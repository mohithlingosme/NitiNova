'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Loader from '../../components/Loader';
import { getCase } from '../../lib/api';
import { Case } from '../../types';

export default function CaseDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCase() {
      try {
        const data = await getCase(id);
        setCaseData(data);
      } catch (err) {
        setError('Case not found');
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchCase();
  }, [id]);

  if (loading) return <Loader />;

  if (error || !caseData) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{error || 'Case not found'}</h1>
          <a href="/search" className="text-primary-600 hover:underline">Go to Search</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{caseData.name}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-8">
            <span>👨‍⚖️ {caseData.judges || 'N/A'}</span>
            <span>📅 {new Date(caseData.date).toLocaleDateString()}</span>
            <span>🏛️ {caseData.court}</span>
          </div>
          {caseData.summary && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Summary</h2>
              <p className="text-lg text-gray-700 whitespace-pre-wrap">{caseData.summary}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {caseData.facts && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 bg-yellow-50 px-4 py-2 rounded-lg">Facts</h2>
              <p className="text-gray-700 whitespace-pre-wrap line-clamp-3 prose max-h-64 overflow-y-auto">{caseData.facts}</p>
            </div>
          )}
          
          {caseData.issues && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 bg-blue-50 px-4 py-2 rounded-lg">Issues</h2>
              <p className="text-gray-700 whitespace-pre-wrap line-clamp-3 prose max-h-64 overflow-y-auto">{caseData.issues}</p>
            </div>
          )}
        </div>

        <div className="mt-8">
          {caseData.judgment && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 bg-green-50 px-4 py-2 rounded-lg">Judgment</h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-wrap max-h-96 overflow-y-auto">{caseData.judgment}</div>
            </div>
          )}
          
          {caseData.ratio && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mt-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 bg-purple-50 px-4 py-2 rounded-lg">Ratio Decidendi</h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-wrap bg-gradient-to-r from-purple-50 p-4 rounded-lg">{caseData.ratio}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

