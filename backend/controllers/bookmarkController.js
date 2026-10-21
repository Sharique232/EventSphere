const Bookmark = require("../models/Bookmark");

// =========================
// CREATE BOOKMARK
// =========================

const createBookmark = async (req, res) => {
    try {
        const { user, expo, session } = req.body;

        if (!user || !expo || !session) {
            return res.status(400).json({
                message: "User, expo and session are required"
            });
        }

        // Check duplicate bookmark
        const existingBookmark = await Bookmark.findOne({
            user,
            session
        });

        if (existingBookmark) {
            return res.status(400).json({
                message: "Session already bookmarked"
            });
        }

        const bookmark = await Bookmark.create({
            user,
            expo,
            session
        });

        res.status(201).json({
            message: "Session bookmarked successfully",
            bookmark
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create bookmark",
            error: error.message
        });
    }
};


// =========================
// GET USER BOOKMARKS
// =========================

const getBookmarksByUser = async (req, res) => {
    try {
        const bookmarks = await Bookmark.find({
            user: req.params.userId
        })
            .populate("expo", "title date location")
            .populate(
                "session",
                "title speaker topic location date startTime endTime"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "User bookmarks fetched successfully",
            count: bookmarks.length,
            bookmarks
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch bookmarks",
            error: error.message
        });
    }
};


// =========================
// GET SINGLE BOOKMARK
// =========================

const getBookmark = async (req, res) => {
    try {
        const bookmark = await Bookmark.findById(
            req.params.id
        )
            .populate("user", "name email role")
            .populate("expo", "title date location")
            .populate(
                "session",
                "title speaker topic location date startTime endTime"
            );

        if (!bookmark) {
            return res.status(404).json({
                message: "Bookmark not found"
            });
        }

        res.status(200).json({
            message: "Bookmark fetched successfully",
            bookmark
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch bookmark",
            error: error.message
        });
    }
};


// =========================
// DELETE BOOKMARK
// =========================

const deleteBookmark = async (req, res) => {
    try {
        const bookmark = await Bookmark.findByIdAndDelete(
            req.params.id
        );

        if (!bookmark) {
            return res.status(404).json({
                message: "Bookmark not found"
            });
        }

        res.status(200).json({
            message: "Bookmark removed successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to remove bookmark",
            error: error.message
        });
    }
};


module.exports = {
    createBookmark,
    getBookmarksByUser,
    getBookmark,
    deleteBookmark
};