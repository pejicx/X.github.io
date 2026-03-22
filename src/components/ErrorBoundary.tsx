import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white p-8 font-mono">
          <div className="max-w-md w-full glass-panel p-8 border-red-500/30">
            <h1 className="text-xl font-bold text-red-400 mb-4 uppercase tracking-widest">Substrate_Critical_Failure</h1>
            <p className="text-sm text-white/60 mb-6 leading-relaxed">
              The neural substrate has encountered an unrecoverable error. System integrity compromised.
            </p>
            <div className="bg-black/40 p-4 rounded-lg border border-white/5 text-[10px] overflow-auto max-h-40 custom-scrollbar mb-6">
              {this.state.error?.toString()}
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-sky-500/20 border border-sky-500/40 rounded-xl text-sky-400 hover:bg-sky-500/30 transition-all uppercase text-xs font-bold tracking-widest"
            >
              Attempt_Reboot
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
