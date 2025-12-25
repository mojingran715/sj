
import React from 'react';
import { TreeState } from '../types';

interface UIOverlayProps {
  treeState: TreeState;
  setTreeState: (state: TreeState) => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ 
  treeState, 
  setTreeState
}) => {
  const toggleAssembly = () => {
    setTreeState(treeState === 'SCATTERED' ? 'TREE_SHAPE' : 'SCATTERED');
  };

  return (
    <div className="pointer-events-none fixed inset-0 flex flex-col justify-between p-8 md:p-12 z-10 overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-start pointer-events-auto">
        <div className="flex flex-col">
          <h1 className="text-4xl md:text-6xl font-luxury text-[#D4AF37] tracking-widest uppercase">
            Arix
          </h1>
          <p className="text-[#065F46] font-medium tracking-[0.3em] uppercase text-xs md:text-sm mt-1">
            Signature Interactive
          </p>
        </div>
        
        <div className="flex flex-col items-end">
          <button 
            onClick={toggleAssembly}
            className="group flex flex-col items-end pointer-events-auto"
          >
            <div className="text-[#D4AF37] font-luxury text-sm tracking-widest uppercase mb-1 group-hover:text-[#FFD700] transition-colors">
              {treeState === 'SCATTERED' ? 'Initiate Assembly' : 'Release Essence'}
            </div>
            <div className="h-[1px] w-24 bg-gradient-to-l from-[#D4AF37] to-transparent"></div>
            <div className="text-[#D4AF37]/40 text-[9px] uppercase tracking-widest mt-1 group-hover:text-[#D4AF37]/70">
              {treeState === 'SCATTERED' ? 'Particles in Entropy' : 'Signature Form Active'}
            </div>
          </button>
          
          <div className="mt-4 text-[#D4AF37]/60 text-right font-light italic text-[10px] uppercase tracking-widest">
            Click the tree to interact
          </div>
        </div>
      </header>

      {/* Decorative corners */}
      <div className="fixed top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-[#D4AF37]/20 pointer-events-none m-4"></div>
      <div className="fixed bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-[#D4AF37]/20 pointer-events-none m-4"></div>
    </div>
  );
};
