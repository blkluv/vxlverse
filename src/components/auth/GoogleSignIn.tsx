import { useState } from "react";
import { pb } from "../../lib/pocketbase";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "../UI";

export function GoogleSignIn({
  onSuccess,
  className,
}: {
  onSuccess?: () => void;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from state or default to home
  const from = location.state?.from?.pathname || "/";

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // List auth methods is not necessary but kept for reference
      pb.collection("users").listAuthMethods({
        provider: "google",
      });

      const authData = await pb
        .collection("users")
        .authWithOAuth2({
          provider: "google",
        })
        .finally(() => {
          setLoading(false);
        });

      if (authData) {
        setUser(authData.record);
        // Redirect to the original page they were trying to access
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      console.error("Google auth error:", err);
    } finally {
      if (onSuccess) {
        onSuccess();
      }
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={loading}
      className={cn(
        "flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 sm disabled:opacity-50 transition-colors",
        className
      )}
    >
      {loading ? (
        "Signing in..."
      ) : (
        <>
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-4 h-4"
          />
          Sign in
        </>
      )}
    </button>
  );
}
