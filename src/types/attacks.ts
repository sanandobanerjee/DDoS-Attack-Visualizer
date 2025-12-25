export interface GeoLocation {
  lat: number;
  lng: number;
  country: string;
  city: string;
  ipAddress: string;
}

export interface DDoSAttack {
  id: string;
  timestamp: number;
  source: GeoLocation;
  target: GeoLocation;
  attackType: 'SYN_FLOOD' | 'UDP_FLOOD' | 'HTTP_FLOOD' | 'DNS_AMPLIFICATION' | 'ICMP_FLOOD' | 'UNKNOWN';
  magnitude: number; // Relative intensity 0-100
  bitsPerSecond: number;
  packetsPerSecond: number;
  duration: number; // in seconds
  targetPort?: number;
  protocol?: string;
  description?: string;
}

export interface AttackStats {
  totalAttacks: number;
  activeAttacks: number;
  peakBitrate: number;
  topSourceCountries: Array<{ country: string; count: number }>;
  topAttackTypes: Array<{ type: string; count: number }>;
  averageAttackDuration: number;
}

export interface StreamEvent {
  type: 'attack' | 'update' | 'stats' | 'connected' | 'error';
  data: DDoSAttack | AttackStats | null;
  timestamp: number;
}
