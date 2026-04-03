import React, { useState } from 'react';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { Calendar, FileText, Clock, MessageSquare, Download } from 'lucide-react';

interface Case {
  id: string;
  title: string;
  status: 'active' | 'closed' | 'pending';
  court: string;
  nextHearing: string;
  documents: number;
}

const mockCases: Case[] = [
  {
    id: '1',
    title: 'Gupta v. State - Contract Dispute',
    status: 'active',
    court: 'Delhi High Court',
    nextHearing: '2024-01-15',
    documents: 8,
  },
  {
    id: '2',
    title: 'Sharma v. ABC Corp - IP Theft',
    status: 'pending',
    court: 'Bombay High Court',
    nextHearing: '2024-01-20',
    documents: 12,
  },
  {
    id: '3',
    title: 'Patel v. Union - Constitutional Challenge',
    status: 'closed',
    court: 'Supreme Court',
    nextHearing: '2023-12-01',
    documents: 23,
  },
];

const Cases: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<Case | null>(mockCases[0]);

  return (
    <div className="max-w-7xl mx-auto p-4 h-full">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-full">
        {/* Cases List */}
        <Card title="My Cases" className="lg:col-span-1">
          <div className="space-y-3">
            {mockCases.map((caseItem) => (
              <button
                key={caseItem.id}
                onClick={() => setSelectedCase(caseItem)}
                className={`w-full p-4 rounded-xl border transition-all ${
                  selectedCase?.id === caseItem.id
                    ? 'border-indigo-500 bg-indigo-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{caseItem.title}</h4>
                    <p className="text-sm text-gray-500">{caseItem.court}</p>
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      caseItem.status === 'active' ? 'bg-green-100 text-green-800' :
                      caseItem.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {caseItem.status}
                    </span>
                  </div>
                </div>
              </button>
            ))}
            <button className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all font-medium text-gray-700">
              + New Case
            </button>
          </div>
        </Card>

        {/* Case Detail */}
        {selectedCase ? (
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-900">{selectedCase.title}</h1>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                selectedCase.status === 'active' ? 'bg-green-100 text-green-800' :
                selectedCase.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {selectedCase.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Next Hearing */}
              <Card title="Next Hearing">
                <div className="flex items-center space-x-3 p-4">
                  <Calendar className="w-8 h-8 text-orange-500" />
                  <div>
                    <p className="font-semibold text-gray-900">{selectedCase.nextHearing}</p>
                    <p className="text-sm text-gray-500">Delhi High Court</p>
                  </div>
                </div>
              </Card>

              {/* Documents */}
              <Card title="Documents">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{selectedCase.documents}</p>
                    <p className="text-sm text-gray-500">Files</p>
                  </div>
                  <Download className="w-8 h-8 text-gray-400" />
                </div>
              </Card>

              {/* Status */}
              <Card title="Status">
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-800">On Track</span>
                </div>
              </Card>
            </div>

            {/* Timeline */}
            <Card title="Case Timeline">
              <div className="space-y-4">
                {[
                  { date: '2023-12-01', event: 'Filing', status: 'completed' },
                  { date: '2023-12-15', event: 'First Hearing', status: 'completed' },
                  { date: '2024-01-15', event: 'Next Hearing', status: 'upcoming' },
                ].map((event, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border-l-4 border-gray-200 pl-6">
                    <div className="w-12 flex-shrink-0">
                      <div className="w-10 h-10 bg-white border-2 rounded-full flex items-center justify-center font-semibold text-sm">
                        {event.date.split('-')[1]}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{event.event}</p>
                      <p className="text-sm text-gray-500">{event.date}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs ${
                      event.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {event.status === 'completed' ? 'Done' : 'Upcoming'}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Notes */}
            <Card title="Notes & Tasks">
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <MessageSquare className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-900">Prepare witness statements</p>
                    <p className="text-sm text-blue-700">Due: 2024-01-10</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="lg:col-span-3 flex items-center justify-center h-64">
            <Loader message="Select a case to view details" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Cases;

