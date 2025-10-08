import React from 'react';
import { ChatIcon, RoleplayIcon, HistoryIcon, PersonasIcon, ScenariosIcon, FeaturesIcon, LogoutIcon } from './icons/Icons';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active }) => (
  <a href="#" className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
      active
        ? 'bg-q-gray-700 text-white'
        : 'text-q-gray-400 hover:bg-q-gray-800 hover:text-white'
    }`}>
    {icon}
    <span className="ml-3">{label}</span>
  </a>
);

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-q-gray-800 text-white flex flex-col p-4 border-r border-q-gray-700">
      <div className="flex items-center mb-8">
        <h1 className="text-xl font-bold">Qilin</h1>
        <span className="ml-2 text-xs text-q-gray-500">Version 1.8.0</span>
      </div>
      <nav className="flex-1 space-y-2">
        <p className="px-4 text-xs font-semibold text-q-gray-500 uppercase tracking-wider">Chat Analyzer</p>
        <NavItem icon={<ChatIcon className="w-5 h-5" />} label="Chat Analyzer" />
        <NavItem icon={<RoleplayIcon className="w-5 h-5" />} label="Roleplay" />
        <NavItem icon={<HistoryIcon className="w-5 h-5" />} label="History" />
        <NavItem icon={<PersonasIcon className="w-5 h-5" />} label="Personas" />
        <NavItem icon={<ScenariosIcon className="w-5 h-5" />} label="Scenarios" />
        <NavItem icon={<FeaturesIcon className="w-5 h-5" />} label="Package Plans" active />
      </nav>
      <div className="mt-auto">
        <div className="flex items-center p-3 rounded-lg bg-q-gray-700">
          <div className="w-10 h-10 bg-q-gray-600 rounded-full flex items-center justify-center font-bold text-q-gray-400">DS</div>
          <div className="ml-3">
            <p className="text-sm font-semibold">Desi Setiya</p>
            <p className="text-xs text-q-gray-400">Trainer</p>
          </div>
        </div>
        <a href="#" className="flex items-center mt-4 px-4 py-2.5 text-sm font-medium text-q-gray-400 hover:bg-q-gray-800 hover:text-white rounded-md">
            <LogoutIcon className="w-5 h-5"/>
            <span className="ml-3">Log out</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;