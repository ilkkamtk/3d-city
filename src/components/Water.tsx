import { useLoader } from '@react-three/fiber';
import { RepeatWrapping, Texture, TextureLoader } from 'three';

const configureTexture = (texture: Texture) => {
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(100, 100);
  return texture;
};

const Water = () => {
  const waterTexture = configureTexture(useLoader(TextureLoader, 'water.jpg'));

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[35, -0.1, 35]}>
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

export default Water;
