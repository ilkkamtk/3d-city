import { Canvas } from '@react-three/fiber';
import { FlyControls, PointerLockControls } from '@react-three/drei';
import House from '../components/House';
import { useMapContext } from '../hooks/ContextHooks';
import Ground from '../components/Ground';
import CustomLight from '../components/CustomLight';

const City = () => {
  const { houses } = useMapContext();
  return (
    <Canvas shadows camera={{ position: [0, 13, 5], fov: 60 }}>
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
          height={house.height}
        />
      ))}
      <Ground />
      <CustomLight position={[60, 30, 30]} />
    </Canvas>
  );
};

export default City;
