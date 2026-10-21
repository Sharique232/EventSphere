const Feedback = require("../models/Feedback");

// =========================
// CREATE FEEDBACK / SUPPORT
// =========================

const createFeedback = async (req, res) => {
    try {
        const {
            user,
            expo,
            type,
            subject,
            message,
            rating
        } = req.body;

        if (!user || !expo || !type || !subject || !message) {
            return res.status(400).json({
                message: "User, expo, type, subject and message are required"
            });
        }

        if (type === "feedback" && rating !== undefined) {
            if (rating < 1 || rating > 5) {
                return res.status(400).json({
                    message: "Rating must be between 1 and 5"
                });
            }
        }

        const feedback = await Feedback.create({
            user,
            expo,
            type,
            subject,
            message,
            rating: type === "feedback" ? rating || null : null
        });

        res.status(201).json({
            message: "Feedback created successfully",
            feedback
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create feedback",
            error: error.message
        });
    }
};


// =========================
// GET ALL FEEDBACK
// =========================

const getFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .populate("user", "name email role")
            .populate("expo", "title date location")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Feedback fetched successfully",
            count: feedbacks.length,
            feedbacks
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch feedback",
            error: error.message
        });
    }
};


// =========================
// GET USER FEEDBACK
// =========================

const getFeedbacksByUser = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({
            user: req.params.userId
        })
            .populate("expo", "title date location")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "User feedback fetched successfully",
            count: feedbacks.length,
            feedbacks
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch user feedback",
            error: error.message
        });
    }
};


// =========================
// GET SINGLE FEEDBACK
// =========================

const getFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findById(
            req.params.id
        )
            .populate("user", "name email role")
            .populate("expo", "title date location");

        if (!feedback) {
            return res.status(404).json({
                message: "Feedback not found"
            });
        }

        res.status(200).json({
            message: "Feedback fetched successfully",
            feedback
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch feedback",
            error: error.message
        });
    }
};


// =========================
// UPDATE FEEDBACK STATUS
// =========================

const updateFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!feedback) {
            return res.status(404).json({
                message: "Feedback not found"
            });
        }

        res.status(200).json({
            message: "Feedback updated successfully",
            feedback
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update feedback",
            error: error.message
        });
    }
};


// =========================
// DELETE FEEDBACK
// =========================

const deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(
            req.params.id
        );

        if (!feedback) {
            return res.status(404).json({
                message: "Feedback not found"
            });
        }

        res.status(200).json({
            message: "Feedback deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete feedback",
            error: error.message
        });
    }
};


module.exports = {
    createFeedback,
    getFeedbacks,
    getFeedbacksByUser,
    getFeedback,
    updateFeedback,
    deleteFeedback
};