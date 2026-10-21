const mongoose = require("mongoose");

const exhibitorSchema = new mongoose.Schema(
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

        companyName: {
            type: String,
            required: true,
            trim: true
        },

        companyDescription: {
            type: String,
            required: true,
            trim: true
        },

        productsServices: {
            type: String,
            required: true,
            trim: true
        },

        documents: {
            type: [String],
            default: []
        },

        booth: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booth",
            default: null
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Exhibitor", exhibitorSchema);