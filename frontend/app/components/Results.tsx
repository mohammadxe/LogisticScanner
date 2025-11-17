'use client';

import React from 'react';
import { ShippingOption } from '../lib/types';
import { CheckCircle, TrendingDown, BarChart3 } from 'lucide-react';

interface ResultsProps {
  results: {
    cheapest: ShippingOption;
    fastest: ShippingOption;
    bestValue: ShippingOption;
    options: ShippingOption[];
    aiSummary: string;
  };
}

export const Results: React.FC<ResultsProps> = ({ results }) => {
  const getRecommendationIcon = (type: 'cheapest' | 'fastest' | 'bestValue') => {
    switch (type) {
      case 'cheapest':
        return <TrendingDown className="w-5 h-5 text-green-600" />;
      case 'fastest':
        return <BarChart3 className="w-5 h-5 text-blue-600" />;
      case 'bestValue':
        return <CheckCircle className="w-5 h-5 text-purple-600" />;
    }
  };

  const RecommendationCard = ({ title, option, type }: { title: string; option: ShippingOption; type: 'cheapest' | 'fastest' | 'bestValue' }) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border-l-4 border-blue-500">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {getRecommendationIcon(type)}
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-gray-600 text-sm">Price</p>
          <p className="text-2xl font-bold text-gray-900">${option.price.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Transit Time</p>
          <p className="text-2xl font-bold text-gray-900">{option.transitDays} days</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Mode</p>
          <p className="text-lg font-semibold text-gray-900">{option.mode}</p>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-gray-600 text-sm mb-2">Route:</p>
        <div className="space-y-1">
          {option.route.map((leg, idx) => (
            <div key={idx} className="flex items-center text-sm text-gray-700">
              <span className="font-mono">{leg.mode}</span>
              <span className="mx-2 text-gray-400">→</span>
              <span>{leg.origin} → {leg.destination}</span>
            </div>
          ))}
        </div>
      </div>
      {option.carbonFootprint && (
        <p className="text-xs text-gray-600">Carbon Footprint: {option.carbonFootprint} kg CO₂</p>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Recommendations</h2>
        <p className="text-gray-700 text-base leading-relaxed">{results.aiSummary}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <RecommendationCard
          title="💰 Cheapest Option"
          option={results.cheapest}
          type="cheapest"
        />
        <RecommendationCard
          title="⚡ Fastest Option"
          option={results.fastest}
          type="fastest"
        />
        <RecommendationCard
          title="⭐ Best Value"
          option={results.bestValue}
          type="bestValue"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">All Options</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Mode</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Price (USD)</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Transit (Days)</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.options.map((option, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-gray-800 font-medium">{option.mode}</td>
                  <td className="text-right px-4 py-3 text-gray-800">${option.price.toFixed(2)}</td>
                  <td className="text-right px-4 py-3 text-gray-800">{option.transitDays}</td>
                  <td className="text-right px-4 py-3">
                    <button className="text-blue-600 hover:text-blue-800 font-semibold">
                      Book
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
