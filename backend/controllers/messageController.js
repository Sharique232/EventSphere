const Message = require("../models/Message");

// =========================
// SEND MESSAGE
// =========================

const sendMessage = async (req, res) => {
    try {
        const {
            sender,
            receiver,
            expo,
            message
        } = req.body;

        if (!sender || !receiver || !message) {
            return res.status(400).json({
                message: "Sender, receiver and message are required"
            });
        }

        // Save message in MongoDB
        const newMessage = await Message.create({
            sender,
            receiver,
            expo: expo || null,
            message
        });

        // Get Socket.IO instance
        const io = req.app.get("io");

        // Send message to receiver in real-time
        if (io) {
            io.to(receiver.toString()).emit(
                "receiveMessage",
                {
                    _id: newMessage._id,
                    sender,
                    receiver,
                    expo: expo || null,
                    message,
                    isRead: false,
                    createdAt: newMessage.createdAt
                }
            );
        }

        res.status(201).json({
            message: "Message sent successfully",
            data: newMessage
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to send message",
            error: error.message
        });
    }
};


// =========================
// GET CONVERSATION
// =========================

const getConversation = async (req, res) => {
    try {
        const { user1, user2 } = req.params;

        const messages = await Message.find({
            $or: [
                {
                    sender: user1,
                    receiver: user2
                },
                {
                    sender: user2,
                    receiver: user1
                }
            ]
        })
            .populate("sender", "name email role")
            .populate("receiver", "name email role")
            .populate("expo", "title date location")
            .sort({ createdAt: 1 });

        res.status(200).json({
            message: "Conversation fetched successfully",
            count: messages.length,
            messages
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch conversation",
            error: error.message
        });
    }
};


// =========================
// GET SINGLE MESSAGE
// =========================

const getMessage = async (req, res) => {
    try {
        const message = await Message.findById(
            req.params.id
        )
            .populate("sender", "name email role")
            .populate("receiver", "name email role")
            .populate("expo", "title date location");

        if (!message) {
            return res.status(404).json({
                message: "Message not found"
            });
        }

        res.status(200).json({
            message: "Message fetched successfully",
            data: message
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch message",
            error: error.message
        });
    }
};


// =========================
// MARK MESSAGE AS READ
// =========================

const markMessageAsRead = async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(
            req.params.id,
            {
                isRead: true
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!message) {
            return res.status(404).json({
                message: "Message not found"
            });
        }

        res.status(200).json({
            message: "Message marked as read",
            data: message
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to mark message as read",
            error: error.message
        });
    }
};


// =========================
// DELETE MESSAGE
// =========================

const deleteMessage = async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(
            req.params.id
        );

        if (!message) {
            return res.status(404).json({
                message: "Message not found"
            });
        }

        res.status(200).json({
            message: "Message deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete message",
            error: error.message
        });
    }
};


// =========================
// EXPORTS
// =========================

module.exports = {
    sendMessage,
    getConversation,
    getMessage,
    markMessageAsRead,
    deleteMessage
};