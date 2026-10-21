const express = require("express");

const {
    createNotification,
    getNotificationsByUser,
    getNotification,
    markNotificationAsRead,
    deleteNotification
} = require("../controllers/notificationController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// CREATE NOTIFICATION
router.post(
    "/",
    protect,
    authorizeRoles("admin", "organizer"),
    createNotification
);


// GET USER NOTIFICATIONS
router.get(
    "/user/:userId",
    protect,
    getNotificationsByUser
);


// GET SINGLE NOTIFICATION
router.get(
    "/:id",
    protect,
    getNotification
);


// MARK NOTIFICATION AS READ
router.put(
    "/:id/read",
    protect,
    markNotificationAsRead
);


// DELETE NOTIFICATION
router.delete(
    "/:id",
    protect,
    deleteNotification
);


module.exports = router;