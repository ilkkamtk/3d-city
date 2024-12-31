import { useEffect, useRef } from 'react';
import { InstancedMesh, MeshStandardMaterial, Object3D } from 'three';
import { House } from '../types/LocalTypes';

const Houses = ({
  houses,
  temp = new Object3D(),
}: {
  houses: House[];
  temp?: Object3D;
}) => {
  const instancedMeshRef = useRef<InstancedMesh>(null);
  useEffect(() => {
    // Set positions
    if (!instancedMeshRef.current) return;
    for (let i = 0; i < houses.length; i++) {
      temp.position.set(houses[i].x, 0, houses[i].y);
      temp.scale.set(houses[i].width, houses[i].floors, houses[i].length);
      temp.updateMatrix();
      if (!instancedMeshRef.current) return;
      instancedMeshRef.current.setMatrixAt(i, temp.matrix);
      // set material
      instancedMeshRef.current.material = new MeshStandardMaterial({
        map: houses[i].texture,
        roughness: 1,
        roughnessMap: houses[i].roughnessMap,
      });

      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    }
    // Update the instance
    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [houses, temp]);
  return (
    <instancedMesh
      ref={instancedMeshRef}
      args={[undefined, undefined, houses.length]}
      receiveShadow
      castShadow
    >
      <boxGeometry />
    </instancedMesh>
  );
};

export default Houses;
