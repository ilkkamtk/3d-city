import { useMapContext } from '../hooks/ContextHooks';
import { useFBX } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import { InstancedMesh, Matrix4, Mesh, Object3D } from 'three';

const Houses = () => {
  const { houses } = useMapContext();
  const houseFBX = useFBX('building1.fbx');

  const blockScale = 0.5; // Adjust scaling factor as needed

  const templateMesh = useMemo((): Mesh | null => {
    let meshTemplate: Mesh | null = null;
    houseFBX.traverse((child) => {
      if (child instanceof Mesh && !meshTemplate) {
        meshTemplate = child;
      }
    });
    return meshTemplate;
  }, [houseFBX]);

  const tempObject = useRef(new Object3D());
  const rotationX = useRef(new Matrix4()); // For X-axis rotation

  const instancedHouses = useMemo(() => {
    if (!templateMesh) return null;

    // Calculate total blocks needed for all houses
    const totalBlocks = houses.reduce(
      (acc, house) => acc + house.width * house.length * house.floors,
      0,
    );

    const instancedMesh = new InstancedMesh(
      templateMesh.geometry,
      templateMesh.material,
      totalBlocks,
    );

    instancedMesh.castShadow = true;
    instancedMesh.receiveShadow = true;

    let blockIndex = 0;

    // Set up the rotation matrix for blocks
    rotationX.current.makeRotationX(-Math.PI / 2);

    houses.forEach((house) => {
      for (let floor = 0; floor < house.floors; floor++) {
        for (let x = 0; x < house.width; x++) {
          for (let z = 0; z < house.length; z++) {
            // Calculate block position
            tempObject.current.position.set(
              house.x + x,
              floor + 0.5,
              house.y + z,
            );

            // Apply scaling
            tempObject.current.scale.set(blockScale, blockScale, blockScale);

            // Reset and apply transformations
            tempObject.current.updateMatrix(); // Update position and scale
            tempObject.current.matrix.multiply(rotationX.current); // Apply X-axis rotation

            // Add block to instanced mesh
            instancedMesh.setMatrixAt(blockIndex, tempObject.current.matrix);
            blockIndex++;
          }
        }
      }
    });

    instancedMesh.instanceMatrix.needsUpdate = true;
    return instancedMesh;
  }, [templateMesh, houses, blockScale]);

  return instancedHouses ? <primitive object={instancedHouses} /> : null;
};

export default Houses;
