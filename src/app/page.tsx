'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">DDoS Attack Visualizer</h1>
        <p className="mt-2 text-slate-400">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
