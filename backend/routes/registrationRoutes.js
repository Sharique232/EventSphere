const express = require("express");

const {
    createRegistration,
    getRegistrations,
    getRegistrationsByUser,
    getRegistrationsByExpo,
    getRegistration,
    cancelRegistration,
    deleteRegistration
} = require("../controllers/registrationController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// =========================
// CREATE REGISTRATION
// Attendee
// =========================

router.post(
    "/",
    protect,
    authorizeRoles("attendee"),
    createRegistration
);


// =========================
// GET ALL REGISTRATIONS
// Admin + Organizer
// =========================

router.get(
    "/",
    protect,
    authorizeRoles("admin", "organizer"),
    getRegistrations
);


// =========================
// GET REGISTRATIONS BY USER
// Admin + Organizer + Attendee
// =========================

router.get(
    "/user/:userId",
    protect,
    getRegistrationsByUser
);


// =========================
// GET REGISTRATIONS BY EXPO
// Admin + Organizer
// =========================

router.get(
    "/expo/:expoId",
    protect,
    authorizeRoles("admin", "organizer"),
    getRegistrationsByExpo
);


// =========================
// GET SINGLE REGISTRATION
// Logged-in Users
// =========================

router.get(
    "/:id",
    protect,
    getRegistration
);


// =========================
// CANCEL REGISTRATION
// Attendee
// =========================

router.put(
    "/:id/cancel",
    protect,
    authorizeRoles("attendee"),
    cancelRegistration
);


// =========================
// DELETE REGISTRATION
// Admin + Organizer
// =========================

router.delete(
    "/:id",
    protect,
    authorizeRoles("admin", "organizer"),
    deleteRegistration
);


module.exports = router;