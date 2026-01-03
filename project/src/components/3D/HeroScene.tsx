import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

type SnowProps = {
  count?: number;
  size?: number;
};

function Snow({ count = 400, size = 0.02 }: SnowProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const positions = useMemo(() => {
    const pos: Array<THREE.Vector3> = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 12;
      const y = Math.random() * 10 + 1; // start above the view
      const z = (Math.random() - 0.5) * 6;
      pos.push(new THREE.Vector3(x, y, z));
    }
    return pos;
  }, [count]);

  // useFrame to move snow down and recycle
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      const v = positions[i];
      v.y -= delta * (0.6 + Math.random() * 0.8); // fall speed
      v.x += Math.sin(state.clock.elapsedTime * 0.2 + i) * 0.001; // slight drift
      v.z += Math.cos(state.clock.elapsedTime * 0.15 + i) * 0.001;
      if (v.y < -2) {
        v.y = 8 + Math.random() * 3; // reset above
        v.x = (Math.random() - 0.5) * 12;
        v.z = (Math.random() - 0.5) * 6;
      }
      dummy.position.set(v.x, v.y, v.z);
  // smaller base size with subtle random variation
  dummy.scale.setScalar(size * (0.6 + Math.random() * 0.6));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  // white material with subtle transparency
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, roughness: 0.9 }),
    []
  );

  return (
    <instancedMesh ref={meshRef} args={[undefined as any, undefined as any, count]} castShadow>
      {/* make base geometry smaller so scale results in tiny particles */}
      <sphereGeometry args={[0.5, 8, 8]} />
      <primitive object={mat} attach="material" />
    </instancedMesh>
  );
}

const HeroScene: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 1.5, 8], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <fog attach="fog" args={[0x0b1220, 6, 18]} />
        <color attach="background" args={[0x081028]} />
  <Snow count={700} size={0.02} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
};

export default HeroScene;