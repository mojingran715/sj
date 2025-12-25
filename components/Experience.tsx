
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { ChristmasTree } from './TreeModel';
import { COLORS } from '../constants';
import { TreeState } from '../types';

interface ExperienceProps {
  treeState: TreeState;
  onToggle: () => void;
}

export const Experience: React.FC<ExperienceProps> = ({ treeState, onToggle }) => {
  return (
    <div className="w-full h-full absolute inset-0 bg-[#000806]">
      <Canvas 
        shadows 
        dpr={[1, 2]} 
        gl={{ 
          antialias: true, 
          stencil: false, 
          depth: true,
          toneMapping: 3, // ACESFilmicToneMapping
          toneMappingExposure: 1.6 // Increased significantly for extra punch
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 1.5, 14]} fov={32} />
        
        <color attach="background" args={['#000504']} />
        <fog attach="fog" args={['#000504', 12, 30]} />

        {/* Global Lighting - Increased intensities by 75% */}
        <ambientLight intensity={1.05} /> 
        
        <spotLight 
          position={[15, 20, 15]} 
          angle={0.2} 
          penumbra={1} 
          intensity={21} 
          castShadow 
          shadow-mapSize={[2048, 2048]}
        />

        {/* Rim lights for silhouette definition */}
        <pointLight position={[-15, 5, -10]} intensity={10.5} color="#00ff9d" />
        <pointLight position={[15, 10, -10]} intensity={7.8} color="#059669" />
        
        {/* Warm golden frontal wash */}
        <pointLight position={[0, -2, 8]} intensity={6.5} color={COLORS.highlightGold} distance={25} />
        
        {/* Interior core glow */}
        <pointLight 
          position={[0, 0, 0]} 
          intensity={treeState === 'TREE_SHAPE' ? 4 : 0} 
          color="#ffcc00" 
          distance={10} 
        />

        <Suspense fallback={null}>
          <ChristmasTree state={treeState} onToggle={onToggle} />
          
          <ContactShadows 
            resolution={1024} 
            scale={20} 
            blur={4} 
            opacity={0.6} 
            far={10} 
            color="#000000" 
          />

          <Environment preset="night" />
        </Suspense>

        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          minDistance={8} 
          maxDistance={22}
          maxPolarAngle={Math.PI / 1.7}
          autoRotate={treeState === 'SCATTERED'}
          autoRotateSpeed={0.25}
        />

        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={1.0} 
            mipmapBlur 
            intensity={1.6} /* Increased bloom for brilliant glow */
            radius={0.35} 
          />
          <Noise opacity={0.02} />
          <Vignette eskil={false} offset={0.2} darkness={1.2} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
