import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div className="mb-4 group">
    {label && (
      <label className="label transition-colors duration-200 group-focus-within:text-blue-400">
        {label}
      </label>
    )}
    <div className="relative">
      <input
        ref={ref}
        className={`input-field ${error ? '!border-red-500/60 focus:!border-red-500 focus:!shadow-[0_0_0_3px_rgba(239,68,68,0.15)]' : ''} ${className}`}
        {...props}
      />
      {/* bottom glow line */}
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-300 group-focus-within:w-full" />
    </div>
    {error && (
      <p className="error-text flex items-center gap-1 animate-fade-in-up">
        <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error}
      </p>
    )}
  </div>
));

Input.displayName = 'Input';
export default Input;
