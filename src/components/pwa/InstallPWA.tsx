import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function InstallPWA() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      // Store the event for later use
      setPromptInstall(e as BeforeInstallPromptEvent);
      setSupportsPWA(true);

      // Show the prompt after a short delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const onInstallClick = () => {
    if (!promptInstall) {
      return;
    }

    // Show the install prompt
    promptInstall.prompt();

    // Wait for the user to respond to the prompt
    promptInstall.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }

      // Reset the prompt variable, since it can't be used twice
      setPromptInstall(null);
      setShowPrompt(false);
    });
  };

  const onDismiss = () => {
    setShowPrompt(false);

    // Store in localStorage that user dismissed the prompt
    // so we don't show it again for a while
    localStorage.setItem("pwa-prompt-dismissed", Date.now().toString());
  };

  // Don't show anything if PWA is not supported or if the prompt is not showing
  if (!supportsPWA || !showPrompt) {
    return null;
  }

  // Check if user has recently dismissed the prompt
  const lastDismissed = localStorage.getItem("pwa-prompt-dismissed");
  if (lastDismissed) {
    const dismissedTime = parseInt(lastDismissed, 10);
    const oneDayInMs = 24 * 60 * 60 * 1000;

    // If dismissed less than a day ago, don't show again
    if (Date.now() - dismissedTime < oneDayInMs) {
      return null;
    }
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 flex flex-col md:max-w-md md:mx-auto">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <img
            src="/icons/ios/144.png"
            alt="VXLverse"
            className="w-12 h-12 mr-3"
          />
          <div>
            <h3 className="font-bold text-lg">Install VXLverse</h3>
            <p className="text-sm text-gray-300">
              Install our app for a better experience!
            </p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-white"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="mt-4 flex justify-end space-x-3">
        <button
          onClick={onDismiss}
          className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
        >
          Not now
        </button>
        <button
          onClick={onInstallClick}
          className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          Install
        </button>
      </div>
    </div>
  );
}
