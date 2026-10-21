const express = require("express");

const {
    createProduct,
    getProducts,
    getProductsByExhibitor,
    getProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// CREATE PRODUCT
router.post(
    "/",
    protect,
    authorizeRoles("admin", "organizer", "exhibitor"),
    createProduct
);

// GET ALL PRODUCTS
router.get(
    "/",
    protect,
    getProducts
);

// GET PRODUCTS BY EXHIBITOR
router.get(
    "/exhibitor/:exhibitorId",
    protect,
    getProductsByExhibitor
);

// GET SINGLE PRODUCT
router.get(
    "/:id",
    protect,
    getProduct
);

// UPDATE PRODUCT
router.put(
    "/:id",
    protect,
    authorizeRoles("admin", "organizer", "exhibitor"),
    updateProduct
);

// DELETE PRODUCT
router.delete(
    "/:id",
    protect,
    authorizeRoles("admin", "organizer", "exhibitor"),
    deleteProduct
);

module.exports = router;