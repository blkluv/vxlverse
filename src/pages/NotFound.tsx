import { Link, useLocation } from "react-router-dom";
import { Header } from "../components/layout/Header";

export function NotFound() {
  const location = useLocation();

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 overflow-hidden">
        {/* Animated background elements */}

        {/* Content with fade-in animation */}
        <div className={`flex flex-col items-center z-10 transition-all duration-1000`}>
          <h1 className="text-8xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            404
          </h1>
          <h2 className="text-3xl font-semibold mb-8 text-gray-200">Page Not Found</h2>

          <div className="relative mb-10 p-6 bg-gray-800/50 backdrop-blur-sm  border border-gray-700 max-w-lg">
            <p className="text-gray-300 text-center mb-4">
              We couldn't find the page you're looking for.
            </p>
            <div className="p-3 bg-black/30  font-mono text-sm text-gray-400 overflow-x-auto w-full">
              <span className="text-blue-400">Error:</span> Path{" "}
              <span className="text-yellow-400">"{location.pathname}"</span> not found
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link
              to="/"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500  transition-all duration-200 text-center font-medium hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1"
            >
              Return Home
            </Link>
            <Link
              to="/games"
              className="px-8 py-3 bg-gray-700 hover:bg-gray-600  transition-all duration-200 text-center font-medium hover:shadow-lg hover:shadow-gray-500/20 hover:-translate-y-1"
            >
              Explore Games
            </Link>
          </div>

          <div className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} VXLverse - All rights reserved
          </div>
        </div>
      </div>
    </>
  );
}
