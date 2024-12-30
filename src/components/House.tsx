// create house from Floor components
// randomize the number of floors between 3 - 10 and color of the house (gray, brown, red)
// randomize the width and height of the house 1-3

import { ThreeElements } from '@react-three/fiber';
import Floor from './Floor';

const House = (props: ThreeElements['group']) => {
  const { position } = props;
  const positionArray = Array.isArray(position) ? position : [0, 0, 0];
  const numberOfFloors = Math.floor(Math.random() * 8) + 3;
  const texture = `material${Math.floor(Math.random() * 3) + 1}.jpg`;
  const width = Math.floor(Math.random() * 3) + 1;
  const height = Math.floor(Math.random() * 3) + 1;
  const floors = [];
  for (let i = 0; i < numberOfFloors; i++) {
    floors.push(
      <Floor
        key={i}
        position={[positionArray[0], positionArray[1] + i, positionArray[2]]}
        texture={texture}
        scale={[width, 1, height]}
      />,
    );
  }
  return <group {...props}>{floors}</group>;
};

export default House;
