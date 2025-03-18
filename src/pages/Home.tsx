import { useState, useEffect } from "react";
import { CreateGameModal } from "../components/game/CreateGameModal";
import { useAuthStore } from "../stores/authStore";
import { Hero } from "../components/home/Hero";
import { Features } from "../components/home/Features";
import { HowItWorks } from "../components/home/HowItWorks";
import { Testimonials } from "../components/home/Testimonials";
import { CallToAction } from "../components/home/CallToAction";
import { PopularTags } from "../components/home/PopularTags";
import { Header } from "../components/layout/Header";
import { GameCard } from "../components/game/GameCard";

const FEATURED_GAMES = [
  {
    id: "1",
    title: "Dragon's Quest",
    description: "Embark on an epic journey through mystical lands",
    thumbnail: "https://images.unsplash.com/photo-1642479755125-d073df16ce7e",
    creator: "system",
    rating: 4.8,
    players: 12500,
    lastUpdated: "2 days ago",
  },
  {
    id: "2",
    title: "Space Odyssey",
    description: "Explore the vast universe in this sci-fi adventure",
    thumbnail: "https://images.unsplash.com/photo-1614728263952-84ea256f9679",
    creator: "system",
    rating: 4.6,
    players: 8300,
    lastUpdated: "5 days ago",
  },
  {
    id: "3",
    title: "Medieval Legends",
    description: "Build your kingdom and conquer new territories",
    thumbnail: "https://images.unsplash.com/photo-1615672968435-75de2c710c1b",
    creator: "system",
    rating: 4.9,
    players: 15200,
    lastUpdated: "1 day ago",
  },
];

export function Home() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { isAuthenticated } = useAuthStore();

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
    <div className="min-h-screen bg-gray-900">
      <Header />

      {/* Main Content */}
      <main>
        <Hero />

        <Features />

        <HowItWorks />

        {/* Featured Games */}
        <section className="py-16 bg-gradient-to-b from-gray-950 to-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-8">Featured Games</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURED_GAMES.map((game, index) => (
                <GameCard key={game.id} game={game} index={index} />
              ))}
            </div>
          </div>
        </section>

        <Testimonials />

        <PopularTags />

        <CallToAction />
      </main>

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
