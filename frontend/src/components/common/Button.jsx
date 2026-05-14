const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
};

const Button = ({ children, variant = 'primary', loading = false, className = '', ...props }) => (
  <button
    className={`${variants[variant]} relative flex items-center justify-center gap-2 ${className}`}
    disabled={loading || props.disabled}
    {...props}
  >
    {/* shimmer sweep on primary */}
    {variant === 'primary' && (
      <span
        className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
        aria-hidden
      >
        <span className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
      </span>
    )}

    {loading ? (
      <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
    ) : null}

    <span className="relative z-10">{children}</span>
  </button>
);

export default Button;
