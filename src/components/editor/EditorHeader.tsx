import React, { useState } from "react";
import { Play, Settings } from "lucide-react";
import { Tooltip } from "../UI/Tooltip";
import { Link, useParams } from "react-router-dom";
import { useEditorStore } from "../../stores/editorStore";
import { useGame } from "../../hooks/useGame";
import { ShortcutsInfo } from "./ShortcutsInfo";

type EditorHeaderProps = {
  setShowMetrics: (show: boolean) => void;
  showMetrics: boolean;
};
export const EditorHeader: React.FC<EditorHeaderProps> = ({ setShowMetrics, showMetrics }) => {
  const { id } = useParams<{ id: string }>();
  const [showSettings, setShowSettings] = useState(false);
  const { setGridSnap, gridSnap } = useEditorStore();
  const { game } = useGame(id!);
  // Toggle states
  const [isPublic, setIsPublic] = useState(false);
  return (
    <header className="bg-slate-900 border-b border-slate-800">
      <div className="flex items-center justify-between px-2 h-10">
        {/* Left side - Logo and title */}
        <div className="flex items-center">
          <Link to="/">
            <img
              src="/icons/large-logo.png"
              alt="VXLverse"
              className="w-8 mr-4 border-r border-slate-800 pr-2"
            />
          </Link>

          <span className="text-white text-sm font-medium">{game?.name}</span>
        </div>

        {/* Right side - Action buttons */}
        <div className="flex items-center space-x-3">
          {/* Play button */}
          <ShortcutsInfo />

          {/* Settings button */}
          <Tooltip content="Settings" position="bottom">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center justify-center p-1.5 sm transition-colors bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white"
            >
              <Settings className="h-4 w-4" />
            </button>
          </Tooltip>
          <Tooltip content={"Play Game"} position="bottom">
            <a
              target="_blank"
              href={`/play/${id}?debug=true`}
              className={`flex items-center justify-center p-1.5 sm transition-colors ${"bg-green-500/20 text-green-400 hover:bg-green-500/30"}`}
            >
              <Play className="h-4 w-4" />
            </a>
          </Tooltip>

          {/* Public toggle */}
        </div>
      </div>

      {/* Settings panel - shows when Settings is clicked */}
      {showSettings && (
        <div className="absolute right-0 top-10 w-64 bg-slate-800 border border-slate-700 shadow-lg z-50 bl-md">
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white text-sm font-medium">Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              <div className="border-t border-slate-700 my-2" />

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">Snap to Grid</span>
                <button
                  onClick={() => setGridSnap(!gridSnap)}
                  className={`w-8 h-4 ${
                    gridSnap ? "bg-blue-600" : "bg-slate-700"
                  } full relative cursor-pointer transition-colors`}
                >
                  <div
                    className={`absolute top-0.5 w-3 h-3 bg-white full transition-all duration-200 ${
                      gridSnap ? "left-4" : "left-0.5"
                    }`}
                  ></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">Show Performance</span>
                <button
                  onClick={() => setShowMetrics(!showMetrics)}
                  className={`w-8 h-4 ${
                    showMetrics ? "bg-blue-600" : "bg-slate-700"
                  } full relative cursor-pointer transition-colors`}
                >
                  <div
                    className={`absolute top-0.5 w-3 h-3 bg-white full transition-all duration-200 ${
                      showMetrics ? "left-4" : "left-0.5"
                    }`}
                  ></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">Public Game</span>
                <button
                  onClick={() => setIsPublic(!isPublic)}
                  className={`w-8 h-4 ${
                    isPublic ? "bg-blue-600" : "bg-slate-700"
                  } full relative cursor-pointer transition-colors`}
                >
                  <div
                    className={`absolute top-0.5 w-3 h-3 bg-white full transition-all duration-200 ${
                      isPublic ? "left-4" : "left-0.5"
                    }`}
                  ></div>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-700">
                <button className="w-full text-xs bg-blue-600 hover:bg-blue-700 text-white py-1.5  transition-colors">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
