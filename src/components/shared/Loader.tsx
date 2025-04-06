export interface LoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

export function Loader({ message, size = "md", fullScreen = true }: LoaderProps) {
  // Size classes for the spinner
  const sizeClasses = {
    sm: "w-8 h-8 border-2",
    md: "w-12 h-12 border-3",
    lg: "w-16 h-16 border-4",
  };

  // If fullScreen, show the loader with a backdrop
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
        <div
          className={`${sizeClasses[size]} border-purple-200 border-t-purple-500 -full animate-spin mb-4`}
        ></div>
        {message && <p className="text-white text-lg font-medium">{message}</p>}
      </div>
    );
  }

  // Otherwise, just show the spinner
  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${sizeClasses[size]} border-blue-200 border-t-blue-500 -full animate-spin mb-2`}
      ></div>
      {message && <p className="text-slate-300 text-sm">{message}</p>}
    </div>
  );
}
