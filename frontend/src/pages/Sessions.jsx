
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Sessions() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [registeringId, setRegisteringId] = useState(null);
    const [successMessages, setSuccessMessages] = useState({});
    const [registrationErrors, setRegistrationErrors] = useState({});

    const [bookmarks, setBookmarks] = useState([]);
    const [bookmarkLoadingId, setBookmarkLoadingId] = useState(null);
    const [bookmarkMessages, setBookmarkMessages] = useState({});

    const [darkMode, setDarkMode] = useState(
        () => localStorage.getItem("eventSphereDarkMode") === "true"
    );

    // Theme synchronization
    useEffect(() => {
        const syncTheme = (event) => {
            if (
                !event ||
                event.key === "eventSphereDarkMode"
            ) {
                setDarkMode(
                    localStorage.getItem("eventSphereDarkMode") === "true"
                );
            }
        };

        window.addEventListener("storage", syncTheme);

        return () => window.removeEventListener("storage", syncTheme);
    }, []);

    const theme = {
        background: darkMode ? "#07111e" : "#f4f8fd",
        card: darkMode ? "rgba(13, 26, 43, 0.94)" : "#ffffff",
        text: darkMode ? "#f0f6ff" : "#122238",
        secondaryText: darkMode ? "#9aadc3" : "#66788f",
        border: darkMode
            ? "rgba(148, 180, 215, 0.14)"
            : "#e1eaf4",
        inputBackground: darkMode ? "#0a1727" : "#ffffff",
        shadow: darkMode
            ? "0 18px 50px rgba(0,0,0,0.20)"
            : "0 15px 40px rgba(31,70,115,0.07)",
        accent: "#1688f8",
        accentLight: darkMode ? "#7cc2ff" : "#0875df"
    };

    const token = () => localStorage.getItem("token");

    // Load sessions
    useEffect(() => {
        const loadSessions = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await axios.get(
                    "api/sessions",
                    {
                        headers: {
                            Authorization: `Bearer ${token()}`
                        }
                    }
                );

                setSessions(
                    response.data.sessions ||
                    response.data.data ||
                    []
                );
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load sessions"
                );
            } finally {
                setLoading(false);
            }
        };

        loadSessions();
    }, []);

    // Load current user's bookmarks
    useEffect(() => {
        const loadBookmarks = async () => {
            try {
                const user = JSON.parse(
                    localStorage.getItem("user") || "null"
                );

                const userId =
                    user?._id ||
                    user?.id ||
                    localStorage.getItem("userId");

                if (!userId) return;

                const response = await axios.get(
                    `api/bookmarks/user/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token()}`
                        }
                    }
                );

                setBookmarks(
                    response.data.bookmarks ||
                    response.data.data ||
                    []
                );
            } catch (err) {
                console.error("Failed to load bookmarks:", err);
            }
        };

        loadBookmarks();
    }, []);

    // Register for a session
    const handleRegister = async (session) => {
        try {
            setRegisteringId(session._id);

            setSuccessMessages((prev) => ({
                ...prev,
                [session._id]: ""
            }));

            setRegistrationErrors((prev) => ({
                ...prev,
                [session._id]: ""
            }));

            const expoId =
                typeof session.expo === "object"
                    ? session.expo?._id
                    : session.expo;

            if (!expoId) {
                setRegistrationErrors((prev) => ({
                    ...prev,
                    [session._id]:
                        "Expo information is missing for this session."
                }));
                return;
            }

            await axios.post(
                "api/registrations",
                {
                    expo: expoId,
                    session: session._id,
                    registrationType: "session"
                },
                {
                    headers: {
                        Authorization: `Bearer ${token()}`
                    }
                }
            );

            setSuccessMessages((prev) => ({
                ...prev,
                [session._id]:
                    "Successfully registered for this session!"
            }));
        } catch (err) {
            setRegistrationErrors((prev) => ({
                ...prev,
                [session._id]:
                    err.response?.data?.message ||
                    "Failed to register for this session"
            }));
        } finally {
            setRegisteringId(null);
        }
    };

    // Add or remove bookmark
    const handleBookmark = async (session) => {
        try {
            setBookmarkLoadingId(session._id);

            setBookmarkMessages((prev) => ({
                ...prev,
                [session._id]: ""
            }));

            const user = JSON.parse(
                localStorage.getItem("user") || "null"
            );

            const userId =
                user?._id ||
                user?.id ||
                localStorage.getItem("userId");

            if (!userId) {
                setBookmarkMessages((prev) => ({
                    ...prev,
                    [session._id]:
                        "Please login again to bookmark sessions."
                }));
                return;
            }

            const expoId =
                typeof session.expo === "object"
                    ? session.expo?._id
                    : session.expo;

            if (!expoId) {
                setBookmarkMessages((prev) => ({
                    ...prev,
                    [session._id]:
                        "Expo information is missing for this session."
                }));
                return;
            }

            const existingBookmark = bookmarks.find((bookmark) => {
                const bookmarkedSession =
                    typeof bookmark.session === "object"
                        ? bookmark.session?._id
                        : bookmark.session;

                return bookmarkedSession === session._id;
            });

            if (existingBookmark) {
                await axios.delete(
                    `api/bookmarks/${existingBookmark._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token()}`
                        }
                    }
                );

                setBookmarks((prev) =>
                    prev.filter(
                        (bookmark) =>
                            bookmark._id !== existingBookmark._id
                    )
                );

                setBookmarkMessages((prev) => ({
                    ...prev,
                    [session._id]: "Bookmark removed successfully!"
                }));

                return;
            }

            const response = await axios.post(
                "api/bookmarks",
                {
                    user: userId,
                    expo: expoId,
                    session: session._id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token()}`
                    }
                }
            );

            if (response.data.bookmark) {
                setBookmarks((prev) => [
                    response.data.bookmark,
                    ...prev
                ]);
            } else {
                // Reload from server if the API uses another response shape.
                const refreshed = await axios.get(
                    `api/bookmarks/user/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token()}`
                        }
                    }
                );

                setBookmarks(
                    refreshed.data.bookmarks ||
                    refreshed.data.data ||
                    []
                );
            }

            setBookmarkMessages((prev) => ({
                ...prev,
                [session._id]: "Session bookmarked successfully!"
            }));
        } catch (err) {
            setBookmarkMessages((prev) => ({
                ...prev,
                [session._id]:
                    err.response?.data?.message ||
                    "Failed to bookmark session"
            }));
        } finally {
            setBookmarkLoadingId(null);
        }
    };

    const isBookmarked = (sessionId) =>
        bookmarks.some((bookmark) => {
            const bookmarkedSession =
                typeof bookmark.session === "object"
                    ? bookmark.session?._id
                    : bookmark.session;

            return bookmarkedSession === sessionId;
        });

    const formatDate = (date) => {
        if (!date) return "Date not announced";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) return "Date not announced";

        return parsedDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const getExpoName = (expo) => {
        if (!expo) return "EventSphere Session";
        if (typeof expo === "string") return "Event Expo";
        return expo.title || expo.name || "Event Expo";
    };

    const cardStyle = {
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: "22px",
        boxShadow: theme.shadow,
        overflow: "hidden",
        minWidth: 0,
        transition:
            "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease"
    };

    const smallButton = {
        width: "100%",
        border: "1px solid transparent",
        borderRadius: "12px",
        padding: "12px 14px",
        fontWeight: 750,
        fontSize: "13px",
        cursor: "pointer",
        transition: "transform 0.2s ease, opacity 0.2s ease"
    };

    return (
        <div
            className="sessions-page"
            style={{
                minHeight: "100vh",
                background: theme.background,
                color: theme.text,
                padding: "38px 22px 60px",
                fontFamily: "Inter, Poppins, Arial, sans-serif",
                position: "relative",
                overflow: "hidden",
                transition: "background 0.3s ease, color 0.3s ease"
            }}
        >
            <style>{`
                @keyframes sessionFadeUp {
                    from { opacity: 0; transform: translateY(18px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes sessionFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-9px); }
                }

                @keyframes sessionSpin {
                    to { transform: rotate(360deg); }
                }

                .session-enter {
                    animation: sessionFadeUp .55s ease both;
                }

                .session-card:hover {
                    transform: translateY(-6px);
                    border-color: rgba(22,136,248,.45) !important;
                    box-shadow: 0 22px 48px rgba(22,136,248,.11) !important;
                }

                .session-action:hover {
                    transform: translateY(-2px);
                }

                .session-link:hover {
                    opacity: .85;
                    transform: translateY(-1px);
                }

                .session-field:focus {
                    border-color: #1688f8 !important;
                    box-shadow: 0 0 0 3px rgba(22,136,248,.13);
                }

                @media (max-width: 600px) {
                    .sessions-page { padding: 25px 14px 40px !important; }
                    .sessions-heading { font-size: 30px !important; }
                    .sessions-toolbar { width: 100%; }
                    .sessions-toolbar a { flex: 1; text-align: center; }
                    .session-grid { grid-template-columns: 1fr !important; }
                    .sessions-stats { grid-template-columns: 1fr 1fr !important; }
                }

                @media (prefers-reduced-motion: reduce) {
                    .session-enter { animation: none !important; }
                    .session-card, .session-action, .session-link { transition: none !important; }
                }
            `}</style>

            {/* Ambient background */}
            <div
                style={{
                    position: "fixed",
                    width: 360,
                    height: 360,
                    borderRadius: "50%",
                    background: "rgba(22,136,248,0.13)",
                    filter: "blur(100px)",
                    top: -130,
                    right: -100,
                    pointerEvents: "none"
                }}
            />

            <div
                style={{
                    position: "fixed",
                    width: 320,
                    height: 320,
                    borderRadius: "50%",
                    background: "rgba(56,189,248,0.09)",
                    filter: "blur(100px)",
                    bottom: -120,
                    left: -100,
                    pointerEvents: "none"
                }}
            />

            <main
                style={{
                    maxWidth: 1180,
                    margin: "0 auto",
                    position: "relative",
                    zIndex: 1
                }}
            >
                {/* Header */}
                <header
                    className="session-enter"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 22,
                        marginBottom: 30
                    }}
                >
                    <div>
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 9,
                                padding: "8px 13px",
                                borderRadius: 999,
                                background: darkMode
                                    ? "rgba(22,136,248,0.13)"
                                    : "#e7f3ff",
                                color: theme.accentLight,
                                border: "1px solid rgba(22,136,248,0.15)",
                                fontSize: 12,
                                fontWeight: 800,
                                letterSpacing: ".7px",
                                textTransform: "uppercase",
                                marginBottom: 14
                            }}
                        >
                            <span>✦</span>
                            EventSphere / Explore
                        </div>

                        <h1
                            className="sessions-heading"
                            style={{
                                margin: 0,
                                fontSize: 39,
                                fontWeight: 850,
                                letterSpacing: "-1.5px",
                                lineHeight: 1.15
                            }}
                        >
                            Discover{" "}
                            <span
                                style={{
                                    background: "linear-gradient(100deg, #1688f8, #48c4ff)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent"
                                }}
                            >
                                Sessions.
                            </span>
                        </h1>

                        <p
                            style={{
                                color: theme.secondaryText,
                                margin: "11px 0 0",
                                fontSize: 14,
                                lineHeight: 1.7
                            }}
                        >
                            Find inspiring talks, explore new ideas and save the sessions
                            that matter to you.
                        </p>
                    </div>

                    <div
                        className="sessions-toolbar"
                        style={{
                            display: "flex",
                            gap: 11,
                            flexWrap: "wrap"
                        }}
                    >
                        <Link
                            to="/bookmarks"
                            className="session-link"
                            style={{
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 9,
                                padding: "12px 17px",
                                borderRadius: 12,
                                background: "linear-gradient(135deg, #1688f8, #0875df)",
                                color: "#fff",
                                fontSize: 13,
                                fontWeight: 750,
                                boxShadow: "0 9px 23px rgba(22,136,248,.23)",
                                transition: "transform .2s ease, opacity .2s ease"
                            }}
                        >
                            <span>🔖</span> My Bookmarks
                        </Link>

                        <Link
                            to="/dashboard"
                            className="session-link"
                            style={{
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                                padding: "12px 17px",
                                borderRadius: 12,
                                background: theme.card,
                                color: theme.text,
                                border: `1px solid ${theme.border}`,
                                fontSize: 13,
                                fontWeight: 750,
                                transition: "transform .2s ease, opacity .2s ease"
                            }}
                        >
                            <span>←</span> Dashboard
                        </Link>
                    </div>
                </header>

                {/* Overview strip */}
                <section
                    className="sessions-stats session-enter"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                        gap: 14,
                        marginBottom: 28,
                        animationDelay: ".08s"
                    }}
                >
                    {[
                        {
                            icon: "🎤",
                            label: "Available Sessions",
                            value: loading ? "—" : sessions.length,
                            color: "#1688f8"
                        },
                        {
                            icon: "🔖",
                            label: "Your Bookmarks",
                            value: bookmarks.length,
                            color: "#e8a126"
                        },
                        {
                            icon: "✨",
                            label: "Saved For Later",
                            value: bookmarks.length,
                            color: "#18b98b"
                        }
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 13,
                                padding: "17px 18px",
                                background: theme.card,
                                border: `1px solid ${theme.border}`,
                                borderRadius: 17,
                                boxShadow: theme.shadow,
                                minWidth: 0
                            }}
                        >
                            <div
                                style={{
                                    width: 43,
                                    height: 43,
                                    flexShrink: 0,
                                    borderRadius: 13,
                                    display: "grid",
                                    placeItems: "center",
                                    background: `${stat.color}16`,
                                    fontSize: 20
                                }}
                            >
                                {stat.icon}
                            </div>

                            <div style={{ minWidth: 0 }}>
                                <div
                                    style={{
                                        fontSize: 21,
                                        fontWeight: 850,
                                        letterSpacing: "-.5px"
                                    }}
                                >
                                    {stat.value}
                                </div>
                                <div
                                    style={{
                                        color: theme.secondaryText,
                                        fontSize: 11,
                                        marginTop: 3,
                                        lineHeight: 1.4
                                    }}
                                >
                                    {stat.label}
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Error message */}
                {error && (
                    <div
                        role="alert"
                        style={{
                            padding: "15px 17px",
                            marginBottom: 22,
                            background: darkMode
                                ? "rgba(239,68,68,.10)"
                                : "#fff0f0",
                            color: darkMode ? "#fca5a5" : "#b91c1c",
                            border: "1px solid rgba(239,68,68,.2)",
                            borderRadius: 13,
                            fontSize: 13
                        }}
                    >
                        ⚠ {error}
                    </div>
                )}

                {/* Section heading */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap",
                        marginBottom: 18
                    }}
                >
                    <div>
                        <h2 style={{ margin: 0, fontSize: 21, fontWeight: 800 }}>
                            Explore the lineup
                        </h2>
                        <p
                            style={{
                                margin: "6px 0 0",
                                color: theme.secondaryText,
                                fontSize: 13
                            }}
                        >
                            Browse the talks and register for your favourites.
                        </p>
                    </div>

                    {!loading && sessions.length > 0 && (
                        <span
                            style={{
                                color: theme.accentLight,
                                background: darkMode
                                    ? "rgba(22,136,248,.12)"
                                    : "#e7f3ff",
                                padding: "8px 12px",
                                borderRadius: 10,
                                fontSize: 12,
                                fontWeight: 750
                            }}
                        >
                            {sessions.length} session{sessions.length !== 1 ? "s" : ""}
                        </span>
                    )}
                </div>

                {/* Loading state */}
                {loading && (
                    <div
                        style={{
                            ...cardStyle,
                            padding: "65px 25px",
                            textAlign: "center"
                        }}
                    >
                        <div
                            style={{
                                width: 43,
                                height: 43,
                                border: "3px solid rgba(22,136,248,.18)",
                                borderTopColor: theme.accent,
                                borderRadius: "50%",
                                margin: "0 auto 18px",
                                animation: "sessionSpin .8s linear infinite"
                            }}
                        />
                        <h3 style={{ margin: 0, fontSize: 17 }}>
                            Loading your sessions
                        </h3>
                        <p
                            style={{
                                color: theme.secondaryText,
                                fontSize: 13,
                                margin: "8px 0 0"
                            }}
                        >
                            Getting the latest event details...
                        </p>
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && sessions.length === 0 && (
                    <div
                        style={{
                            ...cardStyle,
                            padding: "65px 25px",
                            textAlign: "center"
                        }}
                    >
                        <div
                            style={{
                                width: 75,
                                height: 75,
                                display: "grid",
                                placeItems: "center",
                                margin: "0 auto 20px",
                                borderRadius: 24,
                                background: darkMode
                                    ? "rgba(22,136,248,.12)"
                                    : "#e7f3ff",
                                fontSize: 32,
                                animation: "sessionFloat 3s ease-in-out infinite"
                            }}
                        >
                            🎤
                        </div>
                        <h2 style={{ margin: 0, fontSize: 23 }}>
                            No sessions available yet
                        </h2>
                        <p
                            style={{
                                color: theme.secondaryText,
                                maxWidth: 390,
                                lineHeight: 1.7,
                                margin: "12px auto 0",
                                fontSize: 14
                            }}
                        >
                            New talks and activities will appear here when they are
                            added to EventSphere.
                        </p>
                    </div>
                )}

                {/* Session cards */}
                {!loading && sessions.length > 0 && (
                    <div
                        className="session-grid"
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                            gap: 20
                        }}
                    >
                        {sessions.map((session, index) => {
                            const bookmarked = isBookmarked(session._id);
                            const registering = registeringId === session._id;
                            const bookmarking = bookmarkLoadingId === session._id;

                            return (
                                <article
                                    key={session._id}
                                    className="session-card session-enter"
                                    style={{
                                        ...cardStyle,
                                        animationDelay: `${Math.min(index * 0.07, 0.5)}s`
                                    }}
                                >
                                    {/* Card accent */}
                                    <div
                                        style={{
                                            height: 4,
                                            background: "linear-gradient(90deg, #1688f8, #54c6ff, transparent)"
                                        }}
                                    />

                                    <div style={{ padding: 23 }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                                justifyContent: "space-between",
                                                gap: 12
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: 49,
                                                    height: 49,
                                                    display: "grid",
                                                    placeItems: "center",
                                                    borderRadius: 15,
                                                    background: darkMode
                                                        ? "rgba(22,136,248,.14)"
                                                        : "#e8f4ff",
                                                    fontSize: 23
                                                }}
                                            >
                                                🎤
                                            </div>

                                            <span
                                                style={{
                                                    padding: "7px 10px",
                                                    borderRadius: 9,
                                                    background: bookmarked
                                                        ? "rgba(234,161,38,.13)"
                                                        : darkMode
                                                            ? "rgba(148,163,184,.09)"
                                                            : "#f2f6fb",
                                                    color: bookmarked
                                                        ? "#e5a126"
                                                        : theme.secondaryText,
                                                    fontSize: 10,
                                                    fontWeight: 800,
                                                    letterSpacing: ".5px",
                                                    textTransform: "uppercase"
                                                }}
                                            >
                                                {bookmarked ? "★ Saved" : "Session"}
                                            </span>
                                        </div>

                                        <h3
                                            style={{
                                                fontSize: 21,
                                                lineHeight: 1.35,
                                                letterSpacing: "-.4px",
                                                margin: "18px 0 7px",
                                                overflowWrap: "anywhere"
                                            }}
                                        >
                                            {session.title || "Untitled Session"}
                                        </h3>

                                        <div
                                            style={{
                                                color: theme.accentLight,
                                                fontSize: 12,
                                                fontWeight: 750
                                            }}
                                        >
                                            {getExpoName(session.expo)}
                                        </div>

                                        <div
                                            style={{
                                                display: "grid",
                                                gap: 12,
                                                marginTop: 21,
                                                padding: "17px 0",
                                                borderTop: `1px solid ${theme.border}`,
                                                borderBottom: `1px solid ${theme.border}`
                                            }}
                                        >
                                            {[
                                                ["🎙️", "Speaker", session.speaker || "To be announced"],
                                                ["🧠", "Topic", session.topic || "General session"],
                                                ["📍", "Location", session.location || "To be announced"],
                                                ["📅", "Date", formatDate(session.date)],
                                                ["🕒", "Time", `${session.startTime || "TBA"} – ${session.endTime || "TBA"}`]
                                            ].map(([icon, label, value]) => (
                                                <div
                                                    key={label}
                                                    style={{
                                                        display: "grid",
                                                        gridTemplateColumns: "24px 72px minmax(0, 1fr)",
                                                        alignItems: "start",
                                                        gap: 7,
                                                        fontSize: 12,
                                                        lineHeight: 1.55
                                                    }}
                                                >
                                                    <span>{icon}</span>
                                                    <span style={{ color: theme.secondaryText }}>
                                                        {label}
                                                    </span>
                                                    <span
                                                        style={{
                                                            fontWeight: 650,
                                                            overflowWrap: "anywhere"
                                                        }}
                                                    >
                                                        {value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {session.description && (
                                            <p
                                                style={{
                                                    color: theme.secondaryText,
                                                    fontSize: 13,
                                                    lineHeight: 1.75,
                                                    margin: "16px 0 0",
                                                    overflowWrap: "anywhere"
                                                }}
                                            >
                                                {session.description}
                                            </p>
                                        )}

                                        {/* Bookmark action */}
                                        <button
                                            className="session-action"
                                            onClick={() => handleBookmark(session)}
                                            disabled={bookmarking}
                                            style={{
                                                ...smallButton,
                                                marginTop: 20,
                                                background: bookmarked
                                                    ? darkMode
                                                        ? "rgba(234,161,38,.12)"
                                                        : "#fff5df"
                                                    : darkMode
                                                        ? "rgba(148,163,184,.08)"
                                                        : "#f0f6fd",
                                                color: bookmarked
                                                    ? "#d99519"
                                                    : theme.text,
                                                border: `1px solid ${
                                                    bookmarked
                                                        ? "rgba(234,161,38,.25)"
                                                        : theme.border
                                                }`,
                                                opacity: bookmarking ? 0.65 : 1,
                                                cursor: bookmarking ? "wait" : "pointer"
                                            }}
                                        >
                                            {bookmarking
                                                ? "Updating bookmark..."
                                                : bookmarked
                                                    ? "★ Bookmarked — Remove"
                                                    : "☆ Save to My Bookmarks"}
                                        </button>

                                        {bookmarkMessages[session._id] && (
                                            <div
                                                role="status"
                                                style={{
                                                    marginTop: 9,
                                                    padding: "10px 12px",
                                                    borderRadius: 10,
                                                    background: darkMode
                                                        ? "rgba(22,136,248,.10)"
                                                        : "#eaf5ff",
                                                    color: theme.accentLight,
                                                    fontSize: 12,
                                                    lineHeight: 1.5
                                                }}
                                            >
                                                {bookmarkMessages[session._id]}
                                            </div>
                                        )}

                                        {/* Registration action */}
                                        <button
                                            className="session-action"
                                            onClick={() => handleRegister(session)}
                                            disabled={registering}
                                            style={{
                                                ...smallButton,
                                                marginTop: 10,
                                                background: registering
                                                    ? "#64748b"
                                                    : "linear-gradient(110deg, #1688f8, #0875df)",
                                                color: "#ffffff",
                                                boxShadow: registering
                                                    ? "none"
                                                    : "0 9px 20px rgba(22,136,248,.20)",
                                                opacity: registering ? 0.75 : 1,
                                                cursor: registering ? "wait" : "pointer"
                                            }}
                                        >
                                            {registering
                                                ? "Registering..."
                                                : "Register for Session  →"}
                                        </button>

                                        {successMessages[session._id] && (
                                            <div
                                                role="status"
                                                style={{
                                                    marginTop: 10,
                                                    padding: "11px 12px",
                                                    borderRadius: 10,
                                                    background: darkMode
                                                        ? "rgba(34,197,94,.10)"
                                                        : "#eafaf0",
                                                    color: darkMode ? "#86efac" : "#167344",
                                                    fontSize: 12,
                                                    lineHeight: 1.5
                                                }}
                                            >
                                                ✓ {successMessages[session._id]}
                                            </div>
                                        )}

                                        {registrationErrors[session._id] && (
                                            <div
                                                role="alert"
                                                style={{
                                                    marginTop: 10,
                                                    padding: "11px 12px",
                                                    borderRadius: 10,
                                                    background: darkMode
                                                        ? "rgba(239,68,68,.10)"
                                                        : "#fff0f0",
                                                    color: darkMode ? "#fca5a5" : "#b91c1c",
                                                    fontSize: 12,
                                                    lineHeight: 1.5
                                                }}
                                            >
                                                ⚠ {registrationErrors[session._id]}
                                            </div>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}

                {/* Footer */}
                <footer
                    style={{
                        textAlign: "center",
                        color: theme.secondaryText,
                        fontSize: 12,
                        marginTop: 45,
                        paddingTop: 22,
                        borderTop: `1px solid ${theme.border}`
                    }}
                >
                    <span style={{ color: theme.accentLight, fontWeight: 800 }}>
                        EventSphere
                    </span>
                    {" "}· Make every event count.
                </footer>
            </main>
        </div>
    );
}

export default Sessions;
