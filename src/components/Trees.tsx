import { Mesh, InstancedMesh, Matrix4 } from 'three';
import { useMapContext } from '../hooks/ContextHooks';
import { useFBX } from '@react-three/drei';
import { useMemo, useRef } from 'react';

const Trees = () => {
  const { trees } = useMapContext();
  const treeFBX = useFBX('tree3.fbx');
  // Set position and rotation for each instance
  const matrix = useRef(new Matrix4());
  const rotationX = useRef(new Matrix4());
  const rotationZ = useRef(new Matrix4());
  const scale = useRef(new Matrix4());

  // Find the first mesh in the FBX to use as template
  const templateMesh = useMemo((): Mesh | null => {
    let meshTemplate: Mesh | null = null;
    treeFBX.traverse((child) => {
      if (child instanceof Mesh && !meshTemplate) {
        meshTemplate = child;
      }
    });
    return meshTemplate;
  }, [treeFBX]);

  const instancedTrees = useMemo(() => {
    if (!templateMesh) {
      return null;
    }

    // Create instanced mesh with the number of trees
    const instancedMesh = new InstancedMesh(
      templateMesh.geometry,
      templateMesh.material,
      trees.length,
    );

    instancedMesh.castShadow = true;
    instancedMesh.receiveShadow = true;

    trees.forEach((tree, i) => {
      // Reset the matrix for each tree
      matrix.current.identity();

      // Set the position
      matrix.current.setPosition(tree.x, 0, tree.y);

      // X-axis rotation to make the tree stand up
      rotationX.current.makeRotationX(-Math.PI / 2);
      // randomize the  Z-axis rotation
      rotationZ.current.makeRotationZ(Math.random() * Math.PI * 2);
      // scale the tree
      scale.current.makeScale(
        tree.height / 5,
        tree.height / 5,
        tree.height / 5,
      );

      matrix.current
        .multiply(rotationX.current)
        .multiply(rotationZ.current)
        .multiply(scale.current);

      // Add the transformed matrix to the instanced mesh
      instancedMesh.setMatrixAt(i, matrix.current);
    });

    instancedMesh.instanceMatrix.needsUpdate = true;
    return instancedMesh;
  }, [templateMesh, trees]);

  return instancedTrees ? <primitive object={instancedTrees} /> : null;
};

export default Trees;
