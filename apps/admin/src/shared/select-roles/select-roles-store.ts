import { create } from 'zustand';

type SelectRolesStore = {
  userId: string | null;
  setUserId: (userId: string | null) => void;
};

export const useSelectRolesStore = create<SelectRolesStore>((set) => ({
  userId: null,
  setUserId: (userId: string | null) => set({ userId }),
}));

export const useSetUserIdStore = () => useSelectRolesStore((state) => state.setUserId);
export const useGetUserIdStore = () => useSelectRolesStore((state) => state.userId);
