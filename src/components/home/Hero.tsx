import { Gamepad2, Sparkles, Paintbrush, Palette } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useState } from "react";
import { LoginModal } from "../auth/LoginModal";

export function Hero() {
  // We'll use isAuthenticated to conditionally show login modal when needed
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
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-xl opacity-50" />
                <Gamepad2 className="w-16 h-16 text-white relative" />
              </div>
              <div>
                <Sparkles className="w-10 h-10 text-yellow-400" />
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-xl opacity-50" />
                <Paintbrush className="w-16 h-16 text-white relative" />
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Create Incredible
              </span>
              <br />
              <span className="text-white">3D Experiences</span>
            </h1>

            <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
              Join thousands of creators building amazing 3D games and stunning virtual art
              galleries with our powerful platform. No coding required. Start your creative journey
              today.
            </p>

            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30">
                <Gamepad2 className="w-5 h-5 text-blue-400" />
                <span className="text-blue-300">3D Game Creation</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30">
                <Paintbrush className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300">Virtual Art Galleries</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-pink-500/20 rounded-full border border-pink-500/30">
                <Palette className="w-5 h-5 text-pink-400" />
                <span className="text-pink-300">No Coding Required</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { label: "Active Users", value: "50K+" },
              { label: "Games Created", value: "10K+" },
              { label: "Countries", value: "150+" },
              { label: "Reviews", value: "4.9/5" },
            ].map((stat) => (
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
