import { useState, useEffect } from "react";
import { CreateGameModal } from "../components/game/CreateGameModal";
import { useAuthStore } from "../stores/authStore";
import { Hero } from "../components/home/Hero";
import { Features } from "../components/home/Features";
import { HowItWorks } from "../components/home/HowItWorks";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Gamepad2, ArrowRight } from "lucide-react";
import "../styles/animations.css";
import { useGames } from "../hooks/useGames";
import { GameCard } from "../components/game/GameCard";

export function Home() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { games } = useGames();
  useEffect(() => {
    // Event listener for opening the create game modal from other components
    const handleOpenCreateModal = () => {
      if (isAuthenticated) {
        setShowCreateModal(true);
      }
    };

    window.addEventListener("open-create-game-modal", handleOpenCreateModal);

    // Cleanup event listener
    return () => {
      window.removeEventListener("open-create-game-modal", handleOpenCreateModal);
    };
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.15),transparent_50%)] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.1),transparent_70%)] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none z-0" />

      <Header />

      {/* Main Content */}
      <main className="relative z-10">
        <Hero />

        <HowItWorks />

        <Features />

        {/* Featured Games */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm full">
                    <Gamepad2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Featured Games</h2>
                </div>
                <p className="text-gray-400 max-w-2xl">
                  Explore the most popular games created with VXLVerse's powerful game creation
                  platform
                </p>
              </div>

              <a
                href="/games"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 lg transition-all duration-300"
              >
                View All Games
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <a
                href="/games"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 lg transition-all duration-300"
              >
                View All Games
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <CreateGameModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          // Just close the modal, navigation will be handled in the modal itself
          setShowCreateModal(false);
        }}
      />
    </div>
  );
}
