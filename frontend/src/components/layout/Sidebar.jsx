import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LayoutDashboard, Users, Store, Settings } from 'lucide-react';

const NAV_ITEMS = {
  ADMIN: [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', gradient: 'from-blue-500 to-cyan-500' },
    { to: '/admin/users',     icon: Users,           label: 'Users',     gradient: 'from-violet-500 to-purple-500' },
    { to: '/admin/stores',    icon: Store,           label: 'Stores',    gradient: 'from-emerald-500 to-teal-500' },
  ],
  USER: [
    { to: '/user/dashboard', icon: LayoutDashboard, label: 'Dashboard',     gradient: 'from-blue-500 to-cyan-500' },
    { to: '/user/stores',    icon: Store,           label: 'Browse Stores', gradient: 'from-emerald-500 to-teal-500' },
    { to: '/user/profile',   icon: Settings,        label: 'Profile',       gradient: 'from-amber-500 to-orange-500' },
  ],
  STORE_OWNER: [
    { to: '/owner/dashboard', icon: LayoutDashboard, label: 'Dashboard', gradient: 'from-blue-500 to-cyan-500' },
    { to: '/owner/profile',   icon: Settings,        label: 'Profile',   gradient: 'from-amber-500 to-orange-500' },
  ],
};

const Sidebar = () => {
  const { user } = useSelector((s) => s.auth);
  const items = NAV_ITEMS[user?.role] || [];

  return (
    <aside className="w-56 shrink-0 hidden md:block">
      <div className="card p-2.5 sticky top-20 space-y-1">
        {items.map(({ to, icon: Icon, label, gradient }, i) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
               transition-all duration-200 group overflow-hidden
               animate-slide-in-left
               ${isActive ? 'nav-active' : ''}`
            }
            style={({ isActive }) => ({
              animationDelay: `${i * 80}ms`,
              color: isActive ? undefined : 'var(--text-secondary)',
            })}
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? `bg-gradient-to-br ${gradient} shadow-md`
                    : ''
                }`}
                  style={!isActive ? { background: 'var(--bg-elevated)' } : {}}
                >
                  <Icon
                    size={14}
                    className={isActive ? 'text-white' : ''}
                    style={!isActive ? { color: 'var(--text-muted)' } : {}}
                  />
                </div>

                <span>{label}</span>

                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse-glow" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
