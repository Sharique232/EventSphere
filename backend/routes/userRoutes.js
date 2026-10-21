const express = require("express");

const {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// =========================
// PUBLIC ROUTES
// =========================

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);


// =========================
// ANY LOGGED-IN USER
// =========================

router.get("/profile", protect, (req, res) => {
    res.status(200).json({
        message: "Profile accessed successfully",
        user: req.user
    });
});


// =========================
// ADMIN ONLY
// =========================

router.get(
    "/admin",
    protect,
    authorizeRoles("admin"),
    (req, res) => {
        res.status(200).json({
            message: "Welcome Admin",
            user: req.user
        });
    }
);


// =========================
// ADMIN + ORGANIZER
// =========================

router.get(
    "/management",
    protect,
    authorizeRoles("admin", "organizer"),
    (req, res) => {
        res.status(200).json({
            message: "Management area accessed",
            user: req.user
        });
    }
);


// =========================
// EXHIBITOR ONLY
// =========================

router.get(
    "/exhibitor",
    protect,
    authorizeRoles("exhibitor"),
    (req, res) => {
        res.status(200).json({
            message: "Welcome Exhibitor",
            user: req.user
        });
    }
);


// =========================
// ATTENDEE ONLY
// =========================

router.get(
    "/attendee",
    protect,
    authorizeRoles("attendee"),
    (req, res) => {
        res.status(200).json({
            message: "Welcome Attendee",
            user: req.user
        });
    }
);


module.exports = router;