'use client';

import { useState, useCallback } from 'react';
import Head from 'next/head';
import SearchInput from '../components/SearchInput';
import CaseCard from '../components/Card';
import Loader from '../components/Loader';
import { searchCases } from '../lib/api';
import { SearchResult } from '../types';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = useCallback(async (q: string) => {
    setQuery(q);
    setLoading(true);
    setError('');

    try {
      const data = await searchCases(q);
      setResults(data.results || data);
    } catch (err) {
      setError('No results found or search failed. Try different keywords.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen py-20 px-4">
      <Head>
        <title>Search - NitiNova</title>
      </Head>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">Search Cases</h1>
        
        <SearchInput onSearch={handleSearch} />
        
        {loading && (
          <div className="mt-12">
            <Loader />
          </div>
        )}
        
        {error && (
          <div className="mt-12 p-8 bg-red-50 border border-red-200 rounded-2xl text-center">
            <p className="text-lg font-medium text-red-800">{error}</p>
          </div>
        )}
        
        <div className="mt-12">
          {results.length === 0 && !loading && query && (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500 mb-4">No cases found for "{query}"</p>
              <p className="text-gray-400">Try different search terms</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((caseResult) => (
              <CaseCard key={caseResult.id} case={caseResult} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

