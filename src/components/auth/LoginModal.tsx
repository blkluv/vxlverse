import { GoogleSignIn } from "./GoogleSignIn";
import { Modal } from "../UI/Modal";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  onSuccess?: () => void;
}

export function LoginModal({
  onSuccess,
  isOpen,
  onClose,
  message = "Sign in to continue",
}: LoginModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign In">
      <div className="p-4 space-y-6">
        <div className="text-center">
          <p className="text-gray-300 mb-6">{message}</p>

          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-full max-w-xs">
              <GoogleSignIn className="w-full" onSuccess={onClose} />
            </div>

            <div className="text-sm text-gray-500 mt-4">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
