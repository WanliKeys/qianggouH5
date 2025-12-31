import { Product, User } from './types';

export const MOCK_USER: User = {
  id: '8888',
  nickname: '星辰',
  phone: '188****7877',
  avatar: 'https://picsum.photos/id/64/200/200',
  balance: 794.90,
  points: 60517.00,
  earnings_today: 0,
  earnings_total: 1947
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'AA555',
    subtitle: '天然抗氧化 细胞更年轻',
    price: 99999.00,
    image: 'https://picsum.photos/id/21/400/400',
    tags: ['迷迭香提取物']
  },
  {
    id: '2',
    title: 'AA666',
    subtitle: '迷迭香 又称海洋之露',
    price: 19999.00,
    image: 'https://picsum.photos/id/42/400/400',
    tags: ['天然', '清香', '浓郁']
  },
  {
    id: '3',
    title: '精油系列',
    subtitle: '收缩毛孔 紧致肌肤',
    price: 588.00,
    image: 'https://picsum.photos/id/106/400/400',
    tags: ['迷迭香精油']
  }
];

export const COLORS = {
  primary: '#15803d', // green-700
  secondary: '#fcd34d', // amber-300
  text: '#374151', // gray-700
  bg: '#f9fafb', // gray-50
};