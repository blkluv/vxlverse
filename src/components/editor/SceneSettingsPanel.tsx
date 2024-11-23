import { useState } from 'react';
import { Scene } from '../../types';
import { Sun, Music, Palette, Cloud, ChevronDown, ChevronRight } from 'lucide-react';
import { Environment } from '@react-three/drei';

const ENVIRONMENT_PRESETS = [
  'sunset',
  'dawn',
  'night',
  'warehouse',
  'forest',
  'apartment',
  'studio',
  'city',
  'park',
  'lobby',
] as const;

const BACKGROUND_OPTIONS = [
  { value: 'environment', label: 'Environment' },
  { value: 'sky', label: 'Sky' },
  { value: 'none', label: 'None' },
] as const;

interface SceneSettingsPanelProps {
  scene: Scene;
  onChange: (updates: Partial<Scene>) => void;
}

export function SceneSettingsPanel({ scene, onChange }: SceneSettingsPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['environment']));

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-800/50 pb-4">
        <div className="p-2 rounded-lg bg-purple-500/10">
          <Palette className="w-4 h-4 text-purple-400" />
        </div>
        <div>
          <h2 className="text-base font-medium text-slate-100">Scene Settings</h2>
          <div className="text-xs text-slate-400 mt-0.5">{scene.name}</div>
        </div>
      </div>

      {/* Environment Section */}
      <div className="space-y-4">
        <button
          onClick={() => toggleSection('environment')}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
            <Sun className="w-4 h-4 text-amber-400" />
            Environment & Lighting
          </div>
          {expandedSections.has('environment') ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {expandedSections.has('environment') && (
          <div className="space-y-4 pl-6">
            {/* Environment Preset */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400">Environment Preset</label>
              <div className="grid grid-cols-2 gap-2">
                {ENVIRONMENT_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => onChange({ environment: preset })}
                    className={`px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                      scene.environment === preset
                        ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                        : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-transparent'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Type */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400">Background</label>
              <div className="grid grid-cols-3 gap-2">
                {BACKGROUND_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onChange({ background: option.value })}
                    className={`px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                      scene.background === option.value
                        ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                        : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-transparent'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ambient Light */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400">Ambient Light</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={scene.ambientLight || 0.5}
                onChange={(e) => onChange({ ambientLight: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Fog Section */}
      <div className="space-y-4">
        <button
          onClick={() => toggleSection('fog')}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
            <Cloud className="w-4 h-4 text-blue-400" />
            Fog
          </div>
          {expandedSections.has('fog') ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {expandedSections.has('fog') && (
          <div className="space-y-4 pl-6">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-2">Color</label>
              <input
                type="color"
                value={scene.fog?.color || '#000000'}
                onChange={(e) =>
                  onChange({
                    fog: {
                      ...scene.fog,
                      color: e.target.value
                    }
                  })
                }
                className="w-full h-8 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-2">Near</label>
                <input
                  type="number"
                  value={scene.fog?.near || 1}
                  onChange={(e) =>
                    onChange({
                      fog: {
                        ...scene.fog,
                        near: parseFloat(e.target.value)
                      }
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-2">Far</label>
                <input
                  type="number"
                  value={scene.fog?.far || 100}
                  onChange={(e) =>
                    onChange({
                      fog: {
                        ...scene.fog,
                        far: parseFloat(e.target.value)
                      }
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Audio Section */}
      <div className="space-y-4">
        <button
          onClick={() => toggleSection('audio')}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
            <Music className="w-4 h-4 text-green-400" />
            Background Music
          </div>
          {expandedSections.has('audio') ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {expandedSections.has('audio') && (
          <div className="space-y-4 pl-6">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-2">Audio URL</label>
              <input
                type="text"
                placeholder="Music URL"
                value={scene.music?.url || ''}
                onChange={(e) => 
                  onChange({ 
                    music: { 
                      ...scene.music, 
                      url: e.target.value,
                      volume: scene.music?.volume || 0.5,
                      loop: scene.music?.loop ?? true
                    } 
                  })
                }
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-2">Volume</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={scene.music?.volume || 0.5}
                onChange={(e) => 
                  onChange({
                    music: {
                      ...scene.music,
                      volume: parseFloat(e.target.value)
                    }
                  })
                }
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-sm"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={scene.music?.loop ?? true}
                onChange={(e) =>
                  onChange({
                    music: {
                      ...scene.music,
                      loop: e.target.checked
                    }
                  })
                }
                className="rounded border-slate-700"
              />
              Loop Audio
            </label>
          </div>
        )}
      </div>
    </div>
  );
}