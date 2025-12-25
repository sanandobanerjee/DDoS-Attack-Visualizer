import { StreamEvent, DDoSAttack, AttackStats } from '@/types/attacks';
import { generateMockAttacks, calculateStats } from '@/lib/mock-data';

// Store attacks in memory for this instance
let attacksBuffer: DDoSAttack[] = [];
let updateInterval: NodeJS.Timeout | null = null;

function initializeMockData() {
  if (updateInterval) return;

  // Generate initial attacks
  attacksBuffer = generateMockAttacks(20);

  // Simulate new attacks every 1-3 seconds
  updateInterval = setInterval(() => {
    const newAttacks = generateMockAttacks(Math.floor(Math.random() * 3) + 1);
    attacksBuffer = [...newAttacks, ...attacksBuffer].slice(0, 1000);
  }, Math.random() * 2000 + 1000);

  // Clean up interval on process exit
  process.on('exit', () => {
    if (updateInterval) clearInterval(updateInterval);
  });
}

export async function GET(request: Request) {
  // Initialize mock data on first connection
  initializeMockData();

  // Create a readable stream for SSE
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Send connected message
      const connectEvent: StreamEvent = {
        type: 'connected',
        data: null,
        timestamp: Date.now(),
      };
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify(connectEvent)}\n\n`)
      );

      // Send initial attacks
      attacksBuffer.slice(0, 20).forEach((attack) => {
        const event: StreamEvent = {
          type: 'attack',
          data: attack,
          timestamp: Date.now(),
        };
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
        );
      });

      // Send initial stats
      const stats = calculateStats(attacksBuffer);
      const statsEvent: StreamEvent = {
        type: 'stats',
        data: stats,
        timestamp: Date.now(),
      };
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify(statsEvent)}\n\n`)
      );

      let lastUpdateTime = Date.now();
      const updateIntervalTime = 500; // Update every 500ms
      const statsUpdateInterval = 5000; // Update stats every 5 seconds
      let lastStatsUpdate = Date.now();
      let isClosed = false;

      const sendUpdates = () => {
        if (isClosed) return;

        const now = Date.now();

        try {
          // Send new attacks
          if (now - lastUpdateTime > updateIntervalTime) {
            const newAttacks = attacksBuffer.slice(0, 5);
            newAttacks.forEach((attack) => {
              const event: StreamEvent = {
                type: 'update',
                data: attack,
                timestamp: Date.now(),
              };
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
              );
            });
            lastUpdateTime = now;
          }

          // Send stats update
          if (now - lastStatsUpdate > statsUpdateInterval) {
            const stats = calculateStats(attacksBuffer);
            const statsEvent: StreamEvent = {
              type: 'stats',
              data: stats,
              timestamp: Date.now(),
            };
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(statsEvent)}\n\n`)
            );
            lastStatsUpdate = now;
          }

          // Keep-alive ping
          controller.enqueue(encoder.encode(': keep-alive\n\n'));

          // Schedule next update
          setTimeout(sendUpdates, 100);
        } catch (err) {
          isClosed = true;
        }
      };

      // Start sending updates
      sendUpdates();

      // Handle client disconnect
      request.signal.addEventListener('abort', () => {
        isClosed = true;
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
