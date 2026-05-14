import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="card p-8 text-center max-w-md">
            <h2 className="text-xl font-bold text-red-500 mb-2">Something went wrong</h2>
            <p className="text-gray-500 text-sm mb-4">{this.state.error?.message}</p>
            <button className="btn-primary" onClick={() => window.location.reload()}>
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
