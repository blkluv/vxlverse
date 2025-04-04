import { Gamepad2, Sparkles, Play, Plus } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useState } from "react";
import { LoginModal } from "../auth/LoginModal";

export function Hero() {
  const { isAuthenticated } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#1a365d,#0f172a)]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60" />

        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/30  blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/30  blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500  blur-xl opacity-50" />
                <Gamepad2 className="w-16 h-16 text-white relative" />
              </div>
              <div>
                <Sparkles className="w-10 h-10 text-yellow-400" />
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Create Incredible
              </span>
              <br />
              <span className="text-white">3D Games</span>
            </h1>

            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands of creators building amazing games with our powerful 3D engine. No
              coding required. Start your journey today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a
                href="/play/6b2v99o3632rad6"
                className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium 
                         hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/25"
              >
                <Play className="w-5 h-5" />
                Play Demo
              </a>

              <a
                href="/editor/demo"
                className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium 
                         hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/25"
              >
                <Play className="w-5 h-5" />
                Try Editor Demo
              </a>

              <button
                onClick={() => {
                  if (isAuthenticated) {
                    // If authenticated, show the create game modal
                    window.dispatchEvent(new CustomEvent("open-create-game-modal"));
                  } else {
                    // If not authenticated, show login modal
                    setShowLoginModal(true);
                  }
                }}
                className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium 
                         hover:from-purple-600 hover:to-pink-700 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/25"
              >
                <Plus className="w-5 h-5" />
                Create Game
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { label: "Active Users", value: "50K+" },
              { label: "Games Created", value: "10K+" },
              { label: "Countries", value: "150+" },
              { label: "Reviews", value: "4.9/5" },
            ].map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  {stat.value}
                </div>
                <div className="text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent" />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message="Sign in to create your own game"
      />
    </section>
  );
}
