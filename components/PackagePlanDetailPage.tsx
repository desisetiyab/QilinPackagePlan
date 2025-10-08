import React from 'react';
import type { Feature } from '../types';
import Button from './ui/Button';

interface PackagePlanDetailPageProps {
  feature: Feature;
  onBack: () => void;
}

const PackagePlanDetailPage: React.FC<PackagePlanDetailPageProps> = ({ feature, onBack }) => {
  return (
    <div className="p-8 text-white max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <Button variant="secondary" onClick={onBack}>
          &larr; Back to List
        </Button>
        <div className="px-3 py-1 text-xs font-semibold tracking-wider text-cyan-300 uppercase bg-cyan-900/50 rounded-full">
            Preview Mode
        </div>
      </div>
      
      <div className="space-y-8">
        {/* Package Details Card */}
        <div className="bg-q-gray-800 border border-q-gray-700 rounded-lg p-8">
            {/* Package Name and Description */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold">{feature.name}</h1>
                <p className="text-q-gray-400 mt-1 max-w-3xl">{feature.description}</p>
            </div>
            <hr className="border-q-gray-700 mb-8" />

            {/* Other Details */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-x-8 gap-y-8">
                <div className="md:col-span-2">
                    <h3 className="text-sm font-semibold text-q-gray-500 uppercase tracking-wider">Target Market</h3>
                    <p className="mt-2 text-q-gray-200">{feature.packageDetails.targetMarket}</p>
                </div>
                <div className="md:col-span-2">
                    <h3 className="text-sm font-semibold text-q-gray-500 uppercase tracking-wider">Price</h3>
                    <p className="mt-2 text-q-gray-200">{Number(feature.packageDetails.price).toLocaleString('en-US')} {feature.packageDetails.currency}</p>
                </div>
                <div className="md:col-span-2">
                    <h3 className="text-sm font-semibold text-q-gray-500 uppercase tracking-wider">Duration</h3>
                    <p className="mt-2 text-q-gray-200">{feature.packageDetails.duration}</p>
                </div>

                <div className="md:col-span-6"><hr className="border-q-gray-700" /></div>

                <div className="md:col-span-3">
                    <h3 className="text-sm font-semibold text-q-gray-500 uppercase tracking-wider">Benefits</h3>
                    <p className="mt-2 text-q-gray-300 whitespace-pre-wrap">{feature.packageDetails.benefits}</p>
                </div>
                <div className="md:col-span-3">
                    <h3 className="text-sm font-semibold text-q-gray-500 uppercase tracking-wider">Key Selling Points</h3>
                    <p className="mt-2 text-q-gray-300 whitespace-pre-wrap">{feature.packageDetails.sellingPoints}</p>
                </div>
            </div>
        </div>


        {/* Redesigned Checkpoints Card */}
        {feature.checkpoints && feature.checkpoints.length > 0 && (
          <div className="bg-q-gray-800 border border-q-gray-700 rounded-lg p-8">
            <h2 className="text-xl font-bold mb-6">Evaluation Checkpoints</h2>
            <div className="space-y-6">
              {feature.checkpoints.map((checkpoint) => (
                <div key={checkpoint.id} className="p-4 bg-q-gray-700/50 rounded-lg border border-q-gray-700">
                  <h3 className="font-bold text-lg text-q-gray-200">{checkpoint.category}</h3>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                    <div>
                        <p className="font-semibold text-q-gray-300">Very Good</p>
                        <p className="text-q-gray-400 mt-1">{checkpoint.criteria.veryGood}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-q-gray-300">Good</p>
                        <p className="text-q-gray-400 mt-1">{checkpoint.criteria.good}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-q-gray-300">Bad</p>
                        <p className="text-q-gray-400 mt-1">{checkpoint.criteria.bad}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-q-gray-300">Very Bad</p>
                        <p className="text-q-gray-400 mt-1">{checkpoint.criteria.veryBad}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackagePlanDetailPage;