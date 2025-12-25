'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAttackStore } from '@/store/attackStore';
import { DDoSAttack, AttackStats, StreamEvent } from '@/types/attacks';

export const useAttackStream = () => {
  const {
    addAttack,
    updateStats,
    setConnected,
    setError,
    clearAttacks,
  } = useAttackStore();

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 10;
  const baseReconnectDelay = 1000; // 1 second

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setConnected(false);
  }, [setConnected]);

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      return; // Already connected or connecting
    }

    try {
      console.log('[SSE] Attempting to connect to /api/stream');
      const eventSource = new EventSource('/api/stream');

      eventSource.addEventListener('open', () => {
        console.log('[SSE] Connection opened');
        setConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
      });

      eventSource.addEventListener('message', (event) => {
        try {
          const streamEvent: StreamEvent = JSON.parse(event.data);

          if (streamEvent.type === 'attack') {
            const attack = streamEvent.data as DDoSAttack;
            addAttack(attack);
          } else if (streamEvent.type === 'stats') {
            const stats = streamEvent.data as AttackStats;
            updateStats(stats);
          } else if (streamEvent.type === 'connected') {
            console.log('[SSE] Server connected confirmation');
          }
        } catch (err) {
          console.error('[SSE] Failed to parse event:', err, event.data);
        }
      });

      eventSource.addEventListener('error', (event) => {
        console.error('[SSE] Connection error details:', {
          readyState: eventSource.readyState,
          status: (event as any).status,
          message: (event as any).message,
        });
        
        if (eventSource.readyState === EventSource.CLOSED) {
          console.log('[SSE] Connection was closed by server');
        } else if (eventSource.readyState === EventSource.CONNECTING) {
          console.log('[SSE] Connection is in CONNECTING state, will retry');
        }
        
        disconnect();
        attemptReconnect();
      });

      eventSourceRef.current = eventSource;
    } catch (err) {
      console.error('[SSE] Failed to create EventSource:', err);
      setError('Failed to connect to attack stream');
      setConnected(false);
      attemptReconnect();
    }
  }, [addAttack, updateStats, setConnected, setError, disconnect]);

  const attemptReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      setError('Failed to reconnect after maximum attempts');
      return;
    }

    reconnectAttemptsRef.current += 1;
    const delay = baseReconnectDelay * Math.pow(2, reconnectAttemptsRef.current - 1);

    console.log(
      `[SSE] Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`
    );

    reconnectTimeoutRef.current = setTimeout(() => {
      connect();
    }, Math.min(delay, 30000));
  }, [connect, setError]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected: useAttackStore((state) => state.isConnected),
    error: useAttackStore((state) => state.error),
  };
};
