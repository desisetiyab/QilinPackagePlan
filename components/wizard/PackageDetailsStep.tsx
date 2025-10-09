import React from 'react';
import type { Feature, PackageDetails, ValidationErrors } from '../../types';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';

interface PackageDetailsStepProps {
  details: Omit<Feature, 'id' | 'status'>;
  dispatch: React.Dispatch<any>;
  errors: ValidationErrors;
}

const targetMarketOptions = [
  "Individual Business",
  "Recruitment Agency",
  "Small-Medium Enterprise",
  "Multinational",
  "Non-Profit Organization",
  "Government"
];

const PackageDetailsStep: React.FC<PackageDetailsStepProps> = ({ details, dispatch, errors }) => {

  const handleFeatureDetailChange = (field: 'name' | 'description', value: any) => {
    dispatch({ type: 'UPDATE_DETAILS', payload: { [field]: value } });
  };
  
  const handlePackageDetailChange = (field: keyof PackageDetails, value: any) => {
    dispatch({ type: 'UPDATE_PACKAGE_DETAILS', payload: { [field]: value } });
  };
  
  const handleMarketChange = (market: string) => {
    const currentMarkets = details.packageDetails.targetMarket || [];
    const newMarkets = currentMarkets.includes(market)
      ? currentMarkets.filter(m => m !== market)
      : [...currentMarkets, market];
    handlePackageDetailChange('targetMarket', newMarkets);
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
        <div>
            <label className="block text-sm font-medium text-q-gray-400 mb-2">
                Target Market <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-lg bg-q-gray-700/50 border border-q-gray-700">
              {targetMarketOptions.map(opt => (
                <label key={opt} htmlFor={`market-${opt}`} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    id={`market-${opt}`}
                    type="checkbox"
                    checked={details.packageDetails.targetMarket.includes(opt)}
                    onChange={() => handleMarketChange(opt)}
                    className="h-4 w-4 rounded border-q-gray-500 bg-q-gray-800 text-q-green focus:ring-q-green focus:ring-2 focus:ring-offset-q-gray-700/50"
                  />
                  <span className="text-sm font-medium text-q-gray-300">{opt}</span>
                </label>
              ))}
            </div>
            <div className="mt-1 min-h-[1.25rem]">
                {errors.packageDetails?.targetMarket && (
                    <p className="text-sm text-red-500">{errors.packageDetails.targetMarket}</p>
                )}
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
                label="Price (MYR)"
                id="price"
                type="number"
                placeholder="e.g., 500"
                value={details.packageDetails.price === '' ? '' : String(details.packageDetails.price)}
                onChange={(e) => handlePackageDetailChange('price', e.target.value === '' ? '' : parseFloat(e.target.value))}
                error={errors.packageDetails?.price}
                required
            />
            <div className="md:col-span-1">
              <div className="flex items-start gap-2">
                <Input
                  label="Duration"
                  id="durationValue"
                  type="number"
                  placeholder="e.g., 30"
                  value={details.packageDetails.durationValue === '' ? '' : String(details.packageDetails.durationValue)}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || /^\d{1,3}$/.test(val)) {
                        handlePackageDetailChange('durationValue', val === '' ? '' : parseInt(val, 10));
                    }
                  }}
                  error={errors.packageDetails?.duration}
                  required
                  containerClassName="w-2/3"
                />
                <div className="flex flex-col w-1/3">
                  <label className="block text-sm font-medium text-q-gray-400 mb-1 opacity-0 pointer-events-none">Unit</label> {/* Spacer label */}
                  <select
                    id="durationUnit"
                    aria-label="Duration unit"
                    value={details.packageDetails.durationUnit}
                    onChange={(e) => handlePackageDetailChange('durationUnit', e.target.value)}
                    className="bg-q-gray-700 border border-q-gray-600 text-white text-sm rounded-lg block w-full p-2.5 h-[42px] focus:ring-q-green focus:border-q-green"
                  >
                    <option value="day">Day(s)</option>
                    <option value="month">Month(s)</option>
                    <option value="year">Year(s)</option>
                  </select>
                </div>
              </div>
            </div>
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