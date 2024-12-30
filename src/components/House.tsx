import { House as HouseType } from '../types/LocalTypes';

const House = (props: HouseType) => {
  console.log('house is rendered');
  const { x, y, floors, texture, width, height } = props;
  return (
    <>
      {/* The floor */}
      <mesh
        position={[x, floors / 4, y]}
        scale={[width, floors, height]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </>
  );
};

export default House;
