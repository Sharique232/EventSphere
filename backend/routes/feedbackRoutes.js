const express = require("express");

const {
    createFeedback,
    getFeedbacks,
    getFeedbacksByUser,
    getFeedback,
    updateFeedback,
    deleteFeedback
} = require("../controllers/feedbackController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// CREATE FEEDBACK / SUPPORT
router.post(
    "/",
    protect,
    authorizeRoles("attendee", "exhibitor"),
    createFeedback
);


// GET ALL FEEDBACK
router.get(
    "/",
    protect,
    authorizeRoles("admin", "organizer"),
    getFeedbacks
);


// GET USER FEEDBACK
router.get(
    "/user/:userId",
    protect,
    getFeedbacksByUser
);


// GET SINGLE FEEDBACK
router.get(
    "/:id",
    protect,
    getFeedback
);


// UPDATE FEEDBACK
router.put(
    "/:id",
    protect,
    authorizeRoles("admin", "organizer"),
    updateFeedback
);


// DELETE FEEDBACK
router.delete(
    "/:id",
    protect,
    authorizeRoles("admin", "organizer"),
    deleteFeedback
);


module.exports = router;