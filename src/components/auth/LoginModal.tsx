import { useState } from "react";
import { GoogleSignIn } from "./GoogleSignIn";
import { UsernamePasswordSignIn } from "./UsernamePasswordSignIn";
import { Modal } from "../UI/Modal";
import { cn } from "../UI";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  onSuccess?: () => void;
}

type AuthTab = "login" | "register";

export function LoginModal({
  onSuccess,
  isOpen,
  onClose,
  message = "Sign in to continue",
}: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<AuthTab>("login");

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={activeTab === "login" ? "Sign In" : "Register"}>
      <div className="p-6">
        <p className="text-gray-300 mb-4 text-center">{message}</p>

        {/* Simple Tab Navigation */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab("login")}
            className={cn(
              "flex-1 py-2 text-sm font-medium",
              activeTab === "login"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            )}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={cn(
              "flex-1 py-2 text-sm font-medium",
              activeTab === "register"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            )}
          >
            Register
          </button>
        </div>

        {/* Username/Password Authentication */}
        <div className="mb-6">
          <UsernamePasswordSignIn
            className="w-full"
            onSuccess={onClose}
            isRegister={activeTab === "register"}
          />
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">or</span>
          </div>
        </div>

        {/* Google Sign In */}
        <div>
          <GoogleSignIn className="w-full" onSuccess={onClose} />
        </div>

        <div className="text-xs text-gray-500 text-center mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </Modal>
  );
}
