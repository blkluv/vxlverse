import { useState } from "react";
import { GoogleSignIn } from "./GoogleSignIn";
import { UsernamePasswordSignIn } from "./UsernamePasswordSignIn";
import { Modal } from "../UI/Modal";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  onSuccess?: () => void;
}

export function LoginModal({ isOpen, onClose, message = "Sign in to continue" }: LoginModalProps) {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isRegister ? "Create Account" : "Sign In"}>
      <div className="p-4">
        {/* Simple Form */}
        <UsernamePasswordSignIn onSuccess={onClose} isRegister={isRegister} />

        {/* Simple Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="px-2 text-sm text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        {/* Google Sign In */}
        <GoogleSignIn onSuccess={onClose} />

        {/* Toggle Login/Register */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            {isRegister ? "Already have an account? Sign in" : "Need an account? Register"}
          </button>
        </div>

        {/* Terms */}
        <div className="text-xs text-gray-500 text-center mt-4">
          By continuing, you agree to our Terms and Privacy Policy
        </div>
      </div>
    </Modal>
  );
}
