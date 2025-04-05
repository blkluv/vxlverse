import { Box } from "lucide-react";

export function NoSelected() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="bg-slate-800/40 border border-slate-700/30  p-8 shadow-lg max-w-xs">
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-4  mb-4 mx-auto w-16 h-16 flex items-center justify-center border border-blue-500/20">
          <Box className="w-8 h-8 text-blue-400/80" />
        </div>
        <h3 className="text-blue-300 font-medium mb-2">No Object Selected</h3>
        <p className="text-slate-400 text-sm mb-4">
          Select an object in the scene to view and edit its properties.
        </p>
        <div className="text-xs text-slate-500 bg-slate-800/60 p-2  border border-slate-700/40">
          Tip: Use the toolbar to add new objects to your scene
        </div>
      </div>
    </div>
  );
}
