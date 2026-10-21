
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Expos() {
    const [expos, setExpos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("eventSphereDarkMode") === "true"
    );

    // Sync dark/light mode
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

    // Load expos
    useEffect(() => {
        const loadExpos = async () => {
            try {
                setLoading(true);
                setError("");

                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:5000/api/expos",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const expoData =
                    response.data.expos ||
                    response.data.data ||
                    [];

                setExpos(expoData);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load expos"
                );
            } finally {
                setLoading(false);
            }
        };

        loadExpos();
    }, []);

    const formatDate = (date) => {
        if (!date) return "Date not announced";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Date not announced";
        }

        return parsedDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className={`es-expos-page ${darkMode ? "dark" : "light"}`}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

                .es-expos-page {
                    --accent: #168fff;
                    --accent-light: #49b2ff;
                    --accent-soft: rgba(22, 143, 255, 0.12);
                    --page: #05080d;
                    --surface: rgba(10, 16, 24, 0.88);
                    --surface-soft: #0d1520;
                    --text: #f5f8fb;
                    --muted: #8b98a8;
                    --border: rgba(139, 165, 190, 0.16);
                    --shadow: 0 22px 60px rgba(0, 0, 0, 0.24);

                    min-height: 100vh;
                    padding: 32px 24px 70px;
                    position: relative;
                    isolation: isolate;
                    overflow: hidden;
                    background: var(--page);
                    color: var(--text);
                    font-family: Inter, Arial, Helvetica, sans-serif;
                    transition: background 0.3s ease, color 0.3s ease;
                }

                .es-expos-page.light {
                    --page: #f4f8fc;
                    --surface: rgba(255, 255, 255, 0.92);
                    --surface-soft: #f4f8fc;
                    --text: #101a29;
                    --muted: #68788b;
                    --border: rgba(71, 100, 130, 0.16);
                    --shadow: 0 22px 55px rgba(29, 59, 91, 0.09);
                }

                .es-expos-page *,
                .es-expos-page *::before,
                .es-expos-page *::after {
                    box-sizing: border-box;
                }

                .es-expos-page .es-glow {
                    position: absolute;
                    width: 400px;
                    height: 400px;
                    border-radius: 50%;
                    filter: blur(100px);
                    opacity: 0.14;
                    pointer-events: none;
                    z-index: -1;
                }

                .es-expos-page .es-glow-one {
                    background: #087cff;
                    top: -180px;
                    right: -100px;
                }

                .es-expos-page .es-glow-two {
                    background: #6045ff;
                    top: 500px;
                    left: -280px;
                    opacity: 0.09;
                }

                .es-expos-page .es-container {
                    max-width: 1160px;
                    margin: 0 auto;
                    position: relative;
                }

                .es-expos-page .es-topbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 68px;
                    animation: esExpoDown 0.65s ease both;
                }

                .es-expos-page .es-brand {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: var(--text);
                    text-decoration: none;
                }

                .es-expos-page .es-brand-mark {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 43px;
                    height: 43px;
                    border: 1px solid rgba(73, 178, 255, 0.35);
                    border-radius: 14px;
                    color: white;
                    background: linear-gradient(145deg, #168fff, #1355c8);
                    box-shadow: 0 8px 25px rgba(22, 143, 255, 0.2);
                    font-size: 21px;
                }

                .es-expos-page .es-brand-name {
                    font-size: 17px;
                    font-weight: 800;
                    letter-spacing: -0.5px;
                }

                .es-expos-page .es-brand-name span {
                    color: var(--accent-light);
                }

                .es-expos-page .es-brand-caption {
                    margin-top: 3px;
                    color: var(--muted);
                    font-size: 10px;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                }

                .es-expos-page .es-back-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 9px;
                    padding: 12px 17px;
                    color: var(--text);
                    text-decoration: none;
                    font-size: 13px;
                    font-weight: 600;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    transition: 0.25s ease;
                }

                .es-expos-page .es-back-link:hover {
                    border-color: rgba(73, 178, 255, 0.6);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(22, 143, 255, 0.1);
                }

                .es-expos-page .es-hero {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    gap: 35px;
                    margin-bottom: 36px;
                    animation: esExpoUp 0.7s ease both;
                }

                .es-expos-page .es-eyebrow {
                    display: inline-flex;
                    align-items: center;
                    gap: 9px;
                    padding: 8px 12px;
                    color: var(--accent-light);
                    background: var(--accent-soft);
                    border: 1px solid rgba(22, 143, 255, 0.22);
                    border-radius: 999px;
                    font-size: 10px;
                    font-weight: 800;
                    letter-spacing: 1.8px;
                    text-transform: uppercase;
                }

                .es-expos-page .es-eyebrow-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: var(--accent-light);
                    box-shadow: 0 0 10px var(--accent-light);
                }

                .es-expos-page .es-hero h1 {
                    margin: 20px 0 13px;
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: clamp(38px, 5.5vw, 62px);
                    line-height: 1.08;
                    font-weight: 500;
                    letter-spacing: -1.8px;
                }

                .es-expos-page .es-hero h1 span {
                    color: var(--accent-light);
                }

                .es-expos-page .es-hero-description {
                    max-width: 510px;
                    margin: 0;
                    color: var(--muted);
                    font-size: 14px;
                    line-height: 1.9;
                }

                .es-expos-page .es-hero-stat {
                    min-width: 150px;
                    padding: 20px 24px;
                    border: 1px solid var(--border);
                    border-radius: 18px;
                    background: var(--surface);
                    box-shadow: var(--shadow);
                }

                .es-expos-page .es-stat-number {
                    display: block;
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: 34px;
                    line-height: 1.2;
                }

                .es-expos-page .es-stat-label {
                    display: block;
                    margin-top: 7px;
                    color: var(--muted);
                    font-size: 11px;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                }

                .es-expos-page .es-section-line {
                    height: 1px;
                    margin: 0 0 30px;
                    background: linear-gradient(
                        90deg,
                        var(--accent),
                        var(--border) 35%,
                        transparent
                    );
                    opacity: 0.7;
                }

                .es-expos-page .es-expo-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 22px;
                    align-items: stretch;
                }

                .es-expos-page .es-expo-card {
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                    position: relative;
                    padding: 25px;
                    overflow: hidden;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: 22px;
                    box-shadow: var(--shadow);
                    backdrop-filter: blur(16px);
                    animation: esExpoUp 0.65s ease both;
                    transition:
                        transform 0.3s ease,
                        border-color 0.3s ease,
                        box-shadow 0.3s ease;
                }

                .es-expos-page .es-expo-card::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 25px;
                    right: 25px;
                    height: 2px;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        var(--accent),
                        #7864ff,
                        transparent
                    );
                    opacity: 0.65;
                }

                .es-expos-page .es-expo-card::after {
                    content: "";
                    position: absolute;
                    top: -80px;
                    right: -80px;
                    width: 160px;
                    height: 160px;
                    border-radius: 50%;
                    background: var(--accent);
                    filter: blur(90px);
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.3s ease;
                }

                .es-expos-page .es-expo-card:hover {
                    transform: translateY(-7px);
                    border-color: rgba(73, 178, 255, 0.45);
                    box-shadow: 0 24px 60px rgba(22, 143, 255, 0.09);
                }

                .es-expos-page .es-expo-card:hover::after {
                    opacity: 0.15;
                }

                .es-expos-page .es-card-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 23px;
                }

                .es-expos-page .es-expo-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 51px;
                    height: 51px;
                    flex-shrink: 0;
                    border-radius: 16px;
                    background: linear-gradient(
                        145deg,
                        rgba(22, 143, 255, 0.22),
                        rgba(90, 85, 255, 0.12)
                    );
                    border: 1px solid rgba(73, 178, 255, 0.23);
                    font-size: 24px;
                    transition: transform 0.3s ease;
                }

                .es-expos-page .es-expo-card:hover .es-expo-icon {
                    transform: rotate(-5deg) scale(1.06);
                }

                .es-expos-page .es-card-number {
                    color: var(--muted);
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: 13px;
                    letter-spacing: 1px;
                }

                .es-expos-page .es-card-label {
                    display: inline-flex;
                    align-self: flex-start;
                    margin-bottom: 12px;
                    padding: 6px 9px;
                    color: var(--accent-light);
                    background: var(--accent-soft);
                    border-radius: 6px;
                    font-size: 9px;
                    font-weight: 800;
                    letter-spacing: 1.3px;
                    text-transform: uppercase;
                }

                .es-expos-page .es-expo-title {
                    margin: 0 0 20px;
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: 25px;
                    font-weight: 500;
                    line-height: 1.3;
                    letter-spacing: -0.4px;
                    overflow-wrap: anywhere;
                }

                .es-expos-page .es-info-list {
                    display: grid;
                    gap: 10px;
                    padding: 15px;
                    margin-bottom: 18px;
                    background: var(--surface-soft);
                    border: 1px solid var(--border);
                    border-radius: 14px;
                }

                .es-expos-page .es-info-row {
                    display: flex;
                    align-items: flex-start;
                    gap: 11px;
                    min-width: 0;
                    font-size: 12px;
                    line-height: 1.6;
                }

                .es-expos-page .es-info-icon {
                    display: inline-flex;
                    justify-content: center;
                    width: 18px;
                    flex-shrink: 0;
                    font-size: 14px;
                }

                .es-expos-page .es-info-content {
                    min-width: 0;
                }

                .es-expos-page .es-info-label {
                    display: block;
                    margin-bottom: 2px;
                    color: var(--muted);
                    font-size: 10px;
                    letter-spacing: 0.7px;
                    text-transform: uppercase;
                }

                .es-expos-page .es-info-value {
                    display: block;
                    color: var(--text);
                    font-weight: 600;
                    overflow-wrap: anywhere;
                }

                .es-expos-page .es-description {
                    display: -webkit-box;
                    margin: 0 0 22px;
                    overflow: hidden;
                    color: var(--muted);
                    font-size: 12px;
                    line-height: 1.9;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                }

                .es-expos-page .es-card-spacer {
                    flex: 1;
                    min-height: 5px;
                }

                .es-expos-page .es-details-link {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    width: 100%;
                    padding: 14px 16px;
                    color: white;
                    background: linear-gradient(110deg, #087bea, #1763d5);
                    border: 1px solid rgba(73, 178, 255, 0.35);
                    border-radius: 12px;
                    text-decoration: none;
                    font-size: 12px;
                    font-weight: 800;
                    letter-spacing: 0.2px;
                    box-shadow: 0 9px 25px rgba(22, 110, 230, 0.17);
                    transition: 0.25s ease;
                }

                .es-expos-page .es-details-link:hover {
                    background: linear-gradient(110deg, #209aff, #2679ed);
                    box-shadow: 0 12px 30px rgba(22, 143, 255, 0.3);
                }

                .es-expos-page .es-details-arrow {
                    font-size: 18px;
                    transition: transform 0.25s ease;
                }

                .es-expos-page .es-details-link:hover .es-details-arrow {
                    transform: translateX(4px);
                }

                .es-expos-page .es-state-panel {
                    max-width: 650px;
                    margin: 35px auto;
                    padding: 55px 25px;
                    text-align: center;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: 24px;
                    box-shadow: var(--shadow);
                    animation: esExpoUp 0.5s ease both;
                }

                .es-expos-page .es-state-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 70px;
                    height: 70px;
                    margin: 0 auto 22px;
                    background: var(--accent-soft);
                    border: 1px solid rgba(73, 178, 255, 0.2);
                    border-radius: 22px;
                    font-size: 31px;
                }

                .es-expos-page .es-state-panel h2 {
                    margin: 0 0 12px;
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: 28px;
                    font-weight: 500;
                }

                .es-expos-page .es-state-panel p {
                    margin: 0;
                    color: var(--muted);
                    font-size: 13px;
                    line-height: 1.8;
                }

                .es-expos-page .es-loading-ring {
                    width: 38px;
                    height: 38px;
                    margin: 0 auto 20px;
                    border: 3px solid var(--border);
                    border-top-color: var(--accent);
                    border-radius: 50%;
                    animation: esExpoSpin 0.8s linear infinite;
                }

                .es-expos-page .es-error-panel {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin: 0 0 25px;
                    padding: 17px 19px;
                    color: #ff9a9a;
                    background: rgba(239, 68, 68, 0.09);
                    border: 1px solid rgba(239, 68, 68, 0.22);
                    border-radius: 13px;
                    font-size: 13px;
                    line-height: 1.7;
                }

                .es-expos-page.light .es-error-panel {
                    color: #b91c1c;
                    background: #fff1f1;
                    border-color: #fecaca;
                }

                .es-expos-page .es-footer {
                    display: flex;
                    justify-content: space-between;
                    gap: 20px;
                    margin-top: 50px;
                    padding-top: 20px;
                    border-top: 1px solid var(--border);
                    color: var(--muted);
                    font-size: 10px;
                    letter-spacing: 0.6px;
                }

                @keyframes esExpoUp {
                    from {
                        opacity: 0;
                        transform: translateY(18px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes esExpoDown {
                    from {
                        opacity: 0;
                        transform: translateY(-12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes esExpoSpin {
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 950px) {
                    .es-expos-page .es-expo-grid {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }

                    .es-expos-page .es-topbar {
                        margin-bottom: 52px;
                    }
                }

                @media (max-width: 650px) {
                    .es-expos-page {
                        padding: 22px 16px 45px;
                    }

                    .es-expos-page .es-topbar {
                        margin-bottom: 45px;
                    }

                    .es-expos-page .es-brand-caption {
                        letter-spacing: 1px;
                    }

                    .es-expos-page .es-back-link {
                        padding: 10px 12px;
                        font-size: 11px;
                    }

                    .es-expos-page .es-hero {
                        display: block;
                        margin-bottom: 28px;
                    }

                    .es-expos-page .es-hero h1 {
                        font-size: 43px;
                    }

                    .es-expos-page .es-hero-stat {
                        display: inline-block;
                        min-width: 130px;
                        margin-top: 23px;
                        padding: 14px 18px;
                    }

                    .es-expos-page .es-stat-number {
                        font-size: 27px;
                    }

                    .es-expos-page .es-expo-grid {
                        grid-template-columns: minmax(0, 1fr);
                        gap: 17px;
                    }

                    .es-expos-page .es-expo-card {
                        padding: 22px;
                    }

                    .es-expos-page .es-footer {
                        flex-direction: column;
                        gap: 9px;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .es-expos-page *,
                    .es-expos-page *::before,
                    .es-expos-page *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        scroll-behavior: auto !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `}</style>

            <div className="es-glow es-glow-one" />
            <div className="es-glow es-glow-two" />

            <div className="es-container">
                {/* Header */}
                <header className="es-topbar">
                    <Link to="/dashboard" className="es-brand">
                        <div className="es-brand-mark">✦</div>
                        <div>
                            <div className="es-brand-name">
                                Event<span>Sphere</span>
                            </div>
                            <div className="es-brand-caption">
                                Discover. Connect. Experience.
                            </div>
                        </div>
                    </Link>

                    <Link to="/dashboard" className="es-back-link">
                        <span>←</span> Back to Dashboard
                    </Link>
                </header>

                {/* Hero */}
                <section className="es-hero">
                    <div>
                        <div className="es-eyebrow">
                            <span className="es-eyebrow-dot" />
                            Discover What's Next
                        </div>

                        <h1>
                            Explore the
                            <br />
                            world of <span>Expos.</span>
                        </h1>

                        <p className="es-hero-description">
                            Find exciting exhibitions, discover new ideas,
                            and connect with experiences worth being part of.
                            Your next great event starts here.
                        </p>
                    </div>

                    {!loading && !error && (
                        <div className="es-hero-stat">
                            <span className="es-stat-number">
                                {String(expos.length).padStart(2, "0")}
                            </span>
                            <span className="es-stat-label">
                                {expos.length === 1
                                    ? "Expo available"
                                    : "Expos available"}
                            </span>
                        </div>
                    )}
                </section>

                <div className="es-section-line" />

                {/* Loading */}
                {loading && (
                    <div className="es-state-panel">
                        <div className="es-loading-ring" />
                        <h2>Finding your next experience</h2>
                        <p>Please wait while we load the available expos.</p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="es-error-panel">
                        <span style={{ fontSize: "20px" }}>⚠</span>
                        <span>{error}</span>
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && expos.length === 0 && (
                    <div className="es-state-panel">
                        <div className="es-state-icon">🎪</div>
                        <h2>Something exciting is coming.</h2>
                        <p>
                            There are no expos available right now.
                            Check back soon for upcoming experiences.
                        </p>
                    </div>
                )}

                {/* Expo cards */}
                {!loading && !error && expos.length > 0 && (
                    <div className="es-expo-grid">
                        {expos.map((expo, index) => (
                            <article
                                className="es-expo-card"
                                key={expo._id}
                                style={{
                                    animationDelay: `${Math.min(index * 0.09, 0.45)}s`,
                                }}
                            >
                                <div className="es-card-top">
                                    <div className="es-expo-icon">🎪</div>
                                    <span className="es-card-number">
                                        EXPO / {String(index + 1).padStart(2, "0")}
                                    </span>
                                </div>

                                <span className="es-card-label">
                                    Featured Exhibition
                                </span>

                                <h2 className="es-expo-title">
                                    {expo.title || "Untitled Expo"}
                                </h2>

                                <div className="es-info-list">
                                    <div className="es-info-row">
                                        <span className="es-info-icon">📅</span>
                                        <div className="es-info-content">
                                            <span className="es-info-label">
                                                Event Date
                                            </span>
                                            <span className="es-info-value">
                                                {formatDate(expo.date)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="es-info-row">
                                        <span className="es-info-icon">📍</span>
                                        <div className="es-info-content">
                                            <span className="es-info-label">
                                                Location
                                            </span>
                                            <span className="es-info-value">
                                                {expo.location || "Location to be announced"}
                                            </span>
                                        </div>
                                    </div>

                                    {expo.theme && (
                                        <div className="es-info-row">
                                            <span className="es-info-icon">✧</span>
                                            <div className="es-info-content">
                                                <span className="es-info-label">
                                                    Theme
                                                </span>
                                                <span className="es-info-value">
                                                    {expo.theme}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {expo.description && (
                                    <p className="es-description">
                                        {expo.description}
                                    </p>
                                )}

                                <div className="es-card-spacer" />

                                <Link
                                    to={`/expos/${expo._id}`}
                                    className="es-details-link"
                                >
                                    <span>Explore Expo Details</span>
                                    <span className="es-details-arrow">→</span>
                                </Link>
                            </article>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <footer className="es-footer">
                    <span>© {new Date().getFullYear()} EventSphere</span>
                    <span>MADE FOR MEANINGFUL EXPERIENCES</span>
                </footer>
            </div>
        </div>
    );
}

export default Expos;
