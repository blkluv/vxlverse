import { useGameStore } from '../../../stores/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Coins, Search, X, ArrowRight, ShoppingCart } from 'lucide-react';
import { GAME_ITEMS } from '../../../types';

const MERCHANT_ITEMS = GAME_ITEMS.filter(item => 
  ['weapon', 'armor', 'potion'].includes(item.type)
);

export function Merchant() {
  const isOpen = useGameStore((state) => state.merchantOpen);
  const setIsOpen = useGameStore((state) => state.setMerchantOpen);
  // ... rest of the component remains the same ...
}