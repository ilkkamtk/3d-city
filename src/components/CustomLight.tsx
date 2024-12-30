import { useHelper } from '@react-three/drei';
import { ThreeElements } from '@react-three/fiber';
import { useRef, MutableRefObject } from 'react';
import { DirectionalLight, DirectionalLightHelper } from 'three';

const CustomLight = (props: ThreeElements['directionalLight']) => {
  const lightRef =
    useRef<DirectionalLight>() as MutableRefObject<DirectionalLight>;
  useHelper(lightRef, DirectionalLightHelper, 2, 'red');
  return (
    <directionalLight
      {...props}
      ref={lightRef}
      intensity={1.5}
      castShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
      shadow-camera-left={-100} // Extend the shadow area
      shadow-camera-right={100}
      shadow-camera-top={100}
      shadow-camera-bottom={-100}
      shadow-camera-far={500} // Ensure it covers the ground
    />
  );
};

export default CustomLight;
