// Fix: Removed invalid CDATA wrapper causing syntax error.
import React from 'react';
import type { Feature } from '../types';
import Button from './ui/Button';
import { PlusIcon } from './icons/Icons';
import ToggleSwitch from './ui/ToggleSwitch';

interface FeatureListPageProps {
  features: Feature[];
  onCreateNew: () => void;
  onEdit: (featureId: string) => void;
  onView: (feature: Feature) => void;
  onToggleEnable: (featureId: string) => void;
}

const FeatureListPage: React.FC<FeatureListPageProps> = ({ features, onCreateNew, onEdit, onView, onToggleEnable }) => {
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
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature) => (
              <tr key={feature.id} className="border-b border-q-gray-700 hover:bg-q-gray-700/30">
                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap cursor-pointer" onClick={() => onView(feature)}>
                  {feature.name}
                </th>
                <td className="px-6 py-4 max-w-sm truncate cursor-pointer" onClick={() => onView(feature)}>{feature.description}</td>
                <td className="px-6 py-4 cursor-pointer" onClick={() => onView(feature)}>{`${Number(feature.packageDetails.price).toLocaleString('en-US')} ${feature.packageDetails.currency}`}</td>
                <td className="px-6 py-4 cursor-pointer" onClick={() => onView(feature)}>{feature.packageDetails.duration}</td>
                <td className="px-6 py-4">
                  <ToggleSwitch
                    checked={feature.enabled}
                    onChange={() => onToggleEnable(feature.id)}
                    id={`toggle-${feature.id}`}
                  />
                </td>
                <td className="px-6 py-4 text-center">
                   <Button variant="secondary" size="sm" onClick={() => onEdit(feature.id)}>
                        Edit Plan
                    </Button>
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