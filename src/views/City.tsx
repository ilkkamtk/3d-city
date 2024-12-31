import { Canvas } from '@react-three/fiber';
import {
  FlyControls,
  PointerLockControls,
  Sky,
  useFBX,
} from '@react-three/drei';
import House from '../components/House';
import { useMapContext } from '../hooks/ContextHooks';
import Ground from '../components/Ground';
import CustomLight from '../components/CustomLight';
import Water from '../components/Water';
import { Suspense, useMemo } from 'react';
import { Mesh } from 'three';

const City = () => {
  const { houses, trees } = useMapContext();
  const treeFBX = useFBX('tree3.fbx');

  treeFBX.traverse((child) => {
    if (child instanceof Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  const treeModels = useMemo(() => {
    return trees.map(() => treeFBX.clone());
  }, [treeFBX, trees]);
  return (
    <Canvas
      shadows
      camera={{ position: [0, 13, 5], fov: 60 }}
      frameloop="demand"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.8} />
        <PointerLockControls />
        <FlyControls rollSpeed={0} movementSpeed={10} />
        {houses.map((house, index) => (
          <House
            key={index}
            x={house.x}
            y={house.y}
            texture={house.texture}
            floors={house.floors}
            width={house.width}
            length={house.length}
            roughnessMap={house.roughnessMap}
          />
        ))}
        {trees.map((tree, index) => {
          return (
            <primitive
              key={index}
              castShadow={true}
              receiveShadow
              object={treeModels[index]}
              position={[tree.x, 0, tree.y]}
              scale={0.001 * tree.height}
            />
          );
        })}
        <Ground />
        <Water />
        <CustomLight position={[200, 100, 50]} />
        <Sky sunPosition={[200, 100, 50]} />
      </Suspense>
    </Canvas>
  );
};

export default City;
