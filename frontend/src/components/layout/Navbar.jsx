import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, LogOut, LayoutDashboard } from 'lucide-react';
import { toggleTheme } from '../../app/store';
import { logoutUser } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';

const ROLE_DASHBOARD = {
  ADMIN:       '/admin/dashboard',
  USER:        '/user/dashboard',
  STORE_OWNER: '/owner/dashboard',
};

const ROLE_GRADIENT = {
  ADMIN:       'from-violet-500 to-purple-600',
  USER:        'from-blue-500 to-cyan-500',
  STORE_OWNER: 'from-emerald-500 to-teal-500',
};

const Navbar = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user }  = useSelector((s) => s.auth);
  const { dark }  = useSelector((s) => s.theme);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 navbar-bg">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-sm font-black text-white shadow-md animate-pulse-glow">
            ⭐
          </div>
          <span className="text-lg font-black gradient-text">StoreRater</span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-2">

          {/* Theme toggle */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-xl glass hover:scale-110 active:scale-95 transition-all duration-200"
            title={dark ? 'Switch to light' : 'Switch to dark'}
            style={{ color: 'var(--text-secondary)' }}
          >
            {dark
              ? <Sun  size={17} className="text-amber-400" />
              : <Moon size={17} className="text-blue-500"  />
            }
          </button>

          {user ? (
            <>
              <Link
                to={ROLE_DASHBOARD[user.role]}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass text-sm font-medium transition-all duration-200 hover:scale-105"
                style={{ color: 'var(--text-secondary)' }}
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>

              <div className="flex items-center gap-2 pl-2 ml-1 border-l" style={{ borderColor: 'var(--border)' }}>
                {/* Avatar */}
                <div className="relative">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${ROLE_GRADIENT[user.role]} flex items-center justify-center text-white text-sm font-black shadow-md`}>
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2"
                    style={{ borderColor: 'var(--bg-surface)' }} />
                </div>

                <span className="text-sm font-semibold hidden sm:block" style={{ color: 'var(--text-primary)' }}>
                  {user.name?.split(' ')[0]}
                </span>

                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--c-rose)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  title="Logout"
                >
                  <LogOut size={15} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login"  className="btn-secondary text-sm py-1.5 px-4">Login</Link>
              <Link to="/signup" className="btn-primary  text-sm py-1.5 px-4">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
