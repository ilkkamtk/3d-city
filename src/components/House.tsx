import { House as HouseType } from '../types/LocalTypes';

const House = (props: HouseType) => {
  console.log('house is rendered');
  const { x, y, floors, texture, width, length } = props;

  const unitSize = 2; // Ajust the size of the house
  const offset = floors / unitSize / 2; // Half the height of the house

  return (
    <>
      {/* The floor */}
      <mesh position={[x, offset, y]} receiveShadow castShadow>
        <boxGeometry
          args={[width / unitSize, floors / unitSize, length / unitSize]}
        />
        <meshStandardMaterial map={texture} />
      </mesh>
    </>
  );
};

export default House;
