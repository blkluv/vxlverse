import { useState, useRef, useEffect } from "react";
import { LogOut, User, Settings, HelpCircle, Heart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { pb } from "../../lib/pocketbase";
import { useAuthStore } from "../../stores/authStore";
import { LoginModal } from "../auth/LoginModal";

export function Header() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const isAuthenticated = pb.authStore.isValid;
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    pb.authStore.clear();
    logout();
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
      <div className=" mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <img src="/icons/large-logo.png" alt="VXLverse" className="w-10" />
            <span className="text-xl md:block hidden font-bold text-white">VXLverse</span>
          </Link>

          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-4">
              <Link
                to="/"
                className={`text-sm ${
                  location.pathname === "/" ? "text-blue-400" : "text-gray-400 hover:text-white"
                }`}
              >
                Home
              </Link>
              <Link
                to="/games"
                className={`text-sm ${
                  location.pathname === "/games"
                    ? "text-blue-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Games
              </Link>
              <Link
                to="/gallery"
                className={`text-sm ${
                  location.pathname === "/gallery"
                    ? "text-blue-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Galleries
              </Link>
              <Link
                to="/pricing"
                className={`text-sm ${
                  location.pathname === "/pricing"
                    ? "text-blue-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Pricing
              </Link>
              <Link
                to="/how-it-works"
                className={`text-sm ${
                  location.pathname === "/how-it-works"
                    ? "text-blue-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                How It Works
              </Link>
            </nav>

            <div className="flex items-center">
              {isAuthenticated && user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-800 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white font-medium text-sm overflow-hidden">
                      {user.avatar ? (
                        <img
                          src={`${pb.baseUrl}/api/files/${user.collectionId}/${user.id}/${user.avatar}`}
                          alt={user.name || user.email}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{(user.name || user.email || "U").charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute z-50 right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-md shadow-lg py-1">
                      <div className="px-4 py-2 border-b border-gray-800">
                        <p className="text-sm font-medium text-white truncate">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white w-full text-left"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>

                      <Link
                        to="/favorites"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white w-full text-left"
                      >
                        <Heart className="w-4 h-4" />
                        Favorites
                      </Link>

                      <Link
                        to="/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white w-full text-left"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>

                      <Link
                        to="/help"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white w-full text-left"
                      >
                        <HelpCircle className="w-4 h-4" />
                        Help
                      </Link>

                      <div className="border-t border-gray-800 mt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-800 hover:text-red-300 w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-full shadow-md hover:shadow-purple-500/20 transition-all"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </button>
              )}
            </div>

            {/* Login Modal */}
            <LoginModal
              isOpen={isLoginModalOpen}
              onClose={() => setIsLoginModalOpen(false)}
              message="Sign in to access your account"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
