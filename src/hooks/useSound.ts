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
    volume: 0.1,
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
    volume: 0.4,
  },
  questAccept: {
    src: "/mp3/level-passed-142971.mp3",
    volume: 0.4,
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
    src: "/mp3/goodresult-82807.mp3",
    volume: 0.6,
  },
};

type SoundType = keyof typeof SOUNDS;

export function useSound() {
  const soundsRef = useRef<Record<SoundType, Howl>>(
    {} as Record<SoundType, Howl>
  );

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
      Object.values(soundsRef.current).forEach((sound) => sound.unload());
    };
  }, []);

  const playSound = useCallback((type: SoundType) => {
    const sound = soundsRef.current[type];
    if (sound) {
      sound.play();
    }
  }, []);

  const stopSound = useCallback((type: SoundType) => {
    const sound = soundsRef.current[type];
    if (sound) {
      sound.stop();
    }
  }, []);

  return { playSound, stopSound };
}
