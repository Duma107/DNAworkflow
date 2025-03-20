import { create } from 'zustand';
import { 
  WorkflowTemplate, 
  WorkflowInstance, 
  WorkflowStep,
  User,
  Role,
  Approval,
  Comment,
  AuditEntry 
} from '../types/workflow';

interface WorkflowState {
  templates: WorkflowTemplate[];
  instances: WorkflowInstance[];
  currentUser: User | null;
  
  // Template Management
  createTemplate: (template: Omit<WorkflowTemplate, 'id' | 'createdDate'>) => Promise<WorkflowTemplate>;
  updateTemplate: (id: string, template: Partial<WorkflowTemplate>) => Promise<WorkflowTemplate>;
  deleteTemplate: (id: string) => Promise<void>;
  
  // Instance Management
  startWorkflow: (templateId: string, title: string, relatedCourse?: string) => Promise<WorkflowInstance>;
  processStep: (
    instanceId: string, 
    stepId: string, 
    action: 'complete' | 'reject' | 'request_changes',
    comments?: string,
    documents?: string[]
  ) => Promise<WorkflowInstance>;
  
  // Approval Management
  requestApproval: (instanceId: string, approverId: string) => Promise<Approval>;
  processApproval: (
    approvalId: string, 
    decision: 'approved' | 'rejected', 
    comments?: string
  ) => Promise<{ approval: Approval; instance: WorkflowInstance }>;
  
  // User Management
  setCurrentUser: (user: User | null) => void;
  hasPermission: (role: Role) => boolean;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const useWorkflowStore = create<WorkflowState>((set, get) => ({
  templates: [],
  instances: [],
  currentUser: null,

  createTemplate: async (templateData) => {
    if (!get().currentUser) {
      throw new Error('User must be logged in to create a template');
    }

    const template: WorkflowTemplate = {
      ...templateData,
      id: generateId(),
      createdDate: new Date(),
      createdBy: get().currentUser.id,
    };

    set((state) => ({
      templates: [...state.templates, template],
    }));

    return template;
  },

  updateTemplate: async (id, updates) => {
    if (!get().currentUser) {
      throw new Error('User must be logged in to update a template');
    }

    let updatedTemplate: WorkflowTemplate | undefined;

    set((state) => ({
      templates: state.templates.map((template) => {
        if (template.id === id) {
          updatedTemplate = { ...template, ...updates };
          return updatedTemplate;
        }
        return template;
      }),
    }));

    if (!updatedTemplate) {
      throw new Error('Template not found');
    }

    return updatedTemplate;
  },

  deleteTemplate: async (id) => {
    if (!get().currentUser) {
      throw new Error('User must be logged in to delete a template');
    }

    set((state) => ({
      templates: state.templates.filter((template) => template.id !== id),
    }));
  },

  startWorkflow: async (templateId, title, relatedCourse) => {
    const currentUser = get().currentUser;
    if (!currentUser) {
      throw new Error('User must be logged in to start a workflow');
    }

    const template = get().templates.find((t) => t.id === templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const instance: WorkflowInstance = {
      id: generateId(),
      templateId,
      title,
      initiatedBy: currentUser.id,
      initiatedDate: new Date(),
      dueDate: new Date(Date.now() + template.timelineInDays * 24 * 60 * 60 * 1000),
      currentStep: template.steps[0].id,
      completedSteps: [],
      status: 'active',
      associatedDocuments: [],
      approvals: [],
      comments: [],
      relatedCourse,
      auditTrail: [{
        id: generateId(),
        action: 'WORKFLOW_STARTED',
        performedBy: currentUser.id,
        timestamp: new Date(),
        details: `Workflow "${title}" started from template "${template.name}"`,
      }],
    };

    set((state) => ({
      instances: [...state.instances, instance],
    }));

    return instance;
  },

  processStep: async (instanceId, stepId, action, comments, documents = []) => {
    const currentUser = get().currentUser;
    if (!currentUser) {
      throw new Error('User must be logged in to process a step');
    }

    let updatedInstance: WorkflowInstance | undefined;

    set((state) => ({
      instances: state.instances.map((instance) => {
        if (instance.id === instanceId) {
          const newStatus = action === 'complete' ? 'completed' : 
                          action === 'reject' ? 'rejected' : 'active';

          const newCompletedSteps = action === 'complete' 
            ? [...instance.completedSteps, stepId]
            : instance.completedSteps;

          const newComments = comments 
            ? [...instance.comments, {
                id: generateId(),
                userId: currentUser.id,
                content: comments,
                timestamp: new Date(),
              }]
            : instance.comments;

          updatedInstance = {
            ...instance,
            status: newStatus as WorkflowInstance['status'],
            completedSteps: newCompletedSteps,
            comments: newComments,
            associatedDocuments: [...instance.associatedDocuments, ...documents],
            auditTrail: [...instance.auditTrail, {
              id: generateId(),
              action: `STEP_${action.toUpperCase()}`,
              performedBy: currentUser.id,
              timestamp: new Date(),
              details: `Step "${stepId}" ${action}`,
            }],
          };
          return updatedInstance;
        }
        return instance;
      }),
    }));

    if (!updatedInstance) {
      throw new Error('Instance not found');
    }

    return updatedInstance;
  },

  requestApproval: async (instanceId, approverId) => {
    const currentUser = get().currentUser;
    if (!currentUser) {
      throw new Error('User must be logged in to request approval');
    }

    const approval: Approval = {
      id: generateId(),
      requestedBy: currentUser.id,
      requestedFrom: approverId,
      status: 'pending',
      comments: '',
      date: new Date(),
    };

    set((state) => ({
      instances: state.instances.map((instance) => 
        instance.id === instanceId
          ? {
              ...instance,
              approvals: [...instance.approvals, approval],
              auditTrail: [...instance.auditTrail, {
                id: generateId(),
                action: 'APPROVAL_REQUESTED',
                performedBy: currentUser.id,
                timestamp: new Date(),
                details: `Approval requested from user ${approverId}`,
              }],
            }
          : instance
      ),
    }));

    return approval;
  },

  processApproval: async (approvalId, decision, comments) => {
    const currentUser = get().currentUser;
    if (!currentUser) {
      throw new Error('User must be logged in to process approval');
    }

    let updatedApproval: Approval | undefined;
    let updatedInstance: WorkflowInstance | undefined;

    set((state) => ({
      instances: state.instances.map((instance) => {
        const approvalIndex = instance.approvals.findIndex(a => a.id === approvalId);
        if (approvalIndex >= 0) {
          const newApprovals = [...instance.approvals];
          updatedApproval = {
            ...newApprovals[approvalIndex],
            status: decision,
            comments: comments || '',
            date: new Date(),
          };
          newApprovals[approvalIndex] = updatedApproval;

          updatedInstance = {
            ...instance,
            approvals: newApprovals,
            auditTrail: [...instance.auditTrail, {
              id: generateId(),
              action: `APPROVAL_${decision.toUpperCase()}`,
              performedBy: currentUser.id,
              timestamp: new Date(),
              details: `Approval ${decision} by ${currentUser.id}`,
            }],
          };
          return updatedInstance;
        }
        return instance;
      }),
    }));

    if (!updatedApproval || !updatedInstance) {
      throw new Error('Approval not found');
    }

    return { approval: updatedApproval, instance: updatedInstance };
  },

  setCurrentUser: (user) => {
    set({ currentUser: user });
  },

  hasPermission: (role) => {
    const { currentUser } = get();
    if (!currentUser) return false;

    // Admin has all permissions
    if (currentUser.role === 'admin') return true;

    // Check specific role permissions
    switch (role) {
      case 'admin':
        return currentUser.role === 'admin';
      case 'instructor':
        return ['admin', 'instructor'].includes(currentUser.role);
      case 'student':
        return true; // Everyone can access student-level permissions
      case 'stakeholder':
        return ['admin', 'instructor', 'stakeholder'].includes(currentUser.role);
      default:
        return false;
    }
  },
}));

export default useWorkflowStore;