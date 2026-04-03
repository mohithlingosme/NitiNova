import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { Users, FileText, Clock, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      supabase
        .from('users_data')
        .insert({
          user_id: user.id,
          type: 'dashboard_visit',
          content: JSON.stringify({
            timestamp: new Date().toISOString(),
          }),
        })
        .catch((err) => console.error('Failed to log activity:', err));
    }
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-3xl p-8 text-center mb-12 border border-indigo-100">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-indigo-900 to-blue-900 bg-clip-text text-transparent mb-6">
          Welcome back
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          {user?.email ? `Hello, ${user.email.split('@')[0]}!` : 'Welcome to your dashboard.'}
        </p>
        <p className="text-slate-500 mt-2">
          Here's your legal research and drafting activity at a glance.
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
          <Card title="Active Cases">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-500">This month</p>
              </div>
              <Users className="w-12 h-12 text-blue-500" />
            </div>
          </Card>
          
          <Card title="Documents">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">47</p>
                <p className="text-sm text-gray-500">Total</p>
              </div>
              <FileText className="w-12 h-12 text-indigo-500" />
            </div>
          </Card>
          
          <Card title="Pending Reviews">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">3</p>
                <p className="text-sm text-gray-500">Urgent</p>
              </div>
              <Clock className="w-12 h-12 text-orange-500" />
            </div>
          </Card>
          
          <Card title="Alerts">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">2</p>
                <p className="text-sm text-gray-500">New</p>
              </div>
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card title="Recent Activity">
          <div className="space-y-4">
            {[
              { type: 'Research', title: 'Article 21 - Privacy', time: '2h ago', status: 'completed' },
              { type: 'Drafting', title: 'NDA Template', time: '1 day ago', status: 'draft' },
              { type: 'Case Update', title: 'Kesavananda Follow-up', time: '3 days ago', status: 'pending' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.type} • {item.time}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.status === 'completed' ? 'bg-green-100 text-green-800' :
                  item.status === 'draft' ? 'bg-blue-100 text-blue-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {item.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'New Research', icon: 'Search' },
              { label: 'New Document', icon: 'FileText' },
              { label: 'New Case', icon: 'Briefcase' },
              { label: 'Upload File', icon: 'Upload' },
            ].map((action, i) => (
              <button key={i} className="p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-lg flex items-center justify-center group-hover:from-indigo-200 group-hover:to-blue-200">
                    <span className="text-indigo-600 font-medium">{action.icon === 'Search' ? '🔍' : action.icon === 'FileText' ? '📄' : action.icon === 'Briefcase' ? '💼' : '⬆️'}</span>
                  </div>
                  <span className="font-medium text-gray-900">{action.label}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

