import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    setSelectedUser: (selectedUser) => set({ selectedUser }),

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get('/message/users');
            console.log("[useChatStore] response from getUsers : ", res.data);
            set({ users: res.data });
        } catch (error) {
            console.log("[useChatStore] error while fetching users : ", error.message);
            toast.error("Error fetching users!");
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (targetUserId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/message/${targetUserId}`);
            console.log("[useChatStore] response from getMessages : ", res.data);
            set({ messages: res.data });
        } catch (error) {
            console.log("[useChatStore] error while fetching messages : ", error.message);
            toast.error("Error fetching messages!");
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (text, image) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/message/sendmessage/${selectedUser._id}`, {
                text,
                image
            });
            console.log("[useChatStore] response from sendMessage : ", res.data);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            console.log("[useChatStore] error while sending messages : ", error.message);
            toast.error("Error sending message!");
        }
    },

    subscribeToMessage: async () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        socket.on("newMessage", (data) => {
            if (data.senderId !== selectedUser._id) return;
            set({
                messages: [...get().messages, data]
            })
        });
    },

    unsubscribeToMessage: async () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },
}))