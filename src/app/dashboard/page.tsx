'use client';

import { useEffect, useState } from 'react';
import { useAttackStore } from '@/store/attackStore';
import { useAttackStream } from '@/hooks/useAttackStream';
import MapComponent from '@/components/map/MapComponent';
import StatsPanel from '@/components/dashboard/StatsPanel';
import ConnectionStatus from '@/components/dashboard/ConnectionStatus';

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const { isConnected, error } = useAttackStream();
  const attacks = useAttackStore((state) => state.attacks);
  const stats = useAttackStore((state) => state.stats);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  return (
    <div className="flex h-screen w-full flex-col gap-4 bg-slate-950 p-4 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">DDoS Attack Visualizer</h1>
          <p className="text-sm text-slate-400">Real-time global attack detection</p>
        </div>
        <ConnectionStatus isConnected={isConnected} error={error} />
      </div>

      {/* Main Layout - Grid */}
      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-4 min-h-0">
        {/* Map - Takes 3 columns on desktop */}
        <div className="col-span-1 overflow-hidden rounded-lg border border-slate-700 bg-slate-900 lg:col-span-3 min-h-0 flex flex-col">
          <MapComponent attacks={attacks} />
        </div>

        {/* Right Sidebar - Takes 1 column on desktop */}
        <div className="flex flex-col gap-4">
          {/* Stats Panel */}
          <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
            <StatsPanel stats={stats} />
          </div>
        </div>
      </div>
    </div>
  );
}
