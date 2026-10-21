const express = require("express");

const {
    createSession,
    getSessions,
    getSessionsByExpo,
    getSession,
    updateSession,
    deleteSession
} = require("../controllers/sessionController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// =========================
// CREATE SESSION
// Admin + Organizer
// =========================

router.post(
    "/",
    protect,
    authorizeRoles("admin", "organizer"),
    createSession
);


// =========================
// GET ALL SESSIONS
// Logged-in Users
// =========================

router.get(
    "/",
    protect,
    getSessions
);


// =========================
// GET SESSIONS BY EXPO
// Logged-in Users
// =========================

router.get(
    "/expo/:expoId",
    protect,
    getSessionsByExpo
);


// =========================
// GET SINGLE SESSION
// Logged-in Users
// =========================

router.get(
    "/:id",
    protect,
    getSession
);


// =========================
// UPDATE SESSION
// Admin + Organizer
// =========================

router.put(
    "/:id",
    protect,
    authorizeRoles("admin", "organizer"),
    updateSession
);


// =========================
// DELETE SESSION
// Admin + Organizer
// =========================

router.delete(
    "/:id",
    protect,
    authorizeRoles("admin", "organizer"),
    deleteSession
);


module.exports = router;