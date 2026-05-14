import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Shield, Mail, MapPin, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { authAPI } from '../../api/services';
import { updatePasswordSchema } from '../../utils/validationSchemas';

const ROLE_GRADIENT = {
  ADMIN:       'from-violet-500 to-purple-600',
  USER:        'from-blue-500 to-cyan-500',
  STORE_OWNER: 'from-emerald-500 to-teal-500',
};

const Profile = () => {
  const { user } = useSelector((s) => s.auth);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(updatePasswordSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authAPI.updatePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password updated successfully');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const gradient = ROLE_GRADIENT[user?.role] || 'from-blue-500 to-cyan-500';

  return (
    <DashboardLayout>
      <div className="max-w-lg space-y-5">
        <div className="animate-fade-in-up">
          <h1 className="text-2xl font-black gradient-text">Profile</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Manage your account</p>
        </div>

        {/* Profile info */}
        <div className="card p-6 animate-fade-in-up delay-100">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-2xl font-black shadow-lg`}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2"
                style={{ borderColor: 'var(--bg-surface)' }} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-lg truncate" style={{ color: 'var(--text-primary)' }}>{user?.name}</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <Mail size={12} style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
              </div>
              <span className={`inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r ${gradient} text-white`}>
                <Shield size={10} />
                {user?.role}
              </span>
            </div>
          </div>
          {user?.address && (
            <div className="flex items-start gap-2 mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <MapPin size={13} className="mt-0.5 shrink-0" style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{user.address}</p>
            </div>
          )}
        </div>

        {/* Change password */}
        <div className="card p-6 animate-fade-in-up delay-200">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
          <h2 className="text-base font-bold flex items-center gap-2 mb-5">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
              <KeyRound size={14} className="text-white" />
            </div>
            <span className="gradient-text">Change Password</span>
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Input label="Current Password"    type="password" error={errors.currentPassword?.message}  {...register('currentPassword')} />
            <Input label="New Password"        type="password" placeholder="Min 8 chars, 1 uppercase, 1 special" error={errors.newPassword?.message} {...register('newPassword')} />
            <Input label="Confirm New Password" type="password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
            <Button type="submit" loading={loading} className="mt-2 w-full sm:w-auto">
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
