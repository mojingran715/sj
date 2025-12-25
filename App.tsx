
import React, { useState, useCallback } from 'react';
import { Experience } from './components/Experience';
import { UIOverlay } from './components/UIOverlay';
import { TreeState } from './types';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeState>('SCATTERED');

  const handleToggle = useCallback(() => {
    setTreeState((prev) => (prev === 'SCATTERED' ? 'TREE_SHAPE' : 'SCATTERED'));
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#021a12]">
      {/* 3D Content */}
      <Experience treeState={treeState} onToggle={handleToggle} />

      {/* Interactive UI */}
      <UIOverlay 
        treeState={treeState} 
        setTreeState={setTreeState} 
      />

      {/* Bottom attribution */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-[#D4AF37]/30 text-[8px] uppercase tracking-[0.5em] pointer-events-none z-50 text-center">
        The Arix Digital Experience • All Rights Reserved<br/>
        Click the Tree to Reveal the Signature
      </div>

      {/* Ambient overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,26,18,0.4)_100%)] z-5"></div>
    </main>
  );
};

export default App;
