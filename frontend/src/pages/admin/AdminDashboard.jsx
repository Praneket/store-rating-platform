import { useEffect, useState } from 'react';
import { Users, Store, Star, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useSelector } from 'react-redux';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import { userAPI, storeAPI } from '../../api/services';

const BAR_COLORS = ['#3b82f6', '#7c3aed', '#059669', '#d97706', '#e11d48', '#06b6d4'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-4 py-3 text-sm" style={{ minWidth: 120 }}>
      <p className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{label}</p>
      <p style={{ color: 'var(--c-blue)' }}>
        Avg Rating: <span className="font-bold">{payload[0]?.value}</span>
      </p>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentStores, setRecentStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const { dark } = useSelector((s) => s.theme);

  useEffect(() => {
    Promise.all([
      userAPI.getStats(),
      storeAPI.getAll({ limit: 6, sortBy: 'createdAt', sortOrder: 'desc' }),
    ]).then(([s, st]) => {
      setStats(s.data.data);
      setRecentStores(st.data.data);
    }).finally(() => setLoading(false));
  }, []);

  const chartData = recentStores.map((s) => ({
    name: s.name.split(' ')[0],
    rating: s.avgRating || 0,
  }));

  const axisColor = dark ? '#475569' : '#94a3b8';
  const gridColor = dark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.06)';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="animate-fade-in-up">
          <h1 className="text-2xl font-black gradient-text">Admin Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Platform overview & analytics</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1,2,3].map((i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="animate-fade-in-up delay-100"><StatCard title="Total Users"   value={stats?.totalUsers}   icon={Users} color="blue"   /></div>
            <div className="animate-fade-in-up delay-200"><StatCard title="Total Stores"  value={stats?.totalStores}  icon={Store} color="green"  /></div>
            <div className="animate-fade-in-up delay-300"><StatCard title="Total Ratings" value={stats?.totalRatings} icon={Star}  color="orange" /></div>
          </div>
        )}

        <div className="card p-6 animate-fade-in-up delay-400">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
          <h2 className="text-base font-bold flex items-center gap-2 mb-6">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
              <TrendingUp size={14} className="text-white" />
            </div>
            <span className="gradient-text">Store Ratings Overview</span>
          </h2>

          {loading ? (
            <div className="skeleton h-56 rounded-xl" />
          ) : chartData.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>
              No store data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 5]} tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59,130,246,0.05)' }} />
                <Bar dataKey="rating" radius={[6,6,0,0]} maxBarSize={48}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
