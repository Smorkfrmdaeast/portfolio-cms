import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught application error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F4F1EA] dark:bg-[#0F1115] text-[#16181D] dark:text-[#ECE8DF] flex flex-col justify-center items-center px-6 py-20">
          <div className="max-w-md w-full border border-[#D9D4C7] dark:border-[#22262F] bg-white dark:bg-[#15181F] p-8 rounded-[3px]">
            <span className="font-mono text-xs uppercase tracking-wider text-[#D9532B]">
              Application Error
            </span>
            <h1 className="font-serif text-2xl mt-2 mb-4">Something went wrong</h1>
            <p className="text-sm text-[#6B6F78] dark:text-[#8E93A0] mb-6">
              An unexpected error occurred while rendering this page.
            </p>
            {this.state.error && (
              <pre className="text-xs font-mono bg-[#F4F1EA] dark:bg-[#0F1115] p-3 rounded-[2px] border border-[#D9D4C7] dark:border-[#22262F] overflow-x-auto text-red-600 dark:text-red-400 mb-6">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-xs font-mono uppercase tracking-wider bg-[#16181D] dark:bg-[#ECE8DF] text-[#F4F1EA] dark:text-[#16181D] rounded-[2px] hover:bg-[#D9532B] dark:hover:bg-[#D9532B] dark:hover:text-white transition-colors"
              >
                Reload Page
              </button>
              <a
                href="/"
                className="px-4 py-2 text-xs font-mono uppercase tracking-wider border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] hover:border-[#D9532B] transition-colors inline-block"
              >
                Return Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
