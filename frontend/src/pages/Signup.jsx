import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { signupUser, clearError } from '../features/auth/authSlice';
import { signupSchema } from '../utils/validationSchemas';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => { dispatch(clearError()); }, [dispatch]);

  const onSubmit = async (data) => {
    const result = await dispatch(signupUser(data));
    if (signupUser.fulfilled.match(result)) {
      toast.success('Account created! Please log in.');
      navigate('/login');
    } else {
      toast.error(result.payload || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4 py-8">

      <div className="orb w-96 h-96 -top-20 -right-20" style={{ background: 'var(--orb-2)', animationDelay: '0s' }} />
      <div className="orb w-72 h-72 bottom-0 -left-10"  style={{ background: 'var(--orb-1)', animationDelay: '4s' }} />
      <div className="orb w-56 h-56 top-1/3 left-1/2"   style={{ background: 'var(--orb-3)', animationDelay: '2s' }} />

      <div
        className="blob absolute w-[560px] h-[560px] pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, var(--orb-2), var(--orb-1))',
          opacity: 0.35,
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          animationDelay: '5s',
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.6,
        }}
      />

      <div className="auth-card w-full max-w-md p-8 animate-fade-in-scale relative z-10">
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 mb-3 shadow-xl">
            <span className="text-xl">⭐</span>
          </div>
          <h1 className="text-2xl font-black gradient-text">StoreRater</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Create your account</p>
        </div>

        {/* Info banner */}
        <div className="mb-5 p-3 rounded-xl text-xs flex items-start gap-2"
          style={{ background: 'var(--c-blue-light)', color: 'var(--c-blue)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <span className="text-base shrink-0">ℹ️</span>
          <span>Self-registration creates a <strong>User</strong> account. Admin and Store Owner accounts are created by the system administrator.</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-1">
          <Input label="Full Name (20–60 characters)" placeholder="e.g. John Alexander Doe Smith" error={errors.name?.message}     {...register('name')} />
          <Input label="Email"                        type="email"    placeholder="you@example.com"                error={errors.email?.message}    {...register('email')} />
          <Input label="Password"                     type="password" placeholder="Min 8 chars, 1 uppercase, 1 special" error={errors.password?.message} {...register('password')} />
          <Input label="Address (optional)"           placeholder="123 Main St, City, State"                      error={errors.address?.message}  {...register('address')} />

          {error && (
            <div className="p-3 rounded-xl text-sm animate-fade-in-up"
              style={{ background: 'var(--c-rose-light)', color: 'var(--c-rose)', border: '1px solid rgba(225,29,72,0.2)' }}>
              {error}
            </div>
          )}

          <div className="pt-2">
            <Button type="submit" loading={loading} className="w-full py-3 text-base">
              Create Account
            </Button>
          </div>
        </form>

        <p className="text-center text-sm mt-5" style={{ color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold transition-colors" style={{ color: 'var(--c-blue)' }}>
            Sign in
          </Link>
        </p>

        <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
      </div>
    </div>
  );
};

export default Signup;
