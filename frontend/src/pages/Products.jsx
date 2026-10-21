
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api/products";

const EMPTY_FORM = {
    exhibitor: "",
    name: "",
    description: "",
    category: "",
    price: "",
    image: "",
    status: "active"
};

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [formData, setFormData] = useState(EMPTY_FORM);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [darkMode, setDarkMode] = useState(
        () => localStorage.getItem("eventSphereDarkMode") === "true"
    );

    const token = localStorage.getItem("token");

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const userRole = user?.role;

    const canManage = [
        "admin",
        "organizer",
        "exhibitor"
    ].includes(userRole);

    // Theme synchronization
    useEffect(() => {
        const syncTheme = () => {
            setDarkMode(
                localStorage.getItem("eventSphereDarkMode") === "true"
            );
        };

        window.addEventListener("storage", syncTheme);

        const interval = setInterval(syncTheme, 500);

        return () => {
            window.removeEventListener("storage", syncTheme);
            clearInterval(interval);
        };
    }, []);

    // Theme
    const theme = darkMode
        ? {
              background: "#080d16",
              surface: "#101925",
              surfaceSoft: "#0c1420",
              text: "#f1f5f9",
              muted: "#91a0b3",
              description: "#c1ccda",
              border: "rgba(148,163,184,0.14)",
              input: "#0b1320",
              accent: "#168fff",
              accentLight: "#49b2ff",
              shadow: "0 18px 45px rgba(0,0,0,0.18)"
          }
        : {
              background: "#f5f8fc",
              surface: "#ffffff",
              surfaceSoft: "#f0f6fc",
              text: "#132238",
              muted: "#6d7d91",
              description: "#53647a",
              border: "#e3eaf2",
              input: "#ffffff",
              accent: "#087fe7",
              accentLight: "#38a5ff",
              shadow: "0 16px 40px rgba(20,48,80,0.07)"
          };

    // Load products
    const loadProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(API, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setProducts(
                response.data.products ||
                response.data.data ||
                []
            );
        } catch (err) {
            console.error("Failed to load products:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load products. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    // Product categories
    const categories = useMemo(() => {
        return [
            ...new Set(
                products
                    .map((product) => product.category)
                    .filter(Boolean)
            )
        ].sort((a, b) => a.localeCompare(b));
    }, [products]);

    // Search and filter
    const filteredProducts = useMemo(() => {
        const query = search.trim().toLowerCase();

        return products.filter((product) => {
            const matchesSearch = [
                product.name,
                product.description,
                product.category,
                product.exhibitor?.companyName
            ].some((value) =>
                String(value || "").toLowerCase().includes(query)
            );

            const matchesCategory =
                categoryFilter === "all" ||
                product.category === categoryFilter;

            return matchesSearch && matchesCategory;
        });
    }, [products, search, categoryFilter]);

    const activeCount = products.filter(
        (product) => product.status === "active"
    ).length;

    // Input handler
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // Open add form
    const openAddForm = () => {
        setEditingProduct(null);
        setFormData({ ...EMPTY_FORM });
        setError("");
        setSuccess("");
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Open edit form
    const openEditForm = (product) => {
        setEditingProduct(product);

        setFormData({
            exhibitor:
                product.exhibitor?._id ||
                product.exhibitor ||
                "",
            name: product.name || "",
            description: product.description || "",
            category: product.category || "",
            price: product.price ?? "",
            image: product.image || "",
            status: product.status || "active"
        });

        setError("");
        setSuccess("");
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Close form
    const closeForm = () => {
        setShowForm(false);
        setEditingProduct(null);
        setFormData({ ...EMPTY_FORM });
        setError("");
    };

    // Add / update product
    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.exhibitor.trim() ||
            !formData.name.trim() ||
            !formData.description.trim() ||
            !formData.category.trim()
        ) {
            setError(
                "Exhibitor, name, description and category are required."
            );
            return;
        }

        if (
            formData.price !== "" &&
            (!Number.isFinite(Number(formData.price)) ||
                Number(formData.price) < 0)
        ) {
            setError("Please enter a valid, non-negative price.");
            return;
        }

        const productData = {
            exhibitor: formData.exhibitor.trim(),
            name: formData.name.trim(),
            description: formData.description.trim(),
            category: formData.category.trim(),
            price: Number(formData.price) || 0,
            image: formData.image.trim(),
            status: formData.status
        };

        try {
            setSaving(true);

            let response;

            if (editingProduct) {
                response = await axios.put(
                    `${API}/${editingProduct._id}`,
                    productData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
            } else {
                response = await axios.post(
                    API,
                    productData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
            }

            setSuccess(
                response.data.message ||
                (editingProduct
                    ? "Product updated successfully."
                    : "Product created successfully.")
            );

            setShowForm(false);
            setEditingProduct(null);
            setFormData({ ...EMPTY_FORM });

            await loadProducts();
        } catch (err) {
            console.error("Failed to save product:", err);

            setError(
                err.response?.data?.message ||
                "Failed to save product. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    // Delete product
    const deleteProduct = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product? This action cannot be undone."
        );

        if (!confirmed || deletingId) return;

        setError("");
        setSuccess("");
        setDeletingId(id);

        try {
            await axios.delete(`${API}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setProducts((previous) =>
                previous.filter((product) => product._id !== id)
            );

            setSuccess("Product deleted successfully.");
        } catch (err) {
            console.error("Failed to delete product:", err);

            setError(
                err.response?.data?.message ||
                "Failed to delete product. Please try again."
            );
        } finally {
            setDeletingId("");
        }
    };

    // Format price
    const formatPrice = (price) => {
        return Number(price || 0).toLocaleString();
    };

    const styles = {
        page: {
            minHeight: "100vh",
            padding: "34px 24px 60px",
            boxSizing: "border-box",
            color: theme.text,
            fontFamily: "Inter, Poppins, Arial, sans-serif",
            background: darkMode
                ? "radial-gradient(ellipse at 12% 0%, rgba(22,143,255,0.11), transparent 35%), #080d16"
                : "radial-gradient(ellipse at 12% 0%, rgba(22,143,255,0.09), transparent 35%), #f5f8fc",
            transition: "background 0.3s ease, color 0.3s ease"
        },
        container: {
            maxWidth: "1120px",
            margin: "0 auto"
        },
        topbar: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "18px",
            flexWrap: "wrap",
            marginBottom: "40px"
        },
        brand: {
            display: "flex",
            alignItems: "center",
            gap: "11px"
        },
        brandIcon: {
            width: "43px",
            height: "43px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "14px",
            color: "#fff",
            fontSize: "21px",
            fontWeight: "800",
            background: "linear-gradient(135deg, #087fe7, #49b2ff)",
            boxShadow: "0 8px 22px rgba(22,143,255,0.23)"
        },
        brandName: {
            fontSize: "19px",
            fontWeight: "800",
            letterSpacing: "-0.5px"
        },
        brandCaption: {
            marginTop: "3px",
            color: theme.muted,
            fontSize: "11px",
            letterSpacing: "1.5px",
            textTransform: "uppercase"
        },
        topActions: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap"
        },
        dashboardLink: {
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "11px 16px",
            borderRadius: "11px",
            border: `1px solid ${theme.border}`,
            background: theme.surface,
            color: theme.text,
            textDecoration: "none",
            fontSize: "13px",
            fontWeight: "700"
        },
        primaryButton: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "12px 17px",
            borderRadius: "11px",
            border: "none",
            color: "#ffffff",
            background: "linear-gradient(135deg, #087fe7, #168fff)",
            fontSize: "13px",
            fontWeight: "800",
            cursor: "pointer",
            boxShadow: "0 8px 22px rgba(22,143,255,0.2)"
        },
        hero: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "24px",
            marginBottom: "28px",
            animation: "esProductUp 0.5s ease both"
        },
        eyebrow: {
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: theme.accent,
            fontSize: "12px",
            fontWeight: "800",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            marginBottom: "13px"
        },
        title: {
            margin: 0,
            fontSize: "clamp(30px, 5vw, 43px)",
            fontWeight: "800",
            letterSpacing: "-1.7px",
            lineHeight: 1.15
        },
        description: {
            margin: "12px 0 0",
            color: theme.muted,
            fontSize: "14px",
            lineHeight: 1.8
        },
        stats: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))",
            gap: "15px",
            marginBottom: "30px"
        },
        statCard: {
            display: "flex",
            alignItems: "center",
            gap: "13px",
            padding: "18px",
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: "16px",
            boxShadow: theme.shadow
        },
        statIcon: {
            width: "43px",
            height: "43px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "13px",
            background: darkMode ? "rgba(22,143,255,0.13)" : "#eaf5ff",
            fontSize: "20px",
            flexShrink: 0
        },
        statLabel: {
            color: theme.muted,
            fontSize: "12px",
            marginBottom: "5px"
        },
        statValue: {
            fontSize: "22px",
            fontWeight: "800"
        },
        formCard: {
            padding: "27px",
            marginBottom: "30px",
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: "20px",
            boxShadow: theme.shadow,
            animation: "esProductUp 0.35s ease both"
        },
        formTitle: {
            margin: "6px 0 7px",
            fontSize: "23px",
            fontWeight: "800",
            letterSpacing: "-0.6px"
        },
        formDescription: {
            margin: 0,
            color: theme.muted,
            fontSize: "13px",
            lineHeight: 1.7
        },
        formGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "0 18px",
            marginTop: "15px"
        },
        field: {
            marginTop: "15px"
        },
        label: {
            display: "block",
            marginBottom: "8px",
            fontSize: "12px",
            fontWeight: "700",
            color: theme.text
        },
        input: {
            display: "block",
            width: "100%",
            boxSizing: "border-box",
            padding: "12px 13px",
            borderRadius: "10px",
            background: theme.input,
            border: `1px solid ${theme.border}`,
            color: theme.text,
            fontSize: "13px",
            fontFamily: "inherit",
            outline: "none"
        },
        toolbar: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
            marginBottom: "20px"
        },
        toolbarTitle: {
            margin: 0,
            fontSize: "20px",
            fontWeight: "800",
            letterSpacing: "-0.5px"
        },
        toolbarCaption: {
            color: theme.muted,
            fontSize: "12px",
            marginTop: "5px"
        },
        filters: {
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            width: "100%",
            marginBottom: "22px"
        },
        search: {
            flex: "1 1 250px",
            minWidth: 0,
            padding: "12px 14px",
            borderRadius: "11px",
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            color: theme.text,
            fontSize: "13px",
            outline: "none"
        },
        select: {
            flex: "0 1 190px",
            minWidth: "150px",
            padding: "12px 13px",
            borderRadius: "11px",
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            color: theme.text,
            fontSize: "13px",
            outline: "none"
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "20px"
        },
        card: {
            overflow: "hidden",
            position: "relative",
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: "19px",
            boxShadow: theme.shadow,
            transition: "transform 0.25s ease, border-color 0.25s ease",
            animation: "esProductUp 0.5s ease both"
        },
        imageFrame: {
            position: "relative",
            height: "200px",
            overflow: "hidden",
            background: darkMode
                ? "linear-gradient(135deg, #101e30, #14283b)"
                : "linear-gradient(135deg, #e9f5ff, #f4f8fc)"
        },
        image: {
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.35s ease"
        },
        placeholder: {
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "53px"
        },
        cardBody: {
            padding: "21px"
        },
        cardTop: {
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "10px"
        },
        productTitle: {
            margin: 0,
            fontSize: "19px",
            fontWeight: "800",
            lineHeight: 1.4,
            letterSpacing: "-0.4px",
            overflowWrap: "anywhere"
        },
        status: {
            flexShrink: 0,
            padding: "6px 8px",
            borderRadius: "7px",
            fontSize: "10px",
            fontWeight: "800",
            textTransform: "uppercase"
        },
        category: {
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "13px",
            color: theme.accent,
            background: darkMode ? "rgba(22,143,255,0.1)" : "#edf7ff",
            padding: "6px 9px",
            borderRadius: "7px",
            fontSize: "11px",
            fontWeight: "700"
        },
        price: {
            margin: "17px 0 0",
            fontSize: "23px",
            fontWeight: "800",
            letterSpacing: "-0.5px"
        },
        productDescription: {
            minHeight: "62px",
            margin: "12px 0 0",
            color: theme.description,
            fontSize: "13px",
            lineHeight: 1.8,
            overflowWrap: "anywhere",
            whiteSpace: "pre-wrap"
        },
        exhibitor: {
            marginTop: "17px",
            paddingTop: "15px",
            borderTop: `1px solid ${theme.border}`
        },
        exhibitorLabel: {
            color: theme.muted,
            fontSize: "11px",
            marginBottom: "6px"
        },
        exhibitorName: {
            margin: 0,
            fontSize: "13px",
            fontWeight: "700",
            overflowWrap: "anywhere"
        },
        actions: {
            display: "flex",
            gap: "9px",
            marginTop: "18px"
        },
        actionButton: {
            flex: 1,
            padding: "10px 8px",
            borderRadius: "9px",
            border: "1px solid transparent",
            fontSize: "12px",
            fontWeight: "800",
            cursor: "pointer",
            transition: "transform 0.2s ease"
        },
        emptyState: {
            padding: "55px 24px",
            textAlign: "center",
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: "20px",
            boxShadow: theme.shadow
        },
        emptyIcon: {
            width: "68px",
            height: "68px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 17px",
            borderRadius: "20px",
            background: darkMode ? "rgba(22,143,255,0.13)" : "#eaf5ff",
            fontSize: "29px"
        },
        emptyTitle: {
            margin: "0 0 9px",
            fontSize: "21px",
            fontWeight: "800"
        },
        emptyText: {
            margin: "0 auto",
            maxWidth: "440px",
            color: theme.muted,
            fontSize: "13px",
            lineHeight: 1.8
        },
        alert: {
            padding: "14px 16px",
            marginBottom: "18px",
            borderRadius: "11px",
            fontSize: "13px",
            lineHeight: 1.6
        }
    };

    const alertStyle = (type) => ({
        ...styles.alert,
        color: type === "error"
            ? darkMode ? "#ff9999" : "#b91c1c"
            : darkMode ? "#86efac" : "#166534",
        background: type === "error"
            ? darkMode ? "rgba(239,68,68,0.09)" : "#fff1f1"
            : darkMode ? "rgba(34,197,94,0.09)" : "#effbf3",
        border: `1px solid ${
            type === "error"
                ? "rgba(239,68,68,0.2)"
                : "rgba(34,197,94,0.2)"
        }`
    });

    return (
        <div style={styles.page}>
            <style>{`
                @keyframes esProductUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes esProductSpin {
                    to { transform: rotate(360deg); }
                }

                .es-product-card:hover {
                    transform: translateY(-5px);
                    border-color: rgba(22,143,255,0.45) !important;
                }

                .es-product-card:hover .es-product-image {
                    transform: scale(1.04);
                }

                .es-product-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                }

                .es-product-button:disabled {
                    opacity: 0.65;
                    cursor: wait;
                }

                .es-product-input:focus {
                    border-color: #168fff !important;
                    box-shadow: 0 0 0 3px rgba(22,143,255,0.1);
                }

                @media (max-width: 600px) {
                    .es-product-page {
                        padding: 24px 15px 40px !important;
                    }

                    .es-product-form {
                        padding: 19px !important;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .es-product-page *,
                    .es-product-page *::before,
                    .es-product-page *::after {
                        animation-duration: 0.01ms !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `}</style>

            <main className="es-product-page" style={styles.container}>
                {/* Header */}
                <header style={styles.topbar}>
                    <div style={styles.brand}>
                        <div style={styles.brandIcon}>E</div>
                        <div>
                            <div style={styles.brandName}>EventSphere</div>
                            <div style={styles.brandCaption}>Your event hub</div>
                        </div>
                    </div>

                    <div style={styles.topActions}>
                        {canManage && (
                            <button
                                type="button"
                                className="es-product-button"
                                onClick={() => {
                                    if (showForm) {
                                        closeForm();
                                    } else {
                                        openAddForm();
                                    }
                                }}
                                style={styles.primaryButton}
                            >
                                {showForm ? "✕ Close Form" : "+ Add Product"}
                            </button>
                        )}

                        <Link
                            to="/dashboard"
                            style={styles.dashboardLink}
                        >
                            ← Dashboard
                        </Link>
                    </div>
                </header>

                {/* Hero */}
                <section style={styles.hero}>
                    <div>
                        <div style={styles.eyebrow}>
                            <span>✦</span> EVENTSPHERE MARKETPLACE
                        </div>

                        <h1 style={styles.title}>
                            Discover Products
                            <span style={{ color: theme.accent }}>.</span>
                        </h1>

                        <p style={styles.description}>
                            Explore products and innovations presented by our exhibitors.
                            Find something that catches your interest.
                        </p>
                    </div>
                </section>

                {/* Feedback */}
                {success && (
                    <div style={alertStyle("success")}>
                        ✓ {success}
                    </div>
                )}

                {error && (
                    <div style={alertStyle("error")}>
                        ⚠ {error}
                    </div>
                )}

                {/* Summary */}
                {!loading && (
                    <section style={styles.stats}>
                        <div style={styles.statCard}>
                            <div style={styles.statIcon}>🛍️</div>
                            <div>
                                <div style={styles.statLabel}>Total products</div>
                                <div style={styles.statValue}>{products.length}</div>
                            </div>
                        </div>

                        <div style={styles.statCard}>
                            <div style={styles.statIcon}>✓</div>
                            <div>
                                <div style={styles.statLabel}>Active products</div>
                                <div style={styles.statValue}>{activeCount}</div>
                            </div>
                        </div>

                        <div style={styles.statCard}>
                            <div style={styles.statIcon}>🏷️</div>
                            <div>
                                <div style={styles.statLabel}>Categories</div>
                                <div style={styles.statValue}>{categories.length}</div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Add / Edit form */}
                {showForm && canManage && (
                    <section className="es-product-form" style={styles.formCard}>
                        <div style={styles.eyebrow}>
                            {editingProduct ? "✎ EDIT PRODUCT" : "+ PRODUCT MANAGEMENT"}
                        </div>

                        <h2 style={styles.formTitle}>
                            {editingProduct ? "Update product" : "Add a new product"}
                        </h2>

                        <p style={styles.formDescription}>
                            Enter the product information below.
                            Fields marked as required must be completed.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div style={styles.formGrid}>
                                <div style={styles.field}>
                                    <label style={styles.label} htmlFor="product-exhibitor">
                                        Exhibitor ID *
                                    </label>
                                    <input
                                        id="product-exhibitor"
                                        className="es-product-input"
                                        name="exhibitor"
                                        value={formData.exhibitor}
                                        onChange={handleChange}
                                        placeholder="Enter exhibitor ID"
                                        required
                                        style={styles.input}
                                    />
                                </div>

                                <div style={styles.field}>
                                    <label style={styles.label} htmlFor="product-name">
                                        Product name *
                                    </label>
                                    <input
                                        id="product-name"
                                        className="es-product-input"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter product name"
                                        required
                                        style={styles.input}
                                    />
                                </div>

                                <div style={styles.field}>
                                    <label style={styles.label} htmlFor="product-category">
                                        Category *
                                    </label>
                                    <input
                                        id="product-category"
                                        className="es-product-input"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        placeholder="e.g. Technology"
                                        required
                                        style={styles.input}
                                    />
                                </div>

                                <div style={styles.field}>
                                    <label style={styles.label} htmlFor="product-price">
                                        Price
                                    </label>
                                    <input
                                        id="product-price"
                                        className="es-product-input"
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="Enter price"
                                        min="0"
                                        step="any"
                                        style={styles.input}
                                    />
                                </div>

                                <div style={styles.field}>
                                    <label style={styles.label} htmlFor="product-image">
                                        Image URL
                                    </label>
                                    <input
                                        id="product-image"
                                        className="es-product-input"
                                        type="url"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                        placeholder="https://example.com/image.jpg"
                                        style={styles.input}
                                    />
                                </div>

                                <div style={styles.field}>
                                    <label style={styles.label} htmlFor="product-status">
                                        Status
                                    </label>
                                    <select
                                        id="product-status"
                                        className="es-product-input"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        style={styles.input}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
                                    <label style={styles.label} htmlFor="product-description">
                                        Description *
                                    </label>
                                    <textarea
                                        id="product-description"
                                        className="es-product-input"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Describe the product..."
                                        rows={4}
                                        required
                                        style={{
                                            ...styles.input,
                                            resize: "vertical",
                                            lineHeight: 1.7
                                        }}
                                    />
                                </div>
                            </div>

                            {formData.image && (
                                <div style={{ marginTop: "17px" }}>
                                    <span style={styles.label}>Image preview</span>
                                    <img
                                        src={formData.image}
                                        alt="Product preview"
                                        onError={(event) => {
                                            event.currentTarget.style.display = "none";
                                        }}
                                        onLoad={(event) => {
                                            event.currentTarget.style.display = "block";
                                        }}
                                        style={{
                                            display: "block",
                                            maxWidth: "220px",
                                            width: "100%",
                                            height: "130px",
                                            objectFit: "cover",
                                            borderRadius: "12px",
                                            border: `1px solid ${theme.border}`
                                        }}
                                    />
                                </div>
                            )}

                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "10px",
                                    marginTop: "23px"
                                }}
                            >
                                <button
                                    type="submit"
                                    className="es-product-button"
                                    disabled={saving}
                                    style={styles.primaryButton}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingProduct
                                            ? "✓ Update Product"
                                            : "+ Create Product"}
                                </button>

                                <button
                                    type="button"
                                    className="es-product-button"
                                    onClick={closeForm}
                                    disabled={saving}
                                    style={{
                                        ...styles.dashboardLink,
                                        cursor: saving ? "wait" : "pointer"
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </section>
                )}

                {/* Product toolbar */}
                {!loading && (
                    <>
                        <section style={styles.toolbar}>
                            <div>
                                <h2 style={styles.toolbarTitle}>Marketplace</h2>
                                <div style={styles.toolbarCaption}>
                                    Showing {filteredProducts.length} of {products.length} products
                                </div>
                            </div>
                        </section>

                        <div style={styles.filters}>
                            <input
                                className="es-product-input"
                                type="search"
                                aria-label="Search products"
                                placeholder="⌕  Search by name, category or exhibitor..."
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                style={styles.search}
                            />

                            <select
                                className="es-product-input"
                                aria-label="Filter by category"
                                value={categoryFilter}
                                onChange={(event) => setCategoryFilter(event.target.value)}
                                style={styles.select}
                            >
                                <option value="all">All categories</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </>
                )}

                {/* Loading */}
                {loading && (
                    <div style={styles.emptyState}>
                        <div
                            style={{
                                ...styles.emptyIcon,
                                border: "3px solid rgba(22,143,255,0.15)",
                                borderTopColor: theme.accent,
                                borderRadius: "50%",
                                animation: "esProductSpin 0.8s linear infinite"
                            }}
                        />
                        <h2 style={styles.emptyTitle}>Loading products</h2>
                        <p style={styles.emptyText}>
                            Please wait while we fetch the marketplace.
                        </p>
                    </div>
                )}

                {/* Empty or filtered state */}
                {!loading && filteredProducts.length === 0 && (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>
                            {products.length === 0 ? "🛍️" : "⌕"}
                        </div>

                        <h2 style={styles.emptyTitle}>
                            {products.length === 0
                                ? "No products yet"
                                : "No matching products"}
                        </h2>

                        <p style={styles.emptyText}>
                            {products.length === 0
                                ? "There are no products in the marketplace yet."
                                : "Try another search term or choose a different category."}
                        </p>

                        {products.length > 0 && (
                            <button
                                type="button"
                                className="es-product-button"
                                onClick={() => {
                                    setSearch("");
                                    setCategoryFilter("all");
                                }}
                                style={{
                                    ...styles.primaryButton,
                                    marginTop: "20px"
                                }}
                            >
                                Clear filters
                            </button>
                        )}

                        {products.length === 0 && canManage && (
                            <button
                                type="button"
                                className="es-product-button"
                                onClick={openAddForm}
                                style={{
                                    ...styles.primaryButton,
                                    marginTop: "20px"
                                }}
                            >
                                + Add First Product
                            </button>
                        )}
                    </div>
                )}

                {/* Product cards */}
                {!loading && filteredProducts.length > 0 && (
                    <section style={styles.grid}>
                        {filteredProducts.map((product, index) => {
                            const isActive = product.status === "active";

                            return (
                                <article
                                    key={product._id}
                                    className="es-product-card"
                                    style={{
                                        ...styles.card,
                                        animationDelay: `${Math.min(index * 55, 330)}ms`
                                    }}
                                >
                                    <div style={styles.imageFrame}>
                                        {product.image ? (
                                            <img
                                                className="es-product-image"
                                                src={product.image}
                                                alt={product.name || "Product"}
                                                loading="lazy"
                                                onError={(event) => {
                                                    event.currentTarget.style.display = "none";
                                                    event.currentTarget.nextElementSibling.style.display = "flex";
                                                }}
                                                style={styles.image}
                                            />
                                        ) : null}

                                        <div
                                            style={{
                                                ...styles.placeholder,
                                                display: product.image ? "none" : "flex"
                                            }}
                                        >
                                            🛍️
                                        </div>

                                        <span
                                            style={{
                                                ...styles.status,
                                                position: "absolute",
                                                top: "13px",
                                                right: "13px",
                                                color: isActive
                                                    ? darkMode ? "#86efac" : "#166534"
                                                    : darkMode ? "#ffaaaa" : "#991b1b",
                                                background: isActive
                                                    ? darkMode ? "rgba(22,101,52,0.85)" : "#dcfce7"
                                                    : darkMode ? "rgba(127,29,29,0.85)" : "#fee2e2"
                                            }}
                                        >
                                            {product.status || "unknown"}
                                        </span>
                                    </div>

                                    <div style={styles.cardBody}>
                                        <div style={styles.cardTop}>
                                            <h3 style={styles.productTitle}>
                                                {product.name || "Untitled product"}
                                            </h3>
                                        </div>

                                        <div style={styles.category}>
                                            <span>◇</span>
                                            {product.category || "Uncategorized"}
                                        </div>

                                        <p style={styles.price}>
                                            <span
                                                style={{
                                                    color: theme.accent,
                                                    fontSize: "15px",
                                                    marginRight: "5px"
                                                }}
                                            >
                                                PKR
                                            </span>
                                            {formatPrice(product.price)}
                                        </p>

                                        <p style={styles.productDescription}>
                                            {product.description || "No description available."}
                                        </p>

                                        <div style={styles.exhibitor}>
                                            <div style={styles.exhibitorLabel}>
                                                EXHIBITOR
                                            </div>
                                            <p style={styles.exhibitorName}>
                                                {product.exhibitor?.companyName ||
                                                    "Unknown Exhibitor"}
                                            </p>
                                        </div>

                                        {canManage && (
                                            <div style={styles.actions}>
                                                <button
                                                    type="button"
                                                    className="es-product-button"
                                                    onClick={() => openEditForm(product)}
                                                    style={{
                                                        ...styles.actionButton,
                                                        color: theme.accent,
                                                        background: darkMode
                                                            ? "rgba(22,143,255,0.12)"
                                                            : "#edf7ff",
                                                        borderColor: darkMode
                                                            ? "rgba(22,143,255,0.2)"
                                                            : "#d8ecff"
                                                    }}
                                                >
                                                    ✎ Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="es-product-button"
                                                    onClick={() => deleteProduct(product._id)}
                                                    disabled={deletingId === product._id}
                                                    style={{
                                                        ...styles.actionButton,
                                                        color: darkMode ? "#ff9999" : "#c62828",
                                                        background: darkMode
                                                            ? "rgba(239,68,68,0.1)"
                                                            : "#fff1f1",
                                                        borderColor: "rgba(239,68,68,0.15)"
                                                    }}
                                                >
                                                    {deletingId === product._id
                                                        ? "Deleting..."
                                                        : "⌫ Delete"}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </section>
                )}

                <footer
                    style={{
                        marginTop: "45px",
                        paddingTop: "20px",
                        borderTop: `1px solid ${theme.border}`,
                        color: theme.muted,
                        fontSize: "11px",
                        textAlign: "center"
                    }}
                >
                    EventSphere · Every event, one place.
                </footer>
            </main>
        </div>
    );
}

export default Products;
