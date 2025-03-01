import { useState } from "react";
import { useGameStore } from "../../stores/gameStore";
import { Search, X, Info, DollarSign, Package, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GAME_ITEMS } from "../../types";
import { Portal } from "../Portal";
import { useSound } from "../../hooks/useSound";
import { Input } from "../UI/input";

const CATEGORIES = [
  { id: "all", label: "All Items", emoji: "📦" },
  { id: "weapon", label: "Weapons", emoji: "⚔️" },
  { id: "armor", label: "Armor", emoji: "🛡️" },
  { id: "potion", label: "Potions", emoji: "🧪" },
  { id: "material", label: "Materials", emoji: "🪨" },
  { id: "quest", label: "Quest Items", emoji: "📜" },
  { id: "food", label: "Food", emoji: "🍖" },
];

export function Inventory() {
  const isOpen = useGameStore((state) => state.inventoryOpen);
  const setIsOpen = useGameStore((state) => state.setInventoryOpen);
  const inventory = useGameStore((state) => state.inventory);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { playSound } = useSound();
  const { money, updatePlayerStats } = useGameStore((state) => ({
    money: state.playerStats.money,
    updatePlayerStats: state.updatePlayerStats,
  }));
  const removeFromInventory = useGameStore(
    (state) => state.removeFromInventory
  );

  // Track recently sold items for animation
  const [recentlySold, setRecentlySold] = useState<string[]>([]);

  const getItemDetails = (itemId: string) =>
    GAME_ITEMS.find((item) => item.id === itemId);

  const handleSellItem = (itemId: string) => {
    const item = getItemDetails(itemId);
    if (!item) return;

    playSound("cash");
    const sellValue = Math.floor(item.value * 0.7); // 70% of original value
    updatePlayerStats({ money: money + sellValue });
    removeFromInventory(itemId, 1);

    // Add to recently sold items
    setRecentlySold((prev) => [...prev, itemId]);

    // Show sale notification
    const notification = document.createElement("div");
    notification.className =
      "fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2  flex items-center gap-2 animate-slide-up";
    notification.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      Sold ${item.name} for ${sellValue} coins!
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);

    // Remove from recently sold after animation
    setTimeout(() => {
      setRecentlySold((prev) => prev.filter((id) => id !== itemId));
    }, 1000);

    // If no more items of this type, close details panel
    const remainingItems = inventory.find((i) => i.id === itemId)?.amount || 0;
    if (remainingItems <= 1) {
      setSelectedItem(null);
    }
  };

  const filteredItems = inventory.filter((item) => {
    const details = getItemDetails(item.id);
    if (!details) return false;

    const matchesSearch =
      details.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      details.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || details.type === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const selectedItemDetails = selectedItem
    ? getItemDetails(selectedItem)
    : null;

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 md:p-8"
        onClick={() => setIsOpen(false)}
      >
        <div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className="bg-gray-900/95  w-full md:w-[900px] h-[90vh] md:h-[600px] shadow-xl border border-gray-800/50 flex flex-col md:flex-row overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left Sidebar - Categories (Hidden on mobile, shown as top bar) */}
          <div className="md:hidden p-3 bg-gray-900/50 border-b border-gray-800/50 overflow-x-auto">
            <div className="flex gap-2">
              {CATEGORIES.map((category) => {
                const itemCount =
                  category.id === "all"
                    ? inventory.length
                    : inventory.filter(
                        (item) => getItemDetails(item.id)?.type === category.id
                      ).length;

                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      playSound("select");
                      setSelectedCategory(category.id);
                    }}
                    className={`flex-shrink-0 px-3 py-1.5  text-center transition-all ${
                      selectedCategory === category.id
                        ? "bg-blue-500/20 text-blue-100"
                        : "bg-gray-800/50 text-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg">{category.emoji}</span>
                      <span className="text-xs whitespace-nowrap">
                        {category.label}
                      </span>
                      <span
                        className={`text-xs px-1.5 py-0.5  ${
                          selectedCategory === category.id
                            ? "bg-blue-500/30 text-blue-200"
                            : "bg-gray-800 text-gray-400"
                        }`}
                      >
                        {itemCount}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop Categories Sidebar */}
          <div className="hidden md:block w-48 bg-gray-900/50 border-r border-gray-800/50">
            <div className="p-4">
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                Categories
              </div>
              <div className="space-y-1">
                {CATEGORIES.map((category) => {
                  const itemCount =
                    category.id === "all"
                      ? inventory.length
                      : inventory.filter(
                          (item) =>
                            getItemDetails(item.id)?.type === category.id
                        ).length;

                  return (
                    <button
                      key={category.id}
                      onClick={() => {
                        playSound("select");
                        setSelectedCategory(category.id);
                      }}
                      className={`w-full px-3 py-2  text-left transition-all flex items-center justify-between group ${
                        selectedCategory === category.id
                          ? "bg-blue-500/20 text-blue-100"
                          : "hover:bg-gray-800/50 text-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{category.emoji}</span>
                        <span className="text-sm">{category.label}</span>
                      </div>
                      <span
                        className={`text-xs px-1.5 py-0.5  ${
                          selectedCategory === category.id
                            ? "bg-blue-500/30 text-blue-200"
                            : "bg-gray-800 text-gray-400"
                        }`}
                      >
                        {itemCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="p-3 md:p-4 border-b border-gray-800/50 flex items-center justify-between bg-gray-900/50">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="text-xl md:text-2xl">🎒</div>
                <div>
                  <h2 className="text-base md:text-lg font-bold text-white">
                    Inventory
                  </h2>
                  <div className="text-xs md:text-sm text-gray-400">
                    {inventory.length} items
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 md:p-2 hover:bg-gray-800  transition-colors"
              >
                <X className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-3 md:p-4 border-b border-gray-800/50 bg-gray-900/30">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 md:py-2.5 bg-gray-800/50  text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            {/* Items Grid */}
            <div className="flex-1 p-3 md:p-4 overflow-y-auto custom-scrollbar">
              {filteredItems.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">📦</div>
                  <p className="text-gray-400">No items found</p>
                </div>
              ) : (
                <div
                  className={`grid ${
                    selectedItemDetails
                      ? "grid-cols-1"
                      : "grid-cols-1 md:grid-cols-2"
                  } gap-2 md:gap-3`}
                >
                  {filteredItems.map((item) => {
                    const details = getItemDetails(item.id);
                    if (!details) return null;

                    const isSold = recentlySold.includes(item.id);

                    return (
                      <button
                        key={item.id}
                        layoutId={item.id}
                        onClick={() => {
                          playSound("select");
                          setSelectedItem(item.id);
                        }}
                        animate={{
                          scale: isSold ? 0.95 : 1,
                          opacity: isSold ? 0.5 : 1,
                        }}
                        className={`p-3 md:p-4  border transition-all ${
                          selectedItem === item.id
                            ? "bg-blue-500/20 border-blue-500/50 ring-1 ring-blue-500/50"
                            : "bg-gray-800/50 border-gray-700/50 hover:bg-gray-800"
                        }`}
                      >
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="text-2xl md:text-3xl">
                            {details.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-100 truncate">
                              {details.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              Quantity: {item.amount}
                            </div>
                            <div className="flex items-center gap-1 mt-1.5 md:mt-2 text-xs text-yellow-400">
                              <span className="text-base md:text-lg">💰</span>
                              {details.value}
                            </div>
                          </div>
                          {isSold && (
                            <div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="bg-green-500  p-1"
                            >
                              <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Item Details (Full screen on mobile) */}
          {selectedItemDetails && (
            <div
              initial={{
                width: 0,
                opacity: 0,
                height: "100%",
              }}
              animate={{
                width: window.innerWidth < 768 ? "100%" : 350,
                opacity: 1,
                height: "100%",
              }}
              exit={{
                width: 0,
                opacity: 0,
                height: "100%",
              }}
              className="absolute md:relative right-0 top-0 md:w-[350px] h-full bg-gray-900/95 md:bg-gray-900/50 border-l border-gray-800/50 overflow-hidden"
              style={{
                zIndex: window.innerWidth < 768 ? 50 : 1,
              }}
            >
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12  bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                      <Info className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-white">
                        Details
                      </h2>
                      <div className="text-xs md:text-sm text-blue-400">
                        Item Information
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      playSound("select");
                      setSelectedItem(null);
                    }}
                    className="p-1.5 md:p-2 hover:bg-gray-800/50  transition-colors"
                  >
                    <X className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Item Preview */}
                  <div className="flex items-center gap-4">
                    <div className="text-4xl md:text-5xl">
                      {selectedItemDetails.emoji}
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-white">
                        {selectedItemDetails.name}
                      </h3>
                      <div className="text-xs md:text-sm text-gray-400">
                        {selectedItemDetails.type.charAt(0).toUpperCase() +
                          selectedItemDetails.type.slice(1)}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="text-xs md:text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">
                      Description
                    </h4>
                    <p className="text-sm md:text-base text-gray-300">
                      {selectedItemDetails.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div>
                    <h4 className="text-xs md:text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">
                      Stats
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Value</span>
                        <span className="text-yellow-400">
                          {selectedItemDetails.value} coins
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Sell Price</span>
                        <span className="text-yellow-400">
                          {Math.floor(selectedItemDetails.value * 0.7)} coins
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleSellItem(selectedItemDetails.id)}
                      className="w-full px-4 py-2.5  bg-gradient-to-br from-yellow-500 to-yellow-700 text-white font-medium text-sm hover:from-yellow-600 hover:to-yellow-800 transition-all flex items-center justify-center gap-2"
                    >
                      <DollarSign className="w-4 h-4" />
                      Sell Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
}
