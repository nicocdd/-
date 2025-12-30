import { Crop, DecorationItem } from './types';

export const CROPS: Crop[] = [
  {
    id: 'radish',
    name: '白萝卜',
    growthTime: 15, 
    buyPrice: 10,
    sellPrice: 25,
    xp: 5,
    color: 'from-white to-slate-100',
    emoji: '🥕'
  },
  {
    id: 'tomato',
    name: '西红柿',
    growthTime: 45,
    buyPrice: 40,
    sellPrice: 110,
    xp: 12,
    color: 'from-red-400 to-red-600',
    emoji: '🍅'
  },
  {
    id: 'corn',
    name: '玉米',
    growthTime: 90,
    buyPrice: 85,
    sellPrice: 240,
    xp: 25,
    color: 'from-yellow-300 to-yellow-500',
    emoji: '🌽'
  },
  {
    id: 'watermelon',
    name: '大西瓜',
    growthTime: 300,
    buyPrice: 200,
    sellPrice: 750,
    xp: 60,
    color: 'from-green-400 to-green-700',
    emoji: '🍉'
  }
];

export const INITIAL_LAND_COUNT = 12;
export const INITIAL_GOLD = 500;
export const XP_PER_LEVEL = 100;

export const FARMHOUSE_UPGRADES = [
  { level: 1, cost: 0, energyBonus: 0, label: '简陋小屋' },
  { level: 2, cost: 1000, energyBonus: 20, label: '温馨木屋' },
  { level: 3, cost: 5000, energyBonus: 50, label: '精致庄园' },
  { level: 4, cost: 20000, energyBonus: 100, label: '梦想城堡' },
];

export const DECORATIONS: DecorationItem[] = [
  { id: 'scarecrow', name: '稻草人', emoji: '🧑‍🌾', price: 200, description: '装饰农场，增加一点生气' },
  { id: 'doghouse', name: '小狗窝', emoji: '🏠', price: 500, description: '忠诚的伙伴守护农场' },
  { id: 'flowerpot', name: '大花盆', emoji: '🪴', price: 150, description: '点缀色彩的绿植' },
  { id: 'well', name: '古井', emoji: '🪣', price: 1200, description: '源源不断的清泉' },
  { id: 'swing', name: '秋千', emoji: '🎠', price: 2500, description: '闲暇时的欢乐时光' },
];