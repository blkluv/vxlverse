import { useState } from "react";
import { pb } from "../../lib/pocketbase";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "../UI";

export function UsernamePasswordSignIn({
  onSuccess,
  className,
  isRegister = false,
}: {
  onSuccess?: () => void;
  className?: string;
  isRegister?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from state or default to home
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    setLoading(true);
    try {
      const authData = await pb.collection("users").authWithPassword(username, password);

      if (authData) {
        setUser(authData.record);
        // Redirect to the original page they were trying to access
        navigate(from, { replace: true });
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password || !email) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      // Create the user
      const data = {
        username,
        email,
        password,
        passwordConfirm: confirmPassword,
      };

      await pb.collection("users").create(data);

      // After registration, log them in
      const authData = await pb.collection("users").authWithPassword(username, password);

      if (authData) {
        setUser(authData.record);
        navigate(from, { replace: true });
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      if (err.data?.data) {
        // Format PocketBase validation errors
        const errors = Object.entries(err.data.data)
          .map(([field, messages]) => `${field}: ${messages}`)
          .join(", ");
        setError(errors);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={isRegister ? handleRegister : handleLogin}
      className={cn("space-y-4", className)}
    >
      {error && (
        <div className="text-red-400 text-sm bg-red-500/10 p-2 rounded border border-red-500/20">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter your username"
          disabled={loading}
        />
      </div>

      {isRegister && (
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter your email"
            disabled={loading}
          />
        </div>
      )}

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter your password"
          disabled={loading}
        />
      </div>

      {isRegister && (
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Confirm your password"
            disabled={loading}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
      >
        {loading ? "Processing..." : isRegister ? "Register" : "Sign In"}
      </button>
    </form>
  );
}
