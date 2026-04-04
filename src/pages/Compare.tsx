import React from 'react';
import Card from '../components/Card';
// import { Balance } from 'lucide-react'; // Use Scale instead if available
import { Scale } from 'lucide-react';

const Compare = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Case Comparison</h1>
          <Scale className="mx-auto h-16 w-16 text-blue-600 mb-4" />
          <p className="text-xl text-gray-600">Compare judgments side by side</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card title="Case 1">
            <div className="space-y-4">
              <p>Case details and facts.</p>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                Select Case
              </button>
            </div>
          </Card>
          <Card title="Case 2">
            <div className="space-y-4">
              <p>Second case for comparison.</p>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
                Select Case
              </button>
            </div>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <button className="bg-purple-600 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:bg-purple-700">
            Compare Cases
          </button>
        </div>
      </div>
    </div>
  );
};

export default Compare;
