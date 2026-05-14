import { useEffect, useState } from 'react';
import { Star, Users, TrendingUp, Store } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useSelector } from 'react-redux';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import StarRating from '../../components/common/StarRating';
import { CardSkeleton } from '../../components/common/Skeleton';
import { storeAPI } from '../../api/services';

const BAR_COLORS = ['#e11d48', '#d97706', '#eab308', '#059669', '#3b82f6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-4 py-3 text-sm">
      <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{label}</p>
      <p className="mt-0.5" style={{ color: 'var(--text-muted)' }}>
        {payload[0]?.value} rating{payload[0]?.value !== 1 ? 's' : ''}
      </p>
    </div>
  );
};

const OwnerDashboard = () => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const { dark } = useSelector((s) => s.theme);

  useEffect(() => {
    storeAPI.getOwnerDashboard()
      .then(({ data }) => setStore(data.data))
      .finally(() => setLoading(false));
  }, []);

  const ratingDistribution = store
    ? [1,2,3,4,5].map((star) => ({
        star: `${star}★`,
        count: store.ratings.filter((r) => r.value === star).length,
      }))
    : [];

  const axisColor = dark ? '#475569' : '#94a3b8';
  const gridColor = dark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.06)';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="animate-fade-in-up">
          <h1 className="text-2xl font-black gradient-text">Store Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Your store performance overview</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1,2,3].map((i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
            </div>
            <CardSkeleton />
          </div>
        ) : !store ? (
          <div className="card p-16 text-center animate-fade-in-scale">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'var(--bg-elevated)' }}>
              <Store size={28} style={{ color: 'var(--text-muted)' }} />
            </div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-secondary)' }}>No store assigned</h2>
            <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>Contact an admin to assign a store to your account.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="animate-fade-in-up delay-100"><StatCard title="Average Rating" value={store.avgRating ? `${store.avgRating} / 5` : 'N/A'} icon={Star}  color="orange" /></div>
              <div className="animate-fade-in-up delay-200"><StatCard title="Total Ratings"  value={store.totalRatings}                                  icon={Users} color="blue"   /></div>
              <div className="animate-fade-in-up delay-300"><StatCard title="Store"          value={store.name.split(' ')[0]}                            icon={Store} color="green"  subtitle={store.address} /></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart */}
              <div className="card p-6 animate-fade-in-up delay-400">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
                <h2 className="text-base font-bold flex items-center gap-2 mb-5">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
                    <TrendingUp size={14} className="text-white" />
                  </div>
                  <span className="gradient-text">Rating Distribution</span>
                </h2>
                {store.totalRatings === 0 ? (
                  <div className="h-44 flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>No ratings yet</div>
                ) : (
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={ratingDistribution} barCategoryGap="25%">
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                      <XAxis dataKey="star" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis allowDecimals={false} tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59,130,246,0.04)' }} />
                      <Bar dataKey="count" radius={[5,5,0,0]} maxBarSize={40}>
                        {ratingDistribution.map((_, i) => (
                          <Cell key={i} fill={BAR_COLORS[i]} fillOpacity={0.85} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Raters */}
              <div className="card p-6 animate-fade-in-up delay-500">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
                <h2 className="text-base font-bold flex items-center gap-2 mb-5">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                    <Users size={14} className="text-white" />
                  </div>
                  <span className="gradient-text">Recent Raters</span>
                </h2>
                {store.ratings.length === 0 ? (
                  <div className="h-44 flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>No ratings yet</div>
                ) : (
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {store.ratings.map((r, i) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between p-3 rounded-xl transition-colors duration-150 animate-fade-in-up"
                        style={{
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border)',
                          animationDelay: `${i * 50}ms`,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                            style={{ background: 'var(--c-blue-light)', color: 'var(--c-blue)' }}>
                            {r.user.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{r.user.name}</p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{r.user.email}</p>
                          </div>
                        </div>
                        <StarRating value={r.value} readonly size={13} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OwnerDashboard;
