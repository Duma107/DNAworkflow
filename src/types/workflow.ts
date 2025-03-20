export type Role = 'admin' | 'instructor' | 'student' | 'stakeholder';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  accessLevel: number;
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  assignedRoles: Role[];
  requiredDocuments: string[];
  status: 'not_started' | 'in_progress' | 'completed' | 'rejected';
  completionCriteria: string;
  dependsOnSteps: string[];
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdDate: Date;
  steps: WorkflowStep[];
  requiredApprovals: string[];
  timelineInDays: number;
  notificationSettings: NotificationSetting[];
}

export interface WorkflowInstance {
  id: string;
  templateId: string;
  title: string;
  initiatedBy: string;
  initiatedDate: Date;
  dueDate: Date;
  currentStep: string;
  completedSteps: string[];
  status: 'active' | 'completed' | 'cancelled';
  associatedDocuments: string[];
  approvals: Approval[];
  comments: Comment[];
  relatedCourse?: string;
  auditTrail: AuditEntry[];
}

export interface NotificationSetting {
  type: 'email' | 'in_app';
  trigger: 'step_complete' | 'approval_needed' | 'deadline_approaching';
  roles: Role[];
}

export interface Approval {
  id: string;
  requestedBy: string;
  requestedFrom: string;
  status: 'pending' | 'approved' | 'rejected';
  comments: string;
  date: Date;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
}

export interface AuditEntry {
  id: string;
  action: string;
  performedBy: string;
  timestamp: Date;
  details: string;
}