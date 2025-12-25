
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sparkles, Float } from '@react-three/drei';
import { COLORS } from '../constants';
import { TreeState } from '../types';

const PARTICLE_COUNT = 4500; 
const LIGHT_POINT_COUNT = 600; // Increased density for a smoother spiral string

interface ChristmasTreeProps {
  state: TreeState;
  onToggle: () => void;
}

export const ChristmasTree: React.FC<ChristmasTreeProps> = ({ state, onToggle }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const ornamentRef = useRef<THREE.InstancedMesh>(null);
  const lightsRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Sharp, high-definition star with reduced volume and top-point up
  const starGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Dimensions reduced by factor of ~0.8 to achieve ~50% volume reduction (0.8^3 = 0.512)
    const outerRadius = 0.52;
    const innerRadius = 0.22;
    for (let i = 0; i < 10; i++) {
      // Adjusted angle from -PI/2 to +PI/2 to point the first vertex UP
      const angle = (i * Math.PI) / 5 + Math.PI / 2;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, { 
      depth: 0.12, 
      bevelEnabled: true, 
      bevelThickness: 0.04, 
      bevelSize: 0.04, 
      bevelSegments: 3 
    });
  }, []);

  // Richer, high-contrast palette
  const palette = useMemo(() => [
    new THREE.Color('#004d33'), 
    new THREE.Color('#008f5d'), 
    new THREE.Color('#059669'), 
    new THREE.Color('#10b981'), 
    new THREE.Color('#D4AF37'), 
    new THREE.Color('#FFD700'), 
    new THREE.Color('#064e3b'), 
    new THREE.Color('#022c22'), 
  ], []);

  const particleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const sDist = 7 + Math.random() * 5;
      const sTheta = Math.random() * Math.PI * 2;
      const sPhi = Math.acos(2 * Math.random() - 1);
      const scatterPos = new THREE.Vector3(
        sDist * Math.sin(sPhi) * Math.cos(sTheta),
        sDist * Math.sin(sPhi) * Math.sin(sTheta),
        sDist * Math.cos(sPhi)
      );

      const tY = (Math.random() * 6.0) - 2.5; 
      const normalizedHeight = (tY + 2.5) / 6.0;
      const radiusAtHeight = (1 - normalizedHeight) * 2.8;
      const r = (0.3 + 0.7 * Math.sqrt(Math.random())) * radiusAtHeight;
      const angle = Math.random() * Math.PI * 2;
      
      const treePos = new THREE.Vector3(
        Math.cos(angle) * r,
        tY,
        Math.sin(angle) * r
      );

      const color = palette[Math.floor(Math.random() * palette.length)].clone();
      
      data.push({
        scatterPos,
        treePos,
        currentPos: scatterPos.clone(),
        speed: 0.02 + Math.random() * 0.04,
        rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
        scale: 0.06 + Math.random() * 0.12,
        color: color
      });
    }
    return data;
  }, [palette]);

  const ornamentData = useMemo(() => {
    const data = [];
    for (let i = 0; i < 85; i++) {
      const sDist = 9 + Math.random() * 3;
      const sTheta = Math.random() * Math.PI * 2;
      const scatterPos = new THREE.Vector3(
        sDist * Math.cos(sTheta),
        (Math.random() - 0.5) * 10,
        sDist * Math.sin(sTheta)
      );

      const tY = (Math.random() * 5.6) - 2.2;
      const normalizedHeight = (tY + 2.2) / 5.6;
      const radiusAtHeight = (1 - normalizedHeight) * 2.8;
      const angle = Math.random() * Math.PI * 2;
      const r = 0.98 * radiusAtHeight;

      const treePos = new THREE.Vector3(
        Math.cos(angle) * r,
        tY,
        Math.sin(angle) * r
      );

      data.push({
        scatterPos,
        treePos,
        currentPos: scatterPos.clone(),
        size: 0.1 + Math.random() * 0.12,
        phase: Math.random() * Math.PI * 2
      });
    }
    return data;
  }, []);

  // Spiral Light Points: Discrete White
  const lightPointData = useMemo(() => {
    const data = [];
    const whiteColor = new THREE.Color('#FFFFFF');
    const turns = 10;

    for (let i = 0; i < LIGHT_POINT_COUNT; i++) {
      const sDist = 8 + Math.random() * 5;
      const sTheta = Math.random() * Math.PI * 2;
      const scatterPos = new THREE.Vector3(
        sDist * Math.cos(sTheta),
        (Math.random() - 0.5) * 12,
        sDist * Math.sin(sTheta)
      );

      const normalizedHeight = i / (LIGHT_POINT_COUNT - 1);
      const tY = normalizedHeight * 5.8 - 2.2;
      const radiusAtHeight = (1 - normalizedHeight) * 2.92;
      const angle = (normalizedHeight * turns * Math.PI * 2);
      
      const treePos = new THREE.Vector3(
        Math.cos(angle) * radiusAtHeight,
        tY,
        Math.sin(angle) * radiusAtHeight
      );

      // Scale is 0.25 of average block size (avg ~0.12 * 0.25 = 0.03)
      const scale = 0.03;

      data.push({
        scatterPos,
        treePos,
        currentPos: scatterPos.clone(),
        scale,
        color: whiteColor.clone(),
        speed: 0.03 + Math.random() * 0.03
      });
    }
    return data;
  }, []);

  useFrame((clockState) => {
    const time = clockState.clock.getElapsedTime();
    const isAssembled = state === 'TREE_SHAPE';

    if (meshRef.current) {
      particleData.forEach((p, i) => {
        const target = isAssembled ? p.treePos : p.scatterPos;
        p.currentPos.lerp(target, p.speed);
        dummy.position.copy(p.currentPos);
        dummy.position.y += Math.sin(time * 0.25 + i) * 0.015;
        dummy.rotation.set(p.rotation.x + time * 0.05, p.rotation.y + time * 0.04, p.rotation.z);
        dummy.scale.setScalar(p.scale);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
        meshRef.current!.setColorAt(i, p.color);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
      if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    }

    if (ornamentRef.current) {
      ornamentData.forEach((o, i) => {
        const target = isAssembled ? o.treePos : o.scatterPos;
        o.currentPos.lerp(target, 0.05);
        dummy.position.copy(o.currentPos);
        dummy.position.y += Math.cos(time * 0.5 + o.phase) * 0.02;
        dummy.scale.setScalar(o.size);
        dummy.updateMatrix();
        ornamentRef.current!.setMatrixAt(i, dummy.matrix);
      });
      ornamentRef.current.instanceMatrix.needsUpdate = true;
    }

    if (lightsRef.current) {
      lightPointData.forEach((lp, i) => {
        const target = isAssembled ? lp.treePos : lp.scatterPos;
        lp.currentPos.lerp(target, lp.speed);
        dummy.position.copy(lp.currentPos);
        // Discrete twinkle
        const twinkle = 0.6 + Math.sin(time * 6 + i) * 0.4;
        dummy.scale.setScalar(lp.scale * twinkle);
        dummy.updateMatrix();
        lightsRef.current!.setMatrixAt(i, dummy.matrix);
        // Ensure color is white for every instance
        lightsRef.current!.setColorAt(i, lp.color);
      });
      lightsRef.current.instanceMatrix.needsUpdate = true;
      if (lightsRef.current.instanceColor) lightsRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group onClick={(e) => { e.stopPropagation(); onToggle(); }}>
      {/* Foliage blocks */}
      <instancedMesh ref={meshRef} args={[null as any, null as any, PARTICLE_COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial 
          vertexColors
          metalness={0.4} 
          roughness={0.2}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          reflectivity={1.0}
          emissive="#00ff9d"
          emissiveIntensity={0.25}
        />
      </instancedMesh>

      {/* Gold Ornaments */}
      <instancedMesh ref={ornamentRef} args={[null as any, null as any, 85]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial 
          color={COLORS.highlightGold}
          metalness={1.0} 
          roughness={0.0} 
          clearcoat={1.0}
          clearcoatRoughness={0.0}
          reflectivity={1.0}
          emissive="#443300"
          emissiveIntensity={0.1}
        />
      </instancedMesh>

      {/* Spiral Pure White Light Points */}
      <instancedMesh ref={lightsRef} args={[null as any, null as any, LIGHT_POINT_COUNT]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial 
          color="#ffffff"
          vertexColors
          emissive="#ffffff"
          emissiveIntensity={15} // Extremely bright for bloom
          toneMapped={false}
        />
      </instancedMesh>

      {/* Radiant Star */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.3}>
        <mesh 
          position={[0, 3.9, 0]} 
          scale={state === 'TREE_SHAPE' ? 1.4 : 0}
          visible={state === 'TREE_SHAPE'}
          geometry={starGeometry}
        >
          <meshPhysicalMaterial 
            color="#ffffff" 
            emissive={COLORS.highlightGold} 
            emissiveIntensity={12} 
            metalness={1}
            roughness={0.01}
            clearcoat={1.0}
          />
          <pointLight intensity={30} distance={15} color={COLORS.highlightGold} />
        </mesh>
      </Float>

      <Sparkles 
        count={state === 'TREE_SHAPE' ? 150 : 400} 
        scale={state === 'TREE_SHAPE' ? 6 : 15} 
        size={6} 
        speed={0.5} 
        color={COLORS.highlightGold} 
      />
    </group>
  );
};
