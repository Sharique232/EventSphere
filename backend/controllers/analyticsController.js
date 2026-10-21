const Analytics = require("../models/Analytics");
const Registration = require("../models/Registration");
const Exhibitor = require("../models/Exhibitor");
const Booth = require("../models/Booth");
const Session = require("../models/Session");
const Bookmark = require("../models/Bookmark");
const Feedback = require("../models/Feedback");
const User = require("../models/User");

// GET EXPO ANALYTICS
const getExpoAnalytics = async (req, res) => {
    try {
        const { expoId } = req.params;

        const totalAttendees = await User.countDocuments({
            role: "attendee"
        });

        const totalExhibitors = await Exhibitor.countDocuments({
            expo: expoId
        });

        const totalRegistrations = await Registration.countDocuments({
            expo: expoId
        });

        const totalBooths = await Booth.countDocuments({
            expo: expoId
        });

        const occupiedBooths = await Booth.countDocuments({
            expo: expoId,
            status: "occupied"
        });

        const totalSessions = await Session.countDocuments({
            expo: expoId
        });

        const totalBookmarks = await Bookmark.countDocuments({
            expo: expoId
        });

        const totalFeedbacks = await Feedback.countDocuments({
            expo: expoId
        });

        const feedbacks = await Feedback.find({
            expo: expoId,
            type: "feedback",
            rating: { $ne: null }
        });

        let averageRating = 0;

        if (feedbacks.length > 0) {
            const totalRating = feedbacks.reduce(
                (sum, feedback) => sum + feedback.rating,
                0
            );

            averageRating = totalRating / feedbacks.length;
            averageRating = Number(averageRating.toFixed(2));
        }

        const analytics = {
            expo: expoId,
            totalAttendees,
            totalExhibitors,
            totalRegistrations,
            totalBooths,
            occupiedBooths,
            totalSessions,
            totalBookmarks,
            totalFeedbacks,
            averageRating
        };

        res.status(200).json({
            message: "Expo analytics fetched successfully",
            analytics
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch expo analytics",
            error: error.message
        });
    }
};

module.exports = {
    getExpoAnalytics
};