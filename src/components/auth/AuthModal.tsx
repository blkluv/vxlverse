import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogIn, UserPlus, Github } from "lucide-react";
import { pb } from "../../lib/pocketbase";
import { Portal } from "../Portal";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "signin" | "register";
}

export function AuthModal({
  isOpen,
  onClose,
  mode: initialMode = "signin",
}: AuthModalProps) {
  const [mode, setMode] = useState(initialMode);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      const authData = await pb
        .collection("users")
        .authWithOAuth2({ provider: "google" });
      console.log("Google auth success:", authData);
      onClose();
    } catch (err) {
      setError("Failed to sign in with Google");
      console.error("Google auth error:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-900 rounded-xl w-full max-w-md p-6 relative border border-gray-800"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">
              {mode === "signin" ? "Welcome Back!" : "Create Account"}
            </h2>
            <p className="text-gray-400">
              {mode === "signin"
                ? "Sign in to access your games and creations"
                : "Join our community of game creators"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <img
                src="https://www.google.com/favicon.ico"
                className="w-5 h-5"
                alt="Google"
              />
              Continue with Google
            </button>
            <button className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
              <Github className="w-5 h-5" />
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">or</span>
            </div>
          </div>

          {/* Switch Mode */}
          <div className="text-center text-sm">
            <span className="text-gray-400">
              {mode === "signin"
                ? "Don't have an account? "
                : "Already have an account? "}
            </span>
            <button
              onClick={() => setMode(mode === "signin" ? "register" : "signin")}
              className="text-blue-400 hover:text-blue-300"
            >
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </Portal>
  );
}
