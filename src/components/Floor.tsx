// a component that represents a floor in the building
// body constists of a box with a texture
// on the top of the floor there is another box with a texture representing the ceiling

import { ThreeElements, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

const Floor = (props: ThreeElements['mesh'] & { texture: string }) => {
  const { position, texture } = props;
  const material = useLoader(TextureLoader, texture);
  const positionArray = Array.isArray(position) ? position : [0, 0, 0];
  return (
    <>
      {/* The floor */}
      <mesh {...props} receiveShadow castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial map={material} />
      </mesh>
      {/* The ceiling */}
      <mesh
        {...props}
        position={[positionArray[0], positionArray[1] + 0.5, positionArray[2]]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[0.99, 0.04, 0.99]} />
        <meshStandardMaterial color={'black'} />
      </mesh>
    </>
  );
};

export default Floor;
