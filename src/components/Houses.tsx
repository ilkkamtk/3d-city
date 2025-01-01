import { useMapContext } from '../hooks/ContextHooks';
import { useFBX } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import {
  InstancedMesh,
  Matrix4,
  Mesh,
  Object3D,
  BufferGeometry,
  Material,
} from 'three';

const Houses = () => {
  const { houses } = useMapContext();
  const blockScale = 0.5; // Adjust scaling factor as needed

  // Load FBX models individually
  const building1 = useFBX('building1.fbx');
  const building2 = useFBX('building2.fbx');
  const building3 = useFBX('building3.fbx');

  // Stabilize model references
  const models = useMemo(
    () => [building1, building2, building3],
    [building1, building2, building3],
  );

  // Extract meshes for each model
  const templateMeshes = useMemo<
    (Mesh<BufferGeometry, Material> | null)[]
  >(() => {
    return models.map((model) => {
      let meshTemplate: Mesh<BufferGeometry, Material> | null = null;
      model.traverse((child) => {
        if (child instanceof Mesh) {
          meshTemplate = child;
        }
      });
      return meshTemplate;
    });
  }, [models]);

  const tempObject = useRef(new Object3D());
  const rotationX = useRef(new Matrix4()); // For X-axis rotation

  const instancedHouses = useMemo(() => {
    if (!templateMeshes.every(Boolean) || !houses.length) {
      return null;
    }

    // Create separate InstancedMesh for each material type
    const instancedMeshes = templateMeshes.map(
      (mesh) =>
        new InstancedMesh(
          mesh!.geometry,
          mesh!.material,
          houses
            .filter((house) => house.material === templateMeshes.indexOf(mesh))
            .reduce(
              (acc, house) => acc + house.width * house.length * house.floors,
              0,
            ),
        ),
    );

    // Configure each InstancedMesh
    instancedMeshes.forEach((mesh) => {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });

    const blockIndices = Array(instancedMeshes.length).fill(0); // Track block indices per material

    // Set up the rotation matrix for blocks
    rotationX.current.makeRotationX(-Math.PI / 2);

    houses.forEach((house) => {
      const materialIndex = house.material; // Directly use material index (0-based)
      if (!instancedMeshes[materialIndex]) return;

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

            // Add block to the correct InstancedMesh
            instancedMeshes[materialIndex].setMatrixAt(
              blockIndices[materialIndex]++,
              tempObject.current.matrix,
            );
          }
        }
      }
    });

    // Mark all InstancedMeshes for update
    instancedMeshes.forEach((mesh) => {
      mesh.instanceMatrix.needsUpdate = true;
    });

    return instancedMeshes;
  }, [templateMeshes, houses, blockScale]);

  return (
    <>
      {instancedHouses?.map((mesh, index) => (
        <primitive key={index} object={mesh} />
      ))}
    </>
  );
};

export default Houses;
