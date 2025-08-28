import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  token?: string;
  name?: string;
  id: string;
};

const INIT_STATE: User = {
  token: "",
  name: "",
  id: "",
};

type Store = {
  user: User;
  setUser: (user: User) => void;
};

const useUser = create<Store>()(
  persist(
    (set) => ({
      user: INIT_STATE,
      setUser: (user) => set({ user }),
    }),
    {
      name: "user-storage",
    }
  )
);

export default useUser;
