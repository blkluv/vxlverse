import { useState } from "react";
import { X } from "lucide-react";
import { pb } from "../../lib/pocketbase";
import { Portal } from "../Portal";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      const authData = await pb.collection("users").authWithOAuth2({
        provider: "google",
      });

      if (authData) {
        onClose();
      }
    } catch (err: any) {
      console.error("Google auth error:", err);
      setError(err.message || "Failed to sign in with Google. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-900  w-full max-w-md p-6 relative border border-gray-800"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3 text-white">Welcome Back!</h2>
            <p className="text-gray-400">Sign in to continue your creative journey</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20  text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium py-3.5 px-4  transition-colors flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <img src="https://www.google.com/favicon.ico" className="w-6 h-6" alt="Google" />
            Continue with Google
          </button>
        </div>
      </div>
    </Portal>
  );
}
