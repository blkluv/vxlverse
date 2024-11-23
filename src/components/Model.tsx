import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';

interface ModelProps {
  url: string;
}

export function Model({ url }: ModelProps) {
  const { scene } = useGLTF(url);
  
  useEffect(() => {
    return () => {
      useGLTF.preload(url);
    };
  }, [url]);

  return <primitive object={scene.clone()} />;
}