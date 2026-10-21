
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function ExpoDetails() {
    const { id } = useParams();

    const [expo, setExpo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [registering, setRegistering] = useState(false);
    const [message, setMessage] = useState("");

    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("eventSphereDarkMode") === "true"
    );

    // Sync dark mode
    useEffect(() => {
        const syncTheme = () => {
            setDarkMode(
                localStorage.getItem("eventSphereDarkMode") === "true"
            );
        };

        window.addEventListener("storage", syncTheme);
        const interval = setInterval(syncTheme, 300);

        return () => {
            window.removeEventListener("storage", syncTheme);
            clearInterval(interval);
        };
    }, []);

    // Load expo
    useEffect(() => {
        const loadExpo = async () => {
            try {
                setLoading(true);
                setError("");

                const token = localStorage.getItem("token");

                const response = await axios.get(
                    `api/expos/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setExpo(response.data.expo || response.data.data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load expo"
                );
            } finally {
                setLoading(false);
            }
        };

        loadExpo();
    }, [id]);

    // Register for expo
    const handleRegister = async () => {
        try {
            setRegistering(true);
            setMessage("");
            setError("");

            const token = localStorage.getItem("token");

            await axios.post(
                "api/registrations",
                {
                    expo: id,
                    registrationType: "expo",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage("Successfully registered for this expo!");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to register for expo"
            );
        } finally {
            setRegistering(false);
        }
    };

    // Theme
    const theme = darkMode
        ? {
              background: "#05080d",
              surface: "#0a1018",
              surfaceSoft: "#0d1520",
              text: "#f5f8fb",
              muted: "#8b98a8",
              border: "rgba(255,255,255,0.10)",
              blue: "#168fff",
              blueLight: "#49b2ff",
              shadow: "0 25px 80px rgba(0,0,0,0.30)",
          }
        : {
              background: "#f4f7fb",
              surface: "#ffffff",
              surfaceSoft: "#f8fafc",
              text: "#111827",
              muted: "#6b7280",
              border: "#e5e7eb",
              blue: "#0878e8",
              blueLight: "#168fff",
              shadow: "0 25px 65px rgba(15,23,42,0.08)",
          };

    const serif = 'Georgia, "Times New Roman", serif';
    const sans = "Inter, Arial, Helvetica, sans-serif";

    const infoCardStyle = {
        padding: "22px",
        background: theme.surfaceSoft,
        border: `1px solid ${theme.border}`,
        borderRadius: "17px",
        minWidth: 0,
        transition: "transform 0.25s ease, border-color 0.25s ease",
    };

    const labelStyle = {
        margin: 0,
        color: theme.muted,
        fontSize: "10px",
        fontWeight: "800",
        letterSpacing: "1.7px",
    };

    const valueStyle = {
        margin: "10px 0 0",
        color: theme.text,
        fontSize: "15px",
        fontWeight: "600",
        lineHeight: "1.7",
        overflowWrap: "anywhere",
    };

    const alertStyle = {
        marginTop: "22px",
        padding: "15px 18px",
        borderRadius: "12px",
        fontSize: "12px",
        lineHeight: "1.8",
        fontWeight: "600",
    };

    // Loading state
    if (loading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    background: theme.background,
                    color: theme.text,
                    display: "grid",
                    placeItems: "center",
                    padding: "25px",
                    fontFamily: sans,
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "420px",
                        padding: "45px 30px",
                        background: theme.surface,
                        border: `1px solid ${theme.border}`,
                        borderRadius: "22px",
                        textAlign: "center",
                        boxShadow: theme.shadow,
                    }}
                >
                    <div
                        style={{
                            width: "64px",
                            height: "64px",
                            display: "grid",
                            placeItems: "center",
                            margin: "0 auto 22px",
                            borderRadius: "18px",
                            background: "rgba(22,143,255,0.12)",
                            color: theme.blueLight,
                            fontSize: "29px",
                        }}
                    >
                        ◈
                    </div>

                    <h2
                        style={{
                            fontFamily: serif,
                            fontSize: "25px",
                            fontWeight: "400",
                            margin: "0 0 10px",
                        }}
                    >
                        Preparing Your Expo
                    </h2>

                    <p
                        style={{
                            margin: 0,
                            color: theme.muted,
                            fontSize: "12px",
                        }}
                    >
                        Loading event information...
                    </p>
                </div>
            </div>
        );
    }

    // Error state
    if (error && !expo) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    background: theme.background,
                    color: theme.text,
                    padding: "60px 20px",
                    display: "grid",
                    placeItems: "center",
                    fontFamily: sans,
                }}
            >
                <div
                    style={{
                        maxWidth: "520px",
                        width: "100%",
                        padding: "35px",
                        border: `1px solid ${theme.border}`,
                        borderRadius: "22px",
                        background: theme.surface,
                        textAlign: "center",
                        boxShadow: theme.shadow,
                    }}
                >
                    <div style={{ fontSize: "35px", marginBottom: "16px" }}>
                        ⚠️
                    </div>

                    <h2
                        style={{
                            fontFamily: serif,
                            fontSize: "27px",
                            fontWeight: "400",
                            margin: "0 0 12px",
                        }}
                    >
                        Expo Unavailable
                    </h2>

                    <p
                        style={{
                            color: theme.muted,
                            fontSize: "13px",
                            lineHeight: "1.8",
                            overflowWrap: "anywhere",
                        }}
                    >
                        {error}
                    </p>

                    <Link
                        to="/expos"
                        style={{
                            display: "inline-flex",
                            marginTop: "15px",
                            padding: "12px 20px",
                            borderRadius: "10px",
                            background:
                                "linear-gradient(110deg,#0878e8,#168fff,#49b2ff)",
                            color: "#fff",
                            textDecoration: "none",
                            fontSize: "12px",
                            fontWeight: "800",
                        }}
                    >
                        ← Back to Expos
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                position: "relative",
                overflow: "hidden",
                background: theme.background,
                color: theme.text,
                padding: "35px 20px 55px",
                fontFamily: sans,
                transition: "background 0.3s ease, color 0.3s ease",
            }}
        >
            <style>{`
                .expo-details-page,
                .expo-details-page * {
                    box-sizing: border-box;
                }

                .expo-details-page a,
                .expo-details-page button {
                    font-family: inherit;
                    -webkit-tap-highlight-color: transparent;
                }

                .expo-detail-glow {
                    position: absolute;
                    width: 320px;
                    height: 320px;
                    border-radius: 50%;
                    filter: blur(100px);
                    pointer-events: none;
                    z-index: 0;
                }

                .expo-detail-glow-one {
                    top: -200px;
                    left: -150px;
                    background: rgba(22,143,255,0.12);
                }

                .expo-detail-glow-two {
                    right: -200px;
                    bottom: -200px;
                    background: rgba(73,178,255,0.09);
                }

                .expo-detail-content {
                    position: relative;
                    z-index: 1;
                    animation: expoEnter .55s ease both;
                }

                .expo-detail-info-card:hover {
                    transform: translateY(-3px);
                    border-color: rgba(22,143,255,0.4) !important;
                }

                .expo-register-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 32px rgba(22,143,255,0.28) !important;
                }

                .expo-register-button:disabled {
                    cursor: not-allowed;
                    opacity: .7;
                }

                .expo-back-link:hover {
                    color: #49b2ff !important;
                }

                @keyframes expoEnter {
                    from {
                        opacity: 0;
                        transform: translateY(12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (max-width: 600px) {
                    .expo-detail-main-card {
                        padding: 23px !important;
                        border-radius: 20px !important;
                    }

                    .expo-detail-title {
                        font-size: 34px !important;
                    }

                    .expo-detail-hero {
                        padding: 24px !important;
                    }

                    .expo-register-button {
                        width: 100%;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .expo-details-page *,
                    .expo-details-page *::before,
                    .expo-details-page *::after {
                        animation-duration: .01ms !important;
                        transition-duration: .01ms !important;
                    }
                }
            `}</style>

            <div className="expo-details-page">
                <div className="expo-detail-glow expo-detail-glow-one" />
                <div className="expo-detail-glow expo-detail-glow-two" />

                <div
                    className="expo-detail-content"
                    style={{
                        maxWidth: "1000px",
                        margin: "0 auto",
                    }}
                >
                    {/* TOP NAVIGATION */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "15px",
                            marginBottom: "25px",
                        }}
                    >
                        <Link
                            to="/expos"
                            className="expo-back-link"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "9px",
                                color: theme.muted,
                                textDecoration: "none",
                                fontSize: "12px",
                                fontWeight: "700",
                                transition: "color .2s ease",
                            }}
                        >
                            <span style={{ color: theme.blueLight }}>←</span>
                            BACK TO EXPOS
                        </Link>

                        <span
                            style={{
                                color: theme.muted,
                                fontSize: "10px",
                                fontWeight: "800",
                                letterSpacing: "2px",
                            }}
                        >
                            EVENTSPHERE <span style={{ color: theme.blueLight }}>/</span> EXPO
                        </span>
                    </div>

                    {expo && (
                        <div
                            className="expo-detail-main-card"
                            style={{
                                position: "relative",
                                overflow: "hidden",
                                padding: "35px",
                                background: theme.surface,
                                border: `1px solid ${theme.border}`,
                                borderRadius: "25px",
                                boxShadow: theme.shadow,
                            }}
                        >
                            {/* TOP ACCENT */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: "8%",
                                    right: "8%",
                                    height: "2px",
                                    background:
                                        "linear-gradient(90deg,transparent,#168fff,#49b2ff,transparent)",
                                }}
                            />

                            {/* HERO */}
                            <div
                                className="expo-detail-hero"
                                style={{
                                    position: "relative",
                                    overflow: "hidden",
                                    padding: "32px",
                                    borderRadius: "20px",
                                    background: darkMode
                                        ? "linear-gradient(130deg,#0b1b30,#0b1220 75%)"
                                        : "linear-gradient(130deg,#eaf5ff,#f8fafc 75%)",
                                    border: `1px solid ${theme.border}`,
                                }}
                            >
                                <div
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "9px",
                                        padding: "8px 12px",
                                        borderRadius: "999px",
                                        background: darkMode
                                            ? "rgba(22,143,255,0.12)"
                                            : "#dceeff",
                                        color: theme.blueLight,
                                        fontSize: "9px",
                                        fontWeight: "800",
                                        letterSpacing: "2px",
                                        marginBottom: "23px",
                                    }}
                                >
                                    <span>◈</span> FEATURED EXPO
                                </div>

                                <h1
                                    className="expo-detail-title"
                                    style={{
                                        margin: 0,
                                        maxWidth: "750px",
                                        fontFamily: serif,
                                        fontSize: "44px",
                                        fontWeight: "400",
                                        lineHeight: "1.15",
                                        letterSpacing: "-1.2px",
                                        overflowWrap: "anywhere",
                                    }}
                                >
                                    {expo.title || "Untitled Expo"}
                                </h1>

                                <p
                                    style={{
                                        margin: "16px 0 0",
                                        maxWidth: "570px",
                                        color: theme.muted,
                                        fontSize: "13px",
                                        lineHeight: "1.9",
                                    }}
                                >
                                    Explore the details, discover the experience
                                    and register to be part of this event.
                                </p>

                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "10px",
                                        marginTop: "24px",
                                    }}
                                >
                                    <span
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            padding: "9px 12px",
                                            border: `1px solid ${theme.border}`,
                                            borderRadius: "10px",
                                            color: theme.text,
                                            fontSize: "11px",
                                        }}
                                    >
                                        <span style={{ color: theme.blueLight }}>●</span>
                                        Event information
                                    </span>

                                    <span
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            padding: "9px 12px",
                                            border: `1px solid ${theme.border}`,
                                            borderRadius: "10px",
                                            color: theme.text,
                                            fontSize: "11px",
                                        }}
                                    >
                                        <span style={{ color: theme.blueLight }}>✦</span>
                                        Registration available
                                    </span>
                                </div>
                            </div>

                            {/* EVENT INFORMATION */}
                            <div style={{ marginTop: "32px" }}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                        marginBottom: "18px",
                                    }}
                                >
                                    <span
                                        style={{
                                            width: "4px",
                                            height: "25px",
                                            borderRadius: "5px",
                                            background: theme.blueLight,
                                        }}
                                    />

                                    <div>
                                        <h2
                                            style={{
                                                margin: 0,
                                                fontFamily: serif,
                                                fontWeight: "400",
                                                fontSize: "24px",
                                            }}
                                        >
                                            Event Overview
                                        </h2>

                                        <p
                                            style={{
                                                margin: "5px 0 0",
                                                color: theme.muted,
                                                fontSize: "11px",
                                            }}
                                        >
                                            The essential details at a glance
                                        </p>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "repeat(auto-fit,minmax(min(100%,210px),1fr))",
                                        gap: "14px",
                                    }}
                                >
                                    {/* DATE */}
                                    <div
                                        className="expo-detail-info-card"
                                        style={infoCardStyle}
                                    >
                                        <div
                                            style={{
                                                width: "42px",
                                                height: "42px",
                                                display: "grid",
                                                placeItems: "center",
                                                borderRadius: "12px",
                                                background: "rgba(22,143,255,0.11)",
                                                fontSize: "20px",
                                                marginBottom: "20px",
                                            }}
                                        >
                                            📅
                                        </div>

                                        <p style={labelStyle}>EVENT DATE</p>

                                        <p style={valueStyle}>
                                            {expo.date &&
                                            !Number.isNaN(new Date(expo.date).getTime())
                                                ? new Date(expo.date).toLocaleDateString(
                                                      "en-GB",
                                                      {
                                                          day: "2-digit",
                                                          month: "long",
                                                          year: "numeric",
                                                      }
                                                  )
                                                : "Date unavailable"}
                                        </p>
                                    </div>

                                    {/* LOCATION */}
                                    <div
                                        className="expo-detail-info-card"
                                        style={infoCardStyle}
                                    >
                                        <div
                                            style={{
                                                width: "42px",
                                                height: "42px",
                                                display: "grid",
                                                placeItems: "center",
                                                borderRadius: "12px",
                                                background: "rgba(22,143,255,0.11)",
                                                fontSize: "20px",
                                                marginBottom: "20px",
                                            }}
                                        >
                                            📍
                                        </div>

                                        <p style={labelStyle}>LOCATION</p>

                                        <p style={valueStyle}>
                                            {expo.location || "Location unavailable"}
                                        </p>
                                    </div>

                                    {/* THEME */}
                                    {expo.theme && (
                                        <div
                                            className="expo-detail-info-card"
                                            style={infoCardStyle}
                                        >
                                            <div
                                                style={{
                                                    width: "42px",
                                                    height: "42px",
                                                    display: "grid",
                                                    placeItems: "center",
                                                    borderRadius: "12px",
                                                    background: "rgba(22,143,255,0.11)",
                                                    fontSize: "20px",
                                                    marginBottom: "20px",
                                                }}
                                            >
                                                ✦
                                            </div>

                                            <p style={labelStyle}>EXPO THEME</p>

                                            <p style={valueStyle}>{expo.theme}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* DESCRIPTION */}
                            {expo.description && (
                                <div
                                    style={{
                                        marginTop: "28px",
                                        padding: "25px",
                                        background: theme.surfaceSoft,
                                        border: `1px solid ${theme.border}`,
                                        borderRadius: "18px",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "12px",
                                            marginBottom: "15px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                width: "38px",
                                                height: "38px",
                                                display: "grid",
                                                placeItems: "center",
                                                borderRadius: "11px",
                                                background: "rgba(22,143,255,0.11)",
                                                fontSize: "18px",
                                            }}
                                        >
                                            ◈
                                        </span>

                                        <h2
                                            style={{
                                                margin: 0,
                                                fontFamily: serif,
                                                fontWeight: "400",
                                                fontSize: "23px",
                                            }}
                                        >
                                            About This Expo
                                        </h2>
                                    </div>

                                    <p
                                        style={{
                                            margin: 0,
                                            color: theme.muted,
                                            fontSize: "13px",
                                            lineHeight: "2",
                                            whiteSpace: "pre-line",
                                        }}
                                    >
                                        {expo.description}
                                    </p>
                                </div>
                            )}

                            {/* SUCCESS MESSAGE */}
                            {message && (
                                <div
                                    role="status"
                                    style={{
                                        ...alertStyle,
                                        background: darkMode
                                            ? "rgba(34,197,94,0.13)"
                                            : "#dcfce7",
                                        color: darkMode ? "#86efac" : "#166534",
                                        border: darkMode
                                            ? "1px solid rgba(34,197,94,0.2)"
                                            : "1px solid #bbf7d0",
                                    }}
                                >
                                    ✓ {message}
                                </div>
                            )}

                            {/* REGISTRATION ERROR */}
                            {error && expo && (
                                <div
                                    role="alert"
                                    style={{
                                        ...alertStyle,
                                        background: darkMode
                                            ? "rgba(239,68,68,0.12)"
                                            : "#fee2e2",
                                        color: darkMode ? "#fca5a5" : "#b91c1c",
                                        border: darkMode
                                            ? "1px solid rgba(239,68,68,0.2)"
                                            : "1px solid #fecaca",
                                    }}
                                >
                                    ⚠️ {error}
                                </div>
                            )}

                            {/* REGISTRATION PANEL */}
                            <div
                                style={{
                                    marginTop: "30px",
                                    padding: "25px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    flexWrap: "wrap",
                                    gap: "22px",
                                    border: `1px solid ${theme.border}`,
                                    borderRadius: "18px",
                                    background: darkMode
                                        ? "linear-gradient(120deg,rgba(22,143,255,0.08),rgba(10,16,24,0.5))"
                                        : "linear-gradient(120deg,#edf7ff,#ffffff)",
                                }}
                            >
                                <div style={{ flex: "1 1 220px" }}>
                                    <p
                                        style={{
                                            margin: "0 0 9px",
                                            color: theme.blueLight,
                                            fontSize: "9px",
                                            fontWeight: "800",
                                            letterSpacing: "2px",
                                        }}
                                    >
                                        YOUR NEXT EXPERIENCE
                                    </p>

                                    <h2
                                        style={{
                                            margin: 0,
                                            fontFamily: serif,
                                            fontWeight: "400",
                                            fontSize: "27px",
                                        }}
                                    >
                                        Ready to attend?
                                    </h2>

                                    <p
                                        style={{
                                            margin: "9px 0 0",
                                            color: theme.muted,
                                            fontSize: "12px",
                                            lineHeight: "1.8",
                                        }}
                                    >
                                        Register to be part of this expo.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="expo-register-button"
                                    onClick={handleRegister}
                                    disabled={registering}
                                    style={{
                                        minHeight: "48px",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "10px",
                                        padding: "14px 22px",
                                        border: "1px solid rgba(73,178,255,0.35)",
                                        borderRadius: "11px",
                                        background: registering
                                            ? "#64748b"
                                            : "linear-gradient(110deg,#0878e8,#168fff,#49b2ff)",
                                        color: "#ffffff",
                                        fontSize: "12px",
                                        fontWeight: "800",
                                        cursor: registering
                                            ? "not-allowed"
                                            : "pointer",
                                        boxShadow: registering
                                            ? "none"
                                            : "0 10px 28px rgba(22,143,255,0.2)",
                                        transition:
                                            "transform .25s ease, box-shadow .25s ease",
                                    }}
                                >
                                    {registering
                                        ? "Registering..."
                                        : message
                                          ? "Register Again →"
                                          : "Register for Expo →"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* FOOTER */}
                    <div
                        style={{
                            padding: "25px 10px 0",
                            color: theme.muted,
                            fontSize: "10px",
                            textAlign: "center",
                            letterSpacing: ".3px",
                        }}
                    >
                        EVENTSPHERE <span style={{ color: theme.blueLight }}>✦</span>{" "}
                        Bringing events and people together.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExpoDetails;
