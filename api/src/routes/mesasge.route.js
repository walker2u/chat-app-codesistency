import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar, getMessagesForOneUser, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectedRoute, getUsersForSidebar);
router.get("/:id", protectedRoute, getMessagesForOneUser);
router.post("/sendmessage/:id", protectedRoute, sendMessage);

export default router;