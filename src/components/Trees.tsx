import { Mesh, InstancedMesh, Matrix4, Vector3 } from 'three';
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
    if (!templateMesh) return null;

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
    trees.forEach((tree, i) => {
      // Optional: Add random rotation around Y axis for variety
      matrix.makeRotationY(Math.random() * Math.PI * 2);
      matrix.makeRotationX(-Math.PI / 2);
      matrix.setPosition(tree.x, 0, tree.y);
      matrix.scale(
        new Vector3(tree.height / 10, tree.height / 10, tree.height / 10),
      );
      instancedMesh.setMatrixAt(i, matrix);
    });

    instancedMesh.instanceMatrix.needsUpdate = true;
    return instancedMesh;
  }, [templateMesh, trees]);

  return instancedTrees ? <primitive object={instancedTrees} /> : null;
};

export default Trees;
