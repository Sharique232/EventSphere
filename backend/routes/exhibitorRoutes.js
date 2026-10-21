const express = require("express");

const {
    createExhibitor,
    getExhibitors,
    getExhibitorsByExpo,
    getExhibitor,
    updateExhibitor,
    approveExhibitor,
    rejectExhibitor,
    deleteExhibitor
} = require("../controllers/exhibitorController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// =========================
// CREATE EXHIBITOR
// =========================
// Admin + Organizer + Exhibitor
router.post(
    "/",
    protect,
    authorizeRoles("admin", "organizer", "exhibitor"),
    createExhibitor
);


// =========================
// GET ALL EXHIBITORS
// =========================
// Admin + Organizer
router.get(
    "/",
    protect,
    authorizeRoles("admin", "organizer"),
    getExhibitors
);


// =========================
// GET EXHIBITORS BY EXPO
// =========================
// Logged-in users
router.get(
    "/expo/:expoId",
    protect,
    getExhibitorsByExpo
);


// =========================
// GET SINGLE EXHIBITOR
// =========================
// Logged-in users
router.get(
    "/:id",
    protect,
    getExhibitor
);


// =========================
// UPDATE EXHIBITOR
// =========================
// Admin + Organizer + Exhibitor
router.put(
    "/:id",
    protect,
    authorizeRoles("admin", "organizer", "exhibitor"),
    updateExhibitor
);


// =========================
// APPROVE EXHIBITOR
// =========================
// Admin + Organizer
router.put(
    "/:id/approve",
    protect,
    authorizeRoles("admin", "organizer"),
    approveExhibitor
);


// =========================
// REJECT EXHIBITOR
// =========================
// Admin + Organizer
router.put(
    "/:id/reject",
    protect,
    authorizeRoles("admin", "organizer"),
    rejectExhibitor
);


// =========================
// DELETE EXHIBITOR
// =========================
// Admin + Organizer
router.delete(
    "/:id",
    protect,
    authorizeRoles("admin", "organizer"),
    deleteExhibitor
);


module.exports = router;