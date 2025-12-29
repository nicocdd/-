
import { Crop } from './types';

export const CROPS: Crop[] = [
  {
    id: 'radish',
    name: 'White Radish',
    growthTime: 30, // 30 seconds for demo
    buyPrice: 10,
    sellPrice: 25,
    color: 'bg-white border-slate-200',
    emoji: '🥕'
  },
  {
    id: 'cabbage',
    name: 'Cabbage',
    growthTime: 60, // 1 minute
    buyPrice: 20,
    sellPrice: 55,
    color: 'bg-green-100 border-green-300',
    emoji: '🥬'
  },
  {
    id: 'corn',
    name: 'Golden Corn',
    growthTime: 120, // 2 minutes
    buyPrice: 50,
    sellPrice: 150,
    color: 'bg-yellow-100 border-yellow-300',
    emoji: '🌽'
  },
  {
    id: 'watermelon',
    name: 'Watermelon',
    growthTime: 300, // 5 minutes
    buyPrice: 100,
    sellPrice: 350,
    color: 'bg-green-200 border-green-500',
    emoji: '🍉'
  }
];

export const INITIAL_LAND_COUNT = 6;
export const INITIAL_GOLD = 100;
