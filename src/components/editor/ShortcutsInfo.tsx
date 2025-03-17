import { useEffect, useState } from "react";
import { X, Keyboard, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useKeyboardControls } from "@react-three/drei";

interface ShortcutGroup {
  title: string;
  shortcuts: { key: string; description: string }[];
}

export function ShortcutsInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [subscribeKeys] = useKeyboardControls();

  useEffect(() => {
    const unsubscribeEsc = subscribeKeys(
      (state) => state.escape,
      (pressed) => {
        if (pressed) {
          setIsOpen(false);
        }
      }
    );
    const unsubscribeShortcutInfo = subscribeKeys(
      (state) => state.shortcutInfo,
      (pressed) => {
        if (pressed) {
          setIsOpen((s) => !s);
        }
      }
    );
    return () => {
      unsubscribeShortcutInfo();
      unsubscribeEsc();
    };
  }, [subscribeKeys]);

  const shortcutGroups: ShortcutGroup[] = [
    {
      title: "History",
      shortcuts: [
        { key: "Z", description: "Undo" },
        { key: "Y", description: "Redo" },
      ],
    },
    {
      title: "Transform Tools",
      shortcuts: [
        { key: "W", description: "Translate tool" },
        { key: "E", description: "Rotate tool" },
        { key: "R", description: "Scale tool" },
      ],
    },
    {
      title: "Editor Controls",
      shortcuts: [
        { key: "G", description: "Toggle grid" },
        { key: "S", description: "Toggle snap" },
        { key: "F", description: "Focus on selected object" },
        { key: "⌘+F", description: "Toggle fullscreen" },
        { key: "M", description: "Toggle metrics" },
        { key: "Esc", description: "Cancel current operation" },
      ],
    },
    {
      title: "Object Management",
      shortcuts: [
        { key: "D", description: "Duplicate object" },
        { key: "M", description: "Add new object" },
        { key: "Backspace", description: "Delete selected object" },
        { key: "K", description: "Select next object" },
        { key: "J", description: "Select previous object" },
      ],
    },
    {
      title: "Panels & Navigation",
      shortcuts: [
        { key: "1", description: "Scene panel" },
        { key: "2", description: "Properties panel" },
        { key: "3", description: "Quest panel" },
      ],
    },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-slate-800/80 p-1.5  hover:bg-slate-700 transition-colors border border-slate-700/50 shadow-lg"
        title="Keyboard Shortcuts"
      >
        <Keyboard className="w-4 h-4 text-blue-300" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gradient-to-b from-slate-900 to-slate-800 border border-slate-700/80 lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-500/20 p-1.5 md">
                    <Keyboard className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-100">
                    Keyboard Shortcuts
                  </h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 md hover:bg-slate-800/70 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {shortcutGroups.map((group) => (
                  <div key={group.title}>
                    <h3 className="text-sm font-medium text-blue-400 mb-3 border-b border-slate-700/50 pb-2 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 opacity-70" />
                      {group.title}
                    </h3>
                    <div className="space-y-2">
                      {group.shortcuts.map((shortcut) => (
                        <div
                          key={shortcut.key}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm text-slate-300">
                            {shortcut.description}
                          </span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-blue-100 bg-slate-800/70  border border-blue-500/30 min-w-[32px] text-center shadow-inner">
                            {shortcut.key}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-4 border-t border-slate-700/30 text-xs text-slate-400 text-center">
                <div className="bg-blue-900/10 py-2 px-4 md inline-flex items-center gap-2 border border-blue-500/20">
                  <span>Press</span>
                  <kbd className="px-1.5 py-0.5 bg-slate-700/70  border border-blue-500/30 shadow-inner text-blue-300 font-medium">
                    ?
                  </kbd>
                  <span>anytime to toggle this panel</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
