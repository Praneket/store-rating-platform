import { Link } from 'react-router-dom';

const ErrorPage = ({ code, title, message, gradientFrom, gradientTo, orbColor }) => (
  <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
    <div className="orb w-96 h-96 -top-20 -left-20" style={{ background: orbColor, opacity: 0.6 }} />
    <div className="orb w-72 h-72 bottom-0 -right-10" style={{ background: orbColor, opacity: 0.4, animationDelay: '4s' }} />

    <div
      className="blob absolute w-[480px] h-[480px] pointer-events-none"
      style={{ background: `linear-gradient(135deg, ${orbColor}, transparent)`, opacity: 0.3, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
    />

    <div
      className="absolute inset-0 pointer-events-none"
      style={{ backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: 0.5 }}
    />

    <div className="relative z-10 text-center animate-fade-in-scale">
      <h1
        className="text-[9rem] font-black leading-none select-none"
        style={{
          backgroundImage: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          filter: `drop-shadow(0 0 32px ${orbColor})`,
        }}
      >
        {code}
      </h1>
      <h2 className="text-2xl font-bold mt-2 mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      <p className="mb-8 max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>{message}</p>
      <Link to="/" className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-base">
        ← Go Home
      </Link>
    </div>
  </div>
);

export const NotFound = () => (
  <ErrorPage
    code="404"
    title="Page Not Found"
    message="The page you're looking for doesn't exist or has been moved."
    gradientFrom="#3b82f6"
    gradientTo="#7c3aed"
    orbColor="rgba(59,130,246,0.25)"
  />
);

export const Unauthorized = () => (
  <ErrorPage
    code="403"
    title="Access Denied"
    message="You don't have permission to view this page."
    gradientFrom="#e11d48"
    gradientTo="#d97706"
    orbColor="rgba(225,29,72,0.2)"
  />
);
