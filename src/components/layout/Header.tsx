import { LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { pb } from "../../lib/pocketbase";
import { useAuthStore } from "../../stores/authStore";
import { GoogleSignIn } from "../auth/GoogleSignIn";

export function Header() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const isAuthenticated = pb.authStore.isValid;

  const handleLogout = () => {
    pb.authStore.clear();
    logout();
  };

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
                  location.pathname === "/galleries"
                    ? "text-blue-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Galleries
              </Link>
            </nav>

            <div className="flex items-center">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white mr-2">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <GoogleSignIn />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
