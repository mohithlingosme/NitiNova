import React, { useState, useEffect } from 'react';
import { usePricing } from '../../contexts/PricingContext';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { Search } from 'lucide-react';

const Research: React.FC = () => {
  const { isOverLimit, recordSearch } = usePricing();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [filters] = useState({
    courts: ['Supreme Court', 'High Court', 'Tribunal'],
    years: ['2024', '2023', '2022'],
    types: ['Civil', 'Criminal', 'Constitutional']
  });

  const handleSearchClick = () => {
    if (isOverLimit) {
      alert('Free tier limit reached (5 searches/month). Upgrade for unlimited access.');
      return;
    }
    recordSearch();
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isDemoMode && !isOverLimit) {
      recordSearch();
      setIsSearching(true);
      setTimeout(() => setIsSearching(false), 2000);
    } else if (e.key === 'Enter' && isOverLimit) {
      e.preventDefault();
      alert('Free tier limit reached. Upgrade for unlimited.');
    }
  };

  const mockResults = [
    { 
      id: 1,
      title: 'Kesavananda Bharati v. State of Kerala', 
      court: 'Supreme Court', 
      year: '1973', 
      summary: 'Landmark case establishing basic structure doctrine limiting Parliament\'s amendment powers.',
      facts: 'Petition challenging Kerala land reforms under Article 31A.',
      issues: 'Scope of Parliament\'s amending power under Article 368.',
      ratio: 'Basic structure cannot be amended. Judicial review is part of basic structure.'
    },
    { 
      id: 2,
      title: 'Maneka Gandhi v. Union of India', 
      court: 'Supreme Court', 
      year: '1978', 
      summary: 'Expanded Article 21 to include due process and procedural fairness.',
      facts: 'Passport impounded without hearing.',
      issues: 'Scope of Article 21 - procedure established by law vs due process.',
      ratio: 'Article 21 requires procedure to be fair, just and reasonable.'
    },
    // Add 10 more realistic cases...
    { id: 3, title: 'Shreya Singhal v. Union of India', court: 'Supreme Court', year: '2015', summary: 'Struck down Section 66A IT Act.', facts: 'Arrests for online posts.', issues: 'Freedom of speech online.', ratio: 'Section 66A vague and overbroad.' },
    { id: 4, title: 'Navtej Singh Johar v. UOI', court: 'Supreme Court', year: '2018', summary: 'Decriminalized homosexuality.', facts: 'Section 377 challenge.', issues: 'Right to privacy/equality.', ratio: 'Section 377 unconstitutional.' },
    { id: 5, title: 'Justice K.S. Puttaswamy v. UOI', court: 'Supreme Court', year: '2017', summary: 'Right to privacy fundamental.', facts: 'Aadhaar biometrics challenge.', issues: 'Privacy as fundamental right.', ratio: 'Privacy part of Article 21.' },
    { id: 6, title: 'Indira Sawhney v. UOI', court: 'Supreme Court', year: '1992', summary: 'Mandal case - creamy layer exclusion.', facts: 'OBC reservation challenge.', issues: '50% reservation ceiling.', ratio: '27% OBC quota valid, creamy layer excluded.' },
    { id: 7, title: 'Golaknath v. State of Punjab', court: 'Supreme Court', year: '1967', summary: 'Fundamental rights not amendable.', facts: 'Land reform amendments.', issues: 'Amendments affecting fundamental rights.', ratio: 'Amendments subject to fundamental rights.' },
    { id: 8, title: 'Minerva Mills v. UOI', court: 'Supreme Court', year: '1980', summary: 'Limited Parliament supremacy.', facts: '42nd Amendment challenge.', issues: 'Judicial review basic structure.', ratio: 'Limited amending power.' },
    { id: 9, title: 'IR Coelho v. State of Tamil Nadu', court: 'Supreme Court', year: '2007', summary: '9th Schedule judicial review.', facts: 'Land acquisition laws.', issues: 'Basic structure review.', ratio: 'Laws open to basic structure test.' },
    { id: 10, title: 'Aruna Shanbaug v. UOI', court: 'Supreme Court', year: '2011', summary: 'Passive euthanasia guidelines.', facts: 'Comatose patient.', issues: 'Right to die.', ratio: 'Passive euthanasia permitted.' },
    { id: 11, title: 'Common Cause v. UOI', court: 'Supreme Court', year: '2018', summary: 'Passive euthanasia legal.', facts: 'Living wills recognized.', issues: 'Right to die with dignity.', ratio: 'Passive euthanasia constitutional.' },
    { id: 12, title: 'Joseph Shine v. UOI', court: 'Supreme Court', year: '2018', summary: 'Adultery decriminalized.', facts: 'Section 497 challenge.', issues: 'Gender discrimination.', ratio: 'Section 497 unconstitutional.' },
  ];

  const handleDemoToggle = () => {
    setIsDemoMode(!isDemoMode);
    setSearchQuery('');
    setIsSearching(false);
  };

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
              placeholder="Search cases using Semantic Legal Search..."
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 shadow-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isDemoMode) {
                  setIsSearching(true);
                  setTimeout(() => setIsSearching(false), 2000);
                }
              }}
            />
            <button 
              className="px-6 py-4 bg-emerald-600 text-white rounded-2xl font-semibold hover:bg-emerald-700 shadow-lg transition-all whitespace-nowrap flex items-center gap-2"
              onClick={handleDemoToggle}
            >
              {isDemoMode ? 'Live Mode' : 'Try Demo'}
            </button>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Filters */}
        <Card title="Automated Case Digitization Filters">
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
{isDemoMode ? mockResults : mockResults.slice(0, 3)}
            {isDemoMode ? (
              mockResults.map((result, index) => (
                <div key={result.id || index} className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-all hover:-translate-y-1 bg-gradient-to-r from-emerald-50/50 cursor-pointer" onClick={() => navigate(`/compare?case1=${result.id}`)}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-xl text-gray-900">{result.title}</h3>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full font-medium">Demo</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">{result.court}</span>
                      <span className="text-gray-500">{result.year}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2">{result.summary}</p>
                  <div className="text-xs text-gray-500 mb-4 font-medium">Facts: {result.facts}</div>
                  <div className="text-xs text-gray-500 mb-4 font-medium">Issues: {result.issues}</div>
                  <div className="text-xs text-gray-500 mb-4 font-medium">Ratio: {result.ratio}</div>
                  <div className="flex items-center space-x-4 text-sm text-indigo-600 font-medium">
                    <button>Read Full</button>
                    <button>Compare →</button>
                    <button>Cite</button>
                  </div>
                </div>
              ))
            ) : (
              isSearching ? (
                <Loader message="AI Case Intelligence analyzing..." />
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
              )
            )}
          </Card>
        </div>
      </div>

      {/* AI Summary Sidebar (on mobile full width) */}
<Card title="AI Case Intelligence Summary" className="lg:col-span-1">
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

