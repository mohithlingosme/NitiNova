import React, { useState } from 'react';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { Search, Filter, Sparkles } from 'lucide-react';
// CitationCard import commented - will integrate later
// import { CitationCard } from '../CitationCard';

const Research: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filters] = useState({
    courts: ['Supreme Court', 'High Court', 'Tribunal'],
    years: ['2024', '2023', '2022'],
    types: ['Civil', 'Criminal', 'Constitutional']
  });

  const mockResults = [
    { title: 'Kesavananda Bharati v. State of Kerala', court: 'Supreme Court', year: '1973', summary: 'Landmark case on basic structure doctrine...' },
    { title: 'Maneka Gandhi v. Union of India', court: 'Supreme Court', year: '1978', summary: 'Expanded Article 21 to include due process...' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      {/* Search Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 pb-4">
        <div className="flex gap-4 items-end max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cases, judgments, statutes..."
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 shadow-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsSearching(true);
                  setTimeout(() => setIsSearching(false), 2000);
                }
              }}
            />
          </div>
          <button 
            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 shadow-lg transition-all whitespace-nowrap"
            onClick={() => {
              setIsSearching(true);
              setTimeout(() => setIsSearching(false), 2000);
            }}
          >
            Search
          </button>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Filters */}
        <Card title="Filters">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Court</label>
              <select className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                {filters.courts.map((court) => (
                  <option key={court}>{court}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                {filters.years.map((year) => (
                  <option key={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <button className="w-full p-3 bg-indigo-50 text-indigo-700 rounded-xl font-medium hover:bg-indigo-100 transition-colors">
              Apply Filters
            </button>
          </div>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          <Card title={`${mockResults.length} results found`}>
            {isSearching ? (
              <Loader message="Searching 75,000+ judgments..." />
            ) : (
              mockResults.map((result, index) => (
                <div key={index} className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-all hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-xl text-gray-900">{result.title}</h3>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">{result.court}</span>
                      <span className="text-gray-500">{result.year}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{result.summary}</p>
                  <div className="flex items-center space-x-4 text-sm text-indigo-600 font-medium">
                    <button>Read Full</button>
                    <button>Summarize</button>
                    <button>Cite</button>
                  </div>
                </div>
              ))
            )}
          </Card>
        </div>
      </div>

      {/* AI Summary Sidebar (on mobile full width) */}
      <Card title="AI Summary" className="lg:col-span-1">
        <div className="flex items-center space-x-3 mb-4">
          <Sparkles className="w-6 h-6 text-indigo-500" />
          <h4 className="font-semibold text-indigo-700">Key Insights</h4>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          Privacy rights expanded significantly post-Maneka Gandhi. Courts emphasize procedural fairness.
        </p>
        <div className="space-y-2">
          <button className="w-full p-3 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-all font-medium">
            Generate Report
          </button>
          <button className="w-full p-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium">
            Add to Research
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Research;

