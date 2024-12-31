import { Mesh, InstancedMesh, Matrix4 } from 'three';
import { useMapContext } from '../hooks/ContextHooks';
import { useFBX } from '@react-three/drei';
import { useMemo } from 'react';

const Trees = () => {
  const { trees } = useMapContext();
  const treeFBX = useFBX('tree3.fbx');

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

    // Set position and rotation for each instance
    const matrix = new Matrix4();
    const rotationX = new Matrix4();
    const rotationZ = new Matrix4();
    const scale = new Matrix4();

    trees.forEach((tree, i) => {
      // Reset the matrix for each tree
      matrix.identity();

      // Set the position
      matrix.setPosition(tree.x, 0, tree.y);

      // X-axis rotation to make the tree stand up
      rotationX.makeRotationX(-Math.PI / 2);
      // randomize the  Y-axis rotation
      rotationZ.makeRotationZ(Math.random() * Math.PI * 2);
      // scale the tree
      scale.makeScale(tree.height / 5, tree.height / 5, tree.height / 5);

      matrix.multiply(rotationX).multiply(rotationZ).multiply(scale);

      // Add the transformed matrix to the instanced mesh
      instancedMesh.setMatrixAt(i, matrix);
    });

    instancedMesh.instanceMatrix.needsUpdate = true;
    return instancedMesh;
  }, [templateMesh, trees]);

  return instancedTrees ? <primitive object={instancedTrees} /> : null;
};

export default Trees;
