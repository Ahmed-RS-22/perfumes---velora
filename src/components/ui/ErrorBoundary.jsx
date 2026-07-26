import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-bg text-center px-6 py-20">
          <div className="max-w-md">
            <p className="text-7xl mb-6">??</p>
            <h1 className="text-3xl font-cinzel font-bold text-heading mb-4">
              Something went <span className="text-error">wrong</span>
            </h1>
            <p className="text-text-muted mb-2 text-sm leading-relaxed">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre className="text-left text-xs bg-error-bg text-error border border-error rounded-xl p-4 mt-4 overflow-auto max-h-40">
                {this.state.error.toString()}
              </pre>
            )}
            <div className="flex gap-4 justify-center mt-8">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-6 py-2.5 rounded-full bg-primary text-bg font-medium hover:bg-primary/90 transition-all"
              >
                Try Again
              </button>
              <a
                href="/"
                className="px-6 py-2.5 rounded-full border border-border text-text-muted hover:border-primary hover:text-primary transition-all"
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
