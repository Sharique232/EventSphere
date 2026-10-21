const express = require("express");

const {
    createBookmark,
    getBookmarksByUser,
    getBookmark,
    deleteBookmark
} = require("../controllers/bookmarkController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// CREATE BOOKMARK
router.post(
    "/",
    protect,
    authorizeRoles("attendee"),
    createBookmark
);


// GET USER BOOKMARKS
router.get(
    "/user/:userId",
    protect,
    authorizeRoles("attendee"),
    getBookmarksByUser
);


// GET SINGLE BOOKMARK
router.get(
    "/:id",
    protect,
    authorizeRoles("attendee"),
    getBookmark
);


// DELETE BOOKMARK
router.delete(
    "/:id",
    protect,
    authorizeRoles("attendee"),
    deleteBookmark
);


module.exports = router;