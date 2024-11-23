import { useGameStore } from '../../../stores/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Scroll, MapPin, Trophy, Coins, Heart, Star, X } from 'lucide-react';

export function QuestGiver() {
  const isOpen = useGameStore((state) => state.questGiverOpen);
  const setIsOpen = useGameStore((state) => state.setQuestGiverOpen);
  // ... rest of the component remains the same ...
}