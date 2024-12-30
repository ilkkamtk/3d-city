const Ground = () => {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[20, 0, 20]}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color={'grey'} />
    </mesh>
  );
};

export default Ground;
