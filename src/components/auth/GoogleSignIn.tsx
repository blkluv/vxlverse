import { useState } from "react";
import { pb } from "../../lib/pocketbase";
import { useAuthStore } from "../../stores/authStore";

export function GoogleSignIn() {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const providers = await pb.collection("users").listAuthMethods({
        provider: "google",
      });
      console.log("Providers:", providers);
      const authData = await pb.collection("users").authWithOAuth2({
        provider: "google",
      });

      if (authData) {
        console.log("Successfully authenticated with Google", authData);
        setUser(authData.record);
      }
    } catch (err: any) {
      console.error("Google auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={loading}
      className="flex items-center justify-center gap-2 w-60 ml-auto px-4 py-2 text-white bg-grandient-to-r from-blue-500 to-indigo-500 rounded  disabled:opacity-50"
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
          Sign in with Google
        </>
      )}
    </button>
  );
}
