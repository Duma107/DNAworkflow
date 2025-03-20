import React, { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { WorkflowStep, Role } from '../types/workflow';
import useWorkflowStore from '../store/workflowStore';

const TemplateDesigner: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [timelineInDays, setTimelineInDays] = useState(30);
  const [steps, setSteps] = useState<Partial<WorkflowStep>[]>([]);

  const { createTemplate } = useWorkflowStore();

  const addStep = () => {
    setSteps([...steps, {
      id: `step-${steps.length + 1}`,
      name: '',
      description: '',
      assignedRoles: [],
      requiredDocuments: [],
      status: 'not_started',
      completionCriteria: '',
      dependsOnSteps: [],
    }]);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, field: keyof WorkflowStep, value: any) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTemplate({
        name,
        description,
        timelineInDays,
        steps: steps as WorkflowStep[],
        requiredApprovals: [],
        notificationSettings: [],
      });
      // Reset form
      setName('');
      setDescription('');
      setTimelineInDays(30);
      setSteps([]);
    } catch (error) {
      console.error('Failed to create template:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Workflow Template Designer</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Template Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Timeline (days)</label>
          <input
            type="number"
            value={timelineInDays}
            onChange={(e) => setTimelineInDays(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            min={1}
            required
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Workflow Steps</h3>
            <button
              type="button"
              onClick={addStep}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Step
            </button>
          </div>

          {steps.map((step, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="text-md font-medium">Step {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  value={step.name || ''}
                  onChange={(e) => updateStep(index, 'name', e.target.value)}
                  placeholder="Step Name"
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
                
                <textarea
                  value={step.description || ''}
                  onChange={(e) => updateStep(index, 'description', e.target.value)}
                  placeholder="Step Description"
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  rows={2}
                  required
                />

                <input
                  type="text"
                  value={step.completionCriteria || ''}
                  onChange={(e) => updateStep(index, 'completionCriteria', e.target.value)}
                  placeholder="Completion Criteria"
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </button>
        </div>
      </form>
    </div>
  );
};

export default TemplateDesigner;