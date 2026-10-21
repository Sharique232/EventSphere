const express = require("express");

const {
    createBooth,
    getBooths,
    getBoothsByExpo,
    getBooth,
    updateBooth,
    deleteBooth
} = require("../controllers/boothController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// CREATE BOOTH
// Admin + Organizer
router.post(
    "/",
    protect,
    authorizeRoles("admin", "organizer"),
    createBooth
);

// GET ALL BOOTHS
// Logged-in users
router.get(
    "/",
    protect,
    getBooths
);

// GET BOOTHS BY EXPO
// Logged-in users
router.get(
    "/expo/:expoId",
    protect,
    getBoothsByExpo
);

// GET SINGLE BOOTH
// Logged-in users
router.get(
    "/:id",
    protect,
    getBooth
);

// UPDATE BOOTH
// Admin + Organizer
router.put(
    "/:id",
    protect,
    authorizeRoles("admin", "organizer"),
    updateBooth
);

// DELETE BOOTH
// Admin + Organizer
router.delete(
    "/:id",
    protect,
    authorizeRoles("admin", "organizer"),
    deleteBooth
);

module.exports = router;