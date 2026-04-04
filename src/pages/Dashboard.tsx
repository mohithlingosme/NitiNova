import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { Users, FileText, Clock, AlertCircle, Search, File } from 'lucide-react';

interface RecentActivity {
  id: string;
  title: string;
  type: string;
  time: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [savedCases, setSavedCases] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Log visit
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

      // Fetch recent activity (mock table 'user_activity')
      supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)
        .then(({ data, error }) => {
          if (error) console.error('Error fetching activity:', error);
          else setRecentActivity((data || []).map(item => ({
            id: item.id,
            title: item.title || 'Recent search',
            type: item.type || 'search',
            time: '2h ago', // Format timestamp
            status: item.status || 'completed'
          })));
        });

      // Fetch saved cases (mock table 'saved_cases')
      supabase
        .from('saved_cases')
        .select('title')
        .eq('user_id', user.id)
        .limit(3)
        .then(({ data, error }) => {
          if (error) console.error('Error fetching saved cases:', error);
          else setSavedCases((data || []).map(item => item.title));
        });

      setLoading(false);
    }
  }, [user]);

  if (loading) return <Loader message="Loading dashboard..." />;

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
          <Card title="Recent Searches">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{recentActivity.length}</p>
                <p className="text-sm text-gray-500">This week</p>
              </div>
              <Search className="w-12 h-12 text-blue-500" />
            </div>
          </Card>
          
          <Card title="Saved Cases">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{savedCases.length}</p>
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
        <Card title="Recent Searches & Activity">
          <div className="space-y-4">
            {recentActivity.length ? (
              recentActivity.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
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
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No recent activity. Start your first search!</p>
            )}
          </div>
        </Card>

        {/* Saved Cases */}
        <Card title="Saved Cases">
          <div className="space-y-3">
            {savedCases.length ? (
              savedCases.map((title, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900 truncate">{title}</span>
                  <File className="w-4 h-4 text-gray-400" />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <File className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No saved cases yet</p>
                <p className="text-sm">Save from Research page</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

