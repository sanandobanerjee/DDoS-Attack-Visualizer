'use client';

import { DDoSAttack } from '@/types/attacks';
import { AlertCircle, TrendingUp } from 'lucide-react';
import { formatBytes, formatNumber } from '@/lib/utils';

interface AttackFeedProps {
  attacks: DDoSAttack[];
}

export default function AttackFeed({ attacks }: AttackFeedProps) {
  const recentAttacks = attacks.slice(0, 10);

  return (
    <div className="flex h-full flex-col p-4">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <AlertCircle className="h-5 w-5 text-red-500" />
        Recent Attacks
      </h2>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {recentAttacks.length === 0 ? (
          <div className="text-center text-slate-400">No attacks detected</div>
        ) : (
          recentAttacks.map((attack) => (
            <div
              key={attack.id}
              className="rounded border border-slate-700 bg-slate-800 p-3 text-sm hover:border-slate-600 hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-red-400">
                      {attack.attackType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-red-900/30 text-red-300">
                      {attack.magnitude}%
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>
                      <span className="text-slate-300">From:</span> {attack.source.country} ({attack.source.ipAddress})
                    </div>
                    <div>
                      <span className="text-slate-300">To:</span> {attack.target.country}
                    </div>
                    <div className="flex justify-between">
                      <span>{formatBytes(attack.bitsPerSecond)}/s</span>
                      <span>{new Date(attack.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
                <TrendingUp className="h-4 w-4 text-red-500 mt-1" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
