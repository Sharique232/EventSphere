const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        expo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Expo",
            required: true
        },

        type: {
            type: String,
            enum: ["feedback", "support"],
            required: true
        },

        subject: {
            type: String,
            required: true,
            trim: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        rating: {
            type: Number,
            min: 1,
            max: 5,
            default: null
        },

        status: {
            type: String,
            enum: ["pending", "in-progress", "resolved"],
            default: "pending"
        },

        adminReply: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Feedback", feedbackSchema);