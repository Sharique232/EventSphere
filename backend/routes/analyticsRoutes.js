const express = require("express");

const {
    getExpoAnalytics
} = require("../controllers/analyticsController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// GET EXPO ANALYTICS
router.get(
    "/expo/:expoId",
    protect,
    authorizeRoles("admin", "organizer"),
    getExpoAnalytics
);

module.exports = router;