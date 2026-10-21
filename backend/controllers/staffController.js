const Staff = require("../models/Staff");

// CREATE STAFF
const createStaff = async (req, res) => {
    try {
        const {
            exhibitor,
            name,
            email,
            phone,
            designation
        } = req.body;

        if (!exhibitor || !name || !email || !phone || !designation) {
            return res.status(400).json({
                message: "Exhibitor, name, email, phone and designation are required"
            });
        }

        const staff = await Staff.create({
            exhibitor,
            name,
            email,
            phone,
            designation
        });

        res.status(201).json({
            message: "Staff created successfully",
            staff
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create staff",
            error: error.message
        });
    }
};

// GET ALL STAFF
const getStaff = async (req, res) => {
    try {
        const staff = await Staff.find()
            .populate(
                "exhibitor",
                "companyName companyDescription status"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Staff fetched successfully",
            count: staff.length,
            staff
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch staff",
            error: error.message
        });
    }
};

// GET STAFF BY EXHIBITOR
const getStaffByExhibitor = async (req, res) => {
    try {
        const staff = await Staff.find({
            exhibitor: req.params.exhibitorId
        })
            .populate(
                "exhibitor",
                "companyName companyDescription status"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Exhibitor staff fetched successfully",
            count: staff.length,
            staff
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch exhibitor staff",
            error: error.message
        });
    }
};

// GET SINGLE STAFF
const getSingleStaff = async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id)
            .populate(
                "exhibitor",
                "companyName companyDescription status"
            );

        if (!staff) {
            return res.status(404).json({
                message: "Staff not found"
            });
        }

        res.status(200).json({
            message: "Staff fetched successfully",
            staff
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch staff",
            error: error.message
        });
    }
};

// UPDATE STAFF
const updateStaff = async (req, res) => {
    try {
        const staff = await Staff.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!staff) {
            return res.status(404).json({
                message: "Staff not found"
            });
        }

        res.status(200).json({
            message: "Staff updated successfully",
            staff
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update staff",
            error: error.message
        });
    }
};

// DELETE STAFF
const deleteStaff = async (req, res) => {
    try {
        const staff = await Staff.findByIdAndDelete(
            req.params.id
        );

        if (!staff) {
            return res.status(404).json({
                message: "Staff not found"
            });
        }

        res.status(200).json({
            message: "Staff deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete staff",
            error: error.message
        });
    }
};

module.exports = {
    createStaff,
    getStaff,
    getStaffByExhibitor,
    getSingleStaff,
    updateStaff,
    deleteStaff
};