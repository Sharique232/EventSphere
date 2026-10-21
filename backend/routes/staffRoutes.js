const express = require("express");

const {
    createStaff,
    getStaff,
    getStaffByExhibitor,
    getSingleStaff,
    updateStaff,
    deleteStaff
} = require("../controllers/staffController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// CREATE STAFF
router.post(
    "/",
    protect,
    authorizeRoles("admin", "organizer", "exhibitor"),
    createStaff
);

// GET ALL STAFF
router.get(
    "/",
    protect,
    getStaff
);

// GET STAFF BY EXHIBITOR
router.get(
    "/exhibitor/:exhibitorId",
    protect,
    getStaffByExhibitor
);

// GET SINGLE STAFF
router.get(
    "/:id",
    protect,
    getSingleStaff
);

// UPDATE STAFF
router.put(
    "/:id",
    protect,
    authorizeRoles("admin", "organizer", "exhibitor"),
    updateStaff
);

// DELETE STAFF
router.delete(
    "/:id",
    protect,
    authorizeRoles("admin", "organizer", "exhibitor"),
    deleteStaff
);

module.exports = router;