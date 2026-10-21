const Notification = require("../models/Notification");

// =========================
// CREATE NOTIFICATION
// =========================

const createNotification = async (req, res) => {
    try {
        const {
            user,
            expo,
            title,
            message,
            type
        } = req.body;

        if (!user || !title || !message) {
            return res.status(400).json({
                message: "User, title and message are required"
            });
        }

        const notification = await Notification.create({
            user,
            expo: expo || null,
            title,
            message,
            type: type || "general"
        });

        res.status(201).json({
            message: "Notification created successfully",
            notification
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create notification",
            error: error.message
        });
    }
};


// =========================
// GET USER NOTIFICATIONS
// =========================

const getNotificationsByUser = async (req, res) => {
    try {
        const notifications = await Notification.find({
            user: req.params.userId
        })
            .populate("expo", "title date location")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "User notifications fetched successfully",
            count: notifications.length,
            notifications
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch notifications",
            error: error.message
        });
    }
};


// =========================
// GET SINGLE NOTIFICATION
// =========================

const getNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(
            req.params.id
        )
            .populate("user", "name email role")
            .populate("expo", "title date location");

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        res.status(200).json({
            message: "Notification fetched successfully",
            notification
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch notification",
            error: error.message
        });
    }
};


// =========================
// MARK NOTIFICATION AS READ
// =========================

const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            {
                isRead: true
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        res.status(200).json({
            message: "Notification marked as read",
            notification
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to mark notification as read",
            error: error.message
        });
    }
};


// =========================
// DELETE NOTIFICATION
// =========================

const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(
            req.params.id
        );

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        res.status(200).json({
            message: "Notification deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete notification",
            error: error.message
        });
    }
};


module.exports = {
    createNotification,
    getNotificationsByUser,
    getNotification,
    markNotificationAsRead,
    deleteNotification
};