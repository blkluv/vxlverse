import { Link } from 'react-router-dom';
import { Gamepad2, Edit3 } from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-white">3D Game Engine</h1>
        <div className="flex gap-4">
          <Link
            to="/play"
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Gamepad2 className="w-5 h-5" />
            Play Game
          </Link>
          <Link
            to="/editor"
            className="flex items-center gap-2 px-6 py-3 bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
          >
            <Edit3 className="w-5 h-5" />
            Open Editor
          </Link>
        </div>
      </div>
    </div>
  );
}