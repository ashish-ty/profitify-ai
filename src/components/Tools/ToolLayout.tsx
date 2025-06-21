import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function ToolLayout({ title, description, children }: ToolLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard/tools')}
            className="flex items-center space-x-2 text-accent-600 hover:text-primary-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Tools</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-primary-100">
        <div className="p-6 border-b border-primary-100">
          <h1 className="text-2xl font-bold text-primary-900 mb-2">{title}</h1>
          <p className="text-accent-600">{description}</p>
        </div>

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}