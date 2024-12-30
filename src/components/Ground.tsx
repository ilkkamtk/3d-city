const Ground = () => {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[35, 0, 35]}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color={'grey'} />
    </mesh>
  );
};

export default Ground;
