import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js"

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isSigningIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const response = await axiosInstance.post("/auth/check");
            console.log(response);
            set({ authUser: response });
        } catch (error) {
            console.log("Error in useAuthStore! ", error.message);
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    signup: async (data) => {
        try {
            const response = await axiosInstance.post("/auth/signup", {
                fullname: data.fullName,
                email: data.email,
                password: data.password,
                profilePic: "grfg"
            });
            console.log(response);
        } catch (error) {
            console.log("Error in sigup ,", error.message);
            set({ authUser: null });
        } finally {
            set({ isSigningUp: false });
        }
    },
}));