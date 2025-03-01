import {
  Gamepad2,
  LogOut,
  User,
  Settings,
  Heart,
  Plus,
  ChevronDown,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { pb } from "../../lib/pocketbase";
import { useAuthStore } from "../../stores/authStore";
import { GoogleSignIn } from "../auth/GoogleSignIn";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function Header() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const isAuthenticated = pb.authStore.isValid;
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    pb.authStore.clear();
    logout();
    setShowDropdown(false);
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/games", label: "Games" },
  ];

  const dropdownItems = [
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Heart, label: "Favorites", path: "/favorites" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/50 backdrop-blur-xl bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo with animation */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Gamepad2 className="w-8 h-8 text-blue-500" />
            </motion.div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              VXLverse
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2  transition-all duration-300 ${
                  location.pathname === item.path
                    ? "bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/20"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <motion.button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`flex items-center gap-3 px-4 py-2  transition-all duration-300 ${
                    showDropdown
                      ? "bg-blue-500/20 shadow-lg shadow-blue-500/20"
                      : "bg-gray-800/50 hover:bg-gray-800"
                  }`}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8  border-2 border-blue-500/20"
                    />
                  ) : (
                    <div className="w-8 h-8  bg-blue-500/20 text-blue-500 flex items-center justify-center text-sm font-medium border-2 border-blue-500/20">
                      {user.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <div className="text-left">
                    <div className="text-sm font-medium text-white">
                      {user.name || "User"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {user.email || "No email"}
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                  />
                </motion.button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 p-2  bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 shadow-xl"
                  >
                    <div className="space-y-1">
                      {dropdownItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50  transition-colors duration-200"
                        >
                          <item.icon className="w-4 h-4" />
                          <span className="text-sm">{item.label}</span>
                        </Link>
                      ))}
                      <hr className="border-gray-700/50 my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10  transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <GoogleSignIn />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
