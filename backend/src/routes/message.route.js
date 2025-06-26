import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage, markMessagesAsRead, deleteMessage, searchMessages } from "../controllers/message.controller.js";
import { addReaction, removeReaction } from "../controllers/reaction.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);
router.post("/read/:id", protectRoute, markMessagesAsRead);



// Reaction routes

// Search messages
router.get("/:id/search", protectRoute, searchMessages);

router.post("/:id/reactions", protectRoute, addReaction);
router.delete("/:id/reactions", protectRoute, removeReaction);

// Xóa tin nhắn
router.delete("/delete/:id", protectRoute, deleteMessage);

export default router;
