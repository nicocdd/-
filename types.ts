
export enum LandStatus {
  EMPTY = 'EMPTY',
  GROWING = 'GROWING',
  READY = 'READY'
}

export enum WeatherType {
  SUNNY = '晴朗',
  RAINY = '小雨',
  STORMY = '雷阵雨',
  FOGGY = '大雾'
}

export interface Crop {
  id: string;
  name: string;
  growthTime: number; // in seconds
  buyPrice: number;
  sellPrice: number;
  color: string;
  emoji: string;
  xp: number;
}

export interface LandState {
  id: number;
  status: LandStatus;
  cropId: string | null;
  startTime: number | null;
  isBuggy: boolean;
  isWeedy: boolean;
  isDry: boolean;
}

export interface PlayerState {
  gold: number;
  silver: number;
  gems: number;
  energy: number;
  maxEnergy: number;
  level: number;
  xp: number;
  maxXp: number;
  name: string;
  vip: number;
  farmhouseLevel: number;
  unlockedDecorations: string[];
}

export interface DecorationItem {
  id: string;
  name: string;
  emoji: string;
  price: number;
  description: string;
}
