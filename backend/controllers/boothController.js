const Booth = require("../models/Booth");

// =========================
// CREATE BOOTH
// =========================

const createBooth = async (req, res) => {
    try {
        const {
            boothNumber,
            expo,
            exhibitor,
            size,
            status,
            price
        } = req.body;

        if (!boothNumber || !expo || !size || price === undefined) {
            return res.status(400).json({
                message: "Booth number, expo, size and price are required"
            });
        }

        const booth = await Booth.create({
            boothNumber,
            expo,
            exhibitor: exhibitor || null,
            size,
            status: status || "available",
            price
        });

        res.status(201).json({
            message: "Booth created successfully",
            booth
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create booth",
            error: error.message
        });
    }
};


// =========================
// GET ALL BOOTHS
// =========================

const getBooths = async (req, res) => {
    try {
        const booths = await Booth.find()
            .populate("expo", "title date location")
            .populate("exhibitor", "companyName status")
            .sort({ boothNumber: 1 });

        res.status(200).json({
            message: "Booths fetched successfully",
            count: booths.length,
            booths
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch booths",
            error: error.message
        });
    }
};


// =========================
// GET BOOTHS BY EXPO
// =========================

const getBoothsByExpo = async (req, res) => {
    try {
        const booths = await Booth.find({
            expo: req.params.expoId
        })
            .populate("exhibitor", "companyName status")
            .sort({ boothNumber: 1 });

        res.status(200).json({
            message: "Expo booths fetched successfully",
            count: booths.length,
            booths
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch expo booths",
            error: error.message
        });
    }
};


// =========================
// GET SINGLE BOOTH
// =========================

const getBooth = async (req, res) => {
    try {
        const booth = await Booth.findById(req.params.id)
            .populate("expo", "title date location")
            .populate("exhibitor", "companyName status");

        if (!booth) {
            return res.status(404).json({
                message: "Booth not found"
            });
        }

        res.status(200).json({
            message: "Booth fetched successfully",
            booth
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch booth",
            error: error.message
        });
    }
};


// =========================
// UPDATE BOOTH
// =========================

const updateBooth = async (req, res) => {
    try {
        const booth = await Booth.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )
            .populate("expo", "title date location")
            .populate("exhibitor", "companyName status");

        if (!booth) {
            return res.status(404).json({
                message: "Booth not found"
            });
        }

        res.status(200).json({
            message: "Booth updated successfully",
            booth
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update booth",
            error: error.message
        });
    }
};


// =========================
// DELETE BOOTH
// =========================

const deleteBooth = async (req, res) => {
    try {
        const booth = await Booth.findByIdAndDelete(req.params.id);

        if (!booth) {
            return res.status(404).json({
                message: "Booth not found"
            });
        }

        res.status(200).json({
            message: "Booth deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete booth",
            error: error.message
        });
    }
};


// =========================
// EXPORT
// =========================

module.exports = {
    createBooth,
    getBooths,
    getBoothsByExpo,
    getBooth,
    updateBooth,
    deleteBooth
};