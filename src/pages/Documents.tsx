import React, { useState } from 'react';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { Upload, File, Sparkles, Download, Trash2 } from 'lucide-react';

const Documents: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [files] = useState([
    { name: 'NDA_Template_v2.docx', size: '245 KB', uploaded: '2 days ago', type: 'Document' },
    { name: 'Contract_Analysis.pdf', size: '1.2 MB', uploaded: '1 week ago', type: 'Report' },
    { name: 'Case_Summary.xlsx', size: '89 KB', uploaded: '3 weeks ago', type: 'Spreadsheet' },
    { name: 'Witness_Statement.pdf', size: '567 KB', uploaded: '1 month ago', type: 'Document' },
  ]);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => setIsUploading(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* Upload Area */}
      <Card title="Upload Document">
        <div className="p-12 border-2 border-dashed border-gray-200 rounded-3xl text-center hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer group">
          {isUploading ? (
            <Loader message="Uploading and processing..." />
          ) : (
            <>
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4 group-hover:text-indigo-500 transition-colors" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-700">Drop files or click to upload</h3>
              <p className="text-gray-500 mb-6">PDF, DOCX, TXT up to 10MB</p>
              <button 
                onClick={handleUpload}
                className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all"
              >
                Choose Files
              </button>
            </>
          )}
        </div>
      </Card>

      {/* Files Table */}
      <Card title="My Documents">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">File Name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Type</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Size</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Uploaded</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {files.map((file, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900 truncate max-w-48">{file.name}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">{file.type}</span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">{file.size}</td>
                  <td className="py-4 px-6 text-sm text-gray-500">{file.uploaded}</td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <Sparkles className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* AI Actions Row */}
        <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all font-medium">
            <Sparkles className="w-5 h-5 inline mr-2" />
            Summarize All
          </button>
          <button className="p-4 border border-gray-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all font-medium">
            <Download className="w-5 h-5 inline mr-2" />
            Export Selected
          </button>
          <button className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all font-medium">
            <File className="w-5 h-5 inline mr-2" />
            Organize Folder
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Documents;

