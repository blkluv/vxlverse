import { useCallback, useEffect, useRef } from "react";
import { Howl } from "howler";

// Sound configuration
const SOUNDS = {
  background: {
    src: "/mp3/bg.m4a",
    loop: true,
    volume: 0.3,
  },
  hit: {
    src: "/mp3/hit-sound-effect-240898.mp3",
    volume: 0.2,
  },
  select: {
    src: "/mp3/beepd-86247.mp3",
    volume: 0.5,
  },
  collect: {
    src: "/mp3/collect-5930.mp3",
    volume: 0.5,
  },
  teleport: {
    src: "/mp3/teleport-90137.mp3",
    volume: 0.5,
  },
  attack: {
    src: "/mp3/fireball.mp3",
    volume: 0.5,
  },
  npcGreeting: {
    src: "/mp3/what-can-i-do-for-you-npc-british-male-99751.mp3",
    volume: 0.5,
  },
  questAccept: {
    src: "/mp3/level-passed-142971.mp3",
    volume: 0.5,
  },
  loot: {
    src: "/mp3/loot.mp3",
    volume: 0.6,
  },
  questComplete: {
    src: "/mp3/game-level-complete-143022.mp3",
    volume: 0.6,
  },
  enemyDeath: {
    src: "/mp3/male-death-sound-128357.mp3",
    volume: 0.5,
  },
  cash: {
    src: "/mp3/cash.mp3",
    volume: 0.5,
  },
  typing: {
    src: "/mp3/typing.mp3",
    volume: 0.5,
  },
  levelUp: {
    src: "/mp3/levelup.mp3",
    volume: 0.6,
  },
  notAllowed: {
    src: "/mp3/wrong-47985.mp3",
    volume: 0.6,
  },
  hurt: {
    src: "/mp3/hurt.mp3",
    volume: 0.6,
  },
  dialogueStart: {
    src: "/mp3/typing.mp3",
    volume: 0.4,
  },
  dialogueChoice: {
    src: "/mp3/beepd-86247.mp3",
    volume: 0.4,
  },
  dialogueEnd: {
    src: "/mp3/select.mp3",
    volume: 0.5,
  },
  error: {
    src: "/mp3/wrong-47985.mp3",
    volume: 0.5,
  },
  itemGet: {
    src: "/mp3/collect-5930.mp3",
    volume: 0.6,
  },
};

type SoundType = keyof typeof SOUNDS;

// Create a singleton for sound management to prevent multiple initializations
const soundManager = (() => {
  // Store loaded sounds
  const loadedSounds: Record<SoundType, Howl> = {} as Record<SoundType, Howl>;
  // Store custom URL sounds
  const customSounds: Record<string, Howl> = {};
  // Track if initialization has occurred
  let initialized = false;

  // Queue for sounds requested before initialization
  const pendingPlayQueue: Array<SoundType | string> = [];

  // Initialize all predefined sounds
  const initialize = () => {
    if (initialized) return;

    // Only load frequently used sounds immediately
    // Others will be loaded on demand
    const prioritySounds: SoundType[] = ["select", "collect", "hit"];

    prioritySounds.forEach((key) => {
      const config = SOUNDS[key];
      loadedSounds[key] = new Howl({
        src: [config.src],
        loop: config.loop || false,
        volume: config.volume || 1,
        preload: true,
      });
    });

    initialized = true;

    // Play any sounds that were requested before initialization
    while (pendingPlayQueue.length > 0) {
      const sound = pendingPlayQueue.shift();
      if (sound) play(sound);
    }
  };

  // Get or create a Howl instance for a predefined sound
  const getSound = (type: SoundType): Howl => {
    if (!loadedSounds[type]) {
      const config = SOUNDS[type];
      loadedSounds[type] = new Howl({
        src: [config.src],
        loop: config.loop || false,
        volume: config.volume || 1,
      });
    }
    return loadedSounds[type];
  };

  // Play a sound (predefined or custom URL)
  const play = (soundInput: SoundType | string): void => {
    if (!initialized) {
      pendingPlayQueue.push(soundInput);
      return;
    }

    // Handle predefined sounds
    if (typeof soundInput === "string" && soundInput in SOUNDS) {
      const sound = getSound(soundInput as SoundType);
      if (sound && sound.state() === "loaded") {
        sound.play();
      } else if (sound) {
        // If sound is still loading, play when loaded
        sound.once("load", () => {
          sound.play();
        });
      }
    }
    // Handle custom sound URL
    else if (typeof soundInput === "string" && soundInput.startsWith("http")) {
      if (customSounds[soundInput]) {
        customSounds[soundInput].play();
      } else {
        try {
          const newSound = new Howl({
            src: [soundInput],
            volume: 0.5,
            html5: true,
          });

          customSounds[soundInput] = newSound;

          // Play when loaded
          newSound.once("load", () => {
            newSound.play();
          });
        } catch (error) {
          console.error("Error playing custom sound:", error);
        }
      }
    }
  };

  // Stop a sound
  const stop = (soundInput: SoundType | string): void => {
    if (!initialized) return;

    if (
      typeof soundInput === "string" &&
      soundInput in SOUNDS &&
      loadedSounds[soundInput as SoundType]
    ) {
      loadedSounds[soundInput as SoundType].stop();
    } else if (typeof soundInput === "string" && customSounds[soundInput]) {
      customSounds[soundInput].stop();
    }
  };

  // Clean up all sounds
  const cleanup = (): void => {
    Object.values(loadedSounds).forEach((sound) => {
      if (sound) sound.unload();
    });

    Object.values(customSounds).forEach((sound) => {
      if (sound) sound.unload();
    });
  };

  return {
    initialize,
    play,
    stop,
    cleanup,
  };
})();

export function useSound() {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      soundManager.initialize();
      initialized.current = true;
    }

    return () => {
      // No need to clean up on component unmount
      // The singleton will handle cleanup when the app unmounts
    };
  }, []);

  // Memoize these callbacks to prevent unnecessary re-renders
  const playSound = useCallback((soundInput: SoundType | string) => {
    soundManager.play(soundInput);
  }, []);

  const stopSound = useCallback((soundInput: SoundType | string) => {
    soundManager.stop(soundInput);
  }, []);

  return { playSound, stopSound };
}
