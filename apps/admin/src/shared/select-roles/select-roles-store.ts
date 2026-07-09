import { create } from 'zustand';

type SelectRolesStore = {
  userId: string | null;
  setUserId: (userId: string) => void;
};

export const useSelectRolesStore = create<SelectRolesStore>((set) => ({
  userId: null,
  setUserId: (userId: string) => set({ userId }),
}));

export const useSetUserId = () => useSelectRolesStore((state) => state.setUserId);
