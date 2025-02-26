import { useCallback, useEffect, useRef } from "react";
import { Howl } from "howler";

const SOUNDS = {
  background: {
    src: "/mp3/creepy-halloween-bell-trap-melody-247720.mp3",
    loop: true,
    volume: 0.2,
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
  notAllowed:{
    src: "/mp3/wrong-47985.mp3",
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
  }
};

type SoundType = keyof typeof SOUNDS;

export function useSound() {
  const soundsRef = useRef<Record<SoundType, Howl>>(
    {} as Record<SoundType, Howl>
  );
  
  // Cache for custom sound URLs
  const customSoundsCache = useRef<Record<string, Howl>>({});

  useEffect(() => {
    // Initialize sounds
    Object.entries(SOUNDS).forEach(([key, config]) => {
      soundsRef.current[key as SoundType] = new Howl({
        src: [config.src],
        loop: config.loop || false,
        volume: config.volume || 1,
      });
    });

    // Start background music

    // Cleanup
    return () => {
      // Unload predefined sounds
      Object.values(soundsRef.current).forEach((sound) => sound.unload());
      
      // Unload custom sounds
      Object.values(customSoundsCache.current).forEach((sound) => sound.unload());
    };
  }, []);

  const playSound = useCallback((soundInput: SoundType | string) => {
    // Check if it's a predefined sound type
    if (typeof soundInput === 'string' && soundInput in SOUNDS) {
      const sound = soundsRef.current[soundInput as SoundType];
      if (sound) {
        sound.play();
      }
    } 
    // Handle custom sound URL
    else if (typeof soundInput === 'string' && soundInput.startsWith('http')) {
      // Check if we already have this sound cached
      if (customSoundsCache.current[soundInput]) {
        customSoundsCache.current[soundInput].play();
      } else {
        // Create and cache a new Howl instance for this URL
        try {
          const newSound = new Howl({
            src: [soundInput],
            volume: 0.5,
            html5: true, // This helps with streaming audio from external URLs
          });
          
          // Cache the sound
          customSoundsCache.current[soundInput] = newSound;
          
          // Play it
          newSound.play();
        } catch (error) {
          console.error("Error playing custom sound:", error);
        }
      }
    }
  }, []);

  const stopSound = useCallback((soundInput: SoundType | string) => {
    // Check if it's a predefined sound type
    if (typeof soundInput === 'string' && soundInput in SOUNDS) {
      const sound = soundsRef.current[soundInput as SoundType];
      if (sound) {
        sound.stop();
      }
    } 
    // Handle custom sound URL
    else if (typeof soundInput === 'string' && customSoundsCache.current[soundInput]) {
      customSoundsCache.current[soundInput].stop();
    }
  }, []);

  return { playSound, stopSound };
}
