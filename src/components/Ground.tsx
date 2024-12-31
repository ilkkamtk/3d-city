const Ground = () => {
  return (
    <>
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[50, 0, 50]}
      >
        <planeGeometry args={[102, 102]} />
        <meshStandardMaterial color={'#555'} />
      </mesh>
    </>
  );
};

export default Ground;
