import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

export const useChatStore = create((set) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

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
            set({ users: res.data });
        } catch (error) {
            console.log("[useChatStore] error while fetching messages : ", error.message);
            toast.error("Error fetching messages!");
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (targetUserId, text, image) => {
        try {
            const res = await axiosInstance.post(`/message/sendmessage/${targetUserId}`, {
                text,
                image
            });
            console.log("[useChatStore] response from sendMessage : ", res.data);
            set({ users: res.data });
        } catch (error) {
            console.log("[useChatStore] error while sending messages : ", error.message);
            toast.error("Error sending message!");
        }
    },
}))