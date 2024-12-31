import { House as HouseType } from '../types/LocalTypes';

const House = (props: HouseType) => {
  console.log('house is rendered');
  const { x, y, floors, texture, width, length, roughnessMap } = props;

  const offset = floors / 2; // Half the height of the house

  return (
    <>
      {/* The floor */}
      <mesh position={[x, offset, y]} receiveShadow castShadow>
        <boxGeometry args={[width, floors, length]} />
        <meshStandardMaterial
          map={texture}
          roughness={1}
          roughnessMap={roughnessMap}
        />
      </mesh>
    </>
  );
};

export default House;
