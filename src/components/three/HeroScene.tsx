import { useRef, useMemo, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';

function WireframeIcosahedron() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const pointsRef = useRef<THREE.Points>(null!);
  const { pointer } = useThree();

  // Generate vertex positions for glowing nodes
  const nodePositions = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2, 1);
    const positions = geo.getAttribute('position');
    const uniqueVerts: number[] = [];
    const seen = new Set<string>();
    for (let i = 0; i < positions.count; i++) {
      const key = `${positions.getX(i).toFixed(2)},${positions.getY(i).toFixed(2)},${positions.getZ(i).toFixed(2)}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueVerts.push(positions.getX(i), positions.getY(i), positions.getZ(i));
      }
    }
    return new Float32Array(uniqueVerts);
  }, []);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.rotation.x += delta * 0.05;
      // Subtle mouse tilt
      meshRef.current.rotation.x += (pointer.y * 0.3 - meshRef.current.rotation.x) * 0.02;
      meshRef.current.rotation.z += (pointer.x * 0.2 - meshRef.current.rotation.z) * 0.02;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.copy(meshRef.current.rotation);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[2, 1]} />
          <meshBasicMaterial
            color="#ffffff"
            wireframe
            transparent
            opacity={0.12}
          />
        </mesh>
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[nodePositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#ffffff"
            size={0.06}
            transparent
            opacity={0.6}
            sizeAttenuation
          />
        </points>
      </group>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={0.3} color="#ffffff" />
      <WireframeIcosahedron />
      <Stars
        radius={80}
        depth={60}
        count={1500}
        factor={3}
        saturation={0}
        fade
        speed={0.5}
      />
      <Sparkles
        count={40}
        scale={8}
        size={1.5}
        speed={0.3}
        opacity={0.15}
        color="#ffffff"
      />
    </>
  );
}

export function HeroScene() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // On mobile, show a simpler fallback
  if (isMobile) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)',
        }}
      />
    );
  }

  return (
    <div className="absolute inset-0" style={{ zIndex: 0 }}>
      <Suspense
        fallback={
          <div
            className="w-full h-full"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)',
            }}
          />
        }
      >
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 6], fov: 50 }}
          style={{ background: 'transparent' }}
          gl={{ alpha: true, antialias: true }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
