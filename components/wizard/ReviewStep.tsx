import React from 'react';
import type { Feature } from '../../types';

interface ReviewStepProps {
  featureData: Omit<Feature, 'id' | 'status' | 'enabled'>;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ featureData }) => {
  const { durationValue, durationUnit } = featureData.packageDetails;
  const durationText = `${durationValue} ${durationUnit}${durationValue !== 1 ? 's' : ''}`;

  return (
    <div className="space-y-8 mt-6">
      {/* Card 1: Package Plan Details */}
      <div className="bg-q-gray-800 border border-q-gray-700 rounded-lg p-8">
        <h2 className="text-xl font-bold mb-6">Review Your Package Plan</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-6 gap-x-8 gap-y-8">
            {/* Target Market, Price, Duration */}
            <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-q-gray-500 uppercase tracking-wider">Target Market</h3>
                <p className="mt-2 text-q-gray-200">{featureData.packageDetails.targetMarket.join(', ')}</p>
            </div>
            <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-q-gray-500 uppercase tracking-wider">Price</h3>
                <p className="mt-2 text-q-gray-200">{Number(featureData.packageDetails.price).toLocaleString('en-US')} {featureData.packageDetails.currency}</p>
            </div>
            <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-q-gray-500 uppercase tracking-wider">Duration</h3>
                <p className="mt-2 text-q-gray-200">{durationText}</p>
            </div>

            <div className="md:col-span-6"><hr className="border-q-gray-700" /></div>

            {/* Package Name and Description */}
            <div className="md:col-span-3">
                <h3 className="text-sm font-semibold text-q-gray-500 uppercase tracking-wider">Package Name</h3>
                <p className="mt-2 text-q-gray-200">{featureData.name}</p>
            </div>
            <div className="md:col-span-3">
                <h3 className="text-sm font-semibold text-q-gray-500 uppercase tracking-wider">Description</h3>
                <p className="mt-2 text-q-gray-300 whitespace-pre-wrap">{featureData.description}</p>
            </div>
            
            <div className="md:col-span-6"><hr className="border-q-gray-700" /></div>

            {/* Benefits and Key Selling Points */}
            <div className="md:col-span-3">
                <h3 className="text-sm font-semibold text-q-gray-500 uppercase tracking-wider">Benefits</h3>
                <p className="mt-2 text-q-gray-300 whitespace-pre-wrap">{featureData.packageDetails.benefits}</p>
            </div>
            <div className="md:col-span-3">
                <h3 className="text-sm font-semibold text-q-gray-500 uppercase tracking-wider">Key Selling Points</h3>
                <p className="mt-2 text-q-gray-300 whitespace-pre-wrap">{featureData.packageDetails.sellingPoints}</p>
            </div>
        </div>
      </div>

      {/* Card 2: Evaluation Checkpoints */}
      {featureData.checkpoints && featureData.checkpoints.length > 0 && (
        <div className="bg-q-gray-800 border border-q-gray-700 rounded-lg p-8">
          <h2 className="text-xl font-bold mb-6">Evaluation Checkpoints</h2>
          <div className="space-y-6">
            {featureData.checkpoints.map(cp => (
              <div key={cp.id} className="p-4 bg-q-gray-700/50 rounded-lg border border-q-gray-700">
                <h4 className="font-bold text-lg text-q-gray-200">{cp.category}</h4>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                    <div>
                        <p className="font-semibold text-q-gray-300">Very Good</p>
                        <p className="text-q-gray-400 mt-1">{cp.criteria.veryGood}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-q-gray-300">Good</p>
                        <p className="text-q-gray-400 mt-1">{cp.criteria.good}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-q-gray-300">Bad</p>
                        <p className="text-q-gray-400 mt-1">{cp.criteria.bad}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-q-gray-300">Very Bad</p>
                        <p className="text-q-gray-400 mt-1">{cp.criteria.veryBad}</p>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewStep;