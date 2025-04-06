import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface GalleryHeaderProps {
  showMetrics: boolean;
  setShowMetrics: (show: boolean) => void;
  setShowUploader: (show: boolean) => void;
}

export function GalleryHeader({
  showMetrics,
  setShowMetrics,
  setShowUploader,
}: GalleryHeaderProps) {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between p-2 bg-slate-800 text-white">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/icons/logo.png" alt="VXLverse" className="w-8 h-8" />
          <span className="text-xl font-bold">VXLverse Gallery</span>
        </Link>

        <div className="hidden md:flex gap-4 ml-8">
          <Link to="/" className="hover:text-blue-400">
            Home
          </Link>
          <Link to="/games" className="hover:text-blue-400">
            Games
          </Link>
          <Link to="/gallery" className="text-blue-400 font-semibold">
            Art Gallery
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setShowUploader(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2  flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Upload Artwork
        </button>

        <button
          onClick={() => setShowMetrics(!showMetrics)}
          className={`px-3 py-1  ${
            showMetrics ? "bg-blue-500 text-white" : "bg-slate-700 text-gray-300"
          }`}
        >
          Metrics
        </button>

        {user ? (
          <Link to="/profile" className="flex items-center gap-2">
            <div className="w-8 h-8 -full bg-blue-500 flex items-center justify-center text-white">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span className="hidden md:inline">{user.username}</span>
          </Link>
        ) : (
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
