import React, { useState } from 'react';
import useWorkflowStore from './store/workflowStore';
import { Activity, UserCircle } from 'lucide-react';
import TemplateDesigner from './components/TemplateDesigner';
import { mockTemplates, mockUsers } from './mockData';

function App() {
  const { currentUser, setCurrentUser } = useWorkflowStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleUserSelect = (user: typeof mockUsers[0]) => {
    setCurrentUser(user);
    setShowUserMenu(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Activity className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Dynamic DNA Workflow</h1>
          </div>
          <div className="relative">
            {!currentUser ? (
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors inline-flex items-center"
              >
                <UserCircle className="h-5 w-5 mr-2" />
                Login As
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{currentUser.name}</div>
                  <div className="text-xs text-gray-500">
                    {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)} (Level {currentUser.accessLevel})
                  </div>
                </div>
                <button
                  onClick={() => setCurrentUser(null)}
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            )}
            
            {showUserMenu && !currentUser && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-50">
                <div className="py-1">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                    Administrators
                  </div>
                  {mockUsers.filter(user => user.role === 'admin').map(user => (
                    <button
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div>{user.name}</div>
                      <div className="text-xs text-gray-500">Access Level: {user.accessLevel}</div>
                    </button>
                  ))}
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                    Students
                  </div>
                  {mockUsers.filter(user => user.role === 'student').map(user => (
                    <button
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div>{user.name}</div>
                      <div className="text-xs text-gray-500">{user.department}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {currentUser ? (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Welcome to Dynamic DNA Workflow</h2>
              <p className="text-gray-600 mb-4">
                This system helps manage educational workflows, approvals, and notifications.
                {currentUser.role === 'admin' && ` As an administrator with level ${currentUser.accessLevel} access, you have extended privileges.`}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockTemplates.map(template => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-2">{template.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{template.description}</p>
                    <div className="text-sm text-gray-500">
                      Steps: {template.steps.length} | Timeline: {template.timelineInDays} days
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {currentUser.role === 'admin' && currentUser.accessLevel >= 3 && <TemplateDesigner />}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900">
              Please login to access the workflow system
            </h2>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;