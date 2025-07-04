import React from 'react';
import { 
  LayoutDashboard, 
  Database, 
  Settings, 
  HelpCircle, 
  LogOut,
  Activity,
  Wrench
} from 'lucide-react';
import { User } from '../../types';

interface SidebarProps {
  user: User;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
  collapsed?: boolean;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'hospital-data', label: 'Hospital Data', icon: Database },
  { id: 'tools', label: 'Tools', icon: Wrench },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help', icon: HelpCircle },
];

export function Sidebar({ user, activeSection, onSectionChange, onLogout, collapsed = false }: SidebarProps) {
  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} bg-white border-r border-primary-200 h-screen flex flex-col transition-all duration-300`}>
      <div className={`p-6 border-b border-primary-200 ${collapsed ? 'p-3' : ''}`}>
        <div className={`flex items-center space-x-2 mb-4 ${collapsed ? 'justify-center' : ''}`}>
          <Activity className="h-8 w-8 text-primary-900" />
          {!collapsed && <span className="text-xl font-bold text-primary-900">Medicost.ai</span>}
        </div>
        {!collapsed && (
          <div className="bg-primary-50 rounded-lg p-3">
            <h3 className="font-semibold text-primary-900">{user.name}</h3>
            <p className="text-sm text-accent-600">{user.hospitalName}</p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-6">
        <ul className={`space-y-2 ${collapsed ? 'px-2' : 'px-4'}`}>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-primary-900 text-white'
                    : 'text-accent-700 hover:bg-primary-50 hover:text-primary-900'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className={`p-4 border-t border-primary-200 ${collapsed ? 'p-2' : ''}`}>
        <button
          onClick={onLogout}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}