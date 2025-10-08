import React, { useState, useRef, useEffect } from 'react';
import type { Feature } from '../types';
import Button from './ui/Button';
import { PlusIcon, ChevronDownIcon, EditIcon, ToggleOnIcon, ToggleOffIcon } from './icons/Icons';

interface FeatureListPageProps {
  features: Feature[];
  onCreateNew: () => void;
  onEdit: (featureId: string) => void;
  onView: (feature: Feature) => void;
  onToggleEnable: (featureId: string) => void;
}

const FeatureListPage: React.FC<FeatureListPageProps> = ({ features, onCreateNew, onEdit, onView, onToggleEnable }) => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (featureId: string) => {
    setOpenDropdownId(openDropdownId === featureId ? null : featureId);
  };

  return (
    <div className="p-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Package Plans</h1>
          <p className="text-q-gray-400">Manage and create new scoring packages for your team.</p>
        </div>
        <Button onClick={onCreateNew}>
          <PlusIcon className="w-5 h-5 mr-2" />
          Create New Plan
        </Button>
      </div>

      <div className="bg-q-gray-800 border border-q-gray-700 rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left text-q-gray-300">
          <thead className="text-xs text-q-gray-400 uppercase bg-q-gray-700/50">
            <tr>
              <th scope="col" className="px-6 py-3">Package Name</th>
              <th scope="col" className="px-6 py-3">Description</th>
              <th scope="col" className="px-6 py-3">Price</th>
              <th scope="col" className="px-6 py-3">Duration</th>
              <th scope="col" className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature) => (
              <tr key={feature.id} className="border-b border-q-gray-700 hover:bg-q-gray-700/30">
                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap cursor-pointer" onClick={() => onView(feature)}>
                  <div className="flex items-center">
                    <span>{feature.name}</span>
                    {feature.enabled && (
                        <span className="ml-3 px-2 py-0.5 text-xs font-semibold rounded-full bg-green-900 text-green-300">
                            ENABLED
                        </span>
                    )}
                  </div>
                </th>
                <td className="px-6 py-4 max-w-sm truncate cursor-pointer" onClick={() => onView(feature)}>{feature.description}</td>
                <td className="px-6 py-4 cursor-pointer" onClick={() => onView(feature)}>{`${feature.packageDetails.price} ${feature.packageDetails.currency}`}</td>
                <td className="px-6 py-4 cursor-pointer" onClick={() => onView(feature)}>{feature.packageDetails.duration}</td>
                <td className="px-6 py-4 text-center">
                   <div className="relative inline-block text-left" ref={openDropdownId === feature.id ? dropdownRef : null}>
                        <Button variant="secondary" size="sm" onClick={() => toggleDropdown(feature.id)}>
                            Actions
                            <ChevronDownIcon className="w-4 h-4 ml-2" />
                        </Button>
                        {openDropdownId === feature.id && (
                            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-q-gray-700 ring-1 ring-black ring-opacity-5 z-20">
                                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                    <button
                                        className="w-full text-left flex items-center px-4 py-2 text-sm text-q-gray-300 hover:bg-q-gray-600"
                                        role="menuitem"
                                        onClick={() => { onEdit(feature.id); setOpenDropdownId(null); }}
                                    >
                                        <EditIcon className="w-4 h-4 mr-3" />
                                        Edit Plan
                                    </button>
                                    <button
                                        onClick={() => { onToggleEnable(feature.id); setOpenDropdownId(null); }}
                                        className={`w-full text-left flex items-center px-4 py-2 text-sm ${feature.enabled ? 'text-red-400' : 'text-green-400'} hover:bg-q-gray-600`}
                                        role="menuitem"
                                    >
                                        {feature.enabled ? <ToggleOnIcon className="w-5 h-5 mr-3" /> : <ToggleOffIcon className="w-5 h-5 mr-3" />}
                                        {feature.enabled ? 'Disable' : 'Enable'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeatureListPage;