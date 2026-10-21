const mongoose = require("mongoose");

const boothSchema = new mongoose.Schema(
    {
        boothNumber: {
            type: String,
            required: true,
            trim: true
        },

        expo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Expo",
            required: true
        },

        exhibitor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exhibitor",
            default: null
        },

        size: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["available", "reserved", "occupied"],
            default: "available"
        },

        price: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Booth", boothSchema);