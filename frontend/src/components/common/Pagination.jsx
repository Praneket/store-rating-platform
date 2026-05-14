import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1);

  return (
    <div className="flex items-center justify-center gap-1.5 mt-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-xl glass hover:bg-white/10 disabled:opacity-30 transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <ChevronLeft size={15} />
      </button>

      {visible.map((p, i) => {
        const prev = visible[i - 1];
        return (
          <span key={p} className="flex items-center gap-1.5">
            {prev && p - prev > 1 && (
              <span className="w-8 text-center text-gray-500 text-sm">…</span>
            )}
            <button
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 ${
                p === page
                  ? 'bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'glass hover:bg-white/10 text-gray-400 hover:text-white hover:scale-105'
              }`}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-xl glass hover:bg-white/10 disabled:opacity-30 transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <ChevronRight size={15} />
      </button>
    </div>
  );
};

export default Pagination;
