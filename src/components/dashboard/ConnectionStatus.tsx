'use client';

import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
  error: string | null;
}

export default function ConnectionStatus({
  isConnected,
  error,
}: ConnectionStatusProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2">
        {isConnected ? (
          <>
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-400">Connected</span>
          </>
        ) : error ? (
          <>
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-400">Connection Error</span>
          </>
        ) : (
          <>
            <Clock className="h-4 w-4 animate-spin text-yellow-500" />
            <span className="text-sm text-yellow-400">Connecting...</span>
          </>
        )}
      </div>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
