
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [readingIds, setReadingIds] = useState([]);

    const [darkMode, setDarkMode] = useState(
        () => localStorage.getItem("eventSphereDarkMode") === "true"
    );

    const token = localStorage.getItem("token");

    const user = JSON.parse(localStorage.getItem("user") || "null");

    const currentUserId =
        user?._id ||
        user?.id ||
        localStorage.getItem("userId");

    // Theme sync
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
              border: "rgba(148,163,184,0.14)",
              accent: "#168fff",
              accentLight: "#49b2ff",
              unread: "rgba(22,143,255,0.09)",
              shadow: "0 18px 45px rgba(0,0,0,0.18)"
          }
        : {
              background: "#f5f8fc",
              surface: "#ffffff",
              surfaceSoft: "#f0f6fc",
              text: "#132238",
              muted: "#6d7d91",
              border: "#e3eaf2",
              accent: "#087fe7",
              accentLight: "#38a5ff",
              unread: "#f0f8ff",
              shadow: "0 15px 40px rgba(20,48,80,0.06)"
          };

    // Fetch notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await axios.get(
                    `http://localhost:5000/api/notifications/user/${currentUserId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setNotifications(
                    response.data.notifications ||
                    response.data.data ||
                    []
                );
            } catch (err) {
                console.error("Failed to fetch notifications:", err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load notifications. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        if (currentUserId) {
            fetchNotifications();
        } else {
            setError("User not found. Please log in again.");
            setLoading(false);
        }
    }, [currentUserId, token]);

    // Mark notification as read
    const markAsRead = async (id) => {
        if (readingIds.includes(id)) return;

        setReadingIds((previous) => [...previous, id]);

        try {
            await axios.put(
                `http://localhost:5000/api/notifications/${id}/read`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setNotifications((previous) =>
                previous.map((notification) =>
                    notification._id === id
                        ? { ...notification, isRead: true }
                        : notification
                )
            );
        } catch (err) {
            console.error("Failed to mark notification as read:", err);

            setError(
                err.response?.data?.message ||
                "Could not mark this notification as read."
            );
        } finally {
            setReadingIds((previous) =>
                previous.filter((item) => item !== id)
            );
        }
    };

    const unreadCount = notifications.filter(
        (notification) => !notification.isRead
    ).length;

    const formatDate = (date) => {
        if (!date) return "Date unavailable";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Date unavailable";
        }

        return parsedDate.toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
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
            width: "100%",
            maxWidth: "960px",
            margin: "0 auto"
        },
        topbar: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "18px",
            marginBottom: "42px"
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
            color: "#ffffff",
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
            fontWeight: "700",
            transition: "all 0.2s ease"
        },
        hero: {
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "22px",
            marginBottom: "28px",
            animation: "esNotificationUp 0.5s ease both"
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
            fontSize: "clamp(30px, 5vw, 42px)",
            lineHeight: 1.15,
            fontWeight: "800",
            letterSpacing: "-1.7px"
        },
        description: {
            margin: "12px 0 0",
            maxWidth: "520px",
            color: theme.muted,
            fontSize: "14px",
            lineHeight: 1.8
        },
        countCard: {
            display: "flex",
            alignItems: "center",
            gap: "13px",
            padding: "15px 18px",
            borderRadius: "15px",
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.shadow
        },
        countIcon: {
            width: "42px",
            height: "42px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px",
            background: darkMode ? "rgba(22,143,255,0.14)" : "#eaf5ff",
            fontSize: "20px"
        },
        countLabel: {
            color: theme.muted,
            fontSize: "11px",
            marginBottom: "4px"
        },
        countValue: {
            fontSize: "22px",
            fontWeight: "800"
        },
        toolbar: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "17px"
        },
        toolbarTitle: {
            margin: 0,
            fontSize: "19px",
            fontWeight: "800",
            letterSpacing: "-0.4px"
        },
        toolbarSubtitle: {
            color: theme.muted,
            fontSize: "12px"
        },
        notificationCard: {
            position: "relative",
            display: "flex",
            gap: "16px",
            padding: "22px",
            marginBottom: "15px",
            borderRadius: "17px",
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.shadow,
            transition: "transform 0.22s ease, border-color 0.22s ease",
            animation: "esNotificationUp 0.5s ease both"
        },
        notificationIcon: {
            width: "46px",
            height: "46px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            borderRadius: "14px",
            background: darkMode ? "rgba(148,163,184,0.08)" : "#f0f5fa",
            fontSize: "21px"
        },
        notificationContent: {
            flex: 1,
            minWidth: 0
        },
        notificationHeading: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "8px"
        },
        notificationTitle: {
            margin: 0,
            fontSize: "16px",
            lineHeight: 1.5,
            fontWeight: "800",
            overflowWrap: "anywhere"
        },
        unreadBadge: {
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 9px",
            borderRadius: "7px",
            color: theme.accent,
            background: darkMode ? "rgba(22,143,255,0.12)" : "#eaf5ff",
            fontSize: "10px",
            fontWeight: "800",
            letterSpacing: "0.7px",
            flexShrink: 0
        },
        message: {
            margin: 0,
            color: theme.muted,
            fontSize: "13px",
            lineHeight: 1.8,
            overflowWrap: "anywhere",
            whiteSpace: "pre-wrap"
        },
        footer: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            marginTop: "18px",
            paddingTop: "15px",
            borderTop: `1px solid ${theme.border}`
        },
        date: {
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            color: theme.muted,
            fontSize: "11px"
        },
        readLabel: {
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: darkMode ? "#75d9a0" : "#168348",
            fontSize: "11px",
            fontWeight: "700"
        },
        readButton: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "7px",
            padding: "9px 13px",
            borderRadius: "9px",
            border: `1px solid ${darkMode ? "rgba(22,143,255,0.25)" : "#cfe8ff"}`,
            color: theme.accent,
            background: darkMode ? "rgba(22,143,255,0.1)" : "#edf7ff",
            fontSize: "12px",
            fontWeight: "800",
            cursor: "pointer",
            transition: "all 0.2s ease"
        },
        stateCard: {
            padding: "55px 24px",
            textAlign: "center",
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: "21px",
            boxShadow: theme.shadow,
            animation: "esNotificationUp 0.5s ease both"
        },
        stateIcon: {
            width: "70px",
            height: "70px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 18px",
            borderRadius: "21px",
            background: darkMode ? "rgba(22,143,255,0.12)" : "#eaf5ff",
            fontSize: "30px"
        },
        stateTitle: {
            margin: "0 0 10px",
            fontSize: "21px",
            fontWeight: "800"
        },
        stateText: {
            maxWidth: "430px",
            margin: "0 auto",
            color: theme.muted,
            fontSize: "13px",
            lineHeight: 1.8
        },
        primaryButton: {
            display: "inline-flex",
            alignItems: "center",
            gap: "9px",
            marginTop: "22px",
            padding: "12px 18px",
            borderRadius: "10px",
            color: "#ffffff",
            background: "linear-gradient(135deg, #087fe7, #168fff)",
            textDecoration: "none",
            fontSize: "13px",
            fontWeight: "800",
            boxShadow: "0 9px 24px rgba(22,143,255,0.22)"
        },
        errorBox: {
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            padding: "14px 16px",
            marginBottom: "18px",
            borderRadius: "12px",
            border: "1px solid rgba(239,68,68,0.22)",
            background: darkMode ? "rgba(239,68,68,0.09)" : "#fff1f1",
            color: darkMode ? "#ff9999" : "#c62828",
            fontSize: "13px",
            lineHeight: 1.6
        }
    };

    return (
        <div style={styles.page}>
            <style>{`
                @keyframes esNotificationUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes esNotificationSpin {
                    to { transform: rotate(360deg); }
                }

                .es-notification-card:hover {
                    transform: translateY(-3px);
                    border-color: rgba(22,143,255,0.42) !important;
                }

                .es-notification-link:hover {
                    transform: translateY(-2px);
                    border-color: rgba(22,143,255,0.45) !important;
                }

                .es-notification-read:hover:not(:disabled) {
                    background: rgba(22,143,255,0.16) !important;
                }

                .es-notification-read:disabled {
                    cursor: wait !important;
                    opacity: 0.65;
                }

                @media (max-width: 600px) {
                    .es-notification-page {
                        padding: 24px 15px 40px !important;
                    }

                    .es-notification-card {
                        padding: 17px !important;
                        gap: 12px !important;
                    }

                    .es-notification-icon {
                        width: 39px !important;
                        height: 39px !important;
                        font-size: 18px !important;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .es-notification-page *,
                    .es-notification-page *::before,
                    .es-notification-page *::after {
                        animation-duration: 0.01ms !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `}</style>

            <main
                className="es-notification-page"
                style={styles.container}
            >
                {/* Header */}
                <header style={styles.topbar}>
                    <div style={styles.brand}>
                        <div style={styles.brandIcon}>E</div>
                        <div>
                            <div style={styles.brandName}>EventSphere</div>
                            <div style={styles.brandCaption}>Your event hub</div>
                        </div>
                    </div>

                    <Link
                        to="/dashboard"
                        className="es-notification-link"
                        style={styles.dashboardLink}
                    >
                        <span>←</span> Dashboard
                    </Link>
                </header>

                {/* Page title */}
                <section style={styles.hero}>
                    <div>
                        <div style={styles.eyebrow}>
                            <span>✦</span> STAY IN THE LOOP
                        </div>

                        <h1 style={styles.title}>
                            Notifications
                            <span style={{ color: theme.accent }}>.</span>
                        </h1>

                        <p style={styles.description}>
                            All your event updates, announcements and important
                            information, gathered in one place.
                        </p>
                    </div>

                    {!loading && !error && (
                        <div style={styles.countCard}>
                            <div style={styles.countIcon}>🔔</div>
                            <div>
                                <div style={styles.countLabel}>UNREAD NOTIFICATIONS</div>
                                <div style={styles.countValue}>{unreadCount}</div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Error */}
                {error && (
                    <div style={styles.errorBox}>
                        <span>⚠</span>
                        <span>{error}</span>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div style={styles.stateCard}>
                        <div
                            style={{
                                ...styles.stateIcon,
                                border: "3px solid rgba(22,143,255,0.15)",
                                borderTopColor: theme.accent,
                                borderRadius: "50%",
                                animation: "esNotificationSpin 0.8s linear infinite"
                            }}
                        />
                        <h2 style={styles.stateTitle}>Checking for updates</h2>
                        <p style={styles.stateText}>
                            Your notifications are on their way. Please wait a moment.
                        </p>
                    </div>
                )}

                {/* Notifications */}
                {!loading && (
                    <>
                        <div style={styles.toolbar}>
                            <h2 style={styles.toolbarTitle}>Your activity</h2>
                            <span style={styles.toolbarSubtitle}>
                                {notifications.length}{" "}
                                {notifications.length === 1 ? "notification" : "notifications"}
                            </span>
                        </div>

                        {notifications.length === 0 ? (
                            <div style={styles.stateCard}>
                                <div style={styles.stateIcon}>📭</div>
                                <h2 style={styles.stateTitle}>You're all caught up</h2>
                                <p style={styles.stateText}>
                                    There are no notifications to show right now.
                                    We'll display your event updates here when they arrive.
                                </p>

                                <Link
                                    to="/dashboard"
                                    style={styles.primaryButton}
                                >
                                    Back to Dashboard <span>→</span>
                                </Link>
                            </div>
                        ) : (
                            <div>
                                {notifications.map((notification, index) => {
                                    const isUnread = !notification.isRead;
                                    const isReading = readingIds.includes(
                                        notification._id
                                    );

                                    return (
                                        <article
                                            key={notification._id}
                                            className="es-notification-card"
                                            style={{
                                                ...styles.notificationCard,
                                                background: isUnread
                                                    ? theme.unread
                                                    : theme.surface,
                                                borderLeft: isUnread
                                                    ? `3px solid ${theme.accent}`
                                                    : `1px solid ${theme.border}`,
                                                animationDelay: `${Math.min(index * 55, 330)}ms`
                                            }}
                                        >
                                            <div
                                                className="es-notification-icon"
                                                style={{
                                                    ...styles.notificationIcon,
                                                    background: isUnread
                                                        ? darkMode
                                                            ? "rgba(22,143,255,0.14)"
                                                            : "#e1f1ff"
                                                        : styles.notificationIcon.background
                                                }}
                                            >
                                                {isUnread ? "🔔" : "✓"}
                                            </div>

                                            <div style={styles.notificationContent}>
                                                <div style={styles.notificationHeading}>
                                                    <h3 style={styles.notificationTitle}>
                                                        {notification.title || "Notification"}
                                                    </h3>

                                                    {isUnread && (
                                                        <span style={styles.unreadBadge}>
                                                            <span>●</span> NEW
                                                        </span>
                                                    )}
                                                </div>

                                                <p style={styles.message}>
                                                    {notification.message || "No message details available."}
                                                </p>

                                                <div style={styles.footer}>
                                                    <span style={styles.date}>
                                                        <span>◷</span>
                                                        {formatDate(notification.createdAt)}
                                                    </span>

                                                    {isUnread ? (
                                                        <button
                                                            type="button"
                                                            className="es-notification-read"
                                                            onClick={() =>
                                                                markAsRead(notification._id)
                                                            }
                                                            disabled={isReading}
                                                            style={styles.readButton}
                                                        >
                                                            {isReading ? (
                                                                <>
                                                                    <span
                                                                        style={{
                                                                            display: "inline-block",
                                                                            animation: "esNotificationSpin 0.8s linear infinite"
                                                                        }}
                                                                    >
                                                                        ◌
                                                                    </span>
                                                                    Updating...
                                                                </>
                                                            ) : (
                                                                <>✓ Mark as Read</>
                                                            )}
                                                        </button>
                                                    ) : (
                                                        <span style={styles.readLabel}>
                                                            <span>✓</span> Read
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}

                <footer
                    style={{
                        marginTop: "42px",
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

export default Notifications;
