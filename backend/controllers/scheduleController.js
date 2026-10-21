const Schedule = require("../models/Schedule");

// =========================
// CREATE SCHEDULE
// =========================

const createSchedule = async (req, res) => {
    try {
        const {
            expo,
            title,
            date,
            startTime,
            endTime,
            location,
            description
        } = req.body;

        if (
            !expo ||
            !title ||
            !date ||
            !startTime ||
            !endTime ||
            !location ||
            !description
        ) {
            return res.status(400).json({
                message: "All schedule fields are required"
            });
        }

        const schedule = await Schedule.create({
            expo,
            title,
            date,
            startTime,
            endTime,
            location,
            description
        });

        res.status(201).json({
            message: "Schedule created successfully",
            schedule
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create schedule",
            error: error.message
        });
    }
};


// =========================
// GET ALL SCHEDULES
// =========================

const getSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find()
            .populate("expo", "title date location")
            .sort({ date: 1, startTime: 1 });

        res.status(200).json({
            message: "Schedules fetched successfully",
            count: schedules.length,
            schedules
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch schedules",
            error: error.message
        });
    }
};


// =========================
// GET SCHEDULES BY EXPO
// =========================

const getSchedulesByExpo = async (req, res) => {
    try {
        const schedules = await Schedule.find({
            expo: req.params.expoId
        })
            .populate("expo", "title date location")
            .sort({ date: 1, startTime: 1 });

        res.status(200).json({
            message: "Expo schedules fetched successfully",
            count: schedules.length,
            schedules
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch expo schedules",
            error: error.message
        });
    }
};


// =========================
// GET SINGLE SCHEDULE
// =========================

const getSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id)
            .populate("expo", "title date location");

        if (!schedule) {
            return res.status(404).json({
                message: "Schedule not found"
            });
        }

        res.status(200).json({
            message: "Schedule fetched successfully",
            schedule
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch schedule",
            error: error.message
        });
    }
};


// =========================
// UPDATE SCHEDULE
// =========================

const updateSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )
            .populate("expo", "title date location");

        if (!schedule) {
            return res.status(404).json({
                message: "Schedule not found"
            });
        }

        res.status(200).json({
            message: "Schedule updated successfully",
            schedule
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update schedule",
            error: error.message
        });
    }
};


// =========================
// DELETE SCHEDULE
// =========================

const deleteSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findByIdAndDelete(
            req.params.id
        );

        if (!schedule) {
            return res.status(404).json({
                message: "Schedule not found"
            });
        }

        res.status(200).json({
            message: "Schedule deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete schedule",
            error: error.message
        });
    }
};


// =========================
// EXPORT
// =========================

module.exports = {
    createSchedule,
    getSchedules,
    getSchedulesByExpo,
    getSchedule,
    updateSchedule,
    deleteSchedule
};