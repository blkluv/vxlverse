import { GoogleSignIn } from "../components/auth/GoogleSignIn";
import { Gamepad2 } from "lucide-react";

export function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-500/10 p-4 full border border-blue-500/20 shadow-lg shadow-blue-500/5">
              <Gamepad2 className="w-12 h-12 text-blue-400" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
            VXLverse
          </h1>
          <h2 className="text-xl font-semibold text-white mb-2">Login Required</h2>
          <p className="text-gray-400">Please sign in to continue to the editor</p>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-sm xl shadow-2xl border border-gray-700/50 p-8 transform hover:scale-[1.01] transition-all duration-300">
          <div className="flex flex-col items-center">
            <p className="text-gray-300 mb-6 text-center">
              Unlock your creative potential with VXLverse
            </p>
            <GoogleSignIn />
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
}
