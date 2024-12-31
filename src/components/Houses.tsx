import { useMapContext } from '../hooks/ContextHooks';
import { useGLTF } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import { InstancedMesh, Object3D, Mesh } from 'three';

const Houses = () => {
  const { houses } = useMapContext();
  const buildingGLB = useGLTF('building1.glb'); // GLB with a single block for the house

  // Scaling factor to adjust the size of the block
  const blockScale = 0.5; // Adjust this value based on your model's original size

  // Extract the first mesh (the block)
  const blockMesh = useMemo((): Mesh | null => {
    let meshTemplate: Mesh | null = null;
    buildingGLB.scene.traverse((child) => {
      if (child instanceof Mesh && !meshTemplate) {
        meshTemplate = child;
      }
    });
    return meshTemplate;
  }, [buildingGLB]);

  const tempObject = useRef(new Object3D());

  const instancedHouses = useMemo(() => {
    if (!blockMesh) return null;

    // Calculate total blocks needed for all houses
    const totalBlocks = houses.reduce(
      (acc, house) => acc + house.width * house.length * house.floors,
      0,
    );

    const instancedMesh = new InstancedMesh(
      blockMesh.geometry,
      blockMesh.material,
      totalBlocks,
    );

    instancedMesh.castShadow = true;
    instancedMesh.receiveShadow = true;

    let blockIndex = 0; // Tracks the index of the current block in the instanced mesh
    houses.forEach((house) => {
      for (let floor = 0; floor < house.floors; floor++) {
        for (let x = 0; x < house.width; x++) {
          for (let z = 0; z < house.length; z++) {
            // Set position for the block (independent of scaling)
            tempObject.current.position.set(
              house.x + x,
              floor + 0.5,
              house.y + z,
            );

            // Apply the scaling to the object
            tempObject.current.scale.set(blockScale, blockScale, blockScale);

            // Update the transformation matrix
            tempObject.current.updateMatrix();

            // Add the transformed matrix to the instanced mesh
            instancedMesh.setMatrixAt(blockIndex, tempObject.current.matrix);
            blockIndex++;
          }
        }
      }
    });

    instancedMesh.instanceMatrix.needsUpdate = true;
    return instancedMesh;
  }, [blockMesh, houses, blockScale]);

  return instancedHouses ? <primitive object={instancedHouses} /> : null;
};

export default Houses;
