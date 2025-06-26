import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// Add or update a reaction
export const addReaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;
    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ error: 'Message not found' });

    // Remove any previous reaction by this user for this emoji
    message.reactions = (message.reactions || []).filter(r => !(r.userId.equals(userId) && r.emoji === emoji));
    // Add new reaction
    message.reactions.push({ userId, emoji });
    await message.save();

    // Emit socket event to both sender and receiver
    const participants = [message.senderId, message.receiverId];
    participants.forEach(pid => {
      const socketId = getReceiverSocketId(pid.toString());
      if (socketId) {
        io.to(socketId).emit('messageReaction', { messageId: message._id, reactions: message.reactions });
      }
    });

    res.json({ reactions: message.reactions });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Remove a reaction
export const removeReaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;
    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ error: 'Message not found' });

    message.reactions = (message.reactions || []).filter(r => !(r.userId.equals(userId) && r.emoji === emoji));
    await message.save();

    // Emit socket event to both sender and receiver
    const participants = [message.senderId, message.receiverId];
    participants.forEach(pid => {
      const socketId = getReceiverSocketId(pid.toString());
      if (socketId) {
        io.to(socketId).emit('messageReaction', { messageId: message._id, reactions: message.reactions });
      }
    });

    res.json({ reactions: message.reactions });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
