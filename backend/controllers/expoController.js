const Expo = require("../models/Expo");

// =========================
// CREATE EXPO
// =========================

const createExpo = async (req, res) => {
    try {
        const { title, date, location, description, theme } = req.body;

        if (!title || !date || !location || !description || !theme) {
            return res.status(400).json({
                message: "All expo fields are required"
            });
        }

        const expo = await Expo.create({
            title,
            date,
            location,
            description,
            theme
        });

        res.status(201).json({
            message: "Expo created successfully",
            expo
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create expo",
            error: error.message
        });
    }
};


// =========================
// GET ALL EXPOS
// =========================

const getExpos = async (req, res) => {
    try {
        const expos = await Expo.find().sort({ date: 1 });

        res.status(200).json({
            message: "Expos fetched successfully",
            count: expos.length,
            expos
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch expos",
            error: error.message
        });
    }
};


// =========================
// GET SINGLE EXPO
// =========================

const getExpo = async (req, res) => {
    try {
        const expo = await Expo.findById(req.params.id);

        if (!expo) {
            return res.status(404).json({
                message: "Expo not found"
            });
        }

        res.status(200).json({
            message: "Expo fetched successfully",
            expo
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch expo",
            error: error.message
        });
    }
};


// =========================
// UPDATE EXPO
// =========================

const updateExpo = async (req, res) => {
    try {
        const expo = await Expo.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!expo) {
            return res.status(404).json({
                message: "Expo not found"
            });
        }

        res.status(200).json({
            message: "Expo updated successfully",
            expo
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update expo",
            error: error.message
        });
    }
};


// =========================
// DELETE EXPO
// =========================

const deleteExpo = async (req, res) => {
    try {
        const expo = await Expo.findByIdAndDelete(req.params.id);

        if (!expo) {
            return res.status(404).json({
                message: "Expo not found"
            });
        }

        res.status(200).json({
            message: "Expo deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete expo",
            error: error.message
        });
    }
};


module.exports = {
    createExpo,
    getExpos,
    getExpo,
    updateExpo,
    deleteExpo
};