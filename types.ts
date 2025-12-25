
export interface ChristmasWish {
  id: string;
  sender: string;
  message: string;
  theme: 'prosperity' | 'romance' | 'adventure' | 'peace';
  createdAt: number;
}

export type ThemeColors = {
  emerald: string;
  gold: string;
  deepEmerald: string;
  highlightGold: string;
};

export type TreeState = 'SCATTERED' | 'TREE_SHAPE';
