const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
    {
        expo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Expo",
            required: true
        },

        totalAttendees: {
            type: Number,
            default: 0
        },

        totalExhibitors: {
            type: Number,
            default: 0
        },

        totalRegistrations: {
            type: Number,
            default: 0
        },

        totalBooths: {
            type: Number,
            default: 0
        },

        occupiedBooths: {
            type: Number,
            default: 0
        },

        totalSessions: {
            type: Number,
            default: 0
        },

        totalBookmarks: {
            type: Number,
            default: 0
        },

        totalFeedbacks: {
            type: Number,
            default: 0
        },

        averageRating: {
            type: Number,
            default: 0
        },

        boothTraffic: {
            type: Number,
            default: 0
        },

        sessionPopularity: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Analytics", analyticsSchema);