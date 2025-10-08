import React from 'react';
import type { Feature } from '../types';
import Button from './ui/Button';

interface PackagePlanDetailPageProps {
    feature: Feature;
    onBack: () => void;
}

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h3 className="text-sm font-medium text-q-gray-400 uppercase tracking-wider">{title}</h3>
        <div className="mt-2 text-q-gray-200">{children}</div>
    </div>
);

const PackagePlanDetailPage: React.FC<PackagePlanDetailPageProps> = ({ feature, onBack }) => {
  return (
    <div className="p-8 text-white max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h1 className="text-3xl font-bold">{feature.name}</h1>
                <p className="text-q-gray-400 mt-1">{feature.description}</p>
            </div>
             <Button variant="secondary" onClick={onBack}>
                &larr; Back to list
             </Button>
        </div>
      
        <div className="bg-q-gray-800 border border-q-gray-700 rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <DetailSection title="Status">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    feature.status === 'Published'
                      ? 'bg-green-900 text-green-300'
                      : 'bg-yellow-900 text-yellow-300'
                  }`}>
                    {feature.status}
                </span>
            </DetailSection>

             <DetailSection title="Target Market">
                <p>{feature.packageDetails.targetMarket}</p>
            </DetailSection>

             <DetailSection title="Price">
                <p className="text-xl font-semibold">
                    {feature.packageDetails.price} 
                    <span className="text-base font-normal text-q-gray-400 ml-1">{feature.packageDetails.currency}</span>
                </p>
            </DetailSection>

            <DetailSection title="Duration">
                <p>{feature.packageDetails.duration}</p>
            </DetailSection>
           
            <div className="md:col-span-2 border-t border-q-gray-700 my-2"></div>

            <DetailSection title="Benefits">
                <p className="whitespace-pre-wrap">{feature.packageDetails.benefits}</p>
            </DetailSection>

            <DetailSection title="Key Selling Points">
                <p className="whitespace-pre-wrap">{feature.packageDetails.sellingPoints}</p>
            </DetailSection>

            {feature.checkpoints && feature.checkpoints.length > 0 && (
                <>
                    <div className="md:col-span-2 border-t border-q-gray-700 my-2"></div>
                    <div className="md:col-span-2">
                        <DetailSection title="Evaluation Checkpoints">
                            <div className="space-y-4 mt-2">
                                {feature.checkpoints.map(cp => (
                                    <div key={cp.id} className="p-4 bg-q-gray-700/50 rounded-md border border-q-gray-700">
                                        <div className="font-semibold text-white flex justify-between items-center">
                                            <p>{cp.category}</p>
                                        </div>
                                        <div className="mt-3 text-xs text-q-gray-300 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                                            <p><strong className="text-q-gray-400 font-medium">Very Good:</strong> {cp.criteria.veryGood}</p>
                                            <p><strong className="text-q-gray-400 font-medium">Good:</strong> {cp.criteria.good}</p>
                                            <p><strong className="text-q-gray-400 font-medium">Bad:</strong> {cp.criteria.bad}</p>
                                            <p><strong className="text-q-gray-400 font-medium">Very Bad:</strong> {cp.criteria.veryBad}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </DetailSection>
                    </div>
                </>
            )}
        </div>
    </div>
  );
};

export default PackagePlanDetailPage;