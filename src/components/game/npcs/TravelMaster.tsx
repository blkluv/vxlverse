import { useGameStore } from '../../../stores/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Compass, MapPin, Clock, Coins, X } from 'lucide-react';

export function TravelMaster() {
  const isOpen = useGameStore((state) => state.travelMasterOpen);
  const setIsOpen = useGameStore((state) => state.setTravelMasterOpen);
  // ... rest of the component remains the same ...
}