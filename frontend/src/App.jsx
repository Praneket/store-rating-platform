import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { fetchMe } from './features/auth/authSlice';
import { ProtectedRoute, RoleRoute, GuestRoute } from './routes/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminUserDetail = lazy(() => import('./pages/admin/AdminUserDetail'));
const AdminStores = lazy(() => import('./pages/admin/AdminStores'));
const UserDashboard = lazy(() => import('./pages/user/UserDashboard'));
const Profile = lazy(() => import('./pages/user/Profile'));
const OwnerDashboard = lazy(() => import('./pages/owner/OwnerDashboard'));
const NotFound = lazy(() =>
  import('./pages/ErrorPages').then((m) => ({ default: m.NotFound }))
);
const Unauthorized = lazy(() =>
  import('./pages/ErrorPages').then((m) => ({ default: m.Unauthorized }))
);

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => {
  const dispatch = useDispatch();
  const { initialized } = useSelector((s) => s.auth);
  const { dark } = useSelector((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  if (!initialized) return <PageLoader />;

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route element={<GuestRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>

            <Route element={<RoleRoute roles={['ADMIN']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/users/:id" element={<AdminUserDetail />} />
              <Route path="/admin/stores" element={<AdminStores />} />
            </Route>

            <Route element={<RoleRoute roles={['USER']} />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/stores" element={<UserDashboard />} />
              <Route path="/user/profile" element={<Profile />} />
            </Route>

            <Route element={<RoleRoute roles={['STORE_OWNER']} />}>
              <Route path="/owner/dashboard" element={<OwnerDashboard />} />
              <Route path="/owner/profile" element={<Profile />} />
            </Route>

            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
