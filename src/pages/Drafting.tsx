import React, { useState } from 'react';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { FileText, Sparkles, ChevronDown } from 'lucide-react';

const Drafting: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('nda');
  const [documentContent, setDocumentContent] = useState(`# Non-Disclosure Agreement

This Non-Disclosure Agreement (the "Agreement") is entered into by and between...

`);
  const [isGenerating, setIsGenerating] = useState(false);

  const templates = [
    { id: 'nda', name: 'NDA', description: 'Non-Disclosure Agreement' },
    { id: 'employment', name: 'Employment Contract', description: 'Standard employment terms' },
    { id: 'service', name: 'Service Agreement', description: 'Service provider contract' },
    { id: 'sale', name: 'Sales Agreement', description: 'Goods/services sale terms' },
  ];

  const suggestions = [
    'Add indemnity clause for data breach',
    'Include jurisdiction-specific governing law',
    'Add force majeure provisions',
    'Specify termination conditions clearly',
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <div className="space-y-6">
        {/* Template Selector */}
        <Card title="Document Template">
          <div className="flex gap-4 flex-wrap">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedTemplate === template.id
                    ? 'border-indigo-500 bg-indigo-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-500">{template.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor */}
          <Card title="Document Editor">
            <div className="relative">
              <textarea
                value={documentContent}
                onChange={(e) => setDocumentContent(e.target.value)}
                className="w-full h-96 p-6 border border-gray-200 rounded-2xl resize-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 font-mono text-sm leading-relaxed"
                placeholder="Start drafting your document..."
              />
              <div className="absolute bottom-4 right-4 flex items-center space-x-2 text-xs text-gray-500">
                <Sparkles className="w-4 h-4" />
                <span>AI suggestions available</span>
              </div>
            </div>
            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
              <button 
                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-indigo-700 shadow-lg transition-all"
                onClick={() => setIsGenerating(true)}
              >
                {isGenerating ? 'Generating...' : 'Generate Full Draft'}
              </button>
              <button className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all">
                Export PDF
              </button>
            </div>
          </Card>

          {/* AI Suggestions */}
          <Card title="AI Suggestions">
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="group p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <p className="text-sm text-gray-800 leading-relaxed">{suggestion}</p>
                  </div>
                </div>
              ))}
              {isGenerating && (
                <div className="flex items-center space-x-2 p-4 bg-green-50 border border-green-100 rounded-xl">
                  <Sparkles className="w-5 h-5 text-green-500 animate-pulse" />
                  <Loader message="Generating suggestions..." size="sm" />
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Drafting;

