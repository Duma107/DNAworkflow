import { WorkflowTemplate, WorkflowStep, Role, User } from './types/workflow';

export const mockUsers: User[] = [
  {
    id: 'admin-1',
    name: 'Senior Administrator',
    email: 'senior.admin@dna-edu.com',
    role: 'admin',
    department: 'Administration',
    accessLevel: 5
  },
  {
    id: 'admin-2',
    name: 'Junior Administrator',
    email: 'junior.admin@dna-edu.com',
    role: 'admin',
    department: 'Administration',
    accessLevel: 3
  },
  {
    id: 'student-1',
    name: 'John Smith',
    email: 'john.smith@student.dna-edu.com',
    role: 'student',
    department: 'Computer Science',
    accessLevel: 1
  },
  {
    id: 'student-2',
    name: 'Emma Johnson',
    email: 'emma.johnson@student.dna-edu.com',
    role: 'student',
    department: 'Biology',
    accessLevel: 1
  },
  {
    id: 'student-3',
    name: 'Michael Chen',
    email: 'michael.chen@student.dna-edu.com',
    role: 'student',
    department: 'Physics',
    accessLevel: 1
  },
  {
    id: 'student-4',
    name: 'Sarah Williams',
    email: 'sarah.williams@student.dna-edu.com',
    role: 'student',
    department: 'Mathematics',
    accessLevel: 1
  },
  {
    id: 'student-5',
    name: 'David Rodriguez',
    email: 'david.rodriguez@student.dna-edu.com',
    role: 'student',
    department: 'Chemistry',
    accessLevel: 1
  }
];

export const mockTemplates: WorkflowTemplate[] = [
  {
    id: 'template-1',
    name: 'Course Creation Workflow',
    description: 'Standard process for creating and approving new courses',
    createdBy: 'admin-1',
    createdDate: new Date('2024-03-01'),
    timelineInDays: 30,
    steps: [
      {
        id: 'step-1',
        name: 'Course Proposal',
        description: 'Initial course proposal submission',
        assignedRoles: ['instructor'],
        requiredDocuments: ['course-outline', 'learning-objectives'],
        status: 'not_started',
        completionCriteria: 'All required documents uploaded',
        dependsOnSteps: [],
      },
      {
        id: 'step-2',
        name: 'Department Review',
        description: 'Review by department head',
        assignedRoles: ['admin'],
        requiredDocuments: [],
        status: 'not_started',
        completionCriteria: 'Department head approval',
        dependsOnSteps: ['step-1'],
      },
      {
        id: 'step-3',
        name: 'Curriculum Committee Review',
        description: 'Final review and approval',
        assignedRoles: ['stakeholder'],
        requiredDocuments: [],
        status: 'not_started',
        completionCriteria: 'Committee approval',
        dependsOnSteps: ['step-2'],
      },
    ],
    requiredApprovals: ['department-head', 'committee-chair'],
    notificationSettings: [
      {
        type: 'email',
        trigger: 'step_complete',
        roles: ['admin', 'instructor'],
      },
    ],
  },
  {
    id: 'template-2',
    name: 'Student Registration Process',
    description: 'Workflow for student application and enrollment',
    createdBy: 'admin-2',
    createdDate: new Date('2024-03-02'),
    timelineInDays: 14,
    steps: [
      {
        id: 'step-1',
        name: 'Application Submission',
        description: 'Student submits application',
        assignedRoles: ['student'],
        requiredDocuments: ['application-form', 'transcripts'],
        status: 'not_started',
        completionCriteria: 'All documents submitted',
        dependsOnSteps: [],
      },
      {
        id: 'step-2',
        name: 'Application Review',
        description: 'Review of student application',
        assignedRoles: ['admin'],
        requiredDocuments: [],
        status: 'not_started',
        completionCriteria: 'Application reviewed',
        dependsOnSteps: ['step-1'],
      },
    ],
    requiredApprovals: ['registrar'],
    notificationSettings: [
      {
        type: 'email',
        trigger: 'approval_needed',
        roles: ['admin'],
      },
    ],
  },
];