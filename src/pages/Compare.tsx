import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { ArrowLeft, Balance } from 'lucide-react';

interface CaseData {
  id: number;
  title: string;
  court: string;
  year: string;
  facts: string;
  issues: string;
  ratio: string;
}

const mockCases = [
  {
    id: 1,
    title: 'Kesavananda Bharati v. State of Kerala',
    court: 'Supreme Court',
    year: '1973',
    facts: 'Petition challenging Kerala land reforms under Article 31A.',
    issues: 'Scope of Parliament\'s amending power under Article 368.',
    ratio: 'Basic structure cannot be amended. Judicial review is part of basic structure.'
  },
  {
    id: 2,
    title: 'Maneka Gandhi v. Union of India',
    court: 'Supreme Court',
    year: '1978',
    facts: 'Passport impounded without hearing.',
    issues: 'Scope of Article 21 - procedure established by law vs due process.',
    ratio: 'Article 21 requires procedure to be fair, just and reasonable.'
  },
  // More cases for selection
  {
    id: 3,
    title: 'Shreya Singhal v. Union of India',
    court: 'Supreme Court',
    year: '2015',
    facts: 'Arrests for online posts.',
    issues: 'Freedom of speech online.',
    ratio: 'Section 66A vague and overbroad.'
  }
];

const Compare: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const case1Id = searchParams.get('case1');
  const case2Id = searchParams.get('case2');

  const case1 = mockCases.find(c => c.id === parseInt(case1Id || '1'));
  const case2 = mockCases.find(c => c.id === parseInt(case2Id || '2'));

  if (!case1 || !case2) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Select Cases to Compare</h2>
        <p className="text-gray-600 mb-8">Choose two cases from Research page or try demo cases.</p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => navigate('/research')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
          >
            Go to Research
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/research')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Research
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Case Comparison
          </h1>
          <p className="text-gray-600">Side-by-side analysis of facts, issues, and ratio</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Case 1 */}
        <Card title={case1.title} className="border-2 border-indigo-200">
          <div className="text-sm space-y-4 p-6">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">{case1.court}</span>
              <span>{case1.year}</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>Facts
              </h4>
              <p className="text-gray-700">{case1.facts}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>Issues
              </h4>
              <p className="text-gray-700">{case1.issues}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>Ratio
              </h4>
              <p className="text-gray-700 font-medium">{case1.ratio}</p>
            </div>
          </div>
        </Card>

        {/* Case 2 */}
        <Card title={case2.title} className="border-2 border-blue-200">
          <div className="text-sm space-y-4 p-6">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{case2.court}</span>
              <span>{case2.year}</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>Facts
              </h4>
              <p className="text-gray-700">{case2.facts}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>Issues
              </h4>
              <p className="text-gray-700">{case2.issues}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>Ratio
              </h4>
              <p className="text-gray-700 font-medium">{case2.ratio}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Comparison Insights */}
      <Card title="AI Comparison Insights">
        <div className="grid md:grid-cols-3 gap-6 p-6">
          <div className="text-center p-6 bg-indigo-50 rounded-2xl">
            <div className="text-3xl font-bold text-indigo-600 mb-2">85%</div>
            <p className="text-sm text-gray-600">Facts Similarity</p>
          </div>
          <div className="text-center p-6 bg-blue-50 rounded-2xl">
            <div className="text-3xl font-bold text-blue-600 mb-2">92%</div>
            <p className="text-sm text-gray-600">Issue Overlap</p>
          </div>
          <div className="text-center p-6 bg-emerald-50 rounded-2xl">
            <div className="text-3xl font-bold text-emerald-600 mb-2">78%</div>
            <p className="text-sm text-gray-600">Ratio Consistency</p>
          </div>
        </div>
        <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl">
          <h4 className="font-semibold text-gray-900 mb-3">Key Differences</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Basic structure doctrine not relevant to due process evolution</li>
            <li>• Maneka expands Article 21 beyond Kesavananda's amendment focus</li>
            <li>• Both reinforce judicial review but different scopes</li>
          </ul>
        </div>
      </Card>

      <div className="flex gap-4 justify-center pt-8 border-t">
        <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700">
          Save Comparison
        </button>
        <button className="px-8 py-3 border border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50">
          Export Report
        </button>
      </div>
    </div>
  );
};

export default Compare;

