import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js"
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isSigningIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const response = await axiosInstance.post("/auth/check");
            console.log("[useAuthStore] checkAuth response", response);
            set({ authUser: response.data });
        } catch (error) {
            console.log("Error in useAuthStore! ", error.message);
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const response = await axiosInstance.post("/auth/signup", {
                fullname: data.fullName,
                email: data.email,
                password: data.password,
                profilePic: "none"
            });
            set({ authUser: response.data });
            toast.success("Signup Successfull!");
            console.log("[useAuthStore] signup response", response);
        } catch (error) {
            console.log("Error in sigup ,", error.message);
            set({ authUser: null });
        } finally {
            set({ isSigningUp: false });
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Succesfully logged out!");
            get().disconnectSocket();
        } catch (error) {
            toast.error("Something Bad Happened!");
            console.log("[useAuthStore] error in useAuthStore : ", error.message);
        }
    },
    login: async (data) => {
        set({ isSigningIn: true })
        try {
            const res = await axiosInstance.post("/auth/login", {
                email: data.email,
                password: data.password
            });
            set({ authUser: res.data });
            toast.success("Login Successfull!");
            console.log("[useAuthStore] login response", res);
            get().connectSocket();
        } catch (error) {
            toast.error("Something Bad Happened!");
            console.log("[useAuthStore] error while login ,", error.message);
        } finally {
            set({ isSigningIn: false })
        }
    },
    updateProfile: async (base64) => {
        set({ isUpdatingProfile: true })
        try {
            const res = await axiosInstance.put("/auth/updateProfile", {
                profilePic: base64
            });

            set({ authUser: res.data });
            toast.success("Successfully updated Profile!");
            console.log("[useAuthStore] updateProfile response", res);
        } catch (error) {
            toast.error("Something Bad Happened!");
            console.log("[useAuthStore] error while updateProfile ,", error.message);
        } finally {
            set({ isUpdatingProfile: false })
        }
    },
    connectSocket: async () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected()) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            }
        });
        socket.connect();
        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds })
        })
    },
    disconnectSocket: async () => {

        get().socket?.disconnect();
    },
}));