import { useEffect, useState, useCallback } from 'react';
import { Search, Store, MapPin, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StarRating from '../../components/common/StarRating';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { CardSkeleton } from '../../components/common/Skeleton';
import { storeAPI, ratingAPI } from '../../api/services';
import useDebounce from '../../hooks/useDebounce';
import usePagination from '../../hooks/usePagination';

const LABELS = ['', '😞 Poor', '😐 Fair', '🙂 Good', '😊 Great', '🤩 Excellent!'];

const StoreCard = ({ store, onRate, index }) => (
  <div
    className="card p-5 flex flex-col gap-4 group cursor-default animate-fade-in-up"
    style={{ animationDelay: `${index * 55}ms` }}
  >
    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <h3 className="font-bold truncate group-hover:text-blue-500 transition-colors duration-200"
          style={{ color: 'var(--text-primary)' }}>
          {store.name}
        </h3>
        <div className="flex items-center gap-1.5 mt-1">
          <MapPin size={11} style={{ color: 'var(--text-muted)' }} className="shrink-0" />
          <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{store.address}</p>
        </div>
      </div>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200"
        style={{ background: 'var(--c-blue-light)' }}>
        <Store size={18} style={{ color: 'var(--c-blue)' }} />
      </div>
    </div>

    <div className="flex items-center gap-2">
      <StarRating value={Math.round(store.avgRating || 0)} readonly size={15} />
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
        {store.avgRating
          ? <><span className="font-bold" style={{ color: 'var(--c-amber)' }}>{store.avgRating}</span> ({store.totalRatings})</>
          : 'No ratings yet'}
      </span>
    </div>

    {store.userRating != null && (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
        <Star size={12} className="text-amber-400 fill-amber-400 shrink-0" />
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Your rating:</span>
        <StarRating value={store.userRating} readonly size={12} />
      </div>
    )}

    <Button
      variant={store.userRating ? 'secondary' : 'primary'}
      className="w-full mt-auto"
      onClick={() => onRate(store)}
    >
      {store.userRating ? '✏️ Update Rating' : '⭐ Rate Store'}
    </Button>
  </div>
);

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ratingModal, setRatingModal] = useState({ open: false, store: null, value: 0 });
  const [submitting, setSubmitting] = useState(false);

  const debouncedSearch = useDebounce(search);
  const { page, limit, setPage, reset } = usePagination(9);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await storeAPI.getAll({ page, limit, search: debouncedSearch });
      setStores(data.data);
      setTotal(data.pagination.total);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch]);

  useEffect(() => { fetchStores(); }, [fetchStores]);
  useEffect(() => { reset(); }, [debouncedSearch, reset]);

  const openRateModal = (store) =>
    setRatingModal({ open: true, store, value: store.userRating || 0 });

  const submitRating = async () => {
    if (!ratingModal.value) return toast.error('Please select a rating');
    setSubmitting(true);
    try {
      await ratingAPI.submit({ storeId: ratingModal.store.id, value: ratingModal.value });
      toast.success('Rating submitted!');
      setRatingModal({ open: false, store: null, value: 0 });
      fetchStores();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="animate-fade-in-up">
          <h1 className="text-2xl font-black gradient-text">Browse Stores</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Discover and rate stores near you</p>
        </div>

        <div className="relative animate-fade-in-up delay-100">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            className="input-field pl-10"
            placeholder="Search stores by name or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : stores.length === 0 ? (
          <div className="card p-16 text-center animate-fade-in-scale">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'var(--bg-elevated)' }}>
              <Store size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            <p className="font-semibold" style={{ color: 'var(--text-secondary)' }}>No stores found</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map((store, i) => (
              <StoreCard key={store.id} store={store} onRate={openRateModal} index={i} />
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={Math.ceil(total / limit)} onPageChange={setPage} />
      </div>

      <Modal
        isOpen={ratingModal.open}
        onClose={() => setRatingModal({ open: false, store: null, value: 0 })}
        title={ratingModal.store?.name || 'Rate Store'}
        size="sm"
      >
        <div className="text-center py-2">
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            {ratingModal.store?.userRating ? 'Update your rating' : 'How would you rate this store?'}
          </p>
          <div className="flex justify-center mb-4">
            <StarRating
              value={ratingModal.value}
              onChange={(v) => setRatingModal((p) => ({ ...p, value: v }))}
              size={40}
            />
          </div>
          <div className="h-7 mb-4">
            {ratingModal.value > 0 && (
              <p className="text-sm font-bold animate-fade-in-up" style={{ color: 'var(--c-amber)' }}>
                {LABELS[ratingModal.value]}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setRatingModal({ open: false, store: null, value: 0 })}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={submitRating} loading={submitting} disabled={!ratingModal.value}>
            Submit
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default UserDashboard;
