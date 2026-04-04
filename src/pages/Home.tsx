import React from 'react';
import Loader from '../components/Loader';
import Card from '../components/Card';
import Button from '../components/Button';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            NitiNova Legal AI
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Verify citations, compare judgments, research cases with AI-powered accuracy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => window.location.href = '/research'}>Start Research</Button>
            <Button variant="secondary" onClick={() => window.location.href = '/upload'}>Upload Document</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Card title="Citation Verification">
            <p className="text-gray-600 mb-4">AI checks if citations support claims with 98% accuracy.</p>
            <div className="h-32 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg"></div>
          </Card>
          <Card title="Case Comparison">
            <p className="text-gray-600 mb-4">Side-by-side judgment analysis.</p>
            <div className="h-32 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg"></div>
          </Card>
          <Card title="Smart Search">
            <p className="text-gray-600 mb-4">Semantic search across 1M+ Indian judgments.</p>
            <div className="h-32 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg"></div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
