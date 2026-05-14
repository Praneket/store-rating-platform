import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Search, Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import { TableSkeleton } from '../../components/common/Skeleton';
import StarRating from '../../components/common/StarRating';
import { storeAPI, userAPI } from '../../api/services';
import { storeSchema } from '../../utils/validationSchemas';
import useDebounce from '../../hooks/useDebounce';
import usePagination from '../../hooks/usePagination';
import useSort from '../../hooks/useSort';

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState({ open: false, store: null });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [owners, setOwners] = useState([]);

  const debouncedSearch = useDebounce(search);
  const { page, limit, setPage, reset } = usePagination();
  const { sortBy, sortOrder, handleSort } = useSort();

  const { register, handleSubmit, reset: resetForm, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(storeSchema),
  });

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await storeAPI.getAll({ page, limit, search: debouncedSearch, sortBy, sortOrder });
      setStores(data.data);
      setTotal(data.pagination.total);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, sortBy, sortOrder]);

  // Fetch all store owners for the dropdown
  const fetchOwners = useCallback(async () => {
    try {
      const { data } = await userAPI.getAll({ role: 'STORE_OWNER', limit: 100 });
      setOwners(data.data);
    } catch {
      // non-critical
    }
  }, []);

  useEffect(() => { fetchStores(); }, [fetchStores]);
  useEffect(() => { reset(); }, [debouncedSearch, reset]);

  const openCreate = () => {
    fetchOwners();
    resetForm({ name: '', email: '', address: '', ownerId: '' });
    setModal({ open: true, store: null });
  };

  const openEdit = (store) => {
    fetchOwners();
    setValue('name', store.name);
    setValue('email', store.email);
    setValue('address', store.address);
    setValue('ownerId', store.ownerId ?? '');
    setModal({ open: true, store });
  };

  const onSave = async (formData) => {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        ownerId: formData.ownerId ? Number(formData.ownerId) : null,
      };
      if (modal.store) {
        await storeAPI.update(modal.store.id, payload);
        toast.success('Store updated');
      } else {
        await storeAPI.create(payload);
        toast.success('Store created');
      }
      setModal({ open: false, store: null });
      fetchStores();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save store');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    try {
      await storeAPI.delete(id);
      toast.success('Store deleted');
      fetchStores();
    } catch {
      toast.error('Failed to delete store');
    } finally {
      setDeleteId(null);
    }
  };

  const ThCell = ({ field, label }) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none"
      onClick={() => handleSort(field)}
    >
      <span className="flex items-center gap-1">
        {label}
        {sortBy === field
          ? sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
          : <ChevronUp size={14} className="opacity-30" />}
      </span>
    </th>
  );

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Stores</h1>
          <Button onClick={openCreate} className="flex items-center gap-2">
            <Plus size={16} /> Add Store
          </Button>
        </div>

        <div className="card p-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input-field pl-9"
              placeholder="Search by name, email, address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <ThCell field="name" label="Name" />
                  <ThCell field="email" label="Email" />
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Address</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Rating</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Owner</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {loading ? (
                  <tr><td colSpan={6} className="p-4"><TableSkeleton rows={5} cols={5} /></td></tr>
                ) : stores.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-gray-400">No stores found</td></tr>
                ) : (
                  stores.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-sm">{s.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{s.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 max-w-[160px] truncate">{s.address}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <StarRating value={Math.round(s.avgRating || 0)} readonly size={14} />
                          <span className="text-xs text-gray-500">
                            {s.avgRating ? `${s.avgRating} (${s.totalRatings})` : 'No ratings'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{s.owner?.name || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => setDeleteId(s.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500">
                            <Trash2 size={14} />
                          </button>
                        </div>
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

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, store: null })}
        title={modal.store ? 'Edit Store' : 'Create Store'}
      >
        <form onSubmit={handleSubmit(onSave)} noValidate>
          <Input label="Store Name (20–60 chars)" error={errors.name?.message} {...register('name')} />
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Input label="Address" error={errors.address?.message} {...register('address')} />

          {/* Owner dropdown instead of raw ID input */}
          <div className="mb-4">
            <label className="label">Assign Owner (optional)</label>
            <select className="input-field" {...register('ownerId')}>
              <option value="">— No owner —</option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.email})
                </option>
              ))}
            </select>
            {owners.length === 0 && (
              <p className="text-xs text-gray-400 mt-1">
                No store owners found. Create a user with role "Store Owner" first.
              </p>
            )}
            {errors.ownerId && <p className="error-text">{errors.ownerId.message}</p>}
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <Button variant="secondary" type="button" onClick={() => setModal({ open: false, store: null })}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {modal.store ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Store" size="sm">
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete this store? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => onDelete(deleteId)}>Delete</Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default AdminStores;
