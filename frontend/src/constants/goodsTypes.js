import { UtensilsCrossed, Sparkles, Baby, Droplet, Bed, Cross, Pill } from 'lucide-react';

export const ALL_GOODS_TYPES = [
  {
    id: 'ready_to_eat_food',
    name: 'Ready-to-Eat Food',
    icon: UtensilsCrossed,
    description: 'Canned Goods, Biscuits, etc.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  {
    id: 'hygiene_kits',
    name: 'Hygiene Kits',
    icon: Sparkles,
    description: 'Alcohol, Soap, Shampoo, Toothbrush & Toothpaste, etc.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  {
    id: 'baby_needs',
    name: 'Baby Needs',
    icon: Baby,
    description: 'Clean baby clothes, baby food, etc.',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200'
  },
  {
    id: 'bottled_water',
    name: 'Bottled Water',
    icon: Droplet,
    description: 'Bottled water for drinking',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'blankets_towels',
    name: 'Blankets, Towels',
    icon: Bed,
    description: 'Blankets and towels for comfort',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200'
  },
  {
    id: 'emergency_kits',
    name: 'Emergency Kits',
    icon: Cross,
    description: 'Emergency supplies and first aid items',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  {
    id: 'medicine',
    name: 'Medicine',
    icon: Pill,
    description: 'Over-the-counter medication',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  }
];

