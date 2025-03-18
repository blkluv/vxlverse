import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalPortalProps {
  children: React.ReactNode;
}

export function ModalPortal({ children }: ModalPortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Prevent scrolling on the body when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = "auto";
    };
  }, []);

  // Only render the portal after component has mounted on the client
  if (!mounted) return null;

  // Create portal to render modal at the root level
  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      {children}
    </div>,
    document.body
  );
}
