import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, MapPin, Shield, Star } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { userAPI } from '../../api/services';
import { CardSkeleton } from '../../components/common/Skeleton';

const ROLE_BADGE = {
  ADMIN: 'badge bg-purple-100 text-purple-700',
  USER: 'badge bg-blue-100 text-blue-700',
  STORE_OWNER: 'badge bg-green-100 text-green-700',
};

const AdminUserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.getById(id)
      .then(({ data }) => setUser(data.data))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <Link to="/admin/users" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <ArrowLeft size={16} /> Back to Users
        </Link>

        {loading ? (
          <CardSkeleton />
        ) : !user ? (
          <div className="card p-8 text-center text-gray-400">User not found</div>
        ) : (
          <div className="space-y-4">
            <div className="card p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-xl font-bold">{user.name}</h1>
                    <span className={ROLE_BADGE[user.role]}>{user.role}</span>
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2"><Mail size={14} />{user.email}</div>
                    {user.address && <div className="flex items-center gap-2"><MapPin size={14} />{user.address}</div>}
                    <div className="flex items-center gap-2">
                      <Shield size={14} />
                      Member since {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {user.storeRating && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-500">⭐ {user.storeRating}</div>
                    <div className="text-xs text-gray-400 mt-1">Store Rating</div>
                  </div>
                )}
              </div>
            </div>

            {user.ownedStore && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Star size={18} className="text-yellow-500" /> Store Ratings
                </h2>
                <p className="text-sm text-gray-500 mb-3">
                  Store: <span className="font-medium text-gray-800 dark:text-gray-200">{user.ownedStore.name}</span>
                </p>
                {user.ownedStore.ratings.length === 0 ? (
                  <p className="text-gray-400 text-sm">No ratings yet</p>
                ) : (
                  <div className="space-y-2">
                    {user.ownedStore.ratings.map((r, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                        <div>
                          <p className="text-sm font-medium">{r.user.name}</p>
                          <p className="text-xs text-gray-400">{r.user.email}</p>
                        </div>
                        <span className="text-yellow-500 font-bold">{'⭐'.repeat(r.value)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminUserDetail;
