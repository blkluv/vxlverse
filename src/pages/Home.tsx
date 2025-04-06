import { useState, useEffect } from "react";
import { CreateGameModal } from "../components/game/CreateGameModal";
import { useAuthStore } from "../stores/authStore";
import { Hero } from "../components/home/Hero";
import { Features } from "../components/home/Features";
import { HowItWorks } from "../components/home/HowItWorks";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Gamepad2, ArrowRight, Image, Paintbrush } from "lucide-react";
import "../styles/animations.css";
import { Link } from "react-router-dom";
import { useGames } from "../hooks/useGames";
import { GameCard } from "../components/game/GameCard";
import { useGalleries } from "../hooks/useGalleries";
import { SEO } from "../components/shared/SEO";

export function Home() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { games } = useGames();
  const { galleries } = useGalleries();
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
      <SEO
        title="VXLVerse - Create 3D Games & Art Galleries"
        description="Build incredible 3D games and stunning virtual art galleries with VXLVerse. No coding required, multiple pricing options available. Start your creative journey today."
        keywords="3D games, art gallery, virtual gallery, game creation, 3D modeling, no-code, game engine, virtual exhibition, online gallery, 3D art"
        ogImage="/vxlverse-social-preview.jpg"
      />
      {/* Background effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.15),transparent_50%)] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.1),transparent_70%)] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none z-0" />

      <Header />

      {/* Under Construction Badge */}
      <div className="fixed top-20 right-4 z-30 bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg transform rotate-3 border-2 border-yellow-400 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-bold">Under Development</span>
      </div>

      {/* Main Content */}
      <main className="relative z-10">
        <Hero />

        {/* Create Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Create Your Vision</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                VXLVerse gives you the power to build incredible interactive experiences without
                coding. Choose your creative path and start building today.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* 3D Games Card */}
              <Link to="/editor/demo">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-blue-500/20 rounded-xl overflow-hidden group hover:border-blue-500/40 transition-all shadow-lg hover:shadow-blue-500/10">
                  <div className="h-48 bg-gradient-to-br from-blue-900/30 to-blue-700/20 flex items-center justify-center">
                    <Gamepad2 className="w-24 h-24 text-blue-400 opacity-75 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-4">3D Game Creation</h3>
                    <p className="text-gray-300 mb-6">
                      Design immersive 3D games with intuitive tools. Place objects, create
                      interactions, and share your game with the world.
                    </p>
                    <div className="flex flex-wrap gap-3 mb-6">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full">
                        Interactive Objects
                      </span>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full">
                        Physics
                      </span>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full">
                        Multiplayer
                      </span>
                    </div>
                    <a
                      href="/editor/demo"
                      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium group-hover:translate-x-1 transition-transform"
                    >
                      Try Game Editor <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </Link>

              {/* Art Gallery Card */}
              <Link to="/gallery/demo">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl overflow-hidden group hover:border-purple-500/40 transition-all shadow-lg hover:shadow-purple-500/10">
                  <div className="h-48 bg-gradient-to-br from-purple-900/30 to-purple-700/20 flex items-center justify-center">
                    <Paintbrush className="w-24 h-24 text-purple-400 opacity-75 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-4">3D Art Gallery</h3>
                    <p className="text-gray-300 mb-6">
                      Create stunning virtual art galleries to showcase your artwork in an immersive
                      3D environment that visitors can explore.
                    </p>
                    <div className="flex flex-wrap gap-3 mb-6">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full">
                        Custom Layouts
                      </span>
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full">
                        Image Upload
                      </span>
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full">
                        Virtual Tours
                      </span>
                    </div>
                    <a
                      href="/gallery/demo"
                      className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium group-hover:translate-x-1 transition-transform"
                    >
                      Try Gallery Editor <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Gallery Pricing Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 mb-4">
                <Paintbrush className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300 font-medium">Gallery Pricing</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Choose Your Gallery Plan
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Select the perfect plan for your virtual art gallery needs. From hobbyists to
                professional artists, we have options for everyone.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Reusable SVG Check Icon Component */}
              {(() => {
                const CheckIcon = () => (
                  <svg
                    className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                );

                // Feature Item Component
                const FeatureItem = ({ text }: { text: string }) => (
                  <li className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="text-gray-300">{text}</span>
                  </li>
                );

                return (
                  <>
                    {/* Free Tier */}
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden group hover:border-purple-500/40 transition-all shadow-lg hover:shadow-purple-500/10 flex flex-col">
                      <div className="p-8 border-b border-gray-700">
                        <h3 className="text-2xl font-bold text-white mb-2">Free Access</h3>
                        <div className="flex items-end gap-1 mb-4">
                          <span className="text-4xl font-bold text-white">€0</span>
                          <span className="text-gray-400 mb-1">Freemium</span>
                        </div>
                        <p className="text-gray-300">Perfect for beginner artists</p>
                      </div>
                      <div className="p-8 flex-grow flex flex-col justify-between">
                        <ul className="space-y-4">
                          <FeatureItem text="3 free artworks" />
                          <FeatureItem text="Basic gallery without custom domain" />
                          <FeatureItem text="Low resolution images only" />
                          <FeatureItem text="Community support" />
                          <div className="h-12"></div> {/* Spacer for alignment */}
                        </ul>
                        <div className="mt-8">
                          <a
                            href="/gallery/demo"
                            className="block w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium text-center rounded-lg transition-colors"
                          >
                            Start Free
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Pay Per Image Tier */}
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-purple-500/50 rounded-xl overflow-hidden group hover:border-purple-500/80 transition-all shadow-lg hover:shadow-purple-500/20 relative z-10 flex flex-col">
                      <div className="absolute top-0 left-0 right-0 bg-purple-500 text-white text-center py-1 text-sm font-medium">
                        Most Popular
                      </div>
                      <div className="p-8 border-b border-gray-700 mt-6">
                        <h3 className="text-2xl font-bold text-white mb-2">Pay Per Image</h3>
                        <div className="flex items-end gap-1 mb-4">
                          <span className="text-4xl font-bold text-white">€5-15</span>
                          <span className="text-gray-400 mb-1">one-time</span>
                        </div>
                        <p className="text-gray-300">For independent artists</p>
                      </div>
                      <div className="p-8 flex-grow flex flex-col justify-between">
                        <ul className="space-y-4">
                          <FeatureItem text="+5 artworks → €5 one-time" />
                          <FeatureItem text="+20 artworks → €15 one-time" />
                          <FeatureItem text="Pay only for what you need" />
                          <FeatureItem text="No monthly subscription" />
                          <FeatureItem text="Perfect for small collections" />
                        </ul>
                        <div className="mt-8">
                          <a
                            href="/pricing/pay-per-image"
                            className="block w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium text-center rounded-lg transition-colors"
                          >
                            Choose Package
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Subscription Tier */}
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden group hover:border-purple-500/40 transition-all shadow-lg hover:shadow-purple-500/10 flex flex-col">
                      <div className="p-8 border-b border-gray-700">
                        <h3 className="text-2xl font-bold text-white mb-2">Subscription</h3>
                        <div className="flex items-end gap-1 mb-4">
                          <span className="text-4xl font-bold text-white">€9-19</span>
                          <span className="text-gray-400 mb-1">/month</span>
                        </div>
                        <p className="text-gray-300">For professional artists</p>
                      </div>
                      <div className="p-8 flex-grow flex flex-col justify-between">
                        <ul className="space-y-4">
                          <FeatureItem text="PRO Plan - €9/month" />
                          <FeatureItem text="Unlimited uploads" />
                          <FeatureItem text="BUSINESS Plan - €19/month" />
                          <FeatureItem text="Online shop integration" />
                          <FeatureItem text="Custom 3D Galleries - €99 setup" />
                        </ul>
                        <div className="mt-8">
                          <a
                            href="/pricing/subscription"
                            className="block w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium text-center rounded-lg transition-colors"
                          >
                            View Plans
                          </a>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-400 mb-4">
                All plans include content moderation and secure image storage
              </p>
              <a
                href="/pricing"
                className="text-purple-400 hover:text-purple-300 font-medium inline-flex items-center gap-2"
              >
                View full pricing details
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

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

        {/* Art Galleries */}
        <section className="py-20 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm full">
                    <Paintbrush className="w-5 h-5 text-purple-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Art Galleries</h2>
                </div>
                <p className="text-gray-400 max-w-2xl">
                  Explore stunning 3D art galleries created by our community. View, create, and
                  share your own virtual exhibitions.
                </p>
              </div>

              <a
                href="/gallery"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 lg transition-all duration-300"
              >
                View All Galleries
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {galleries && galleries.length > 0 ? (
                galleries.slice(0, 3).map((gallery) => (
                  <div
                    key={gallery.id}
                    className="group relative overflow-hidden rounded-lg border border-gray-800 bg-gray-900 shadow-md transition-all hover:shadow-lg hover:shadow-purple-500/10"
                  >
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={gallery.thumbnailUrl || "/placeholder-gallery.jpg"}
                        alt={gallery.title || "Gallery"}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {gallery.title || "Art Gallery"}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {gallery.description || "A beautiful virtual art gallery"}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Image className="w-4 h-4 text-purple-400" />
                          <span className="text-sm text-gray-400">
                            {gallery.paintingCount || 0} paintings
                          </span>
                        </div>
                        <a
                          href={`/gallery/${gallery.id}`}
                          className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          Visit Gallery
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 p-8 text-center border border-dashed border-gray-700 rounded-lg">
                  <Paintbrush className="w-10 h-10 text-purple-400 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-medium text-white mb-2">No Galleries Yet</h3>
                  <p className="text-gray-400 mb-4">
                    Be the first to create a stunning 3D art gallery!
                  </p>
                  <a
                    href="/editor/demo"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-md transition-colors"
                  >
                    Try Gallery Editor
                  </a>
                </div>
              )}
            </div>

            <div className="mt-8 text-center md:hidden">
              <a
                href="/gallery"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 lg transition-all duration-300"
              >
                View All Galleries
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
