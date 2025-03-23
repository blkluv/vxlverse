import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-gray-800/50 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand and description */}
          <div className="md:col-span-2">
            <Link to="/" className="block mb-4">
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                VXLVerse
              </h3>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              A powerful 3D game creation platform that enables anyone to build, share, and play
              immersive experiences without coding knowledge.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm border border-gray-700/30 text-gray-400 hover:text-white transition-all duration-300"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm border border-gray-700/30 text-gray-400 hover:text-white transition-all duration-300"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm border border-gray-700/30 text-gray-400 hover:text-white transition-all duration-300"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@vxlverse.com"
                className="p-2 bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm border border-gray-700/30 text-gray-400 hover:text-white transition-all duration-300"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/games" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Games
                </Link>
              </li>
              <li>
                <Link to="/editor" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Editor
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Community Forum
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="pt-6 border-t border-gray-800/50 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} VXLVerse. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>

        {/* Made with love badge */}
        <div className="absolute bottom-4 right-4">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-red-400 fill-red-400" />
            <span>by VXLVerse Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
