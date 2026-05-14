import { useState } from 'react';

const StarRating = ({ value = 0, onChange, readonly = false, size = 20 }) => {
  const [hovered, setHovered] = useState(0);
  const [justClicked, setJustClicked] = useState(0);
  const display = hovered || value;

  const handleClick = (star) => {
    if (readonly) return;
    setJustClicked(star);
    onChange?.(star);
    setTimeout(() => setJustClicked(0), 300);
  };

  return (
    <div className="flex gap-0.5 items-center">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= display;
        const isPopped = star === justClicked;

        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            className={`relative transition-all duration-150 focus:outline-none
              ${readonly ? 'cursor-default' : 'cursor-pointer'}
              ${isPopped ? 'animate-star-pop' : ''}
              ${!readonly && filled ? 'hover:scale-125' : ''}
              ${!readonly && !filled ? 'hover:scale-110' : ''}
            `}
            style={{ width: size + 4, height: size + 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill={filled ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={filled ? 0 : 1.5}
              className={`transition-all duration-150 ${
                filled
                  ? 'text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]'
                  : 'text-gray-600'
              }`}
            >
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>

            {/* glow burst on fill */}
            {filled && !readonly && (
              <span
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(250,204,21,0.3) 0%, transparent 70%)',
                  opacity: hovered >= star ? 1 : 0,
                  transition: 'opacity 0.15s',
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
