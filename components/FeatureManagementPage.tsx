import React, { useState } from 'react';
import FeatureListPage from './FeatureListPage';
import CreatePackagePlanForm from './CreateFeatureWizard';
import type { Feature } from '../types';
import PackagePlanDetailPage from './PackagePlanDetailPage';

const initialFeatures: Feature[] = [
  {
    id: '1',
    name: 'AI Job Folder',
    description: 'A free trial package for AI-powered job folder management.',
    status: 'Published',
    enabled: true,
    packageDetails: {
      targetMarket: 'SMEs and startups',
      price: 0,
      currency: 'MYR',
      duration: '30 days',
      benefits: 'Automated candidate sorting.\nAI-driven skill matching.',
      sellingPoints: 'Save time on manual screening.\nExperience the future of recruitment.',
    },
    checkpoints: [
      {
        id: 'cp1',
        category: 'Info Accuracy',
        criteria: {
          veryGood: 'Explains components clearly and accurately, links them together logically (e.g., explains free trial, subscription, what happens after expiry, and candidate tokens).',
          good: 'Minor detail may be skipped but no errors.',
          bad: 'Missing or oversimplified explanation; key explained incorrectly.',
          veryBad: 'Information is misleading or factually wrong (e.g., says folder is unlimited free, or misstates trial period, or wrong feature explanation).'
        }
      },
      {
        id: 'cp2',
        category: 'Clarity & Ease of Understanding',
        criteria: {
          veryGood: 'Breaks down complex idea into relatable, simple language (possibly with examples or analogies); ensures customer is fully clear.',
          good: 'Uses simple, clear wording; customer can follow.',
          bad: 'Uses jargon, half-explains, or lacks flow; customer might understand but with effort.',
          veryBad: 'Pitch is confusing, too technical, or jumps between features with no structure; employer likely won’t understand how it works.'
        }
      },
      {
        id: 'cp3',
        category: 'Personalisation to Customer’s Hiring Needs',
        criteria: {
          veryGood: 'Highly tailored pitch: addresses employer’s exact hiring challenge and shows how AI Job Folder solves it step-by-step.',
          good: 'Connects product features to specific pain points (e.g., “Since you mentioned low applicants, AI can proactively find matches for you”).',
          bad: 'Mentions employer’s needs but doesn’t link features to those needs.',
          veryBad: 'Generic product pitch with no reference to employer’s situation.'
        }
      }
    ]
  },
   {
    id: '2',
    name: 'Customer Empathy',
    description: 'Evaluates the ability to understand and share the feelings of the customer.',
    status: 'Published',
    enabled: true,
    packageDetails: {
      targetMarket: 'All customer-facing roles',
      price: 100,
      currency: 'MYR',
      duration: 'per agent/month',
      benefits: 'Improved customer satisfaction.',
      sellingPoints: 'Develop deeper customer connections.',
    },
    checkpoints: [],
  },
  {
    id: '3',
    name: 'Problem Solving',
    description: 'Assesses the skill in identifying issues and implementing effective solutions.',
    status: 'Draft',
    enabled: false,
    packageDetails: {
      targetMarket: 'Technical support teams',
      price: 15000,
      currency: 'MYR',
      duration: 'per agent/month',
      benefits: 'Faster resolution times.',
      sellingPoints: 'Increase first-call resolution rates.',
    },
    checkpoints: [],
  },
];

type View = 
  | { type: 'list' }
  | { type: 'create' }
  | { type: 'edit', featureId: string }
  | { type: 'detail', feature: Feature };


const FeatureManagementPage: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>(initialFeatures);
  const [view, setView] = useState<View>({ type: 'list' });

  const handleCreateNew = () => {
    setView({ type: 'create' });
  };

  const handleCancel = () => {
    setView({ type: 'list' });
  };
  
  const handleStartEdit = (featureId: string) => {
    setView({ type: 'edit', featureId });
  };
  
  const handleViewDetail = (feature: Feature) => {
    setView({ type: 'detail', feature });
  }

  const handleToggleEnable = (featureId: string) => {
    setFeatures(features.map(f => 
        f.id === featureId ? { ...f, enabled: !f.enabled } : f
    ));
  };

  const handleSaveFeature = (featureData: Feature) => {
    const existing = features.find(f => f.id === featureData.id);
    if (existing) {
        setFeatures(features.map(f => f.id === featureData.id ? featureData : f));
    } else {
        setFeatures(prevFeatures => [...prevFeatures, featureData]);
    }
    setView({ type: 'list' });
  };

  const renderContent = () => {
    switch (view.type) {
      case 'create':
        return <CreatePackagePlanForm onCancel={handleCancel} onSave={handleSaveFeature} />;
      case 'edit':
        const featureToEdit = features.find(f => f.id === view.featureId);
        if (!featureToEdit) {
            setView({ type: 'list' });
            return null;
        }
        return <CreatePackagePlanForm onCancel={handleCancel} onSave={handleSaveFeature} initialData={featureToEdit} />;
      case 'detail':
        return <PackagePlanDetailPage feature={view.feature} onBack={() => setView({ type: 'list' })} />;
      case 'list':
      default:
        return <FeatureListPage features={features} onCreateNew={handleCreateNew} onEdit={handleStartEdit} onView={handleViewDetail} onToggleEnable={handleToggleEnable} />;
    }
  }

  return <>{renderContent()}</>;
};

export default FeatureManagementPage;