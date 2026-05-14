import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginUser, clearError } from '../features/auth/authSlice';
import { loginSchema } from '../utils/validationSchemas';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const ROLE_REDIRECT = {
  ADMIN:       '/admin/dashboard',
  USER:        '/user/dashboard',
  STORE_OWNER: '/owner/dashboard',
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => { dispatch(clearError()); }, [dispatch]);

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      toast.success('Welcome back!');
      navigate(ROLE_REDIRECT[result.payload.role] || '/');
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">

      {/* Orbs — use CSS vars so they adapt to theme */}
      <div className="orb w-96 h-96 -top-24 -left-24" style={{ background: 'var(--orb-1)' }} />
      <div className="orb w-80 h-80 top-1/2 -right-20"  style={{ background: 'var(--orb-2)', animationDelay: '3s' }} />
      <div className="orb w-64 h-64 bottom-0 left-1/3"  style={{ background: 'var(--orb-3)', animationDelay: '6s' }} />

      {/* Morphing blob */}
      <div
        className="blob absolute w-[480px] h-[480px] pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, var(--orb-1), var(--orb-2))',
          opacity: 0.4,
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.6,
        }}
      />

      {/* Card */}
      <div className="auth-card w-full max-w-md p-8 animate-fade-in-scale relative z-10">

        {/* Top accent */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 mb-4 shadow-xl animate-pulse-glow">
            <span className="text-2xl">⭐</span>
          </div>
          <h1 className="text-2xl font-black gradient-text">StoreRater</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-1">
          <Input label="Email"    type="email"    placeholder="you@example.com" error={errors.email?.message}    {...register('email')} />
          <Input label="Password" type="password" placeholder="••••••••"        error={errors.password?.message} {...register('password')} />

          {error && (
            <div className="p-3 rounded-xl text-sm animate-fade-in-up"
              style={{ background: 'var(--c-rose-light)', color: 'var(--c-rose)', border: '1px solid rgba(225,29,72,0.2)' }}>
              {error}
            </div>
          )}

          <div className="pt-2">
            <Button type="submit" loading={loading} className="w-full py-3 text-base">
              Sign In
            </Button>
          </div>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold transition-colors" style={{ color: 'var(--c-blue)' }}>
            Sign up
          </Link>
        </p>

        <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
      </div>
    </div>
  );
};

export default Login;
