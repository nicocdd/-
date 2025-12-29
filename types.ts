
export enum LandStatus {
  EMPTY = 'EMPTY',
  GROWING = 'GROWING',
  READY = 'READY'
}

export interface Crop {
  id: string;
  name: string;
  growthTime: number; // in seconds
  buyPrice: number;
  sellPrice: number;
  color: string;
  emoji: string;
}

export interface LandState {
  id: number;
  status: LandStatus;
  cropId: string | null;
  startTime: number | null; // Unix Timestamp (ms)
}

export interface PlayerState {
  gold: number;
  seeds: Record<string, number>;
}
