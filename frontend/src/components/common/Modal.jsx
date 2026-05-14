import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const panelRef = useRef(null);

  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!isOpen) return null;

  const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in-scale"
        style={{ animationDuration: '0.2s' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`relative w-full ${sizes[size]} z-10 max-h-[90vh] overflow-y-auto animate-fade-in-scale`}
        style={{ animationDuration: '0.25s' }}
      >
        {/* Glow ring */}
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-blue-500/30 via-violet-500/20 to-cyan-500/20 blur-sm pointer-events-none" />

        <div className="relative auth-card p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold gradient-text">{title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl transition-all duration-200 hover:bg-white/10 hover:rotate-90 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
