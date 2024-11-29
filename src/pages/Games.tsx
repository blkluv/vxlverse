import { useState, useMemo } from "react";
import { GameCard } from "../components/game/GameCard";
import { useAuthStore } from "../stores/authStore";
import { Header } from "../components/layout/Header";
import { Plus, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { useGames } from "../hooks/useGames";
import { GameFilters } from "../components/game/GameFilters";

export function Games() {
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const { user } = useAuthStore();
  const { games, isLoading, mutate } = useGames();

  const filteredGames = useMemo(() => {
    let filtered = games;

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        game =>
          game.title.toLowerCase().includes(searchLower) ||
          game.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(game => 
        game.tags?.some(tag => selectedTags.includes(tag))
      );
    }

    // Filter by ownership
    if (activeTab === 'my') {
      filtered = filtered.filter(game => game.creator === user?.id);
    } else {
      filtered = filtered.filter(game => game.creator !== user?.id);
    }

    return filtered;
  }, [games, search, selectedTags, activeTab, user?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-800 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Games Gallery</h1>
            <p className="text-gray-400">Discover and play amazing VXL games</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showFilters
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
            {user && (
              <Link
                to="/editor"
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Game
              </Link>
            )}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
            <GameFilters
              onSearchChange={setSearch}
              onTagsChange={setSelectedTags}
              selectedTags={selectedTags}
            />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 bg-gray-800/50 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'all'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            All Games
          </button>
          {user && (
            <button
              onClick={() => setActiveTab('my')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'my'
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              My Games
            </button>
          )}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game, index) => (
            <GameCard
              key={game.id}
              game={game}
              index={index}
              onDelete={mutate}
            />
          ))}
          {filteredGames.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-gray-700 rounded-xl">
              <div className="text-gray-400 text-center">
                <p className="mb-2">
                  {activeTab === 'my'
                    ? "You haven't created any games yet."
                    : "No games found matching your filters."}
                </p>
                {activeTab === 'my' && (
                  <Link
                    to="/editor"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Create your first game →
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
