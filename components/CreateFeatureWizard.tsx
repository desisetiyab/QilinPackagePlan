import React, { useState } from 'react';
import type { Feature, ValidationErrors, Checkpoint } from '../types';
import { useFeatureReducer } from '../hooks/useFeatureReducer';
import PackageDetailsStep from './wizard/PackageDetailsStep';
import CheckpointsStep from './wizard/CheckpointsStep';
import Button from './ui/Button';

interface CreateFeatureWizardProps {
  onCancel: () => void;
  onSave: (feature: Feature) => void;
  initialData?: Feature;
}

type Tab = 'details' | 'checkpoints';

const CreateFeatureWizard: React.FC<CreateFeatureWizardProps> = ({ onCancel, onSave, initialData }) => {
  const [state, dispatch] = useFeatureReducer(initialData);
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [errors, setErrors] = useState<ValidationErrors>({});
  
  const validateDetails = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};
    
    // Name and Description
    if (!state.name.trim()) newErrors.name = 'Package name is required.';
    else if (state.name.trim().length < 3 || state.name.trim().length > 50) newErrors.name = 'Must be between 3 and 50 characters.';

    if (!state.description.trim()) newErrors.description = 'Description is required.';
    else if (state.description.trim().length < 10 || state.description.trim().length > 500) newErrors.description = 'Must be between 10 and 500 characters.';
    
    // Package Details
    const packageErrors: ValidationErrors['packageDetails'] = {};
    if (!state.packageDetails.targetMarket.trim()) {
      packageErrors.targetMarket = 'Target market is required.';
    } else if (state.packageDetails.targetMarket.trim().length < 10 || state.packageDetails.targetMarket.trim().length > 200) {
      packageErrors.targetMarket = 'Must be between 10 and 200 characters.';
    }

    if (state.packageDetails.price === '' || isNaN(Number(state.packageDetails.price)) || Number(state.packageDetails.price) < 0) {
      packageErrors.price = 'Price must be a valid non-negative number.';
    }

    if (!state.packageDetails.duration.trim()) {
      packageErrors.duration = 'Duration is required.';
    } else if (state.packageDetails.duration.trim().length < 3 || state.packageDetails.duration.trim().length > 50) {
      packageErrors.duration = 'Must be between 3 and 50 characters.';
    }
    
    // Benefits
    if (!state.packageDetails.benefits.trim()) {
        packageErrors.benefits = 'Benefits are required.';
    } else if (state.packageDetails.benefits.trim().length < 10 || state.packageDetails.benefits.trim().length > 1000) {
        packageErrors.benefits = 'Must be between 10 and 1000 characters.';
    }

    // Selling Points
    if (!state.packageDetails.sellingPoints.trim()) {
        packageErrors.sellingPoints = 'Key selling points are required.';
    } else if (state.packageDetails.sellingPoints.trim().length < 10 || state.packageDetails.sellingPoints.trim().length > 1000) {
        packageErrors.sellingPoints = 'Must be between 10 and 1000 characters.';
    }


    if (Object.keys(packageErrors).length > 0) {
        newErrors.packageDetails = packageErrors;
    }

    return newErrors;
  };
  
  const validateCheckpoints = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};
    const cpErrorsContainer: ValidationErrors['checkpoints'] = {};
    let hasCpError = false;

    if (!state.checkpoints || state.checkpoints.length === 0) {
      return {}; // No checkpoints, no errors
    }

    state.checkpoints?.forEach((cp: Checkpoint) => {
      const cpErrors: { [key: string]: string } = {};
      if (!cp.category.trim()) cpErrors.category = 'Category name is required.';
      else if (cp.category.trim().length < 5 || cp.category.trim().length > 100) cpErrors.category = 'Must be between 5 and 100 characters.';

      if (!cp.criteria.veryGood.trim()) cpErrors.veryGood = 'Criteria is required.';
      else if (cp.criteria.veryGood.trim().length < 20 || cp.criteria.veryGood.trim().length > 300) cpErrors.veryGood = 'Must be between 20 and 300 characters.';

      if (!cp.criteria.good.trim()) cpErrors.good = 'Criteria is required.';
      else if (cp.criteria.good.trim().length < 20 || cp.criteria.good.trim().length > 300) cpErrors.good = 'Must be between 20 and 300 characters.';

      if (!cp.criteria.bad.trim()) cpErrors.bad = 'Criteria is required.';
      else if (cp.criteria.bad.trim().length < 20 || cp.criteria.bad.trim().length > 300) cpErrors.bad = 'Must be between 20 and 300 characters.';

      if (!cp.criteria.veryBad.trim()) cpErrors.veryBad = 'Criteria is required.';
      else if (cp.criteria.veryBad.trim().length < 20 || cp.criteria.veryBad.trim().length > 300) cpErrors.veryBad = 'Must be between 20 and 300 characters.';
      
      if (Object.keys(cpErrors).length > 0) {
        cpErrorsContainer[cp.id] = cpErrors;
        hasCpError = true;
      }
    });

    if (hasCpError) {
        newErrors.checkpoints = cpErrorsContainer;
    }
    
    return newErrors;
  };


  const handleSave = () => {
    const detailsErrors = validateDetails();
    const checkpointsErrors = validateCheckpoints();

    const allErrors: ValidationErrors = {
        ...detailsErrors,
        ...checkpointsErrors,
    };

    setErrors(allErrors);

    if (Object.keys(detailsErrors).length > 0) {
        setActiveTab('details');
        return;
    }
    if (Object.keys(checkpointsErrors).length > 0) {
        setActiveTab('checkpoints');
        return;
    }

    const finalFeature: Feature = {
      id: initialData?.id || crypto.randomUUID(),
      ...state,
      packageDetails: {
          ...state.packageDetails,
          price: Number(state.packageDetails.price)
      },
      status: initialData?.status || 'Draft',
      enabled: initialData?.enabled || false,
    };
    onSave(finalFeature);
  };

  const tabs: { id: Tab; name: string }[] = [
    { id: 'details', name: 'Details' },
    { id: 'checkpoints', name: 'Checkpoints' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return <PackageDetailsStep details={state} dispatch={dispatch} errors={errors} />;
      case 'checkpoints':
        return <CheckpointsStep checkpoints={state.checkpoints || []} dispatch={dispatch} errors={errors} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-8 text-white max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold">{initialData ? 'Edit' : 'Create New'} Package Plan</h1>
          <p className="text-q-gray-400">Fill in the details below to create a new package.</p>
        </div>
      </div>

      <div className="border-b border-q-gray-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none
                ${activeTab === tab.id
                  ? 'border-q-green text-q-green'
                  : 'border-transparent text-q-gray-400 hover:text-q-gray-200 hover:border-q-gray-500'}`
              }
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div>
        {renderTabContent()}
      </div>

      <div className="mt-12 pt-6 border-t border-q-gray-700 flex justify-end items-center space-x-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          {initialData ? 'Update Plan' : 'Create Plan'}
        </Button>
      </div>
    </div>
  );
};

export default CreateFeatureWizard;