import { DDoSAttack, GeoLocation, AttackStats } from "@/types/attacks";

const ATTACK_TYPES = [
  "SYN_FLOOD",
  "UDP_FLOOD",
  "HTTP_FLOOD",
  "DNS_AMPLIFICATION",
  "ICMP_FLOOD",
] as const;

interface LocationBase {
  name: string;
  lat: number;
  lng: number;
}

const COUNTRIES: LocationBase[] = [
  { name: "China", lat: 35.8617, lng: 104.1954 },
  { name: "Russia", lat: 61.524, lng: 105.3188 },
  { name: "United States", lat: 37.0902, lng: -95.7129 },
  { name: "India", lat: 20.5937, lng: 78.9629 },
  { name: "Brazil", lat: -14.2352, lng: -51.9253 },
  { name: "Vietnam", lat: 14.0583, lng: 108.2772 },
  { name: "Iran", lat: 32.4279, lng: 53.688 },
  { name: "North Korea", lat: 40.3399, lng: 127.5101 },
];

const TARGET_COUNTRIES: LocationBase[] = [
  { name: "United States", lat: 37.0902, lng: -95.7129 },
  { name: "United Kingdom", lat: 55.3781, lng: -3.436 },
  { name: "Germany", lat: 51.1657, lng: 10.4515 },
  { name: "Australia", lat: -25.2744, lng: 133.7751 },
  { name: "Japan", lat: 36.2048, lng: 138.2529 },
  { name: "Canada", lat: 56.1304, lng: -106.3468 },
];

function generateRandomCoordinate(base: LocationBase, radius: number = 2): Omit<GeoLocation, "ipAddress"> {
  return {
    lat: base.lat + (Math.random() - 0.5) * radius,
    lng: base.lng + (Math.random() - 0.5) * radius,
    country: base.name,
    city: base.name,
  };
}

function generateRandomIP(): string {
  return Array(4)
    .fill(0)
    .map(() => Math.floor(Math.random() * 256))
    .join(".");
}

export function generateMockAttacks(count: number): DDoSAttack[] {
  const attacks: DDoSAttack[] = [];

  for (let i = 0; i < count; i++) {
    const sourceCountry = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    const targetCountry =
      TARGET_COUNTRIES[Math.floor(Math.random() * TARGET_COUNTRIES.length)];

    const attack: DDoSAttack = {
      id: `attack_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      source: {
        ...generateRandomCoordinate(sourceCountry),
        ipAddress: generateRandomIP(),
      },
      target: {
        ...generateRandomCoordinate(targetCountry),
        ipAddress: generateRandomIP(),
      },
      attackType:
        ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)],
      magnitude: Math.floor(Math.random() * 100) + 1,
      bitsPerSecond: Math.floor(Math.random() * 100000000) + 1000000,
      packetsPerSecond: Math.floor(Math.random() * 1000000) + 10000,
      duration: Math.floor(Math.random() * 3600) + 60,
      targetPort: Math.floor(Math.random() * 65535) + 1,
      protocol: ["TCP", "UDP", "ICMP"][Math.floor(Math.random() * 3)],
    };

    attacks.push(attack);
  }

  return attacks;
}

export function calculateStats(attacks: DDoSAttack[]): AttackStats {
  if (attacks.length === 0) {
    return {
      totalAttacks: 0,
      activeAttacks: 0,
      peakBitrate: 0,
      topSourceCountries: [],
      topAttackTypes: [],
      averageAttackDuration: 0,
    };
  }

  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
  const activeAttacks = attacks.filter((a) => a.timestamp > fiveMinutesAgo).length;

  const peakBitrate = Math.max(...attacks.map((a) => a.bitsPerSecond));

  const countryMap = new Map<string, number>();
  attacks.forEach((a) => {
    countryMap.set(
      a.source.country,
      (countryMap.get(a.source.country) || 0) + 1
    );
  });

  const topSourceCountries = Array.from(countryMap.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const typeMap = new Map<string, number>();
  attacks.forEach((a) => {
    typeMap.set(a.attackType, (typeMap.get(a.attackType) || 0) + 1);
  });

  const topAttackTypes = Array.from(typeMap.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  const averageAttackDuration =
    attacks.reduce((sum, a) => sum + a.duration, 0) / attacks.length;

  return {
    totalAttacks: attacks.length,
    activeAttacks,
    peakBitrate,
    topSourceCountries,
    topAttackTypes,
    averageAttackDuration,
  };
}
