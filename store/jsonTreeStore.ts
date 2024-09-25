import { create } from 'zustand';

type State = {
  expandedNodes: Record<string, boolean>;
  toggleNode: (path: string) => void;
};

export const useJsonTreeStore = create<State>((set) => ({
  expandedNodes: {},
  toggleNode: (path) =>
    set((state) => ({
      expandedNodes: {
        ...state.expandedNodes,
        [path]: !state.expandedNodes[path],
      },
    })),
}));
