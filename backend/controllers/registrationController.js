const Registration = require("../models/Registration");

// =========================
// CREATE REGISTRATION
// =========================

const createRegistration = async (req, res) => {
    try {

        const {
            expo,
            session,
            registrationType
        } = req.body;

        // Logged-in user JWT token se milega
        const user = req.user.id;

        // Required fields
        if (!user || !expo || !registrationType) {
            return res.status(400).json({
                message: "User, expo and registration type are required"
            });
        }

        // Session registration ke liye session required hai
        if (
            registrationType === "session" &&
            !session
        ) {
            return res.status(400).json({
                message:
                    "Session is required for session registration"
            });
        }

        // Expo registration mein session nahi hona chahiye
        const registrationSession =
            registrationType === "session"
                ? session
                : null;

        // Check duplicate registration
        const existingRegistration =
            await Registration.findOne({
                user,
                expo,
                session: registrationSession,
                status: "registered"
            });

        if (existingRegistration) {
            return res.status(400).json({
                message: "User is already registered"
            });
        }

        // Create registration
        const registration =
            await Registration.create({
                user,
                expo,
                session: registrationSession,
                registrationType
            });

        res.status(201).json({
            message:
                "Registration created successfully",
            registration
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to create registration",
            error: error.message
        });

    }
};


// =========================
// GET ALL REGISTRATIONS
// =========================

const getRegistrations = async (req, res) => {
    try {

        const registrations =
            await Registration.find()
                .populate(
                    "user",
                    "name email role"
                )
                .populate(
                    "expo",
                    "title date location"
                )
                .populate(
                    "session",
                    "title speaker topic location date startTime endTime"
                )
                .sort({
                    createdAt: -1
                });

        res.status(200).json({
            message:
                "Registrations fetched successfully",

            count:
                registrations.length,

            registrations
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to fetch registrations",

            error:
                error.message
        });

    }
};


// =========================
// GET REGISTRATIONS BY USER
// =========================

const getRegistrationsByUser = async (req, res) => {
    try {

        const registrations =
            await Registration.find({
                user: req.params.userId
            })
                .populate(
                    "expo",
                    "title date location"
                )
                .populate(
                    "session",
                    "title speaker topic location date startTime endTime"
                )
                .sort({
                    createdAt: -1
                });

        res.status(200).json({
            message:
                "User registrations fetched successfully",

            count:
                registrations.length,

            registrations
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to fetch user registrations",

            error:
                error.message
        });

    }
};


// =========================
// GET REGISTRATIONS BY EXPO
// =========================

const getRegistrationsByExpo = async (req, res) => {
    try {

        const registrations =
            await Registration.find({
                expo: req.params.expoId
            })
                .populate(
                    "user",
                    "name email role"
                )
                .populate(
                    "session",
                    "title speaker topic location date startTime endTime"
                )
                .sort({
                    createdAt: -1
                });

        res.status(200).json({
            message:
                "Expo registrations fetched successfully",

            count:
                registrations.length,

            registrations
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to fetch expo registrations",

            error:
                error.message
        });

    }
};


// =========================
// GET SINGLE REGISTRATION
// =========================

const getRegistration = async (req, res) => {
    try {

        const registration =
            await Registration.findById(
                req.params.id
            )
                .populate(
                    "user",
                    "name email role"
                )
                .populate(
                    "expo",
                    "title date location"
                )
                .populate(
                    "session",
                    "title speaker topic location date startTime endTime"
                );

        if (!registration) {
            return res.status(404).json({
                message:
                    "Registration not found"
            });
        }

        res.status(200).json({
            message:
                "Registration fetched successfully",

            registration
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to fetch registration",

            error:
                error.message
        });

    }
};


// =========================
// CANCEL REGISTRATION
// =========================

const cancelRegistration = async (req, res) => {
    try {

        const registration =
            await Registration.findByIdAndUpdate(
                req.params.id,
                {
                    status: "cancelled"
                },
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!registration) {
            return res.status(404).json({
                message:
                    "Registration not found"
            });
        }

        res.status(200).json({
            message:
                "Registration cancelled successfully",

            registration
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to cancel registration",

            error:
                error.message
        });

    }
};


// =========================
// DELETE REGISTRATION
// =========================

const deleteRegistration = async (req, res) => {
    try {

        const registration =
            await Registration.findByIdAndDelete(
                req.params.id
            );

        if (!registration) {
            return res.status(404).json({
                message:
                    "Registration not found"
            });
        }

        res.status(200).json({
            message:
                "Registration deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to delete registration",

            error:
                error.message
        });

    }
};


// =========================
// EXPORT
// =========================

module.exports = {
    createRegistration,
    getRegistrations,
    getRegistrationsByUser,
    getRegistrationsByExpo,
    getRegistration,
    cancelRegistration,
    deleteRegistration
};
