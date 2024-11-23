import { GAME_ITEMS, Item } from '../../types';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface ItemSelectorProps {
  onSelect: (item: Item) => void;
  onClose: () => void;
}

export function ItemSelector({ onSelect, onClose }: ItemSelectorProps) {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<Item['type'] | 'all'>('all');

  const filteredItems = GAME_ITEMS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                         item.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  const types = ['all', ...Array.from(new Set(GAME_ITEMS.map(item => item.type)))];

  return (
    <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm p-4 z-50">
      <div className="max-w-lg mx-auto bg-slate-800 rounded-xl shadow-xl">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-slate-100">Select Item</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-300">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-700/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {types.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                  selectedType === type
                    ? 'bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-2">
            {filteredItems.map(item => (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors text-left"
              >
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <div className="text-sm font-medium text-slate-200">{item.name}</div>
                  <div className="text-xs text-slate-400">{item.value} coins</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}