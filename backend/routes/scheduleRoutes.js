const express = require("express");

const {
    createSchedule,
    getSchedules,
    getSchedulesByExpo,
    getSchedule,
    updateSchedule,
    deleteSchedule
} = require("../controllers/scheduleController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// =========================
// CREATE SCHEDULE
// Admin + Organizer
// =========================

router.post(
    "/",
    protect,
    authorizeRoles("admin", "organizer"),
    createSchedule
);


// =========================
// GET ALL SCHEDULES
// Logged-in Users
// =========================

router.get(
    "/",
    protect,
    getSchedules
);


// =========================
// GET SCHEDULES BY EXPO
// Logged-in Users
// =========================

router.get(
    "/expo/:expoId",
    protect,
    getSchedulesByExpo
);


// =========================
// GET SINGLE SCHEDULE
// Logged-in Users
// =========================

router.get(
    "/:id",
    protect,
    getSchedule
);


// =========================
// UPDATE SCHEDULE
// Admin + Organizer
// =========================

router.put(
    "/:id",
    protect,
    authorizeRoles("admin", "organizer"),
    updateSchedule
);


// =========================
// DELETE SCHEDULE
// Admin + Organizer
// =========================

router.delete(
    "/:id",
    protect,
    authorizeRoles("admin", "organizer"),
    deleteSchedule
);


module.exports = router;