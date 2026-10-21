import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api/staff";
const EXHIBITORS_API = "http://localhost:5000/api/exhibitors";

const EMPTY_FORM = {
    exhibitor: "",
    name: "",
    email: "",
    phone: "",
    designation: "",
    status: "active",
};

function getStoredUser() {
    try {
        return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        return null;
    }
}

function Staff() {
    const [staff, setStaff] = useState([]);
    const [exhibitors, setExhibitors] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [darkMode, setDarkMode] = useState(
        () => localStorage.getItem("eventSphereDarkMode") === "true"
    );

    const [formData, setFormData] = useState({ ...EMPTY_FORM });

    const token = localStorage.getItem("token");
    const user = getStoredUser();
    const userRole = user?.role;

    const canManage = [
        "admin",
        "organizer",
        "exhibitor",
    ].includes(userRole);

    // Shared EventSphere theme synchronization.
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
              shadow: "0 18px 45px rgba(0,0,0,0.18)",
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
              shadow: "0 16px 40px rgba(20,48,80,0.07)",
          };

    // Load staff records.
    const loadStaff = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(API, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                },
            });

            setStaff(
                response.data.staff ||
                response.data.data ||
                []
            );
        } catch (err) {
            console.error("Failed to load staff:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load staff. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // Load exhibitors for the form dropdown.
    const loadExhibitors = async () => {
        try {
            const response = await axios.get(EXHIBITORS_API, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                },
            });

            setExhibitors(
                response.data.exhibitors ||
                response.data.data ||
                []
            );
        } catch (err) {
            console.error("Failed to load exhibitors:", err);
        }
    };

    useEffect(() => {
        loadStaff();
        loadExhibitors();
    }, []);

    // Statistics.
    const activeCount = staff.filter(
        (member) => member.status === "active"
    ).length;

    const inactiveCount = staff.length - activeCount;

    const exhibitorCount = useMemo(
        () =>
            new Set(
                staff
                    .map((member) =>
                        member.exhibitor?._id ||
                        member.exhibitor
                    )
                    .filter(Boolean)
            ).size,
        [staff]
    );

    // Search and status filter.
    const filteredStaff = useMemo(() => {
        const query = search.trim().toLowerCase();

        return staff.filter((member) => {
            const matchesSearch = [
                member.name,
                member.email,
                member.phone,
                member.designation,
                member.exhibitor?.companyName,
            ].some((value) =>
                String(value || "").toLowerCase().includes(query)
            );

            const matchesStatus =
                statusFilter === "all" ||
                member.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [staff, search, statusFilter]);

    // Input changes.
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // Open the add form.
    const openAddForm = () => {
        setEditingStaff(null);
        setFormData({ ...EMPTY_FORM });
        setError("");
        setSuccess("");
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // Open the edit form.
    const openEditForm = (member) => {
        setEditingStaff(member);

        setFormData({
            exhibitor:
                member.exhibitor?._id ||
                member.exhibitor ||
                "",
            name: member.name || "",
            email: member.email || "",
            phone: member.phone || "",
            designation: member.designation || "",
            status: member.status || "active",
        });

        setError("");
        setSuccess("");
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // Close and reset the form.
    const closeForm = () => {
        setShowForm(false);
        setEditingStaff(null);
        setFormData({ ...EMPTY_FORM });
        setError("");
    };

    // Add or update a staff member.
    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.exhibitor.trim() ||
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.phone.trim() ||
            !formData.designation.trim()
        ) {
            setError(
                "Exhibitor, name, email, phone and designation are required."
            );
            return;
        }

        try {
            setSaving(true);

            const staffData = {
                exhibitor: formData.exhibitor.trim(),
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                designation: formData.designation.trim(),
                status: formData.status,
            };

            let response;

            if (editingStaff) {
                response = await axios.put(
                    `${API}/${editingStaff._id}`,
                    staffData,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
            } else {
                response = await axios.post(
                    API,
                    staffData,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
            }

            setSuccess(
                response.data.message ||
                (editingStaff
                    ? "Staff updated successfully."
                    : "Staff created successfully.")
            );

            setShowForm(false);
            setEditingStaff(null);
            setFormData({ ...EMPTY_FORM });

            await loadStaff();
        } catch (err) {
            console.error("Failed to save staff:", err);

            setError(
                err.response?.data?.message ||
                "Failed to save staff. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    // Delete a staff member.
    const deleteStaff = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this staff member?"
        );

        if (!confirmed || deletingId) return;

        setError("");
        setSuccess("");
        setDeletingId(id);

        try {
            await axios.delete(`${API}/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                },
            });

            setStaff((previous) =>
                previous.filter((member) => member._id !== id)
            );

            setSuccess("Staff deleted successfully.");
        } catch (err) {
            console.error("Failed to delete staff:", err);

            setError(
                err.response?.data?.message ||
                "Failed to delete staff. Please try again."
            );
        } finally {
            setDeletingId("");
        }
    };

    const styles = {
        page: {
            minHeight: "100vh",
            padding: "34px 24px 60px",
            boxSizing: "border-box",
            color: theme.text,
            fontFamily: "Inter, Poppins, Arial, sans-serif",
            background: darkMode
                ? "radial-gradient(ellipse at 12% 0%, rgba(22,143,255,0.13), transparent 35%), #080d16"
                : "radial-gradient(ellipse at 12% 0%, rgba(22,143,255,0.10), transparent 35%), #f5f8fc",
            transition: "background 0.3s ease, color 0.3s ease",
        },
        container: {
            width: "100%",
            maxWidth: "1120px",
            margin: "0 auto",
        },
        topbar: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "18px",
            flexWrap: "wrap",
            marginBottom: "40px",
            animation: "esStaffEnter 0.65s ease both",
        },
        brand: {
            display: "flex",
            alignItems: "center",
            gap: "11px",
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
            boxShadow: "0 8px 22px rgba(22,143,255,0.23)",
        },
        brandName: {
            fontSize: "19px",
            fontWeight: "800",
            letterSpacing: "-0.5px",
        },
        brandCaption: {
            marginTop: "3px",
            color: theme.muted,
            fontSize: "11px",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
        },
        topActions: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
        },
        dashboardLink: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "11px 16px",
            borderRadius: "11px",
            border: `1px solid ${theme.border}`,
            background: theme.surface,
            color: theme.text,
            textDecoration: "none",
            fontSize: "13px",
            fontWeight: "700",
            transition: "all 0.2s ease",
        },
        primaryButton: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "12px 17px",
            borderRadius: "11px",
            border: "none",
            color: "#fff",
            background: "linear-gradient(135deg, #087fe7, #168fff)",
            fontSize: "13px",
            fontWeight: "800",
            cursor: "pointer",
            boxShadow: "0 8px 22px rgba(22,143,255,0.2)",
            transition: "transform 0.2s ease, filter 0.2s ease",
        },
        hero: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "24px",
            marginBottom: "28px",
            animation: "esStaffEnter 0.65s ease both",
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
            marginBottom: "13px",
        },
        title: {
            margin: 0,
            fontSize: "clamp(30px, 5vw, 43px)",
            fontWeight: "800",
            letterSpacing: "-1.7px",
            lineHeight: 1.15,
        },
        description: {
            margin: "12px 0 0",
            color: theme.muted,
            fontSize: "14px",
            lineHeight: 1.8,
            maxWidth: "580px",
        },
        stats: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))",
            gap: "15px",
            marginBottom: "30px",
        },
        statCard: {
            display: "flex",
            alignItems: "center",
            gap: "13px",
            padding: "18px",
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: "16px",
            boxShadow: theme.shadow,
            animation: "esStaffEnter 0.6s ease both",
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
            flexShrink: 0,
        },
        statLabel: {
            color: theme.muted,
            fontSize: "12px",
            marginBottom: "5px",
        },
        statValue: {
            fontSize: "22px",
            fontWeight: "800",
        },
        formCard: {
            padding: "27px",
            marginBottom: "30px",
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: "20px",
            boxShadow: theme.shadow,
            animation: "esStaffEnter 0.4s ease both",
        },
        formTitle: {
            margin: "6px 0 7px",
            fontSize: "23px",
            fontWeight: "800",
            letterSpacing: "-0.6px",
        },
        formDescription: {
            margin: 0,
            color: theme.muted,
            fontSize: "13px",
            lineHeight: 1.7,
        },
        formGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "0 18px",
            marginTop: "15px",
        },
        field: {
            marginTop: "15px",
            minWidth: 0,
        },
        label: {
            display: "block",
            marginBottom: "8px",
            fontSize: "12px",
            fontWeight: "700",
            color: theme.text,
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
            outline: "none",
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        },
        toolbar: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
            marginBottom: "18px",
        },
        toolbarTitle: {
            margin: 0,
            fontSize: "20px",
            fontWeight: "800",
            letterSpacing: "-0.5px",
        },
        toolbarCaption: {
            color: theme.muted,
            fontSize: "12px",
            marginTop: "5px",
        },
        filters: {
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            width: "100%",
            marginBottom: "22px",
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
            outline: "none",
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
            outline: "none",
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "20px",
        },
        card: {
            minWidth: 0,
            padding: "22px",
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: "19px",
            boxShadow: theme.shadow,
            transition: "transform 0.25s ease, border-color 0.25s ease",
            animation: "esStaffEnter 0.55s ease both",
        },
        avatar: {
            width: "52px",
            height: "52px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            borderRadius: "16px",
            background: darkMode ? "rgba(22,143,255,0.13)" : "#eaf5ff",
            color: theme.accent,
            fontSize: "19px",
            fontWeight: "800",
        },
        memberName: {
            margin: "16px 0 0",
            fontSize: "20px",
            fontWeight: "800",
            letterSpacing: "-0.5px",
            overflowWrap: "anywhere",
        },
        designation: {
            marginTop: "6px",
            color: theme.accent,
            fontSize: "13px",
            fontWeight: "700",
        },
        status: {
            flexShrink: 0,
            padding: "6px 9px",
            borderRadius: "8px",
            fontSize: "10px",
            fontWeight: "800",
            textTransform: "uppercase",
        },
        details: {
            display: "grid",
            gap: "12px",
            marginTop: "21px",
        },
        detail: {
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            color: theme.description,
            fontSize: "13px",
            lineHeight: 1.6,
            overflowWrap: "anywhere",
        },
        detailIcon: {
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            borderRadius: "9px",
            background: darkMode ? "rgba(148,163,184,0.09)" : "#f1f5f9",
        },
        exhibitor: {
            marginTop: "20px",
            padding: "15px",
            borderRadius: "12px",
            background: theme.surfaceSoft,
            border: `1px solid ${theme.border}`,
        },
        exhibitorLabel: {
            color: theme.muted,
            fontSize: "10px",
            fontWeight: "800",
            letterSpacing: "1px",
            marginBottom: "7px",
        },
        exhibitorName: {
            margin: 0,
            fontSize: "13px",
            fontWeight: "700",
            overflowWrap: "anywhere",
        },
        actions: {
            display: "flex",
            gap: "9px",
            marginTop: "18px",
        },
        actionButton: {
            flex: 1,
            padding: "10px 8px",
            borderRadius: "9px",
            border: "1px solid transparent",
            fontSize: "12px",
            fontWeight: "800",
            cursor: "pointer",
            transition: "transform 0.2s ease, opacity 0.2s ease",
        },
        emptyState: {
            padding: "55px 24px",
            textAlign: "center",
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: "20px",
            boxShadow: theme.shadow,
            animation: "esStaffEnter 0.5s ease both",
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
            fontSize: "29px",
        },
        emptyTitle: {
            margin: "0 0 9px",
            fontSize: "21px",
            fontWeight: "800",
        },
        emptyText: {
            margin: "0 auto",
            maxWidth: "440px",
            color: theme.muted,
            fontSize: "13px",
            lineHeight: 1.8,
        },
        alert: {
            padding: "14px 16px",
            marginBottom: "18px",
            borderRadius: "11px",
            fontSize: "13px",
            lineHeight: 1.6,
            overflowWrap: "anywhere",
        },
    };

    const alertStyle = (type) => ({
        ...styles.alert,
        color:
            type === "error"
                ? darkMode ? "#ff9999" : "#b91c1c"
                : darkMode ? "#86efac" : "#166534",
        background:
            type === "error"
                ? darkMode ? "rgba(239,68,68,0.09)" : "#fff1f1"
                : darkMode ? "rgba(34,197,94,0.09)" : "#effbf3",
        border: `1px solid ${
            type === "error"
                ? "rgba(239,68,68,0.2)"
                : "rgba(34,197,94,0.2)"
        }`,
    });

    return (
        <div style={styles.page}>
            <style>{`
                @keyframes esStaffEnter {
                    from {
                        opacity: 0;
                        transform: translateX(22px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes esStaffSpin {
                    to { transform: rotate(360deg); }
                }

                .es-staff-card:hover {
                    transform: translateY(-5px);
                    border-color: rgba(22,143,255,0.45) !important;
                }

                .es-staff-button:hover:not(:disabled),
                .es-staff-link:hover {
                    transform: translateY(-2px);
                    filter: brightness(1.06);
                }

                .es-staff-button:disabled {
                    opacity: 0.65;
                    cursor: wait;
                }

                .es-staff-input:focus {
                    border-color: #168fff !important;
                    box-shadow: 0 0 0 3px rgba(22,143,255,0.1);
                }

                @media (max-width: 600px) {
                    .es-staff-page {
                        padding: 24px 15px 40px !important;
                    }

                    .es-staff-form {
                        padding: 19px !important;
                    }

                    .es-staff-heading {
                        font-size: 32px !important;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .es-staff-page *,
                    .es-staff-page *::before,
                    .es-staff-page *::after {
                        animation-duration: 0.01ms !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `}</style>

            <main
                className="es-staff-page"
                style={{
                    ...styles.container,
                    minHeight: "calc(100vh - 94px)",
                }}
            >
                {/* HEADER */}
                <header style={styles.topbar}>
                    <div style={styles.brand}>
                        <div style={styles.brandIcon}>E</div>
                        <div>
                            <div style={styles.brandName}>EventSphere</div>
                            <div style={styles.brandCaption}>
                                Your event hub
                            </div>
                        </div>
                    </div>

                    <div style={styles.topActions}>
                        {canManage && (
                            <button
                                type="button"
                                className="es-staff-button"
                                onClick={() =>
                                    showForm ? closeForm() : openAddForm()
                                }
                                style={styles.primaryButton}
                            >
                                {showForm ? "✕ Close Form" : "+ Add Staff"}
                            </button>
                        )}

                        <Link
                            to="/dashboard"
                            className="es-staff-link"
                            style={styles.dashboardLink}
                        >
                            ← Dashboard
                        </Link>
                    </div>
                </header>

                {/* HERO */}
                <section style={styles.hero}>
                    <div>
                        <div style={styles.eyebrow}>
                            <span>✦</span> EVENTSPHERE TEAM
                        </div>

                        <h1
                            className="es-staff-heading"
                            style={styles.title}
                        >
                            Staff Management
                            <span style={{ color: theme.accent }}>.</span>
                        </h1>

                        <p style={styles.description}>
                            Manage your team, keep staff information organized,
                            and view exhibitor assignments in one place.
                        </p>
                    </div>
                </section>

                {/* ALERTS */}
                {success && (
                    <div role="status" style={alertStyle("success")}>
                        ✓ {success}
                    </div>
                )}

                {error && (
                    <div role="alert" style={alertStyle("error")}>
                        ⚠ {error}
                    </div>
                )}

                {/* STATISTICS */}
                {!loading && (
                    <section style={styles.stats}>
                        <div style={styles.statCard}>
                            <div style={styles.statIcon}>👥</div>
                            <div>
                                <div style={styles.statLabel}>
                                    Total staff
                                </div>
                                <div style={styles.statValue}>
                                    {staff.length}
                                </div>
                            </div>
                        </div>

                        <div style={styles.statCard}>
                            <div style={styles.statIcon}>✓</div>
                            <div>
                                <div style={styles.statLabel}>
                                    Active staff
                                </div>
                                <div style={styles.statValue}>
                                    {activeCount}
                                </div>
                            </div>
                        </div>

                        <div style={styles.statCard}>
                            <div
                                style={{
                                    ...styles.statIcon,
                                    background: darkMode
                                        ? "rgba(239,68,68,0.12)"
                                        : "#fff0f0",
                                }}
                            >
                                ◌
                            </div>
                            <div>
                                <div style={styles.statLabel}>
                                    Inactive staff
                                </div>
                                <div style={styles.statValue}>
                                    {inactiveCount}
                                </div>
                            </div>
                        </div>

                        <div style={styles.statCard}>
                            <div style={styles.statIcon}>🏢</div>
                            <div>
                                <div style={styles.statLabel}>
                                    Exhibitors represented
                                </div>
                                <div style={styles.statValue}>
                                    {exhibitorCount}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* ADD / EDIT FORM */}
                {showForm && canManage && (
                    <section
                        className="es-staff-form"
                        style={styles.formCard}
                    >
                        <div style={styles.eyebrow}>
                            {editingStaff
                                ? "✎ EDIT STAFF MEMBER"
                                : "+ TEAM MANAGEMENT"}
                        </div>

                        <h2 style={styles.formTitle}>
                            {editingStaff
                                ? "Update staff details"
                                : "Add a new team member"}
                        </h2>

                        <p style={styles.formDescription}>
                            Fill in the staff details below. All fields except
                            status are required.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div style={styles.formGrid}>
                                <div style={styles.field}>
                                    <label
                                        htmlFor="staff-exhibitor"
                                        style={styles.label}
                                    >
                                        Exhibitor *
                                    </label>

                                    <select
                                        id="staff-exhibitor"
                                        className="es-staff-input"
                                        name="exhibitor"
                                        value={formData.exhibitor}
                                        onChange={handleChange}
                                        required
                                        style={styles.input}
                                    >
                                        <option value="">
                                            Select exhibitor
                                        </option>

                                        {exhibitors.map((exhibitor) => (
                                            <option
                                                key={exhibitor._id}
                                                value={exhibitor._id}
                                            >
                                                {exhibitor.companyName ||
                                                    exhibitor.name ||
                                                    exhibitor._id}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div style={styles.field}>
                                    <label
                                        htmlFor="staff-name"
                                        style={styles.label}
                                    >
                                        Full name *
                                    </label>

                                    <input
                                        id="staff-name"
                                        className="es-staff-input"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter full name"
                                        required
                                        style={styles.input}
                                    />
                                </div>

                                <div style={styles.field}>
                                    <label
                                        htmlFor="staff-email"
                                        style={styles.label}
                                    >
                                        Email address *
                                    </label>

                                    <input
                                        id="staff-email"
                                        className="es-staff-input"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="staff@example.com"
                                        required
                                        style={styles.input}
                                    />
                                </div>

                                <div style={styles.field}>
                                    <label
                                        htmlFor="staff-phone"
                                        style={styles.label}
                                    >
                                        Phone number *
                                    </label>

                                    <input
                                        id="staff-phone"
                                        className="es-staff-input"
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                        required
                                        style={styles.input}
                                    />
                                </div>

                                <div style={styles.field}>
                                    <label
                                        htmlFor="staff-designation"
                                        style={styles.label}
                                    >
                                        Designation *
                                    </label>

                                    <input
                                        id="staff-designation"
                                        className="es-staff-input"
                                        type="text"
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleChange}
                                        placeholder="e.g. Sales Manager"
                                        required
                                        style={styles.input}
                                    />
                                </div>

                                <div style={styles.field}>
                                    <label
                                        htmlFor="staff-status"
                                        style={styles.label}
                                    >
                                        Account status
                                    </label>

                                    <select
                                        id="staff-status"
                                        className="es-staff-input"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        style={styles.input}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "10px",
                                    marginTop: "24px",
                                }}
                            >
                                <button
                                    type="submit"
                                    className="es-staff-button"
                                    disabled={saving}
                                    style={styles.primaryButton}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingStaff
                                          ? "✓ Update Staff"
                                          : "+ Create Staff"}
                                </button>

                                <button
                                    type="button"
                                    className="es-staff-button"
                                    onClick={closeForm}
                                    disabled={saving}
                                    style={{
                                        ...styles.dashboardLink,
                                        cursor: saving ? "wait" : "pointer",
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </section>
                )}

                {/* LOADING */}
                {loading && (
                    <div style={styles.emptyState}>
                        <div
                            style={{
                                ...styles.emptyIcon,
                                border: "3px solid rgba(22,143,255,0.15)",
                                borderTopColor: theme.accent,
                                borderRadius: "50%",
                                animation: "esStaffSpin 0.8s linear infinite",
                            }}
                        />

                        <h2 style={styles.emptyTitle}>
                            Loading team members
                        </h2>

                        <p style={styles.emptyText}>
                            Please wait while we load your staff records.
                        </p>
                    </div>
                )}

                {/* STAFF TOOLBAR */}
                {!loading && staff.length > 0 && (
                    <>
                        <section style={styles.toolbar}>
                            <div>
                                <h2 style={styles.toolbarTitle}>
                                    Your Team
                                </h2>

                                <div style={styles.toolbarCaption}>
                                    Showing {filteredStaff.length} of{" "}
                                    {staff.length} team members
                                </div>
                            </div>
                        </section>

                        <div style={styles.filters}>
                            <input
                                className="es-staff-input"
                                type="search"
                                aria-label="Search staff"
                                placeholder="⌕  Search name, email, designation..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                style={styles.search}
                            />

                            <select
                                className="es-staff-input"
                                aria-label="Filter by status"
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(event.target.value)
                                }
                                style={styles.select}
                            >
                                <option value="all">All statuses</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </>
                )}

                {/* EMPTY STATE */}
                {!loading && filteredStaff.length === 0 && (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>
                            {staff.length === 0 ? "👥" : "⌕"}
                        </div>

                        <h2 style={styles.emptyTitle}>
                            {staff.length === 0
                                ? "No staff members yet"
                                : "No matching staff"}
                        </h2>

                        <p style={styles.emptyText}>
                            {staff.length === 0
                                ? "Your team list is empty. Add a staff member to get started."
                                : "Try a different search term or status filter."}
                        </p>

                        {staff.length > 0 && (
                            <button
                                type="button"
                                className="es-staff-button"
                                onClick={() => {
                                    setSearch("");
                                    setStatusFilter("all");
                                }}
                                style={{
                                    ...styles.primaryButton,
                                    marginTop: "20px",
                                }}
                            >
                                Clear filters
                            </button>
                        )}

                        {canManage && staff.length === 0 && (
                            <button
                                type="button"
                                className="es-staff-button"
                                onClick={openAddForm}
                                style={{
                                    ...styles.primaryButton,
                                    marginTop: "20px",
                                }}
                            >
                                + Add First Staff Member
                            </button>
                        )}
                    </div>
                )}

                {/* STAFF CARDS */}
                {!loading && filteredStaff.length > 0 && (
                    <section style={styles.grid}>
                        {filteredStaff.map((member, index) => {
                            const isActive = member.status === "active";

                            const initials = (member.name || "S")
                                .trim()
                                .split(/\s+/)
                                .slice(0, 2)
                                .map((part) => part[0])
                                .join("")
                                .toUpperCase();

                            return (
                                <article
                                    key={member._id}
                                    className="es-staff-card"
                                    style={{
                                        ...styles.card,
                                        animationDelay: `${Math.min(index * 65, 390)}ms`,
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            justifyContent: "space-between",
                                            gap: "12px",
                                        }}
                                    >
                                        <div style={styles.avatar}>
                                            {initials}
                                        </div>

                                        <span
                                            style={{
                                                ...styles.status,
                                                color: isActive
                                                    ? darkMode
                                                        ? "#86efac"
                                                        : "#166534"
                                                    : darkMode
                                                      ? "#ffaaaa"
                                                      : "#991b1b",
                                                background: isActive
                                                    ? darkMode
                                                        ? "rgba(22,101,52,0.3)"
                                                        : "#dcfce7"
                                                    : darkMode
                                                      ? "rgba(127,29,29,0.3)"
                                                      : "#fee2e2",
                                            }}
                                        >
                                            {member.status || "unknown"}
                                        </span>
                                    </div>

                                    <h3 style={styles.memberName}>
                                        {member.name || "Unnamed staff"}
                                    </h3>

                                    <div style={styles.designation}>
                                        {member.designation ||
                                            "No designation"}
                                    </div>

                                    <div style={styles.details}>
                                        <div style={styles.detail}>
                                            <span style={styles.detailIcon}>
                                                <span>✉</span>
                                            </span>

                                            <span>
                                                {member.email || "No email"}
                                            </span>
                                        </div>

                                        <div style={styles.detail}>
                                            <span style={styles.detailIcon}>
                                                <span>☎</span>
                                            </span>

                                            <span>
                                                {member.phone || "No phone"}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={styles.exhibitor}>
                                        <div style={styles.exhibitorLabel}>
                                            EXHIBITOR
                                        </div>

                                        <p style={styles.exhibitorName}>
                                            {member.exhibitor?.companyName ||
                                                "Unknown Exhibitor"}
                                        </p>
                                    </div>

                                    {canManage && (
                                        <div style={styles.actions}>
                                            <button
                                                type="button"
                                                className="es-staff-button"
                                                onClick={() =>
                                                    openEditForm(member)
                                                }
                                                style={{
                                                    ...styles.actionButton,
                                                    color: theme.accent,
                                                    background: darkMode
                                                        ? "rgba(22,143,255,0.12)"
                                                        : "#edf7ff",
                                                    borderColor: darkMode
                                                        ? "rgba(22,143,255,0.2)"
                                                        : "#d8ecff",
                                                }}
                                            >
                                                ✎ Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="es-staff-button"
                                                onClick={() =>
                                                    deleteStaff(member._id)
                                                }
                                                disabled={
                                                    deletingId === member._id
                                                }
                                                style={{
                                                    ...styles.actionButton,
                                                    color: darkMode
                                                        ? "#ff9999"
                                                        : "#c62828",
                                                    background: darkMode
                                                        ? "rgba(239,68,68,0.1)"
                                                        : "#fff1f1",
                                                    borderColor:
                                                        "rgba(239,68,68,0.15)",
                                                }}
                                            >
                                                {deletingId === member._id
                                                    ? "Deleting..."
                                                    : "⌫ Delete"}
                                            </button>
                                        </div>
                                    )}
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
                        textAlign: "center",
                        letterSpacing: "0.3px",
                    }}
                >
                    EventSphere · Every event, one place.
                </footer>
            </main>
        </div>
    );
}

export default Staff;