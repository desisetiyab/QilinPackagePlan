import React, { useState, useEffect } from 'react';
import type { Feature, ValidationErrors, Step } from '../types';
import { useFeatureReducer } from '../hooks/useFeatureReducer';
import { refinePackageDetails } from '../services/geminiService';
import StepIndicator from './wizard/StepIndicator';
import PackageDetailsStep from './wizard/PackageDetailsStep';
import CheckpointsStep from './wizard/CheckpointsStep';
import AIRefinementStep from './wizard/AIRefinementStep';
import ReviewStep from './wizard/ReviewStep';
import Button from './ui/Button';

interface CreatePackagePlanFormProps {
  onCancel: () => void;
  onSave: (featureData: Feature) => void;
  initialData?: Feature;
}

const CreatePackagePlanForm: React.FC<CreatePackagePlanFormProps> = ({ onCancel, onSave, initialData }) => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [state, dispatch] = useFeatureReducer(initialData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  
  const [isRefining, setIsRefining] = useState(false);
  const [refinementError, setRefinementError] = useState<string | null>(null);
  const [hasRefined, setHasRefined] = useState(false);

  useEffect(() => {
    // When the user navigates to the Checkpoints step, automatically add the first
    // checkpoint if none exist. This provides a more direct workflow instead of
    // showing an empty state and requiring an extra click.
    if (currentStep === 2 && (!state.checkpoints || state.checkpoints.length === 0)) {
      dispatch({ type: 'ADD_CHECKPOINT' });
    }
  }, [currentStep, state.checkpoints, dispatch]);


  const validateStep1 = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!state.name.trim()) newErrors.name = 'Package name is required.';
    if (state.name.trim().length < 3 || state.name.trim().length > 50) {
      newErrors.name = 'Must be between 3 and 50 characters.';
    }
    if (!state.description.trim()) newErrors.description = 'Package description is required.';
    if (state.description.trim().length < 10 || state.description.trim().length > 500) {
        newErrors.description = 'Must be between 10 and 500 characters.';
    }


    const pdErrors: ValidationErrors['packageDetails'] = {};
    if (state.packageDetails.targetMarket.length === 0) {
      pdErrors.targetMarket = 'At least one target market must be selected.';
    }

    if (state.packageDetails.price === '' || isNaN(Number(state.packageDetails.price)) || Number(state.packageDetails.price) < 0) {
      pdErrors.price = 'A valid, non-negative price is required.';
    }
    if (state.packageDetails.durationValue === '' || isNaN(Number(state.packageDetails.durationValue)) || Number(state.packageDetails.durationValue) <= 0) {
      pdErrors.duration = 'A valid duration is required.';
    } else if (Number(state.packageDetails.durationValue) > 999) {
      pdErrors.duration = 'Duration must be 999 or less.';
    }

    if (!state.packageDetails.benefits.trim()) pdErrors.benefits = 'Benefits are required.';
     if (state.packageDetails.benefits.trim().length < 20 || state.packageDetails.benefits.trim().length > 1000) {
        pdErrors.benefits = 'Must be between 20 and 1000 characters.';
    }
    
    if (!state.packageDetails.sellingPoints.trim()) pdErrors.sellingPoints = 'Selling points are required.';
    if (state.packageDetails.sellingPoints.trim().length < 20 || state.packageDetails.sellingPoints.trim().length > 1000) {
        pdErrors.sellingPoints = 'Must be between 20 and 1000 characters.';
    }
    
    if (Object.keys(pdErrors).length > 0) {
      newErrors.packageDetails = pdErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
     if (!state.checkpoints || state.checkpoints.length === 0) {
      setErrors({ checkpointsError: 'At least one checkpoint is required.'});
      return false;
    }

    const newErrors: ValidationErrors = {};
    const cpErrors: ValidationErrors['checkpoints'] = {};
    let hasError = false;
    state.checkpoints.forEach(cp => {
      const singleCpErrors: { [key: string]: string } = {};
      if (!cp.category.trim()) singleCpErrors.category = 'Category is required.';
       if (cp.category.trim().length < 3 || cp.category.trim().length > 100) {
        singleCpErrors.category = 'Must be between 3 and 100 characters.';
      }
      if (!cp.criteria.veryGood.trim()) singleCpErrors.veryGood = 'Criteria is required.';
      if (cp.criteria.veryGood.trim().length < 10 || cp.criteria.veryGood.trim().length > 300) {
        singleCpErrors.veryGood = 'Must be between 10 and 300 characters.';
      }
      if (!cp.criteria.good.trim()) singleCpErrors.good = 'Criteria is required.';
      if (cp.criteria.good.trim().length < 10 || cp.criteria.good.trim().length > 300) {
        singleCpErrors.good = 'Must be between 10 and 300 characters.';
      }
      if (!cp.criteria.bad.trim()) singleCpErrors.bad = 'Criteria is required.';
      if (cp.criteria.bad.trim().length < 10 || cp.criteria.bad.trim().length > 300) {
        singleCpErrors.bad = 'Must be between 10 and 300 characters.';
      }
      if (!cp.criteria.veryBad.trim()) singleCpErrors.veryBad = 'Criteria is required.';
      if (cp.criteria.veryBad.trim().length < 10 || cp.criteria.veryBad.trim().length > 300) {
        singleCpErrors.veryBad = 'Must be between 10 and 300 characters.';
      }
      
      if (Object.keys(singleCpErrors).length > 0) {
        cpErrors[cp.id] = singleCpErrors;
        hasError = true;
      }
    });

    if (hasError) {
      newErrors.checkpoints = cpErrors;
    }

    setErrors(newErrors);
    return !hasError;
  };

  const handleRefine = async () => {
    setIsRefining(true);
    setRefinementError(null);
    try {
        const refinedData = await refinePackageDetails(state);
        dispatch({ type: 'UPDATE_REFINEMENTS', payload: refinedData });
        setHasRefined(true);
    } catch (error) {
        console.error(error);
        setRefinementError('Failed to refine content. Please check the console for details and try again.');
    } finally {
        setIsRefining(false);
    }
  };

  const handleNext = () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    } else {
      isValid = true;
    }

    if (isValid) {
      if (currentStep === 2 && !hasRefined) {
        handleRefine();
      }
      setCurrentStep(prev => (prev < 4 ? prev + 1 : prev) as Step);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => (prev > 1 ? prev - 1 : prev) as Step);
  };
  
  const handleSave = () => {
    const finalFeature: Feature = {
      ...state,
      id: initialData?.id || crypto.randomUUID(),
      status: 'Published', // Let's assume saving always publishes for simplicity
      enabled: initialData?.enabled ?? true,
      packageDetails: {
          ...state.packageDetails,
          price: Number(state.packageDetails.price), // ensure price is number
          durationValue: Number(state.packageDetails.durationValue),
      }
    };
    onSave(finalFeature);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PackageDetailsStep details={state} dispatch={dispatch} errors={errors} />;
      case 2:
        return <CheckpointsStep checkpoints={state.checkpoints || []} dispatch={dispatch} errors={errors} />;
      case 3:
        return <AIRefinementStep 
            details={state} 
            dispatch={dispatch} 
            isRefining={isRefining} 
            onRefineAgain={handleRefine}
            error={refinementError}
        />;
      case 4:
        return <ReviewStep featureData={state} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-8 text-white max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
            <div>
                <h1 className="text-2xl font-bold">{initialData ? 'Edit Package Plan' : 'Create New Package Plan'}</h1>
                <p className="text-q-gray-400">{initialData ? 'Update the details for your scoring package.' : 'Fill in the details to create a new scoring package.'}</p>
            </div>
            <StepIndicator currentStep={currentStep} />
        </div>

        <div>{renderStepContent()}</div>
      
        <div className="mt-12 pt-6 border-t border-q-gray-700 flex justify-between items-center">
            <Button variant="secondary" onClick={onCancel}>Cancel</Button>
            <div className="flex items-center space-x-4">
                {currentStep > 1 && (
                    <Button variant="secondary" onClick={handleBack}>Back</Button>
                )}
                {currentStep < 4 && (
                    <Button onClick={handleNext}>Next</Button>
                )}
                {currentStep === 4 && (
                    <Button onClick={handleSave}>
                        {initialData ? 'Update Package Plan' : 'Create Package Plan'}
                    </Button>
                )}
            </div>
        </div>
    </div>
  );
};

export default CreatePackagePlanForm;
