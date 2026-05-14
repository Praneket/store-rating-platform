import { useRef } from 'react';

const PALETTE = {
  blue:   { gradient: 'from-blue-500 to-cyan-500',     glow: 'rgba(59,130,246,0.3)'  },
  green:  { gradient: 'from-emerald-500 to-teal-500',  glow: 'rgba(5,150,105,0.3)'   },
  purple: { gradient: 'from-violet-500 to-purple-500', glow: 'rgba(124,58,237,0.3)'  },
  orange: { gradient: 'from-amber-500 to-orange-500',  glow: 'rgba(217,119,6,0.3)'   },
};

const StatCard = ({ title, value, icon: Icon, color = 'blue', subtitle }) => {
  const cardRef = useRef(null);
  const p = PALETTE[color];

  const onMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(4px)`;
  };

  const onMouseLeave = () => {
    if (cardRef.current)
      cardRef.current.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg) translateZ(0)';
  };

  return (
    <div
      ref={cardRef}
      className="stat-card p-6 cursor-default animate-fade-in-up"
      style={{ transition: 'transform 0.15s ease, box-shadow 0.25s ease' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
            {title}
          </p>
          <p className="text-3xl font-black tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {value ?? '—'}
          </p>
          {subtitle && (
            <p className="text-xs mt-1.5 truncate max-w-[140px]" style={{ color: 'var(--text-muted)' }}>
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div
            className={`relative p-3.5 rounded-2xl bg-gradient-to-br ${p.gradient} shrink-0`}
            style={{ boxShadow: `0 6px 20px ${p.glow}` }}
          >
            <div
              className="absolute inset-0 rounded-2xl border-2 border-white/25 animate-spin-slow"
              style={{ borderTopColor: 'rgba(255,255,255,0.6)' }}
            />
            <Icon size={20} className="text-white relative z-10" />
          </div>
        )}
      </div>

      {/* Bottom accent */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${p.gradient} opacity-30 rounded-b-2xl`} />
    </div>
  );
};

export default StatCard;
