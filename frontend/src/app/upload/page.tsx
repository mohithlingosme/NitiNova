'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { uploadFile } from '../lib/api';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleUpload = useCallback(async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await uploadFile(formData);
      setSuccess('Case processed successfully! Check search page.');
      setTimeout(() => router.push('/search'), 2000);
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [file, router]);

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Upload Case</h1>
          
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-300 transition-colors">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer block">
              <div className="text-4xl mb-4">📄</div>
              <p className="text-lg font-medium text-gray-700 mb-1">{file ? file.name : 'Choose PDF file'}</p>
              <p className="text-gray-500 text-sm">Click to select or drag & drop</p>
            </label>
          </div>

          {file && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="font-medium text-green-800">Ready to upload: {file.name}</p>
              <p className="text-sm text-green-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="font-medium text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="font-medium text-green-800">{success}</p>
            </div>
          )}

          <Button 
            onClick={handleUpload} 
            loading={loading}
            className="w-full mt-8"
            disabled={!file}
          >
            Process Case
          </Button>
        </div>
      </div>
    </div>
  );
}

