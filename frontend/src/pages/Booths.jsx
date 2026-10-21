import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "api";

const EMPTY_FORM = {
    expo: "",
    exhibitor: "",
    boothNumber: "",
    location: "",
    size: "",
    status: "available",
};

function Booths() {
    const [booths, setBooths] = useState([]);
    const [exhibitors, setExhibitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exhibitorsLoading, setExhibitorsLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingBooth, setEditingBooth] = useState(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("eventSphereDarkMode") !== "false"
    );

    const [formData, setFormData] = useState({ ...EMPTY_FORM });

    const token = localStorage.getItem("token");

    const user = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "null");
        } catch {
            return null;
        }
    }, []);

    const userRole = user?.role;
    const canManage = ["admin", "organizer"].includes(userRole);

    const theme = darkMode
        ? {
              background: "#070b16",
              surface: "#0e1628",
              surface2: "#111d32",
              input: "#091326",
              text: "#f4f7ff",
              muted: "#91a0b9",
              border: "rgba(148,163,184,.15)",
              divider: "rgba(148,163,184,.12)",
              softBlue: "rgba(37,99,235,.14)",
              softBlueBorder: "rgba(96,165,250,.22)",
              shadow: "0 18px 45px rgba(0,0,0,.20)",
              grid: "rgba(96,165,250,.045)",
          }
        : {
              background: "#f3f6fc",
              surface: "#ffffff",
              surface2: "#f8faff",
              input: "#ffffff",
              text: "#111c32",
              muted: "#697991",
              border: "#e1e8f2",
              divider: "#e7edf5",
              softBlue: "#edf4ff",
              softBlueBorder: "#cfe0ff",
              shadow: "0 18px 45px rgba(27,48,85,.065)",
              grid: "rgba(37,99,235,.045)",
          };

    useEffect(() => {
        const syncDarkMode = () => {
            setDarkMode(
                localStorage.getItem("eventSphereDarkMode") !== "false"
            );
        };

        window.addEventListener("storage", syncDarkMode);
        const interval = setInterval(syncDarkMode, 700);

        return () => {
            window.removeEventListener("storage", syncDarkMode);
            clearInterval(interval);
        };
    }, []);

    const loadBooths = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(`${API}/booths`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data =
                response.data.booths ||
                response.data.data ||
                [];

            setBooths(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                    "Unable to load booths. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, [token]);

    const loadExhibitors = useCallback(async () => {
        try {
            setExhibitorsLoading(true);

            const response = await axios.get(`${API}/exhibitors`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data =
                response.data.exhibitors ||
                response.data.data ||
                [];

            setExhibitors(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setExhibitorsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        loadBooths();
        loadExhibitors();
    }, [loadBooths, loadExhibitors]);

    const stats = useMemo(() => {
        const available = booths.filter(
            (booth) => booth.status === "available"
        ).length;

        const occupied = booths.filter(
            (booth) => booth.status === "occupied"
        ).length;

        return {
            total: booths.length,
            available,
            occupied,
            occupancy: booths.length
                ? Math.round((occupied / booths.length) * 100)
                : 0,
        };
    }, [booths]);

    const filteredBooths = useMemo(() => {
        const query = search.trim().toLowerCase();

        return booths.filter((booth) => {
            const exhibitorName =
                booth.exhibitor?.companyName ||
                booth.exhibitor?.name ||
                "";

            const matchesSearch = [
                booth.boothNumber,
                booth.location,
                booth.size,
                booth.status,
                exhibitorName,
                booth.expo?.title,
            ].some((value) =>
                String(value || "").toLowerCase().includes(query)
            );

            const matchesStatus =
                statusFilter === "all" ||
                booth.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [booths, search, statusFilter]);

    const clearMessages = () => {
        setError("");
        setSuccess("");
    };

    const openAddForm = () => {
        setEditingBooth(null);
        setFormData({ ...EMPTY_FORM });
        clearMessages();
        setShowForm(true);

        setTimeout(() => {
            document
                .getElementById("booth-form")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
    };

    const openEditForm = (booth) => {
        setEditingBooth(booth);

        setFormData({
            expo: booth.expo?._id || booth.expo || "",
            exhibitor: booth.exhibitor?._id || booth.exhibitor || "",
            boothNumber: booth.boothNumber || "",
            location: booth.location || "",
            size: booth.size || "",
            status: booth.status || "available",
        });

        clearMessages();
        setShowForm(true);

        setTimeout(() => {
            document
                .getElementById("booth-form")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingBooth(null);
        setFormData({ ...EMPTY_FORM });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        clearMessages();

        if (
            !formData.expo.trim() ||
            !formData.boothNumber.trim() ||
            !formData.location.trim()
        ) {
            setError("Expo, booth number and location are required.");
            return;
        }

        const payload = {
            expo: formData.expo.trim(),
            exhibitor: formData.exhibitor || null,
            boothNumber: formData.boothNumber.trim(),
            location: formData.location.trim(),
            size: formData.size.trim(),
            status: formData.status,
        };

        try {
            setSaving(true);

            if (editingBooth) {
                const response = await axios.put(
                    `${API}/booths/${editingBooth._id}`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                setSuccess(
                    response.data.message || "Booth updated successfully."
                );
            } else {
                const response = await axios.post(
                    `${API}/booths`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                setSuccess(
                    response.data.message || "Booth created successfully."
                );
            }

            closeForm();
            await loadBooths();
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                    "Unable to save booth. Please check your details."
            );
        } finally {
            setSaving(false);
        }
    };

    const deleteBooth = async (id) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this booth?"
            )
        ) {
            return;
        }

        clearMessages();

        try {
            setDeletingId(id);

            const response = await axios.delete(`${API}/booths/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setBooths((previous) =>
                previous.filter((booth) => booth._id !== id)
            );

            if (editingBooth?._id === id) closeForm();

            setSuccess(
                response.data.message || "Booth deleted successfully."
            );
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                    "Unable to delete booth. Please try again."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (value) => {
        if (!value) return "Not specified";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) return String(value);

        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const cardStyle = {
        background: theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: "21px",
        boxShadow: theme.shadow,
    };

    const primaryButton = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "9px",
        padding: "12px 18px",
        border: "1px solid rgba(147,197,253,.18)",
        borderRadius: "12px",
        background:
            "linear-gradient(120deg, #1d4ed8, #2563eb 60%, #3b82f6)",
        color: "#ffffff",
        textDecoration: "none",
        fontSize: "13px",
        fontWeight: 800,
        cursor: "pointer",
        boxShadow: "0 9px 22px rgba(37,99,235,.20)",
        whiteSpace: "nowrap",
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                padding: "28px clamp(16px, 4vw, 48px) 55px",
                background: theme.background,
                backgroundImage: `radial-gradient(${theme.grid} 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
                color: theme.text,

                // Login page ka normal writing font
                fontFamily: "Inter, Arial, Helvetica, sans-serif",

                transition: "background .25s ease, color .25s ease",
                overflow: "hidden",
            }}
        >
            <style>{`
                @keyframes boothRise {
                    from { opacity: 0; transform: translateY(17px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes boothFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-6px); }
                }

                @keyframes boothSpin {
                    to { transform: rotate(360deg); }
                }

                .booth-enter {
                    animation: boothRise .55s ease both;
                }

                .booth-card {
                    transition: transform .23s ease, border-color .23s ease,
                        box-shadow .23s ease;
                }

                .booth-card:hover {
                    transform: translateY(-5px);
                    border-color: rgba(59,130,246,.42) !important;
                    box-shadow: 0 24px 55px rgba(37,99,235,.12) !important;
                }

                .booth-button {
                    transition: transform .2s ease, filter .2s ease,
                        box-shadow .2s ease;
                }

                .booth-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    filter: brightness(1.08);
                }

                .booth-input {
                    transition: border-color .2s ease, box-shadow .2s ease;
                }

                .booth-input:focus {
                    outline: none;
                    border-color: #3b82f6 !important;
                    box-shadow: 0 0 0 3px rgba(59,130,246,.14);
                }

                .booth-icon {
                    animation: boothFloat 4s ease-in-out infinite;
                }

                .booth-detail {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    padding: 11px 0;
                    border-bottom: 1px solid var(--booth-divider);
                    font-size: 13px;
                }

                .booth-detail:last-child {
                    border-bottom: none;
                }

                .booth-skeleton {
                    height: 290px;
                    border-radius: 21px;
                    background: linear-gradient(
                        100deg,
                        ${theme.surface} 20%,
                        ${theme.surface2} 40%,
                        ${theme.surface} 60%
                    );
                    background-size: 200% 100%;
                    animation: boothShimmer 1.4s linear infinite;
                    border: 1px solid ${theme.border};
                }

                @keyframes boothShimmer {
                    to { background-position-x: -200%; }
                }

                /* Login page ke headings wala serif font */
                .booth-title,
                .booth-form-title,
                .booth-section-title,
                .booth-empty-title,
                .booth-card-title {
                    font-family: Georgia, "Times New Roman", serif;
                }

                @media (max-width: 640px) {
                    .booth-header {
                        align-items: stretch !important;
                    }

                    .booth-header-actions {
                        width: 100%;
                    }

                    .booth-header-actions > * {
                        flex: 1;
                    }

                    .booth-hero {
                        padding: 24px !important;
                    }

                    .booth-title {
                        font-size: 36px !important;
                    }

                    .booth-form-grid {
                        grid-template-columns: 1fr !important;
                    }

                    .booth-stats {
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                    }

                    .booth-toolbar {
                        align-items: stretch !important;
                        flex-direction: column !important;
                    }

                    .booth-search {
                        width: 100% !important;
                        box-sizing: border-box;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .booth-enter, .booth-icon, .booth-skeleton {
                        animation: none !important;
                    }

                    .booth-card, .booth-button, .booth-input {
                        transition: none !important;
                    }
                }
            `}</style>

            <main style={{ maxWidth: "1200px", margin: "0 auto" }}>
                {/* HEADER */}
                <header
                    className="booth-header booth-enter"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "20px",
                        flexWrap: "wrap",
                        marginBottom: "25px",
                    }}
                >
                    <Link
                        to="/dashboard"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "11px",
                            color: theme.text,
                            textDecoration: "none",
                        }}
                    >
                        <div
                            style={{
                                width: "43px",
                                height: "43px",
                                borderRadius: "14px",
                                display: "grid",
                                placeItems: "center",
                                color: "#fff",
                                fontWeight: 900,
                                fontSize: "20px",
                                background:
                                    "linear-gradient(135deg, #1e40af, #3b82f6)",
                                boxShadow: "0 8px 22px rgba(37,99,235,.24)",
                            }}
                        >
                            E
                        </div>

                        <div>
                            <div style={{ fontWeight: 900, fontSize: "18px" }}>
                                Event<span style={{ color: "#60a5fa" }}>Sphere</span>
                            </div>
                            <div
                                style={{
                                    color: theme.muted,
                                    fontSize: "11px",
                                    marginTop: "3px",
                                }}
                            >
                                EVENT MANAGEMENT
                            </div>
                        </div>
                    </Link>

                    <div
                        className="booth-header-actions"
                        style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",
                        }}
                    >
                        <button
                            type="button"
                            className="booth-button"
                            onClick={loadBooths}
                            disabled={loading}
                            style={{
                                ...primaryButton,
                                background: theme.surface,
                                color: theme.text,
                                border: `1px solid ${theme.border}`,
                                boxShadow: "none",
                                opacity: loading ? 0.65 : 1,
                            }}
                        >
                            <span>↻</span> Refresh
                        </button>

                        <Link
                            to="/dashboard"
                            className="booth-button"
                            style={primaryButton}
                        >
                            <span>←</span> Dashboard
                        </Link>
                    </div>
                </header>

                {/* HERO */}
                <section
                    className="booth-hero booth-enter"
                    style={{
                        ...cardStyle,
                        position: "relative",
                        overflow: "hidden",
                        padding: "clamp(28px, 5vw, 48px)",
                        marginBottom: "22px",
                        background: darkMode
                            ? "linear-gradient(115deg, #0b1730 0%, #0e1628 58%, #10264a 100%)"
                            : "linear-gradient(115deg, #ffffff 0%, #eff6ff 60%, #dbeafe 100%)",
                        animationDelay: ".05s",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            width: "290px",
                            height: "290px",
                            borderRadius: "50%",
                            background: "#2563eb",
                            opacity: darkMode ? 0.15 : 0.09,
                            filter: "blur(75px)",
                            right: "-60px",
                            top: "-120px",
                            pointerEvents: "none",
                        }}
                    />

                    <div
                        style={{
                            position: "absolute",
                            right: "7%",
                            top: "10%",
                            fontSize: "clamp(85px, 15vw, 160px)",
                            opacity: darkMode ? 0.1 : 0.08,
                            pointerEvents: "none",
                        }}
                        className="booth-icon"
                    >
                        ▦
                    </div>

                    <div style={{ position: "relative", maxWidth: "710px" }}>
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "7px 12px",
                                borderRadius: "999px",
                                border: `1px solid ${theme.softBlueBorder}`,
                                background: theme.softBlue,
                                color: darkMode ? "#93c5fd" : "#1d4ed8",
                                fontSize: "10px",
                                fontWeight: 850,
                                letterSpacing: "1.4px",
                                marginBottom: "20px",
                            }}
                        >
                            <span>✦</span> EXHIBITION MANAGEMENT
                        </div>

                        <h1
                            className="booth-title"
                            style={{
                                margin: 0,
                                fontSize: "clamp(38px, 5vw, 54px)",
                                fontWeight: 900,
                                lineHeight: 1.06,
                                letterSpacing: "-2px",
                            }}
                        >
                            Booths{" "}
                            <span style={{ color: "#60a5fa" }}>
                                Management
                            </span>
                        </h1>

                        <p
                            style={{
                                maxWidth: "550px",
                                color: theme.muted,
                                fontSize: "14px",
                                lineHeight: 1.85,
                                margin: "17px 0 25px",
                            }}
                        >
                            Organize your exhibition space, manage booth assignments,
                            and keep track of availability from one place.
                        </p>

                        {canManage && (
                            <button
                                type="button"
                                className="booth-button"
                                onClick={() => {
                                    if (showForm) closeForm();
                                    else openAddForm();
                                }}
                                style={primaryButton}
                            >
                                <span>{showForm ? "×" : "+"}</span>
                                {showForm ? "Close Form" : "Create New Booth"}
                            </button>
                        )}
                    </div>
                </section>

                {/* ALERTS */}
                {success && (
                    <div
                        role="status"
                        className="booth-enter"
                        style={{
                            marginBottom: "18px",
                            padding: "14px 17px",
                            borderRadius: "13px",
                            border: `1px solid ${
                                darkMode
                                    ? "rgba(74,222,128,.2)"
                                    : "#bbf7d0"
                            }`,
                            background: darkMode
                                ? "rgba(22,101,52,.18)"
                                : "#f0fdf4",
                            color: darkMode ? "#86efac" : "#166534",
                            fontSize: "13px",
                            fontWeight: 700,
                        }}
                    >
                        ✓ {success}
                    </div>
                )}

                {error && (
                    <div
                        role="alert"
                        className="booth-enter"
                        style={{
                            marginBottom: "18px",
                            padding: "14px 17px",
                            borderRadius: "13px",
                            border: `1px solid ${
                                darkMode
                                    ? "rgba(248,113,113,.22)"
                                    : "#fecaca"
                            }`,
                            background: darkMode
                                ? "rgba(127,29,29,.2)"
                                : "#fef2f2",
                            color: darkMode ? "#fca5a5" : "#991b1b",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: "12px",
                            fontSize: "13px",
                        }}
                    >
                        <span>⚠ {error}</span>
                        <button
                            type="button"
                            onClick={loadBooths}
                            className="booth-button"
                            style={{
                                border: 0,
                                background: "transparent",
                                color: "inherit",
                                fontWeight: 800,
                                cursor: "pointer",
                            }}
                        >
                            Try again ↗
                        </button>
                    </div>
                )}

                {/* STATS */}
                <section
                    className="booth-stats booth-enter"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                        gap: "15px",
                        marginBottom: "30px",
                        animationDelay: ".1s",
                    }}
                >
                    <StatCard
                        label="Total Booths"
                        value={stats.total}
                        icon="▦"
                        accent="#60a5fa"
                        theme={theme}
                    />
                    <StatCard
                        label="Available"
                        value={stats.available}
                        icon="✓"
                        accent="#34d399"
                        theme={theme}
                    />
                    <StatCard
                        label="Occupied"
                        value={stats.occupied}
                        icon="◈"
                        accent="#fbbf24"
                        theme={theme}
                    />
                    <StatCard
                        label="Occupancy Rate"
                        value={`${stats.occupancy}%`}
                        icon="↗"
                        accent="#818cf8"
                        theme={theme}
                    />
                </section>

                {/* ADD / EDIT FORM */}
                {showForm && canManage && (
                    <section
                        id="booth-form"
                        className="booth-enter"
                        style={{
                            ...cardStyle,
                            padding: "clamp(20px, 4vw, 32px)",
                            marginBottom: "30px",
                            scrollMarginTop: "20px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "13px",
                                marginBottom: "24px",
                            }}
                        >
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "15px",
                                    display: "grid",
                                    placeItems: "center",
                                    background: theme.softBlue,
                                    color: "#60a5fa",
                                    fontSize: "23px",
                                }}
                            >
                                {editingBooth ? "✎" : "+"}
                            </div>

                            <div style={{ flex: 1 }}>
                                <h2
                                    className="booth-form-title"
                                    style={{
                                        margin: 0,
                                        fontSize: "22px",
                                        letterSpacing: "-.5px",
                                    }}
                                >
                                    {editingBooth
                                        ? "Edit Booth Details"
                                        : "Create a Booth"}
                                </h2>
                                <p
                                    style={{
                                        color: theme.muted,
                                        margin: "6px 0 0",
                                        fontSize: "13px",
                                    }}
                                >
                                    Enter the details below to{" "}
                                    {editingBooth
                                        ? "update this booth."
                                        : "add it to your exhibition."}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div
                                className="booth-form-grid"
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(2, minmax(0, 1fr))",
                                    gap: "18px",
                                }}
                            >
                                <FormField label="Expo ID" required theme={theme}>
                                    <input
                                        className="booth-input"
                                        name="expo"
                                        value={formData.expo}
                                        onChange={handleChange}
                                        placeholder="Enter the Expo ID"
                                        required
                                        style={inputStyle(theme)}
                                    />
                                </FormField>

                                <FormField label="Exhibitor" theme={theme}>
                                    <select
                                        className="booth-input"
                                        name="exhibitor"
                                        value={formData.exhibitor}
                                        onChange={handleChange}
                                        style={inputStyle(theme)}
                                    >
                                        <option value="">Unassigned</option>
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
                                    {exhibitorsLoading && (
                                        <small style={{ color: theme.muted }}>
                                            Loading exhibitors…
                                        </small>
                                    )}
                                </FormField>

                                <FormField
                                    label="Booth Number"
                                    required
                                    theme={theme}
                                >
                                    <input
                                        className="booth-input"
                                        name="boothNumber"
                                        value={formData.boothNumber}
                                        onChange={handleChange}
                                        placeholder="e.g. B-101"
                                        required
                                        style={inputStyle(theme)}
                                    />
                                </FormField>

                                <FormField label="Location" required theme={theme}>
                                    <input
                                        className="booth-input"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g. Main Hall, Zone A"
                                        required
                                        style={inputStyle(theme)}
                                    />
                                </FormField>

                                <FormField label="Booth Size" theme={theme}>
                                    <input
                                        className="booth-input"
                                        name="size"
                                        value={formData.size}
                                        onChange={handleChange}
                                        placeholder="e.g. 10x10 ft"
                                        style={inputStyle(theme)}
                                    />
                                </FormField>

                                <FormField
                                    label="Availability Status"
                                    theme={theme}
                                >
                                    <select
                                        className="booth-input"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        style={inputStyle(theme)}
                                    >
                                        <option value="available">
                                            Available
                                        </option>
                                        <option value="occupied">
                                            Occupied
                                        </option>
                                    </select>
                                </FormField>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    flexWrap: "wrap",
                                    marginTop: "25px",
                                    paddingTop: "22px",
                                    borderTop: `1px solid ${theme.divider}`,
                                }}
                            >
                                <button
                                    type="submit"
                                    className="booth-button"
                                    disabled={saving}
                                    style={{
                                        ...primaryButton,
                                        opacity: saving ? 0.7 : 1,
                                        cursor: saving ? "wait" : "pointer",
                                    }}
                                >
                                    {saving
                                        ? "Saving…"
                                        : editingBooth
                                          ? "✓ Update Booth"
                                          : "+ Create Booth"}
                                </button>

                                <button
                                    type="button"
                                    className="booth-button"
                                    onClick={closeForm}
                                    disabled={saving}
                                    style={{
                                        padding: "12px 18px",
                                        borderRadius: "12px",
                                        background: theme.surface2,
                                        color: theme.text,
                                        border: `1px solid ${theme.border}`,
                                        fontWeight: 750,
                                        cursor: "pointer",
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </section>
                )}

                {/* SEARCH AND FILTER */}
                <section
                    className="booth-toolbar booth-enter"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "18px",
                        flexWrap: "wrap",
                        marginBottom: "19px",
                        animationDelay: ".15s",
                    }}
                >
                    <div>
                        <h2
                            className="booth-section-title"
                            style={{
                                margin: 0,
                                fontSize: "22px",
                                letterSpacing: "-.5px",
                            }}
                        >
                            Exhibition Booths
                        </h2>
                        <p
                            style={{
                                margin: "6px 0 0",
                                color: theme.muted,
                                fontSize: "13px",
                            }}
                        >
                            Browse, search and manage booth assignments.
                        </p>
                    </div>

                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        <div style={{ position: "relative" }}>
                            <span
                                style={{
                                    position: "absolute",
                                    left: "13px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: theme.muted,
                                    pointerEvents: "none",
                                }}
                            >
                                ⌕
                            </span>
                            <input
                                className="booth-input booth-search"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search booths…"
                                aria-label="Search booths"
                                style={{
                                    ...inputStyle(theme),
                                    width: "225px",
                                    paddingLeft: "36px",
                                }}
                            />
                        </div>

                        <select
                            className="booth-input"
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                            aria-label="Filter booths by status"
                            style={{
                                ...inputStyle(theme),
                                width: "auto",
                                minWidth: "140px",
                                cursor: "pointer",
                            }}
                        >
                            <option value="all">All statuses</option>
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                        </select>
                    </div>
                </section>

                {/* LOADING SKELETON */}
                {loading && (
                    <section
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
                            gap: "18px",
                        }}
                    >
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="booth-skeleton" />
                        ))}
                    </section>
                )}

                {/* EMPTY STATE */}
                {!loading && filteredBooths.length === 0 && (
                    <section
                        className="booth-enter"
                        style={{
                            ...cardStyle,
                            padding: "clamp(30px, 6vw, 60px) 24px",
                            textAlign: "center",
                        }}
                    >
                        <div
                            className="booth-icon"
                            style={{
                                width: "78px",
                                height: "78px",
                                margin: "0 auto 22px",
                                display: "grid",
                                placeItems: "center",
                                borderRadius: "24px",
                                background: theme.softBlue,
                                border: `1px solid ${theme.softBlueBorder}`,
                                fontSize: "34px",
                            }}
                        >
                            ▦
                        </div>

                        <span
                            style={{
                                color: "#60a5fa",
                                fontSize: "10px",
                                fontWeight: 850,
                                letterSpacing: "1.5px",
                            }}
                        >
                            YOUR EXHIBITION WORKSPACE
                        </span>

                        <h3
                            className="booth-empty-title"
                            style={{
                                margin: "10px 0 8px",
                                fontSize: "24px",
                            }}
                        >
                            {booths.length === 0
                                ? "No booths yet"
                                : "No matching booths"}
                        </h3>

                        <p
                            style={{
                                maxWidth: "430px",
                                margin: "0 auto 22px",
                                color: theme.muted,
                                fontSize: "14px",
                                lineHeight: 1.8,
                            }}
                        >
                            {booths.length === 0
                                ? "Your booth inventory will appear here. Create your first booth to get started."
                                : "Try another search term or change the status filter to find a booth."}
                        </p>

                        {booths.length > 0 ? (
                            <button
                                type="button"
                                className="booth-button"
                                onClick={() => {
                                    setSearch("");
                                    setStatusFilter("all");
                                }}
                                style={primaryButton}
                            >
                                Clear filters
                            </button>
                        ) : canManage ? (
                            <button
                                type="button"
                                className="booth-button"
                                onClick={openAddForm}
                                style={primaryButton}
                            >
                                + Create your first booth
                            </button>
                        ) : null}
                    </section>
                )}

                {/* BOOTH CARDS */}
                {!loading && filteredBooths.length > 0 && (
                    <>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "12px",
                                marginBottom: "14px",
                                color: theme.muted,
                                fontSize: "12px",
                            }}
                        >
                            <span>
                                Showing{" "}
                                <strong style={{ color: theme.text }}>
                                    {filteredBooths.length}
                                </strong>{" "}
                                of{" "}
                                <strong style={{ color: theme.text }}>
                                    {booths.length}
                                </strong>{" "}
                                booths
                            </span>
                            <span>Updated from your booth inventory</span>
                        </div>

                        <section
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
                                gap: "18px",
                                alignItems: "stretch",
                            }}
                        >
                            {filteredBooths.map((booth, index) => {
                                const occupied = booth.status === "occupied";

                                const exhibitorName =
                                    booth.exhibitor?.companyName ||
                                    booth.exhibitor?.name ||
                                    "Unassigned";

                                return (
                                    <article
                                        key={booth._id}
                                        className="booth-card booth-enter"
                                        style={{
                                            ...cardStyle,
                                            padding: "23px",
                                            minWidth: 0,
                                            display: "flex",
                                            flexDirection: "column",
                                            animationDelay: `${Math.min(
                                                index * 0.055,
                                                0.3
                                            )}s`,
                                        }}
                                    >
                                        {/* Card heading */}
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                                gap: "13px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    flexShrink: 0,
                                                    width: "49px",
                                                    height: "49px",
                                                    display: "grid",
                                                    placeItems: "center",
                                                    borderRadius: "15px",
                                                    background:
                                                        "linear-gradient(135deg, rgba(37,99,235,.2), rgba(59,130,246,.07))",
                                                    border: "1px solid rgba(96,165,250,.18)",
                                                    color: "#60a5fa",
                                                    fontSize: "23px",
                                                }}
                                            >
                                                ▦
                                            </div>

                                            <div
                                                style={{
                                                    minWidth: 0,
                                                    flex: 1,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontSize: "10px",
                                                        fontWeight: 850,
                                                        letterSpacing: "1.3px",
                                                        color: "#60a5fa",
                                                    }}
                                                >
                                                    BOOTH NUMBER
                                                </span>

                                                <h3
                                                    className="booth-card-title"
                                                    style={{
                                                        margin: "4px 0 0",
                                                        fontSize: "22px",
                                                        fontWeight: 850,
                                                        letterSpacing: "-.5px",
                                                        overflowWrap: "anywhere",
                                                    }}
                                                >
                                                    {booth.boothNumber ||
                                                        "Unnumbered"}
                                                </h3>
                                            </div>

                                            <span
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                    padding: "6px 9px",
                                                    borderRadius: "999px",
                                                    fontSize: "10px",
                                                    fontWeight: 850,
                                                    textTransform: "capitalize",
                                                    whiteSpace: "nowrap",
                                                    color: occupied
                                                        ? darkMode
                                                            ? "#fbbf24"
                                                            : "#92400e"
                                                        : darkMode
                                                          ? "#86efac"
                                                          : "#166534",
                                                    background: occupied
                                                        ? darkMode
                                                            ? "rgba(245,158,11,.12)"
                                                            : "#fffbeb"
                                                        : darkMode
                                                          ? "rgba(34,197,94,.12)"
                                                          : "#f0fdf4",
                                                    border: `1px solid ${
                                                        occupied
                                                            ? darkMode
                                                                ? "rgba(251,191,36,.2)"
                                                                : "#fde68a"
                                                            : darkMode
                                                              ? "rgba(74,222,128,.2)"
                                                              : "#bbf7d0"
                                                    }`,
                                                }}
                                            >
                                                <span>●</span>
                                                {booth.status || "unknown"}
                                            </span>
                                        </div>

                                        {/* Location */}
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                marginTop: "17px",
                                                color: theme.muted,
                                                fontSize: "13px",
                                            }}
                                        >
                                            <span>⌖</span>
                                            <span style={{ overflowWrap: "anywhere" }}>
                                                {booth.location ||
                                                    "Location not specified"}
                                            </span>
                                        </div>

                                        {/* Details */}
                                        <div
                                            style={{
                                                marginTop: "18px",
                                                padding: "4px 14px",
                                                borderRadius: "14px",
                                                background: theme.surface2,
                                                border: `1px solid ${theme.border}`,
                                                "--booth-divider": theme.divider,
                                            }}
                                        >
                                            <DetailRow
                                                icon="📐"
                                                label="Booth size"
                                                value={
                                                    booth.size || "Not specified"
                                                }
                                                theme={theme}
                                            />

                                            <DetailRow
                                                icon="🏢"
                                                label="Exhibitor"
                                                value={exhibitorName}
                                                theme={theme}
                                            />

                                            <DetailRow
                                                icon="🎟"
                                                label="Expo"
                                                value={
                                                    booth.expo?.title ||
                                                    (typeof booth.expo === "string"
                                                        ? booth.expo
                                                        : booth.expo?._id) ||
                                                    "Not specified"
                                                }
                                                theme={theme}
                                            />
                                        </div>

                                        {/* Assignment indicator */}
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                                padding: "14px 0 0",
                                                marginTop: "auto",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "31px",
                                                    height: "31px",
                                                    display: "grid",
                                                    placeItems: "center",
                                                    borderRadius: "10px",
                                                    background: theme.softBlue,
                                                    color: "#60a5fa",
                                                    fontSize: "14px",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {booth.exhibitor ? "✓" : "＋"}
                                            </div>

                                            <div>
                                                <div
                                                    style={{
                                                        fontSize: "12px",
                                                        fontWeight: 800,
                                                    }}
                                                >
                                                    {booth.exhibitor
                                                        ? "Exhibitor assigned"
                                                        : "Awaiting assignment"}
                                                </div>
                                                <div
                                                    style={{
                                                        marginTop: "3px",
                                                        fontSize: "11px",
                                                        color: theme.muted,
                                                    }}
                                                >
                                                    {booth.exhibitor
                                                        ? "Booth has an exhibitor"
                                                        : "Ready for an exhibitor"}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        {canManage && (
                                            <div
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns: "1fr 1fr",
                                                    gap: "10px",
                                                    marginTop: "18px",
                                                    paddingTop: "17px",
                                                    borderTop: `1px solid ${theme.divider}`,
                                                }}
                                            >
                                                <button
                                                    type="button"
                                                    className="booth-button"
                                                    onClick={() =>
                                                        openEditForm(booth)
                                                    }
                                                    style={{
                                                        ...primaryButton,
                                                        padding: "11px 12px",
                                                        boxShadow: "none",
                                                        fontSize: "12px",
                                                    }}
                                                >
                                                    ✎ Edit Booth
                                                </button>

                                                <button
                                                    type="button"
                                                    className="booth-button"
                                                    onClick={() =>
                                                        deleteBooth(booth._id)
                                                    }
                                                    disabled={
                                                        deletingId === booth._id
                                                    }
                                                    style={{
                                                        padding: "11px 12px",
                                                        borderRadius: "12px",
                                                        border: `1px solid ${
                                                            darkMode
                                                                ? "rgba(248,113,113,.22)"
                                                                : "#fecaca"
                                                        }`,
                                                        background: darkMode
                                                            ? "rgba(127,29,29,.18)"
                                                            : "#fff5f5",
                                                        color: darkMode
                                                            ? "#fca5a5"
                                                            : "#b91c1c",
                                                        fontSize: "12px",
                                                        fontWeight: 800,
                                                        cursor:
                                                            deletingId ===
                                                            booth._id
                                                                ? "wait"
                                                                : "pointer",
                                                        opacity:
                                                            deletingId ===
                                                            booth._id
                                                                ? 0.6
                                                                : 1,
                                                    }}
                                                >
                                                    {deletingId === booth._id
                                                        ? "Deleting…"
                                                        : "⌫ Delete"}
                                                </button>
                                            </div>
                                        )}
                                    </article>
                                );
                            })}
                        </section>
                    </>
                )}

                {/* FOOTER */}
                <footer
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "12px",
                        borderTop: `1px solid ${theme.divider}`,
                        paddingTop: "20px",
                        marginTop: "42px",
                        color: theme.muted,
                        fontSize: "12px",
                    }}
                >
                    <span>© {new Date().getFullYear()} EventSphere</span>
                    <span>Plan better. Experience more.</span>
                </footer>
            </main>
        </div>
    );
}

function StatCard({ label, value, icon, accent, theme }) {
    return (
        <article
            className="booth-card"
            style={{
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: "18px",
                padding: "19px",
                boxShadow: theme.shadow,
                minWidth: 0,
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                }}
            >
                <span
                    style={{
                        color: theme.muted,
                        fontSize: "12px",
                        fontWeight: 650,
                        lineHeight: 1.4,
                    }}
                >
                    {label}
                </span>

                <span
                    style={{
                        width: "34px",
                        height: "34px",
                        flexShrink: 0,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: "11px",
                        background: `${accent}18`,
                        color: accent,
                        fontSize: "17px",
                        fontWeight: 900,
                    }}
                >
                    {icon}
                </span>
            </div>

            <div
                style={{
                    fontSize: "30px",
                    fontWeight: 900,
                    letterSpacing: "-1px",
                    marginTop: "15px",
                    color: theme.text,
                }}
            >
                {value}
            </div>

            <div
                style={{
                    width: "36px",
                    height: "3px",
                    borderRadius: "5px",
                    background: accent,
                    marginTop: "12px",
                }}
            />
        </article>
    );
}

function FormField({ label, required, theme, children }) {
    return (
        <div style={{ minWidth: 0 }}>
            <label
                style={{
                    display: "block",
                    marginBottom: "8px",
                    color: theme.text,
                    fontSize: "12px",
                    fontWeight: 800,
                }}
            >
                {label}
                {required && (
                    <span style={{ color: "#60a5fa" }}> *</span>
                )}
            </label>

            {children}
        </div>
    );
}

function DetailRow({ icon, label, value, theme }) {
    return (
        <div className="booth-detail">
            <span
                style={{
                    width: "19px",
                    flexShrink: 0,
                    textAlign: "center",
                }}
            >
                {icon}
            </span>

            <span
                style={{
                    width: "82px",
                    flexShrink: 0,
                    color: theme.muted,
                }}
            >
                {label}
            </span>

            <strong
                style={{
                    flex: 1,
                    minWidth: 0,
                    color: theme.text,
                    fontWeight: 650,
                    textAlign: "right",
                    overflowWrap: "anywhere",
                    lineHeight: 1.5,
                }}
            >
                {value}
            </strong>
        </div>
    );
}

const inputStyle = (theme) => ({
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    border: `1px solid ${theme.border}`,
    borderRadius: "11px",
    background: theme.input,
    color: theme.text,
    fontSize: "13px",
    fontFamily: "inherit",
});

export default Booths;