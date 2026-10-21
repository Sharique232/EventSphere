import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Bookmarks() {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [removingId, setRemovingId] = useState(null);
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("eventSphereDarkMode") !== "false"
    );

    const token = localStorage.getItem("token");

    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "null");
        } catch {
            return null;
        }
    })();

    const userId = user?._id || user?.id || localStorage.getItem("userId");

    const theme = darkMode
        ? {
              background: "#070b16",
              surface: "#0e1628",
              surfaceRaised: "#121e33",
              text: "#f4f7ff",
              muted: "#91a0b9",
              border: "rgba(148,163,184,0.16)",
              divider: "rgba(148,163,184,0.13)",
              softBlue: "rgba(37,99,235,0.14)",
              softRed: "rgba(248,113,113,0.12)",
              shadow: "0 22px 60px rgba(0,0,0,0.22)",
          }
        : {
              background: "#f4f7fc",
              surface: "#ffffff",
              surfaceRaised: "#f8faff",
              text: "#111c32",
              muted: "#66748b",
              border: "#e1e8f2",
              divider: "#e7edf5",
              softBlue: "#edf4ff",
              softRed: "#fff1f1",
              shadow: "0 18px 45px rgba(27,48,85,0.07)",
          };

    useEffect(() => {
        const syncDarkMode = () => {
            setDarkMode(
                localStorage.getItem("eventSphereDarkMode") !== "false"
            );
        };

        window.addEventListener("storage", syncDarkMode);
        const interval = setInterval(syncDarkMode, 500);

        return () => {
            window.removeEventListener("storage", syncDarkMode);
            clearInterval(interval);
        };
    }, []);

    const loadBookmarks = useCallback(async () => {
        if (!userId) {
            setError("Your user session could not be found. Please log in again.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `http://localhost:5000/api/bookmarks/user/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data =
                response.data.bookmarks ||
                response.data.data ||
                [];

            setBookmarks(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                    "We couldn't load your bookmarks. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, [userId, token]);

    useEffect(() => {
        loadBookmarks();
    }, [loadBookmarks]);

    const removeBookmark = async (id) => {
        if (!window.confirm("Are you sure you want to remove this bookmark?")) {
            return;
        }

        try {
            setRemovingId(id);
            setError("");
            setSuccess("");

            const response = await axios.delete(
                `http://localhost:5000/api/bookmarks/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setBookmarks((previous) =>
                previous.filter((bookmark) => bookmark._id !== id)
            );

            setSuccess(
                response.data.message || "Bookmark removed successfully."
            );
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                    "We couldn't remove this bookmark. Please try again."
            );
        } finally {
            setRemovingId(null);
        }
    };

    const formatDate = (date) => {
        if (!date) return "Date not available";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Date not available";
        }

        return parsedDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const styles = {
        page: {
            minHeight: "100vh",
            background: theme.background,
            color: theme.text,
            padding: "30px clamp(16px, 4vw, 52px) 60px",
            fontFamily: "Inter, Poppins, system-ui, -apple-system, sans-serif",
            transition: "background .25s ease, color .25s ease",
            overflow: "hidden",
            position: "relative",
        },

        shell: {
            maxWidth: "1180px",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
        },

        panel: {
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: "24px",
            boxShadow: theme.shadow,
        },

        primaryButton: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "9px",
            border: "1px solid rgba(147,197,253,0.18)",
            borderRadius: "13px",
            padding: "12px 18px",
            color: "#ffffff",
            background: "linear-gradient(115deg, #1e40af, #2563eb 60%, #3b82f6)",
            boxShadow: "0 10px 24px rgba(37,99,235,.22)",
            fontWeight: 750,
            fontSize: "14px",
            textDecoration: "none",
            cursor: "pointer",
            transition: "transform .2s ease, box-shadow .2s ease",
            whiteSpace: "nowrap",
        },
    };

    return (
        <div style={styles.page}>
            <style>{`
                @keyframes bookmarkFadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(18px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes bookmarkFloat {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-9px);
                    }
                }

                @keyframes bookmarkSpin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                .bm-animate {
                    animation: bookmarkFadeUp .55s ease both;
                }

                .bm-card {
                    transition: transform .24s ease, border-color .24s ease,
                        box-shadow .24s ease;
                }

                .bm-card:hover {
                    transform: translateY(-5px);
                    border-color: rgba(59,130,246,.45) !important;
                    box-shadow: 0 24px 55px rgba(37,99,235,.12) !important;
                }

                .bm-action {
                    transition: transform .2s ease, filter .2s ease;
                }

                .bm-action:hover {
                    transform: translateY(-2px);
                    filter: brightness(1.08);
                }

                .bm-dashboard:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 14px 28px rgba(37,99,235,.3);
                }

                .bm-detail {
                    display: grid;
                    grid-template-columns: 1fr 1.35fr;
                    gap: 12px;
                    padding: 11px 0;
                    border-bottom: 1px solid var(--bm-divider);
                }

                .bm-detail:last-child {
                    border-bottom: 0;
                }

                .bm-orb {
                    position: absolute;
                    width: 330px;
                    height: 330px;
                    border-radius: 50%;
                    filter: blur(85px);
                    opacity: .15;
                    pointer-events: none;
                }

                @media (max-width: 640px) {
                    .bm-header {
                        align-items: flex-start !important;
                        flex-direction: column !important;
                    }

                    .bm-dashboard {
                        width: 100%;
                        box-sizing: border-box;
                    }

                    .bm-hero {
                        padding: 24px !important;
                    }

                    .bm-card {
                        padding: 20px !important;
                    }

                    .bm-title {
                        font-size: 32px !important;
                    }

                    .bm-detail {
                        grid-template-columns: 1fr;
                        gap: 5px;
                    }

                    .bm-toolbar {
                        align-items: flex-start !important;
                        flex-direction: column !important;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .bm-animate,
                    .bm-orb {
                        animation: none !important;
                    }

                    .bm-card,
                    .bm-action,
                    .bm-dashboard {
                        transition: none !important;
                    }
                }
            `}</style>

            {/* Navy-blue decorative background */}
            <div
                className="bm-orb"
                style={{
                    top: "-100px",
                    right: "-70px",
                    background: "#2563eb",
                }}
            />

            <div
                className="bm-orb"
                style={{
                    top: "400px",
                    left: "-180px",
                    background: "#0e7ac8",
                    opacity: darkMode ? 0.1 : 0.08,
                }}
            />

            <main style={styles.shell}>
                {/* Header */}
                <header
                    className="bm-header bm-animate"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "20px",
                        marginBottom: "28px",
                    }}
                >
                    <Link
                        to="/dashboard"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "10px",
                            color: theme.text,
                            textDecoration: "none",
                            fontWeight: 800,
                            letterSpacing: "-.3px",
                        }}
                    >
                        <span
                            style={{
                                display: "grid",
                                placeItems: "center",
                                width: "42px",
                                height: "42px",
                                borderRadius: "13px",
                                color: "#ffffff",
                                background: "linear-gradient(135deg, #1e40af, #2563eb)",
                                boxShadow: "0 8px 22px rgba(37,99,235,.25)",
                                fontSize: "21px",
                            }}
                        >
                            E
                        </span>

                        <span style={{ fontSize: "18px" }}>
                            Event
                            <span style={{ color: "#60a5fa" }}>Sphere</span>
                        </span>
                    </Link>

                    <Link
                        className="bm-dashboard"
                        to="/dashboard"
                        style={styles.primaryButton}
                    >
                        <span aria-hidden="true">←</span>
                        Back to Dashboard
                    </Link>
                </header>

                {/* Hero */}
                <section
                    className="bm-hero bm-animate"
                    style={{
                        ...styles.panel,
                        padding: "clamp(26px, 5vw, 48px)",
                        marginBottom: "24px",
                        position: "relative",
                        overflow: "hidden",
                        background: darkMode
                            ? "linear-gradient(115deg, #0b1730 0%, #0e1628 60%, #10264a 100%)"
                            : "linear-gradient(115deg, #ffffff 0%, #eff6ff 60%, #dbeafe 100%)",
                        animationDelay: ".05s",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            width: "230px",
                            height: "230px",
                            borderRadius: "50%",
                            border: "1px solid rgba(96,165,250,.14)",
                            right: "5%",
                            top: "-110px",
                            boxShadow:
                                "0 0 0 28px rgba(96,165,250,.035), 0 0 0 58px rgba(96,165,250,.025)",
                        }}
                    />

                    <div style={{ position: "relative", maxWidth: "710px" }}>
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                border: `1px solid ${
                                    darkMode
                                        ? "rgba(96,165,250,.25)"
                                        : "#cbdcff"
                                }`,
                                background: theme.softBlue,
                                color: darkMode ? "#93c5fd" : "#2858b8",
                                padding: "7px 12px",
                                borderRadius: "999px",
                                fontSize: "11px",
                                fontWeight: 850,
                                letterSpacing: "1.3px",
                                marginBottom: "18px",
                            }}
                        >
                            <span>✦</span> YOUR PERSONAL COLLECTION
                        </div>

                        <h1
                            className="bm-title"
                            style={{
                                margin: 0,
                                fontSize: "clamp(34px, 5vw, 48px)",
                                lineHeight: 1.1,
                                letterSpacing: "-1.8px",
                                fontWeight: 850,
                            }}
                        >
                            My{" "}
                            <span style={{ color: "#60a5fa" }}>
                                Bookmarks
                            </span>
                        </h1>

                        <p
                            style={{
                                color: theme.muted,
                                fontSize: "15px",
                                lineHeight: 1.8,
                                maxWidth: "580px",
                                margin: "16px 0 0",
                            }}
                        >
                            Keep the sessions that matter close. Revisit your
                            saved talks, speakers, and expo details whenever you
                            need them.
                        </p>

                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "12px",
                                marginTop: "27px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    padding: "13px 16px",
                                    background: darkMode
                                        ? "rgba(255,255,255,.035)"
                                        : "#ffffff",
                                    border: `1px solid ${theme.border}`,
                                    borderRadius: "15px",
                                    minWidth: "150px",
                                }}
                            >
                                <span
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        display: "grid",
                                        placeItems: "center",
                                        borderRadius: "12px",
                                        background: theme.softBlue,
                                        fontSize: "19px",
                                    }}
                                >
                                    🔖
                                </span>

                                <span>
                                    <strong
                                        style={{
                                            display: "block",
                                            fontSize: "22px",
                                        }}
                                    >
                                        {bookmarks.length}
                                    </strong>

                                    <span
                                        style={{
                                            color: theme.muted,
                                            fontSize: "12px",
                                        }}
                                    >
                                        Saved sessions
                                    </span>
                                </span>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    padding: "13px 16px",
                                    background: darkMode
                                        ? "rgba(255,255,255,.035)"
                                        : "#ffffff",
                                    border: `1px solid ${theme.border}`,
                                    borderRadius: "15px",
                                    minWidth: "150px",
                                }}
                            >
                                <span
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        display: "grid",
                                        placeItems: "center",
                                        borderRadius: "12px",
                                        background: darkMode
                                            ? "rgba(16,185,129,.12)"
                                            : "#e9fbf3",
                                        fontSize: "19px",
                                    }}
                                >
                                    ✦
                                </span>

                                <span>
                                    <strong
                                        style={{
                                            display: "block",
                                            fontSize: "15px",
                                        }}
                                    >
                                        Ready when you are
                                    </strong>

                                    <span
                                        style={{
                                            color: theme.muted,
                                            fontSize: "12px",
                                        }}
                                    >
                                        Your event shortlist
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Success message */}
                {success && (
                    <div
                        role="status"
                        style={{
                            padding: "14px 17px",
                            marginBottom: "18px",
                            borderRadius: "14px",
                            color: darkMode ? "#86efac" : "#166534",
                            background: darkMode
                                ? "rgba(22,101,52,.2)"
                                : "#f0fdf4",
                            border: `1px solid ${
                                darkMode
                                    ? "rgba(74,222,128,.2)"
                                    : "#bbf7d0"
                            }`,
                            animation: "bookmarkFadeUp .3s ease both",
                        }}
                    >
                        ✓ {success}
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <div
                        role="alert"
                        style={{
                            padding: "14px 17px",
                            marginBottom: "18px",
                            borderRadius: "14px",
                            color: darkMode ? "#fca5a5" : "#991b1b",
                            background: darkMode
                                ? "rgba(127,29,29,.22)"
                                : "#fef2f2",
                            border: `1px solid ${
                                darkMode
                                    ? "rgba(248,113,113,.2)"
                                    : "#fecaca"
                            }`,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "12px",
                        }}
                    >
                        <span>⚠ {error}</span>

                        <button
                            type="button"
                            onClick={loadBookmarks}
                            style={{
                                border: 0,
                                background: "transparent",
                                color: "inherit",
                                fontWeight: 800,
                                cursor: "pointer",
                                textDecoration: "underline",
                            }}
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Saved sessions toolbar */}
                <section
                    className="bm-toolbar bm-animate"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "16px",
                        margin: "30px 2px 18px",
                        animationDelay: ".1s",
                    }}
                >
                    <div>
                        <h2
                            style={{
                                margin: 0,
                                fontSize: "21px",
                                letterSpacing: "-.5px",
                            }}
                        >
                            Saved sessions
                        </h2>

                        <p
                            style={{
                                color: theme.muted,
                                margin: "6px 0 0",
                                fontSize: "13px",
                            }}
                        >
                            {loading
                                ? "Fetching your saved sessions…"
                                : `${bookmarks.length} ${
                                      bookmarks.length === 1
                                          ? "session"
                                          : "sessions"
                                  } in your collection`}
                        </p>
                    </div>

                    <Link
                        to="/sessions"
                        className="bm-action"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            color: darkMode ? "#93c5fd" : "#2858b8",
                            textDecoration: "none",
                            fontSize: "14px",
                            fontWeight: 800,
                        }}
                    >
                        Explore sessions <span>↗</span>
                    </Link>
                </section>

                {/* Loading state */}
                {loading ? (
                    <section
                        style={{
                            ...styles.panel,
                            padding: "58px 24px",
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                width: "44px",
                                height: "44px",
                                margin: "0 auto 18px",
                                borderRadius: "50%",
                                border: "3px solid rgba(96,165,250,.18)",
                                borderTopColor: "#3b82f6",
                                animation: "bookmarkSpin .8s linear infinite",
                            }}
                        />

                        <h3 style={{ margin: 0, fontSize: "17px" }}>
                            Loading your collection
                        </h3>

                        <p
                            style={{
                                color: theme.muted,
                                margin: "8px 0 0",
                                fontSize: "14px",
                            }}
                        >
                            Just a moment while we fetch your bookmarks.
                        </p>
                    </section>
                ) : bookmarks.length === 0 ? (
                    /* Empty state */
                    <section
                        className="bm-animate"
                        style={{
                            ...styles.panel,
                            padding: "clamp(32px, 6vw, 65px) 24px",
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                width: "82px",
                                height: "82px",
                                margin: "0 auto 22px",
                                display: "grid",
                                placeItems: "center",
                                borderRadius: "25px",
                                background: theme.softBlue,
                                border: `1px solid ${theme.border}`,
                                fontSize: "34px",
                                animation:
                                    "bookmarkFloat 4s ease-in-out infinite",
                            }}
                        >
                            🔖
                        </div>

                        <p
                            style={{
                                margin: "0 0 10px",
                                color: "#60a5fa",
                                fontSize: "11px",
                                fontWeight: 850,
                                letterSpacing: "1.6px",
                            }}
                        >
                            A LITTLE SPACE FOR INSPIRATION
                        </p>

                        <h2
                            style={{
                                margin: 0,
                                fontSize: "26px",
                                letterSpacing: "-.7px",
                            }}
                        >
                            Nothing saved just yet
                        </h2>

                        <p
                            style={{
                                maxWidth: "440px",
                                margin: "12px auto 24px",
                                color: theme.muted,
                                lineHeight: 1.8,
                                fontSize: "14px",
                            }}
                        >
                            When you find a session you like, bookmark it and
                            it will be waiting for you here.
                        </p>

                        <Link to="/sessions" style={styles.primaryButton}>
                            Browse sessions <span>→</span>
                        </Link>
                    </section>
                ) : (
                    /* Bookmarks grid */
                    <section
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
                            gap: "20px",
                            alignItems: "stretch",
                        }}
                    >
                        {bookmarks.map((bookmark, index) => {
                            const session = bookmark.session;
                            const expo = bookmark.expo;

                            return (
                                <article
                                    key={bookmark._id}
                                    className="bm-card bm-animate"
                                    style={{
                                        ...styles.panel,
                                        padding: "25px",
                                        display: "flex",
                                        flexDirection: "column",
                                        minWidth: 0,
                                        animationDelay: `${Math.min(
                                            index * 0.07,
                                            0.35
                                        )}s`,
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: "14px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "50px",
                                                height: "50px",
                                                flexShrink: 0,
                                                display: "grid",
                                                placeItems: "center",
                                                borderRadius: "16px",
                                                color: "#93c5fd",
                                                background:
                                                    "linear-gradient(135deg, rgba(37,99,235,.22), rgba(14,116,214,.12))",
                                                border: "1px solid rgba(96,165,250,.16)",
                                                fontSize: "23px",
                                            }}
                                        >
                                            🔖
                                        </div>

                                        <div style={{ minWidth: 0, flex: 1 }}>
                                            <span
                                                style={{
                                                    color: "#60a5fa",
                                                    fontSize: "10px",
                                                    fontWeight: 850,
                                                    letterSpacing: "1.4px",
                                                }}
                                            >
                                                SAVED SESSION
                                            </span>

                                            <h3
                                                style={{
                                                    margin: "6px 0 0",
                                                    fontSize: "19px",
                                                    lineHeight: 1.4,
                                                    letterSpacing: "-.35px",
                                                    overflowWrap: "anywhere",
                                                }}
                                            >
                                                {session?.title ||
                                                    "Untitled session"}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Session details */}
                                    <div
                                        style={{
                                            marginTop: "23px",
                                            padding: "5px 15px",
                                            borderRadius: "15px",
                                            background: theme.surfaceRaised,
                                            border: `1px solid ${theme.border}`,
                                            "--bm-divider": theme.divider,
                                        }}
                                    >
                                        <DetailRow
                                            icon="🎤"
                                            label="Speaker"
                                            value={
                                                session?.speaker ||
                                                "Not specified"
                                            }
                                            theme={theme}
                                        />

                                        <DetailRow
                                            icon="📚"
                                            label="Topic"
                                            value={
                                                session?.topic ||
                                                "Not specified"
                                            }
                                            theme={theme}
                                        />

                                        <DetailRow
                                            icon="📅"
                                            label="Date"
                                            value={formatDate(session?.date)}
                                            theme={theme}
                                        />

                                        <DetailRow
                                            icon="◷"
                                            label="Time"
                                            value={`${
                                                session?.startTime || "N/A"
                                            } – ${
                                                session?.endTime || "N/A"
                                            }`}
                                            theme={theme}
                                        />

                                        <DetailRow
                                            icon="⌖"
                                            label="Location"
                                            value={
                                                session?.location ||
                                                "Not specified"
                                            }
                                            theme={theme}
                                        />
                                    </div>

                                    {/* Expo details */}
                                    <div
                                        style={{
                                            marginTop: "19px",
                                            padding: "16px",
                                            borderRadius: "15px",
                                            background: theme.softBlue,
                                            border: `1px solid ${theme.border}`,
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: "10px",
                                                color: darkMode
                                                    ? "#93c5fd"
                                                    : "#2858b8",
                                                fontWeight: 850,
                                                letterSpacing: "1.3px",
                                                marginBottom: "7px",
                                            }}
                                        >
                                            EXPO DETAILS
                                        </div>

                                        <div
                                            style={{
                                                fontSize: "15px",
                                                fontWeight: 800,
                                                overflowWrap: "anywhere",
                                            }}
                                        >
                                            {expo?.title ||
                                                "Expo details unavailable"}
                                        </div>

                                        {(expo?.date || expo?.location) && (
                                            <div
                                                style={{
                                                    marginTop: "8px",
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    gap: "8px 14px",
                                                    color: theme.muted,
                                                    fontSize: "12px",
                                                }}
                                            >
                                                {expo?.date && (
                                                    <span>
                                                        📅 {formatDate(expo.date)}
                                                    </span>
                                                )}

                                                {expo?.location && (
                                                    <span>
                                                        📍 {expo.location}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Remove bookmark */}
                                    <button
                                        type="button"
                                        className="bm-action"
                                        onClick={() =>
                                            removeBookmark(bookmark._id)
                                        }
                                        disabled={
                                            removingId === bookmark._id
                                        }
                                        style={{
                                            width: "100%",
                                            marginTop: "18px",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "9px",
                                            padding: "13px 16px",
                                            borderRadius: "13px",
                                            border: `1px solid ${
                                                darkMode
                                                    ? "rgba(248,113,113,.23)"
                                                    : "#fecaca"
                                            }`,
                                            background: theme.softRed,
                                            color: darkMode
                                                ? "#fca5a5"
                                                : "#b91c1c",
                                            cursor:
                                                removingId === bookmark._id
                                                    ? "wait"
                                                    : "pointer",
                                            fontSize: "13px",
                                            fontWeight: 800,
                                            opacity:
                                                removingId === bookmark._id
                                                    ? 0.65
                                                    : 1,
                                        }}
                                    >
                                        {removingId === bookmark._id
                                            ? "Removing…"
                                            : "✕ Remove bookmark"}
                                    </button>
                                </article>
                            );
                        })}
                    </section>
                )}

                {/* Footer */}
                <footer
                    style={{
                        marginTop: "40px",
                        paddingTop: "20px",
                        borderTop: `1px solid ${theme.divider}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "12px",
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

function DetailRow({ icon, label, value, theme }) {
    return (
        <div className="bm-detail">
            <span
                style={{
                    color: theme.muted,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12px",
                    fontWeight: 650,
                }}
            >
                <span style={{ width: "18px", textAlign: "center" }}>
                    {icon}
                </span>
                {label}
            </span>

            <strong
                style={{
                    color: theme.text,
                    fontSize: "13px",
                    fontWeight: 650,
                    lineHeight: 1.5,
                    overflowWrap: "anywhere",
                }}
            >
                {value}
            </strong>
        </div>
    );
}

export default Bookmarks;