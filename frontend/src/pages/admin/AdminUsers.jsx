import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Search, ChevronUp, ChevronDown, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import { TableSkeleton } from '../../components/common/Skeleton';
import { userAPI } from '../../api/services';
import { createUserSchema } from '../../utils/validationSchemas';
import useDebounce from '../../hooks/useDebounce';
import usePagination from '../../hooks/usePagination';
import useSort from '../../hooks/useSort';

const ROLE_BADGE = {
  ADMIN: 'badge bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  USER: 'badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  STORE_OWNER: 'badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

const SortIcon = ({ field, sortBy, sortOrder }) => {
  if (sortBy !== field) return <ChevronUp size={14} className="opacity-30" />;
  return sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const debouncedSearch = useDebounce(search);
  const { page, limit, setPage, reset } = usePagination();
  const { sortBy, sortOrder, handleSort } = useSort();

  const { register, handleSubmit, reset: resetForm, formState: { errors } } = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: 'USER' },
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await userAPI.getAll({
        page, limit, search: debouncedSearch, role: roleFilter, sortBy, sortOrder,
      });
      setUsers(data.data);
      setTotal(data.pagination.total);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, roleFilter, sortBy, sortOrder]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { reset(); }, [debouncedSearch, roleFilter, reset]);

  const onCreateUser = async (formData) => {
    setCreating(true);
    try {
      await userAPI.create(formData);
      toast.success('User created successfully');
      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const ThCell = ({ field, label }) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none"
      onClick={() => handleSort(field)}
    >
      <span className="flex items-center gap-1">
        {label}
        <SortIcon field={field} sortBy={sortBy} sortOrder={sortOrder} />
      </span>
    </th>
  );

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Users</h1>
          <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
            <Plus size={16} /> Add User
          </Button>
        </div>

        <div className="card p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input-field pl-9"
              placeholder="Search by name, email, address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input-field sm:w-40"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
            <option value="STORE_OWNER">Store Owner</option>
          </select>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <ThCell field="name" label="Name" />
                  <ThCell field="email" label="Email" />
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Address</th>
                  <ThCell field="role" label="Role" />
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Store Rating</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {loading ? (
                  <tr><td colSpan={6} className="p-4"><TableSkeleton rows={5} cols={5} /></td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-gray-400">No users found</td></tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-sm">{u.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{u.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 max-w-[180px] truncate">{u.address || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={ROLE_BADGE[u.role]}>{u.role}</span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {u.storeRating ? `⭐ ${u.storeRating}` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/admin/users/${u.id}`}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 inline-flex"
                          title="View details"
                        >
                          <Eye size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-100 dark:border-gray-700">
            <Pagination page={page} totalPages={Math.ceil(total / limit)} onPageChange={setPage} />
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New User">
        <form onSubmit={handleSubmit(onCreateUser)} noValidate>
          <Input label="Full Name (20–60 chars)" error={errors.name?.message} {...register('name')} />
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Input label="Password" type="password" error={errors.password?.message} {...register('password')} />
          <Input label="Address (optional)" error={errors.address?.message} {...register('address')} />
          <div className="mb-4">
            <label className="label">Role</label>
            <select className="input-field" {...register('role')}>
              <option value="USER">User</option>
              <option value="STORE_OWNER">Store Owner</option>
              <option value="ADMIN">Admin</option>
            </select>
            {errors.role && <p className="error-text">{errors.role.message}</p>}
          </div>
          <div className="flex gap-3 justify-end mt-6">
            <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" loading={creating}>Create User</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default AdminUsers;
