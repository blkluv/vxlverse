import { motion } from "framer-motion";
import { ArrowRight, Gamepad2 } from "lucide-react";

export function CallToAction() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10" />
        <div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_70%)]"
        />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-8"
          >
            <Gamepad2 className="w-16 h-16 text-blue-500 mx-auto" />
          </div>

          <h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Ready to Create Your First Game?
            </span>
          </h2>

          <p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
          >
            Join thousands of creators who are building amazing games with our
            powerful 3D engine. No coding required. Start your journey today!
          </p>

          <div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <a
              href="/editor"
              className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium 
                       hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/25"
            >
              Get Started
              <div>
                <ArrowRight className="w-5 h-5" />
              </div>
            </a>

            <a
              href="/games"
              className="px-8 py-4 bg-gray-800/50 hover:bg-gray-700/50 text-white font-medium 
                       border border-gray-700/50 hover:border-blue-500/30 transition-all"
            >
              Explore Games
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
