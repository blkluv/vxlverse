import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { Search, X, Info, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GAME_ITEMS } from '../../types';
import { Portal } from '../Portal';

const CATEGORIES = [
  { id: 'all', label: 'All Items', emoji: '📦' },
  { id: 'weapon', label: 'Weapons', emoji: '⚔️' },
  { id: 'armor', label: 'Armor', emoji: '🛡️' },
  { id: 'potion', label: 'Potions', emoji: '🧪' },
  { id: 'material', label: 'Materials', emoji: '🪨' },
  { id: 'quest', label: 'Quest Items', emoji: '📜' },
  { id: 'food', label: 'Food', emoji: '🍖' }
];

export function Inventory() {
  const isOpen = useGameStore((state) => state.inventoryOpen);
  const setIsOpen = useGameStore((state) => state.setInventoryOpen);
  const inventory = useGameStore((state) => state.inventory);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getItemDetails = (itemId: string) => GAME_ITEMS.find(item => item.id === itemId);

  const filteredItems = inventory.filter(item => {
    const details = getItemDetails(item.id);
    if (!details) return false;
    
    const matchesSearch = details.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         details.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || details.type === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const selectedItemDetails = selectedItem ? getItemDetails(selectedItem) : null;

  if (!isOpen) return null;

  return (
    <Portal>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-8"
        onClick={() => setIsOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className="bg-gray-900/95 rounded-xl w-[900px] h-[600px] shadow-xl border border-gray-800/50 flex overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Left Sidebar - Categories */}
          <div className="w-48 bg-gray-900/50 border-r border-gray-800/50">
            <div className="p-4">
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                Categories
              </div>
              <div className="space-y-1">
                {CATEGORIES.map(category => {
                  const itemCount = category.id === 'all' 
                    ? inventory.length
                    : inventory.filter(item => getItemDetails(item.id)?.type === category.id).length;

                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full px-3 py-2 rounded-lg text-left transition-all flex items-center justify-between group ${
                        selectedCategory === category.id
                          ? 'bg-blue-500/20 text-blue-100'
                          : 'hover:bg-gray-800/50 text-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{category.emoji}</span>
                        <span className="text-sm">{category.label}</span>
                      </div>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        selectedCategory === category.id
                          ? 'bg-blue-500/30 text-blue-200'
                          : 'bg-gray-800 text-gray-400'
                      }`}>
                        {itemCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-800/50 flex items-center justify-between bg-gray-900/50">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🎒</div>
                <div>
                  <h2 className="text-lg font-bold text-white">Inventory</h2>
                  <div className="text-sm text-gray-400">
                    {inventory.length} items
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-gray-800/50 bg-gray-900/30">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-800/50 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            {/* Items Grid */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
              {filteredItems.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">📦</div>
                  <p className="text-gray-400">No items found</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {filteredItems.map(item => {
                    const details = getItemDetails(item.id);
                    if (!details) return null;

                    return (
                      <motion.button
                        key={item.id}
                        layoutId={item.id}
                        onClick={() => setSelectedItem(item.id)}
                        className={`p-4 rounded-lg border transition-all ${
                          selectedItem === item.id
                            ? 'bg-blue-500/20 border-blue-500/50 ring-1 ring-blue-500/50'
                            : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800'
                        }`}
                      >
                        <div className="text-3xl mb-3">{details.emoji}</div>
                        <div className="text-sm font-medium text-gray-100 mb-1">
                          {details.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          Quantity: {item.amount}
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-xs text-yellow-400">
                          <span className="text-lg">💰</span>
                          {details.value}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Item Details */}
          <AnimatePresence mode="wait">
            {selectedItemDetails && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 300, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="w-[300px] bg-gray-900/50 border-l border-gray-800/50 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-800/50">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">ℹ️</span>
                    <h3 className="text-lg font-bold text-white">Item Details</h3>
                  </div>
                </div>

                <div className="p-4 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 flex items-center justify-center text-4xl bg-gray-800 rounded-lg">
                      {selectedItemDetails.emoji}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-100">
                        {selectedItemDetails.name}
                      </h4>
                      <div className="text-sm text-gray-400">
                        {selectedItemDetails.type}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                      Description
                    </div>
                    <p className="text-sm text-gray-300">
                      {selectedItemDetails.description}
                    </p>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                      Value
                    </div>
                    <div className="flex items-center gap-2 text-yellow-400">
                      <span className="text-2xl">💰</span>
                      <span className="text-lg font-medium">
                        {selectedItemDetails.value}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-800/50">
                    <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">
                      Use Item
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </Portal>
  );
}