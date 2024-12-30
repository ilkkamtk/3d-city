import { useLoader } from '@react-three/fiber';
import { RepeatWrapping, TextureLoader } from 'three';

const Ground = () => {
  const waterTexture = useLoader(TextureLoader, 'water.jpg');
  waterTexture.wrapS = RepeatWrapping;
  waterTexture.wrapT = RepeatWrapping;
  waterTexture.repeat.set(100, 100);

  return (
    <>
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[35, 0, 35]}
      >
        <circleGeometry args={[51]} />
        <meshStandardMaterial color={'grey'} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[35, -0.05, 35]}>
        <circleGeometry args={[500, 500]} />
        <meshStandardMaterial
          color={'#a0e9ff'}
          roughnessMap={waterTexture}
          metalness={0.3}
          roughness={0.8}
        />
      </mesh>
    </>
  );
};

export default Ground;
