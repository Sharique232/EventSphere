const Exhibitor = require("../models/Exhibitor");

// =========================
// CREATE EXHIBITOR
// =========================

const createExhibitor = async (req, res) => {
    try {
        const {
            user,
            expo,
            companyName,
            companyDescription,
            productsServices,
            documents
        } = req.body;

        if (
            !user ||
            !expo ||
            !companyName ||
            !companyDescription ||
            !productsServices
        ) {
            return res.status(400).json({
                message: "User, expo, company name, description and products/services are required"
            });
        }

        const exhibitor = await Exhibitor.create({
            user,
            expo,
            companyName,
            companyDescription,
            productsServices,
            documents: documents || []
        });

        res.status(201).json({
            message: "Exhibitor created successfully",
            exhibitor
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create exhibitor",
            error: error.message
        });
    }
};


// =========================
// GET ALL EXHIBITORS
// =========================

const getExhibitors = async (req, res) => {
    try {
        const exhibitors = await Exhibitor.find()
            .populate("user", "name email role")
            .populate("expo", "title date location")
            .populate("booth", "boothNumber size status price")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Exhibitors fetched successfully",
            count: exhibitors.length,
            exhibitors
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch exhibitors",
            error: error.message
        });
    }
};


// =========================
// GET EXHIBITORS BY EXPO
// =========================

const getExhibitorsByExpo = async (req, res) => {
    try {
        const exhibitors = await Exhibitor.find({
            expo: req.params.expoId
        })
            .populate("user", "name email role")
            .populate("booth", "boothNumber size status price")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Expo exhibitors fetched successfully",
            count: exhibitors.length,
            exhibitors
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch expo exhibitors",
            error: error.message
        });
    }
};


// =========================
// GET SINGLE EXHIBITOR
// =========================

const getExhibitor = async (req, res) => {
    try {
        const exhibitor = await Exhibitor.findById(req.params.id)
            .populate("user", "name email role")
            .populate("expo", "title date location")
            .populate("booth", "boothNumber size status price");

        if (!exhibitor) {
            return res.status(404).json({
                message: "Exhibitor not found"
            });
        }

        res.status(200).json({
            message: "Exhibitor fetched successfully",
            exhibitor
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch exhibitor",
            error: error.message
        });
    }
};


// =========================
// UPDATE EXHIBITOR
// =========================

const updateExhibitor = async (req, res) => {
    try {
        const exhibitor = await Exhibitor.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!exhibitor) {
            return res.status(404).json({
                message: "Exhibitor not found"
            });
        }

        res.status(200).json({
            message: "Exhibitor updated successfully",
            exhibitor
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update exhibitor",
            error: error.message
        });
    }
};


// =========================
// APPROVE EXHIBITOR
// =========================

const approveExhibitor = async (req, res) => {
    try {
        const exhibitor = await Exhibitor.findByIdAndUpdate(
            req.params.id,
            {
                status: "approved"
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!exhibitor) {
            return res.status(404).json({
                message: "Exhibitor not found"
            });
        }

        res.status(200).json({
            message: "Exhibitor approved successfully",
            exhibitor
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to approve exhibitor",
            error: error.message
        });
    }
};


// =========================
// REJECT EXHIBITOR
// =========================

const rejectExhibitor = async (req, res) => {
    try {
        const exhibitor = await Exhibitor.findByIdAndUpdate(
            req.params.id,
            {
                status: "rejected"
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!exhibitor) {
            return res.status(404).json({
                message: "Exhibitor not found"
            });
        }

        res.status(200).json({
            message: "Exhibitor rejected successfully",
            exhibitor
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to reject exhibitor",
            error: error.message
        });
    }
};


// =========================
// DELETE EXHIBITOR
// =========================

const deleteExhibitor = async (req, res) => {
    try {
        const exhibitor = await Exhibitor.findByIdAndDelete(req.params.id);

        if (!exhibitor) {
            return res.status(404).json({
                message: "Exhibitor not found"
            });
        }

        res.status(200).json({
            message: "Exhibitor deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete exhibitor",
            error: error.message
        });
    }
};


module.exports = {
    createExhibitor,
    getExhibitors,
    getExhibitorsByExpo,
    getExhibitor,
    updateExhibitor,
    approveExhibitor,
    rejectExhibitor,
    deleteExhibitor
};