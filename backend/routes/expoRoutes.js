const express = require("express");

const {
    createExpo,
    getExpos,
    getExpo,
    updateExpo,
    deleteExpo
} = require("../controllers/expoController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// CREATE EXPO
// Admin + Organizer
router.post(
    "/",
    protect,
    authorizeRoles("admin", "organizer"),
    createExpo
);

// GET ALL EXPOS
// Logged-in users
router.get(
    "/",
    protect,
    getExpos
);

// GET SINGLE EXPO
// Logged-in users
router.get(
    "/:id",
    protect,
    getExpo
);

// UPDATE EXPO
// Admin + Organizer
router.put(
    "/:id",
    protect,
    authorizeRoles("admin", "organizer"),
    updateExpo
);

// DELETE EXPO
// Admin + Organizer
router.delete(
    "/:id",
    protect,
    authorizeRoles("admin", "organizer"),
    deleteExpo
);

module.exports = router;