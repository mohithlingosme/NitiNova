import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import Card from '../components/Card';
// import PricingContext from '../../contexts/PricingContext'; // Commented per plan
// import { useNavigate } from 'react-router-dom'; // Add later

interface ResearchCase {
  id: number;
  title: string;
  summary: string;
}

const Research = () => {
  const [cases, setCases] = useState<ResearchCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    // Mock data
    setCases([
      { id: 1, title: 'Sample Case 1', summary: 'Summary 1' },
      { id: 2, title: 'Sample Case 2', summary: 'Summary 2' },
    ]);
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Legal Research</h1>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter case query..."
            className="w-full max-w-2xl px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400"
          />
          <button onClick={handleSearch} className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700">
            Research
          </button>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((c, index) => (
              <Card key={c.id || index} title={c.title}>
                <p>{c.summary}</p>
                <button 
                  onClick={() => console.log('Navigate to:', c.id)} // TODO: Add react-router
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  View Details
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <div className="fixed bottom-8 right-8 bg-linear-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-lg animate-pulse">
        {/* <Sparkles /> */}
        AI Verified
      </div>
    </div>
  );
};

export default Research;
