'use client';

import { AttackStats } from '@/types/attacks';
import { Activity, Zap, Globe, Clock } from 'lucide-react';
import { formatBytes, formatNumber } from '@/lib/utils';

interface StatsPanelProps {
  stats: AttackStats | null;
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  if (!stats) {
    return (
      <div className="text-center text-slate-400">
        <p>Loading statistics...</p>
      </div>
    );
  }

  const statItems = [
    {
      label: 'Total Attacks',
      value: formatNumber(stats.totalAttacks),
      icon: Activity,
      color: 'text-red-500',
    },
    {
      label: 'Active Now',
      value: formatNumber(stats.activeAttacks),
      icon: Zap,
      color: 'text-yellow-500',
    },
    {
      label: 'Peak Rate',
      value: formatBytes(stats.peakBitrate) + '/s',
      icon: TrendingUp,
      color: 'text-orange-500',
    },
    {
      label: 'Avg Duration',
      value: Math.round(stats.averageAttackDuration) + 's',
      icon: Clock,
      color: 'text-blue-500',
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Globe className="h-5 w-5" />
        Statistics
      </h2>

      <div className="space-y-3">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Icon className={`h-3 w-3 ${item.color}`} />
                {item.label}
              </div>
              <div className="text-xl font-bold text-white">{item.value}</div>
            </div>
          );
        })}
      </div>

      {/* Top Attack Types */}
      {stats.topAttackTypes.length > 0 && (
        <div className="space-y-2 border-t border-slate-700 pt-4">
          <h3 className="text-xs font-semibold text-slate-300 uppercase">
            Top Attack Types
          </h3>
          <div className="space-y-1">
            {stats.topAttackTypes.slice(0, 3).map((item) => (
              <div
                key={item.type}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-slate-400">{item.type}</span>
                <span className="font-semibold text-slate-200">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Source Countries */}
      {stats.topSourceCountries.length > 0 && (
        <div className="space-y-2 border-t border-slate-700 pt-4">
          <h3 className="text-xs font-semibold text-slate-300 uppercase">
            Top Sources
          </h3>
          <div className="space-y-1">
            {stats.topSourceCountries.slice(0, 3).map((item) => (
              <div
                key={item.country}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-slate-400">{item.country}</span>
                <span className="font-semibold text-red-400">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// TrendingUp icon - fallback since we imported from lucide-react
import { TrendingUp } from 'lucide-react';
