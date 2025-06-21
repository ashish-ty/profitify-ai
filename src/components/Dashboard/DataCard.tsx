import React from 'react';
import { DivideIcon as LucideIcon, ChevronRight } from 'lucide-react';

interface DataCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  fields: string[];
  onClick: () => void;
}

export function DataCard({ title, description, icon: Icon, color, fields, onClick }: DataCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-6 shadow-sm border border-primary-100 hover:shadow-md transition-all duration-300 cursor-pointer group hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform`}>
          <Icon className="h-6 w-6" />
        </div>
        <ChevronRight className="h-5 w-5 text-accent-400 group-hover:text-primary-600 transition-colors" />
      </div>
      
      <h3 className="text-lg font-semibold text-primary-900 mb-2">{title}</h3>
      <p className="text-accent-600 mb-4 text-sm leading-relaxed">{description}</p>
      
      <div className="space-y-2">
        <p className="text-xs font-medium text-accent-500 uppercase tracking-wide">Key Fields</p>
        <div className="flex flex-wrap gap-1">
          {fields.slice(0, 3).map((field, index) => (
            <span key={index} className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded">
              {field}
            </span>
          ))}
          {fields.length > 3 && (
            <span className="text-xs bg-accent-100 text-accent-600 px-2 py-1 rounded">
              +{fields.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}