import React from 'react';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { Search, TrendingUp } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero */}
      <div className="text-center py-16 px-8">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-900 bg-clip-text text-transparent mb-6">
          Your Legal Intelligence Platform
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          AI-powered research, drafting, and case management. Verified against 75,000+ judgments.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Ask a legal question or paste argument..."
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 shadow-sm transition-all"
            />
          </div>
          <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all whitespace-nowrap">
            Analyze
          </button>
        </div>
      </div>

      {/* Trending Topics */}
      <Card title="Trending Topics" className="max-w-4xl mx-auto">
        <div className="flex flex-wrap gap-2">
          {['Basic Structure Doctrine', 'Article 21', 'Right to Privacy', 'GST Compliance', 'Contract Disputes'].map((topic) => (
            <button
              key={topic}
              className="px-4 py-2 bg-gray-50 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 rounded-xl text-sm font-medium border border-gray-200 hover:border-indigo-200 transition-all"
            >
              {topic}
            </button>
          ))}
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card title="Recent Activity">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-900">Case researched</span>
              <span className="text-green-600 font-medium">Kesavananda</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-900">Draft created</span>
              <span className="text-blue-600 font-medium">NDA</span>
            </div>
          </div>
        </Card>
        <Card title="Saved Research">
          <p className="text-gray-500 text-sm">Article 370 challenges</p>
        </Card>
        <Card title="Pending Actions">
          <Loader message="Review document summary" size="sm" />
        </Card>
      </div>
    </div>
  );
};

export default Home;

