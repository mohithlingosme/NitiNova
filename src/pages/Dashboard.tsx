import React from 'react';
import Loader from '../components/Loader';
import Card from '../components/Card';
// import useAuth from '../../hooks/useAuth';
// import supabase from '../../lib/supabase'; // Commented per plan

const Dashboard = () => {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<{title: string, value: string}[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Mock data
      setData([
        { title: 'Recent Verification', value: '95% accuracy' },
        { title: 'Cases Analyzed', value: '1,247' },
        { title: 'Time Saved', value: '23 hours' },
      ]);
  } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-600 p-8">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.map((item, index) => (
            <Card key={index} title={item.title}>
              <div className="text-3xl font-bold text-blue-600">{item.value}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
