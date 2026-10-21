const Product = require("../models/product");

// CREATE PRODUCT
const createProduct = async (req, res) => {
    try {
        const {
            exhibitor,
            name,
            description,
            category,
            price,
            image
        } = req.body;

        if (!exhibitor || !name || !description || !category) {
            return res.status(400).json({
                message: "Exhibitor, name, description and category are required"
            });
        }

        const product = await Product.create({
            exhibitor,
            name,
            description,
            category,
            price: price || 0,
            image: image || ""
        });

        res.status(201).json({
            message: "Product created successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create product",
            error: error.message
        });
    }
};

// GET ALL PRODUCTS
const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate(
                "exhibitor",
                "companyName companyDescription status"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Products fetched successfully",
            count: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message
        });
    }
};

// GET PRODUCTS BY EXHIBITOR
const getProductsByExhibitor = async (req, res) => {
    try {
        const products = await Product.find({
            exhibitor: req.params.exhibitorId
        })
            .populate(
                "exhibitor",
                "companyName companyDescription status"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Exhibitor products fetched successfully",
            count: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch exhibitor products",
            error: error.message
        });
    }
};

// GET SINGLE PRODUCT
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate(
                "exhibitor",
                "companyName companyDescription productsServices status"
            );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product fetched successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch product",
            error: error.message
        });
    }
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update product",
            error: error.message
        });
    }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete product",
            error: error.message
        });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductsByExhibitor,
    getProduct,
    updateProduct,
    deleteProduct
};