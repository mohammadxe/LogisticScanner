'use client';

import { useState } from 'react';
import { ShipmentForm } from './components/ShipmentForm';
import { Results } from './components/Results';
import { ShipmentDetails, QuoteResponse } from './lib/types';
import { apiClient } from './lib/api';

export default function Home() {
  const [results, setResults] = useState<QuoteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (formData: ShipmentDetails) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getQuotes(formData);
      setResults(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get quotes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Freight Rate Optimizer
          </h1>
          <p className="text-xl text-gray-600">
            Compare ocean, air, and land freight rates powered by AI
          </p>
        </header>

        {!results ? (
          <>
            <ShipmentForm onSubmit={handleFormSubmit} isLoading={loading} />
            {error && (
              <div className="mt-6 max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </>
        ) : (
          <>
            <button
              onClick={() => setResults(null)}
              className="mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded font-semibold transition"
            >
              ← New Search
            </button>
            <Results results={results} />
          </>
        )}
      </div>
    </main>
  );
}
