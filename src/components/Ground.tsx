const Ground = () => {
  return (
    <>
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[35, 0, 35]}
      >
        <circleGeometry args={[51]} />
        <meshStandardMaterial color={'#555'} />
      </mesh>
    </>
  );
};

export default Ground;
