const Session = require("../models/Session");

// =========================
// CREATE SESSION
// =========================

const createSession = async (req, res) => {
    try {
        const {
            expo,
            title,
            speaker,
            topic,
            location,
            date,
            startTime,
            endTime,
            description
        } = req.body;

        if (
            !expo ||
            !title ||
            !speaker ||
            !topic ||
            !location ||
            !date ||
            !startTime ||
            !endTime ||
            !description
        ) {
            return res.status(400).json({
                message: "All session fields are required"
            });
        }

        const session = await Session.create({
            expo,
            title,
            speaker,
            topic,
            location,
            date,
            startTime,
            endTime,
            description
        });

        res.status(201).json({
            message: "Session created successfully",
            session
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create session",
            error: error.message
        });
    }
};


// =========================
// GET ALL SESSIONS
// =========================

const getSessions = async (req, res) => {
    try {
        const sessions = await Session.find()
            .populate("expo", "title date location")
            .sort({ date: 1, startTime: 1 });

        res.status(200).json({
            message: "Sessions fetched successfully",
            count: sessions.length,
            sessions
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch sessions",
            error: error.message
        });
    }
};


// =========================
// GET SESSIONS BY EXPO
// =========================

const getSessionsByExpo = async (req, res) => {
    try {
        const sessions = await Session.find({
            expo: req.params.expoId
        })
            .populate("expo", "title date location")
            .sort({ date: 1, startTime: 1 });

        res.status(200).json({
            message: "Expo sessions fetched successfully",
            count: sessions.length,
            sessions
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch expo sessions",
            error: error.message
        });
    }
};


// =========================
// GET SINGLE SESSION
// =========================

const getSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)
            .populate("expo", "title date location");

        if (!session) {
            return res.status(404).json({
                message: "Session not found"
            });
        }

        res.status(200).json({
            message: "Session fetched successfully",
            session
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch session",
            error: error.message
        });
    }
};


// =========================
// UPDATE SESSION
// =========================

const updateSession = async (req, res) => {
    try {
        const session = await Session.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )
            .populate("expo", "title date location");

        if (!session) {
            return res.status(404).json({
                message: "Session not found"
            });
        }

        res.status(200).json({
            message: "Session updated successfully",
            session
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update session",
            error: error.message
        });
    }
};


// =========================
// DELETE SESSION
// =========================

const deleteSession = async (req, res) => {
    try {
        const session = await Session.findByIdAndDelete(
            req.params.id
        );

        if (!session) {
            return res.status(404).json({
                message: "Session not found"
            });
        }

        res.status(200).json({
            message: "Session deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete session",
            error: error.message
        });
    }
};


// =========================
// EXPORT
// =========================

module.exports = {
    createSession,
    getSessions,
    getSessionsByExpo,
    getSession,
    updateSession,
    deleteSession
};