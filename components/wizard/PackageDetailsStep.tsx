import React from 'react';
import type { Feature, PackageDetails, ValidationErrors } from '../../types';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';

interface PackageDetailsStepProps {
  details: Omit<Feature, 'id' | 'status'>;
  dispatch: React.Dispatch<any>;
  errors: ValidationErrors;
}

const PackageDetailsStep: React.FC<PackageDetailsStepProps> = ({ details, dispatch, errors }) => {

  const handleFeatureDetailChange = (field: 'name' | 'description', value: any) => {
    dispatch({ type: 'UPDATE_DETAILS', payload: { [field]: value } });
  };
  
  const handlePackageDetailChange = (field: keyof PackageDetails, value: any) => {
    dispatch({ type: 'UPDATE_PACKAGE_DETAILS', payload: { [field]: value } });
  };
  
  return (
    <div className="space-y-8 mt-12">
      {/* Package Information Card */}
      <div className="bg-q-gray-800 border border-q-gray-700 rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-bold">Package Information</h2>
        <Input
          label="Package Name"
          id="featureName"
          placeholder="e.g., AI Job Folder Free Trial"
          value={details.name}
          onChange={(e) => handleFeatureDetailChange('name', e.target.value)}
          error={errors.name}
          maxLength={50}
          required
        />
        <Textarea
          label="Package Description"
          id="description"
          placeholder="Brief description of what this package includes..."
          value={details.description}
          onChange={(e) => handleFeatureDetailChange('description', e.target.value)}
          error={errors.description}
          maxLength={500}
          required
        />
      </div>

      {/* Package Details Card */}
      <div className="bg-q-gray-800 border border-q-gray-700 rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-bold">Package Details</h2>
        <Textarea
          label="Target Market"
          id="targetMarket"
          placeholder="Who is the typical customer for this package (SMEs, startups, etc.)?"
          value={details.packageDetails.targetMarket}
          onChange={(e) => handlePackageDetailChange('targetMarket', e.target.value)}
          error={errors.packageDetails?.targetMarket}
          maxLength={200}
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
                label="Price"
                id="price"
                type="number"
                placeholder="e.g., 500"
                value={details.packageDetails.price === '' ? '' : String(details.packageDetails.price)}
                onChange={(e) => handlePackageDetailChange('price', e.target.value === '' ? '' : parseFloat(e.target.value))}
                error={errors.packageDetails?.price}
                required
            />
            <div className="flex flex-col">
                <label htmlFor="currency" className="block text-sm font-medium text-q-gray-400 mb-1">Currency</label>
                <select
                    id="currency"
                    value={details.packageDetails.currency}
                    onChange={(e) => handlePackageDetailChange('currency', e.target.value)}
                    className="bg-q-gray-700 border border-q-gray-600 text-white text-sm rounded-lg focus:ring-q-green focus:border-q-green block w-full p-2.5"
                >
                    <option>MYR</option>
                    <option>SGD</option>
                    <option>USD</option>
                </select>
            </div>
             <Input
                label="Duration"
                id="duration"
                placeholder="e.g., 30 days, 1 year"
                value={details.packageDetails.duration}
                onChange={(e) => handlePackageDetailChange('duration', e.target.value)}
                error={errors.packageDetails?.duration}
                maxLength={50}
                required
            />
        </div>
        
        <Textarea
          label="Benefits"
          id="benefits"
          placeholder="List the key benefits of this package, one per line."
          value={details.packageDetails.benefits}
          onChange={(e) => handlePackageDetailChange('benefits', e.target.value)}
          error={errors.packageDetails?.benefits}
          maxLength={1000}
          rows={5}
          required
        />

        <Textarea
          label="Key Selling Points"
          id="sellingPoints"
          placeholder="List the key selling points, one per line."
          value={details.packageDetails.sellingPoints}
          onChange={(e) => handlePackageDetailChange('sellingPoints', e.target.value)}
          error={errors.packageDetails?.sellingPoints}
          maxLength={1000}
          rows={5}
          required
        />
      </div>
    </div>
  );
};

export default PackageDetailsStep;