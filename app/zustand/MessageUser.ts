import { create } from "zustand";
import { useRouter } from "next/router";

type UserMessage = {
  id: string;
  name: string;
  email: string;
};

type MessageDetailStore = {
  selectedUser: UserMessage | null;
  setSelectedUser: (user: UserMessage) => void;
  clearSelectedUser: () => void;
  goToMessageDetail: (
    user: UserMessage,
    router: ReturnType<typeof useRouter>
  ) => void;
};

export const useMessageDetailStore = create<MessageDetailStore>((set) => ({
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
  clearSelectedUser: () => set({ selectedUser: null }),

  goToMessageDetail: (user, router) => {
    set({ selectedUser: user });
    router.push(`/messagedetail?id=${user.id}`);
  },
}));
