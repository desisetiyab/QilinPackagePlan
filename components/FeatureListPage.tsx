
// Fix: Removed invalid CDATA wrapper causing syntax error.
import React from 'react';
import type { Feature } from '../types';
import Button from './ui/Button';
import { PlusIcon } from './icons/Icons';
import ToggleSwitch from './ui/ToggleSwitch';
import Input from './ui/Input';

type FilterStatus = 'all' | 'enabled' | 'disabled';

interface FeatureListPageProps {
  features: Feature[];
  onCreateNew: () => void;
  onEdit: (featureId: string) => void;
  onView: (feature: Feature) => void;
  onToggleEnable: (featureId: string) => void;
  filterStatus: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const FeatureListPage: React.FC<FeatureListPageProps> = ({
  features,
  onCreateNew,
  onEdit,
  onView,
  onToggleEnable,
  filterStatus,
  onFilterChange,
  searchTerm,
  onSearchChange
}) => {
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

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-1 p-1 bg-q-gray-700/50 rounded-lg w-max">
          <Button
            size="sm"
            variant={filterStatus === 'all' ? 'secondary' : 'ghost'}
            onClick={() => onFilterChange('all')}
            className="!px-4 !py-1.5"
          >
            All Plans
          </Button>
          <Button
            size="sm"
            variant={filterStatus === 'enabled' ? 'secondary' : 'ghost'}
            onClick={() => onFilterChange('enabled')}
            className="!px-4 !py-1.5"
          >
            Enabled
          </Button>
          <Button
            size="sm"
            variant={filterStatus === 'disabled' ? 'secondary' : 'ghost'}
            onClick={() => onFilterChange('disabled')}
            className="!px-4 !py-1.5"
          >
            Disabled
          </Button>
        </div>
        <div className="w-full max-w-xs">
            <Input 
                id="search-package-name"
                placeholder="Search by package name..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
            />
        </div>
      </div>

      <div className="bg-q-gray-800 border border-q-gray-700 rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left text-q-gray-300">
          <thead className="text-xs text-q-gray-400 uppercase bg-q-gray-700/50">
            <tr>
              <th scope="col" className="px-6 py-3">Package Name</th>
              <th scope="col" className="px-6 py-3">Description</th>
              <th scope="col" className="px-6 py-3">Price</th>
              <th scope="col" className="px-6 py-3 w-24">Duration</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {features.length > 0 ? (
              features.map((feature) => {
                const { durationValue, durationUnit } = feature.packageDetails;
                const durationText = `${durationValue} ${durationUnit}${durationValue !== 1 ? 's' : ''}`;
                return (
                  <tr key={feature.id} className="border-b border-q-gray-700 hover:bg-q-gray-700/30">
                    <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap cursor-pointer" onClick={() => onView(feature)}>
                      {feature.name}
                    </th>
                    <td className="px-6 py-4 max-w-sm truncate cursor-pointer" onClick={() => onView(feature)}>{feature.description}</td>
                    <td className="px-6 py-4 cursor-pointer" onClick={() => onView(feature)}>{`${Number(feature.packageDetails.price).toLocaleString('en-US')} ${feature.packageDetails.currency}`}</td>
                    <td className="px-6 py-4 cursor-pointer" onClick={() => onView(feature)}>{durationText}</td>
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
                )
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-12 text-q-gray-500">
                  No package plans match the current filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeatureListPage;