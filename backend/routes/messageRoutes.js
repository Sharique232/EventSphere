const express = require("express");

const {
    sendMessage,
    getConversation,
    getMessage,
    markMessageAsRead,
    deleteMessage
} = require("../controllers/messageController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// SEND MESSAGE
router.post(
    "/",
    protect,
    sendMessage
);


// GET CONVERSATION
router.get(
    "/conversation/:user1/:user2",
    protect,
    getConversation
);


// GET SINGLE MESSAGE
router.get(
    "/:id",
    protect,
    getMessage
);


// MARK MESSAGE AS READ
router.put(
    "/:id/read",
    protect,
    markMessageAsRead
);


// DELETE MESSAGE
router.delete(
    "/:id",
    protect,
    deleteMessage
);


module.exports = router;