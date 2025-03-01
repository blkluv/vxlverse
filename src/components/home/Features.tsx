import { motion } from "framer-motion";
import {
  Layers,
  Wand2,
  Share2,
  Zap,
  Box,
  Gamepad2,
  Globe,
  Users,
} from "lucide-react";

const FEATURES = [
  {
    icon: Box,
    title: "Voxel-Based Editor",
    description:
      "Create stunning 3D worlds using our intuitive voxel-based editor with precise grid and snapping controls.",
    color: "blue",
  },
  {
    icon: Wand2,
    title: "No-Code Required",
    description:
      "Design complex game mechanics and interactions without writing a single line of code.",
    color: "purple",
  },
  {
    icon: Gamepad2,
    title: "Instant Play",
    description:
      "Test your creations instantly in the browser. No downloads or installations needed.",
    color: "pink",
  },
  {
    icon: Layers,
    title: "Advanced Physics",
    description:
      "Realistic physics simulation brings your game worlds to life with authentic movement and interactions.",
    color: "indigo",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description:
      "Share your games with a simple link. Anyone can play your creations directly in their browser.",
    color: "green",
  },
  {
    icon: Zap,
    title: "Real-time Collaboration",
    description:
      "Work together with friends in real-time to build amazing game experiences.",
    color: "yellow",
  },
  {
    icon: Globe,
    title: "Cross-Platform",
    description:
      "Your games work seamlessly across desktop, tablet, and mobile devices.",
    color: "orange",
  },
  {
    icon: Users,
    title: "Growing Community",
    description:
      "Join a thriving community of creators sharing assets, tips, and inspiration.",
    color: "red",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-950 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-64 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(30,64,175,0.05),transparent_50%)]" />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <div className="inline-block p-2 bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm mb-4">
            <Layers className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Powerful Features
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to create amazing 3D games without writing code
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/30 backdrop-blur-sm group hover:border-blue-500/30 transition-all duration-300"
            >
              <div
                className={`p-3 mb-4 inline-block bg-${feature.color}-500/10 border border-${feature.color}-500/20 group-hover:bg-${feature.color}-500/20 transition-all duration-300`}
              >
                <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
