
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function MyRegistrations() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("eventSphereDarkMode") === "true"
    );

    // Sync theme with the rest of EventSphere
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

    // Load registrations
    useEffect(() => {
        const loadRegistrations = async () => {
            try {
                setLoading(true);
                setError("");

                const token = localStorage.getItem("token");
                const user = JSON.parse(
                    localStorage.getItem("user") || "null"
                );

                const userId = user?._id || user?.id;

                if (!userId) {
                    setError(
                        "User information not found. Please log in again."
                    );
                    return;
                }

                const response = await axios.get(
                    `http://localhost:5000/api/registrations/user/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setRegistrations(
                    response.data.registrations ||
                    response.data.data ||
                    []
                );
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load registrations. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        loadRegistrations();
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
            year: "numeric"
        });
    };

    const registeredCount = registrations.filter(
        (item) => item.status === "registered"
    ).length;

    const cancelledCount = registrations.length - registeredCount;

    const theme = darkMode ? "dark" : "light";

    return (
        <div className={`es-reg-page ${theme}`}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap');

                .es-reg-page {
                    --accent: #168fff;
                    --accent-light: #49b2ff;
                    --accent-soft: rgba(22,143,255,0.12);
                    --page: #05080d;
                    --surface: rgba(10,16,24,0.88);
                    --surface-soft: #0d1520;
                    --text: #f5f8fb;
                    --muted: #8b98a8;
                    --border: rgba(139,165,190,0.16);
                    --shadow: 0 22px 60px rgba(0,0,0,0.24);

                    min-height: 100vh;
                    padding: 32px 24px 65px;
                    position: relative;
                    isolation: isolate;
                    overflow: hidden;
                    background: var(--page);
                    color: var(--text);
                    font-family: Inter, Arial, sans-serif;
                    transition: background 0.3s ease, color 0.3s ease;
                }

                .es-reg-page.light {
                    --page: #f4f8fc;
                    --surface: rgba(255,255,255,0.94);
                    --surface-soft: #f4f8fc;
                    --text: #101a29;
                    --muted: #68788b;
                    --border: rgba(71,100,130,0.16);
                    --shadow: 0 22px 55px rgba(29,59,91,0.09);
                }

                .es-reg-page *,
                .es-reg-page *::before,
                .es-reg-page *::after {
                    box-sizing: border-box;
                }

                .es-reg-page .reg-glow {
                    position: absolute;
                    width: 400px;
                    height: 400px;
                    border-radius: 50%;
                    filter: blur(100px);
                    opacity: 0.14;
                    pointer-events: none;
                    z-index: -1;
                }

                .es-reg-page .reg-glow-one {
                    background: #087cff;
                    top: -180px;
                    right: -100px;
                }

                .es-reg-page .reg-glow-two {
                    background: #6045ff;
                    top: 550px;
                    left: -280px;
                    opacity: 0.09;
                }

                .es-reg-page .reg-container {
                    max-width: 1160px;
                    margin: 0 auto;
                    position: relative;
                }

                .es-reg-page .reg-topbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 65px;
                    animation: regDown 0.65s ease both;
                }

                .es-reg-page .reg-brand {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: var(--text);
                    text-decoration: none;
                }

                .es-reg-page .reg-brand-mark {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 43px;
                    height: 43px;
                    flex-shrink: 0;
                    border: 1px solid rgba(73,178,255,0.35);
                    border-radius: 14px;
                    color: white;
                    background: linear-gradient(145deg,#168fff,#1355c8);
                    box-shadow: 0 8px 25px rgba(22,143,255,0.2);
                    font-size: 21px;
                }

                .es-reg-page .reg-brand-name {
                    font-size: 17px;
                    font-weight: 800;
                    letter-spacing: -0.5px;
                }

                .es-reg-page .reg-brand-name span {
                    color: var(--accent-light);
                }

                .es-reg-page .reg-brand-caption {
                    margin-top: 3px;
                    color: var(--muted);
                    font-size: 10px;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                }

                .es-reg-page .reg-back-link {
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

                .es-reg-page .reg-back-link:hover {
                    border-color: rgba(73,178,255,0.6);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(22,143,255,0.1);
                }

                .es-reg-page .reg-hero {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    gap: 30px;
                    margin-bottom: 36px;
                    animation: regUp 0.7s ease both;
                }

                .es-reg-page .reg-eyebrow {
                    display: inline-flex;
                    align-items: center;
                    gap: 9px;
                    padding: 8px 12px;
                    color: var(--accent-light);
                    background: var(--accent-soft);
                    border: 1px solid rgba(22,143,255,0.22);
                    border-radius: 999px;
                    font-size: 10px;
                    font-weight: 800;
                    letter-spacing: 1.8px;
                    text-transform: uppercase;
                }

                .es-reg-page .reg-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: var(--accent-light);
                    box-shadow: 0 0 10px var(--accent-light);
                }

                .es-reg-page .reg-hero h1 {
                    margin: 20px 0 13px;
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: clamp(38px,5.5vw,62px);
                    line-height: 1.12;
                    font-weight: 500;
                    letter-spacing: -1.8px;
                }

                .es-reg-page .reg-hero h1 span {
                    color: var(--accent-light);
                }

                .es-reg-page .reg-description {
                    max-width: 540px;
                    margin: 0;
                    color: var(--muted);
                    font-size: 14px;
                    line-height: 1.9;
                }

                .es-reg-page .reg-hero-stat {
                    min-width: 155px;
                    padding: 20px 24px;
                    border: 1px solid var(--border);
                    border-radius: 18px;
                    background: var(--surface);
                    box-shadow: var(--shadow);
                }

                .es-reg-page .reg-stat-number {
                    display: block;
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 34px;
                    line-height: 1.2;
                }

                .es-reg-page .reg-stat-label {
                    display: block;
                    margin-top: 7px;
                    color: var(--muted);
                    font-size: 11px;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                }

                .es-reg-page .reg-section-line {
                    height: 1px;
                    margin-bottom: 28px;
                    background: linear-gradient(
                        90deg,
                        var(--accent),
                        var(--border) 35%,
                        transparent
                    );
                    opacity: 0.7;
                }

                .es-reg-page .reg-stats {
                    display: grid;
                    grid-template-columns: repeat(3,minmax(0,1fr));
                    gap: 17px;
                    margin-bottom: 40px;
                    animation: regUp 0.65s ease both;
                }

                .es-reg-page .reg-stat-card {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    min-width: 0;
                    padding: 21px;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: 18px;
                    box-shadow: var(--shadow);
                    transition: transform 0.25s ease,border-color 0.25s ease;
                }

                .es-reg-page .reg-stat-card:hover {
                    transform: translateY(-4px);
                    border-color: rgba(73,178,255,0.4);
                }

                .es-reg-page .reg-stat-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 47px;
                    height: 47px;
                    flex-shrink: 0;
                    border-radius: 14px;
                    background: var(--accent-soft);
                    border: 1px solid rgba(22,143,255,0.13);
                    font-size: 21px;
                }

                .es-reg-page .reg-stat-icon.green {
                    background: rgba(34,197,94,0.12);
                }

                .es-reg-page .reg-stat-icon.red {
                    background: rgba(239,68,68,0.1);
                }

                .es-reg-page .reg-stat-label {
                    display: block;
                    margin-bottom: 5px;
                    color: var(--muted);
                    font-size: 11px;
                }

                .es-reg-page .reg-stat-value {
                    font-size: 26px;
                    font-weight: 800;
                    letter-spacing: -0.7px;
                }

                .es-reg-page .reg-section-heading {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 15px;
                    flex-wrap: wrap;
                    margin-bottom: 20px;
                }

                .es-reg-page .reg-section-heading h2 {
                    margin: 0;
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 27px;
                    font-weight: 500;
                }

                .es-reg-page .reg-section-caption {
                    color: var(--muted);
                    font-size: 12px;
                }

                .es-reg-page .reg-grid {
                    display: grid;
                    grid-template-columns: repeat(3,minmax(0,1fr));
                    gap: 22px;
                    align-items: stretch;
                }

                .es-reg-page .reg-card {
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
                    animation: regUp 0.65s ease both;
                    transition: transform 0.3s ease,border-color 0.3s ease,box-shadow 0.3s ease;
                }

                .es-reg-page .reg-card::before {
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
                    opacity: 0.7;
                }

                .es-reg-page .reg-card:hover {
                    transform: translateY(-7px);
                    border-color: rgba(73,178,255,0.45);
                    box-shadow: 0 24px 60px rgba(22,143,255,0.09);
                }

                .es-reg-page .reg-card-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 23px;
                }

                .es-reg-page .reg-expo-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 51px;
                    height: 51px;
                    flex-shrink: 0;
                    border-radius: 16px;
                    background: linear-gradient(
                        145deg,
                        rgba(22,143,255,0.22),
                        rgba(90,85,255,0.12)
                    );
                    border: 1px solid rgba(73,178,255,0.23);
                    font-size: 24px;
                    transition: transform 0.3s ease;
                }

                .es-reg-page .reg-card:hover .reg-expo-icon {
                    transform: rotate(-5deg) scale(1.06);
                }

                .es-reg-page .reg-card-number {
                    color: var(--muted);
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 12px;
                    letter-spacing: 1px;
                }

                .es-reg-page .reg-status {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 7px 10px;
                    border-radius: 8px;
                    font-size: 10px;
                    font-weight: 800;
                    white-space: nowrap;
                }

                .es-reg-page .reg-status.registered {
                    color: #48d58a;
                    background: rgba(34,197,94,0.12);
                    border: 1px solid rgba(34,197,94,0.17);
                }

                .es-reg-page .reg-status.cancelled {
                    color: #ff9999;
                    background: rgba(239,68,68,0.1);
                    border: 1px solid rgba(239,68,68,0.17);
                }

                .es-reg-page.light .reg-status.registered {
                    color: #168348;
                    background: #eaf9ef;
                }

                .es-reg-page.light .reg-status.cancelled {
                    color: #c62828;
                    background: #fff0f0;
                }

                .es-reg-page .reg-card-label {
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

                .es-reg-page .reg-card-title {
                    margin: 0 0 21px;
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 25px;
                    font-weight: 500;
                    line-height: 1.35;
                    letter-spacing: -0.4px;
                    overflow-wrap: anywhere;
                }

                .es-reg-page .reg-divider {
                    height: 1px;
                    margin-bottom: 21px;
                    background: var(--border);
                }

                .es-reg-page .reg-detail-row {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    margin-bottom: 17px;
                    min-width: 0;
                }

                .es-reg-page .reg-detail-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 36px;
                    height: 36px;
                    flex-shrink: 0;
                    border-radius: 11px;
                    background: var(--surface-soft);
                    border: 1px solid var(--border);
                    font-size: 15px;
                }

                .es-reg-page .reg-detail-content {
                    min-width: 0;
                    padding-top: 2px;
                }

                .es-reg-page .reg-detail-label {
                    display: block;
                    margin-bottom: 5px;
                    color: var(--muted);
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 1px;
                }

                .es-reg-page .reg-detail-value {
                    margin: 0;
                    color: var(--text);
                    font-size: 12px;
                    font-weight: 600;
                    line-height: 1.7;
                    overflow-wrap: anywhere;
                }

                .es-reg-page .reg-session-box {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    margin-top: 5px;
                    padding: 15px;
                    border-radius: 13px;
                    background: var(--accent-soft);
                    border: 1px solid rgba(22,143,255,0.2);
                }

                .es-reg-page .reg-session-icon {
                    font-size: 20px;
                }

                .es-reg-page .reg-session-title {
                    margin: 5px 0 0;
                    color: var(--text);
                    font-size: 13px;
                    font-weight: 700;
                    line-height: 1.6;
                    overflow-wrap: anywhere;
                }

                .es-reg-page .reg-state-panel {
                    max-width: 650px;
                    margin: 30px auto;
                    padding: 55px 25px;
                    text-align: center;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: 24px;
                    box-shadow: var(--shadow);
                    animation: regUp 0.5s ease both;
                }

                .es-reg-page .reg-state-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 70px;
                    height: 70px;
                    margin: 0 auto 22px;
                    background: var(--accent-soft);
                    border: 1px solid rgba(73,178,255,0.2);
                    border-radius: 22px;
                    font-size: 31px;
                }

                .es-reg-page .reg-state-panel h2 {
                    margin: 0 0 12px;
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 28px;
                    font-weight: 500;
                }

                .es-reg-page .reg-state-panel p {
                    max-width: 440px;
                    margin: 0 auto;
                    color: var(--muted);
                    font-size: 13px;
                    line-height: 1.9;
                }

                .es-reg-page .reg-loading-ring {
                    width: 38px;
                    height: 38px;
                    margin: 0 auto 22px;
                    border: 3px solid var(--border);
                    border-top-color: var(--accent);
                    border-radius: 50%;
                    animation: regSpin 0.8s linear infinite;
                }

                .es-reg-page .reg-error {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    margin: 0 0 25px;
                    padding: 17px 19px;
                    color: #ff9a9a;
                    background: rgba(239,68,68,0.09);
                    border: 1px solid rgba(239,68,68,0.22);
                    border-radius: 13px;
                    font-size: 13px;
                    line-height: 1.7;
                }

                .es-reg-page.light .reg-error {
                    color: #b91c1c;
                    background: #fff1f1;
                    border-color: #fecaca;
                }

                .es-reg-page .reg-primary-link {
                    display: inline-flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                    margin-top: 24px;
                    padding: 14px 18px;
                    color: white;
                    background: linear-gradient(110deg,#087bea,#1763d5);
                    border: 1px solid rgba(73,178,255,0.35);
                    border-radius: 12px;
                    text-decoration: none;
                    font-size: 12px;
                    font-weight: 800;
                    box-shadow: 0 9px 25px rgba(22,110,230,0.17);
                    transition: 0.25s ease;
                }

                .es-reg-page .reg-primary-link:hover {
                    transform: translateY(-3px);
                    background: linear-gradient(110deg,#209aff,#2679ed);
                    box-shadow: 0 12px 30px rgba(22,143,255,0.3);
                }

                .es-reg-page .reg-primary-link span {
                    font-size: 18px;
                    transition: transform 0.25s ease;
                }

                .es-reg-page .reg-primary-link:hover span {
                    transform: translateX(4px);
                }

                .es-reg-page .reg-footer {
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

                @keyframes regUp {
                    from {
                        opacity: 0;
                        transform: translateY(18px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes regDown {
                    from {
                        opacity: 0;
                        transform: translateY(-12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes regSpin {
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 950px) {
                    .es-reg-page .reg-grid {
                        grid-template-columns: repeat(2,minmax(0,1fr));
                    }

                    .es-reg-page .reg-stats {
                        gap: 12px;
                    }

                    .es-reg-page .reg-stat-card {
                        padding: 16px;
                    }

                    .es-reg-page .reg-topbar {
                        margin-bottom: 50px;
                    }
                }

                @media (max-width: 650px) {
                    .es-reg-page {
                        padding: 22px 16px 45px;
                    }

                    .es-reg-page .reg-topbar {
                        margin-bottom: 45px;
                    }

                    .es-reg-page .reg-brand-caption {
                        letter-spacing: 1px;
                        font-size: 9px;
                    }

                    .es-reg-page .reg-back-link {
                        padding: 10px 12px;
                        font-size: 11px;
                    }

                    .es-reg-page .reg-hero {
                        display: block;
                        margin-bottom: 28px;
                    }

                    .es-reg-page .reg-hero h1 {
                        font-size: 43px;
                    }

                    .es-reg-page .reg-hero-stat {
                        display: inline-block;
                        min-width: 130px;
                        margin-top: 22px;
                        padding: 14px 18px;
                    }

                    .es-reg-page .reg-stat-number {
                        font-size: 27px;
                    }

                    .es-reg-page .reg-stats {
                        grid-template-columns: 1fr;
                        gap: 12px;
                        margin-bottom: 32px;
                    }

                    .es-reg-page .reg-stat-card {
                        padding: 16px;
                    }

                    .es-reg-page .reg-grid {
                        grid-template-columns: minmax(0,1fr);
                        gap: 17px;
                    }

                    .es-reg-page .reg-card {
                        padding: 22px;
                    }

                    .es-reg-page .reg-footer {
                        flex-direction: column;
                        gap: 9px;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .es-reg-page *,
                    .es-reg-page *::before,
                    .es-reg-page *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `}</style>

            <div className="reg-glow reg-glow-one" />
            <div className="reg-glow reg-glow-two" />

            <main className="reg-container">
                {/* Header */}
                <header className="reg-topbar">
                    <Link to="/dashboard" className="reg-brand">
                        <div className="reg-brand-mark">✦</div>

                        <div>
                            <div className="reg-brand-name">
                                Event<span>Sphere</span>
                            </div>

                            <div className="reg-brand-caption">
                                Discover. Connect. Experience.
                            </div>
                        </div>
                    </Link>

                    <Link to="/dashboard" className="reg-back-link">
                        <span>←</span>
                        Back to Dashboard
                    </Link>
                </header>

                {/* Hero */}
                <section className="reg-hero">
                    <div>
                        <div className="reg-eyebrow">
                            <span className="reg-dot" />
                            Your Event Journey
                        </div>

                        <h1>
                            My <span>Registrations.</span>
                        </h1>

                        <p className="reg-description">
                            Every booking, every experience, all in one place.
                            Keep track of your registered expos and sessions
                            and get ready for your next event.
                        </p>
                    </div>

                    {!loading && !error && (
                        <div className="reg-hero-stat">
                            <span className="reg-stat-number">
                                {String(registrations.length).padStart(2, "0")}
                            </span>

                            <span className="reg-stat-label">
                                Total Bookings
                            </span>
                        </div>
                    )}
                </section>

                <div className="reg-section-line" />

                {/* Summary stats */}
                {!loading && !error && (
                    <section className="reg-stats">
                        <div className="reg-stat-card">
                            <div className="reg-stat-icon">🎟️</div>

                            <div>
                                <span className="reg-stat-label">
                                    Total Bookings
                                </span>

                                <div className="reg-stat-value">
                                    {registrations.length}
                                </div>
                            </div>
                        </div>

                        <div className="reg-stat-card">
                            <div className="reg-stat-icon green">✓</div>

                            <div>
                                <span className="reg-stat-label">
                                    Registered
                                </span>

                                <div className="reg-stat-value">
                                    {registeredCount}
                                </div>
                            </div>
                        </div>

                        <div className="reg-stat-card">
                            <div className="reg-stat-icon red">↗</div>

                            <div>
                                <span className="reg-stat-label">
                                    Cancelled / Other
                                </span>

                                <div className="reg-stat-value">
                                    {cancelledCount}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Loading */}
                {loading && (
                    <div className="reg-state-panel">
                        <div className="reg-loading-ring" />

                        <h2>Finding your bookings</h2>

                        <p>
                            Please wait while we load your registration details.
                        </p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="reg-error">
                        <span style={{ fontSize: "20px" }}>⚠</span>
                        <span>{error}</span>
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && registrations.length === 0 && (
                    <div className="reg-state-panel">
                        <div className="reg-state-icon">🎪</div>

                        <h2>Your next experience awaits.</h2>

                        <p>
                            You haven't registered for any expos or sessions yet.
                            Explore available exhibitions and discover an event
                            worth being part of.
                        </p>

                        <Link to="/expos" className="reg-primary-link">
                            <span>Explore Expos</span>
                            <span>→</span>
                        </Link>
                    </div>
                )}

                {/* Registration cards */}
                {!loading && !error && registrations.length > 0 && (
                    <section>
                        <div className="reg-section-heading">
                            <h2>Your Bookings</h2>

                            <span className="reg-section-caption">
                                {registrations.length}{" "}
                                {registrations.length === 1
                                    ? "booking"
                                    : "bookings"}{" "}
                                found
                            </span>
                        </div>

                        <div className="reg-grid">
                            {registrations.map((registration, index) => {
                                const isRegistered =
                                    registration.status === "registered";

                                const expo =
                                    registration.expo &&
                                    typeof registration.expo === "object"
                                        ? registration.expo
                                        : null;

                                const session =
                                    registration.session &&
                                    typeof registration.session === "object"
                                        ? registration.session
                                        : null;

                                return (
                                    <article
                                        key={registration._id || index}
                                        className="reg-card"
                                        style={{
                                            animationDelay: `${Math.min(
                                                index * 0.09,
                                                0.45
                                            )}s`
                                        }}
                                    >
                                        <div className="reg-card-top">
                                            <div className="reg-expo-icon">
                                                {registration.registrationType ===
                                                "session"
                                                    ? "🎤"
                                                    : "🎪"}
                                            </div>

                                            <span
                                                className={`reg-status ${
                                                    isRegistered
                                                        ? "registered"
                                                        : "cancelled"
                                                }`}
                                            >
                                                <span>●</span>
                                                {isRegistered
                                                    ? "Registered"
                                                    : "Cancelled / Other"}
                                            </span>
                                        </div>

                                        <span className="reg-card-label">
                                            {registration.registrationType ===
                                            "session"
                                                ? "Session Booking"
                                                : "Expo Registration"}
                                        </span>

                                        <h2 className="reg-card-title">
                                            {expo?.title ||
                                                (session
                                                    ? session.title
                                                    : null) ||
                                                "Event Registration"}
                                        </h2>

                                        <div className="reg-divider" />

                                        <div className="reg-detail-row">
                                            <div className="reg-detail-icon">
                                                📅
                                            </div>

                                            <div className="reg-detail-content">
                                                <span className="reg-detail-label">
                                                    EVENT DATE
                                                </span>

                                                <p className="reg-detail-value">
                                                    {formatDate(
                                                        expo?.date ||
                                                        session?.date
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="reg-detail-row">
                                            <div className="reg-detail-icon">
                                                📍
                                            </div>

                                            <div className="reg-detail-content">
                                                <span className="reg-detail-label">
                                                    LOCATION
                                                </span>

                                                <p className="reg-detail-value">
                                                    {expo?.location ||
                                                        session?.location ||
                                                        "Location not announced"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="reg-detail-row">
                                            <div className="reg-detail-icon">
                                                📝
                                            </div>

                                            <div className="reg-detail-content">
                                                <span className="reg-detail-label">
                                                    REGISTRATION TYPE
                                                </span>

                                                <p className="reg-detail-value">
                                                    {registration.registrationType ===
                                                    "session"
                                                        ? "Session Registration"
                                                        : "Expo Registration"}
                                                </p>
                                            </div>
                                        </div>

                                        {session && (
                                            <div className="reg-session-box">
                                                <div className="reg-session-icon">
                                                    🎤
                                                </div>

                                                <div>
                                                    <span className="reg-detail-label">
                                                        SESSION DETAILS
                                                    </span>

                                                    <p className="reg-session-title">
                                                        {session.title ||
                                                            "Session"}
                                                    </p>

                                                    {session.speaker && (
                                                        <p
                                                            className="reg-detail-value"
                                                            style={{
                                                                marginTop: "7px",
                                                                color: "var(--muted)"
                                                            }}
                                                        >
                                                            Speaker:{" "}
                                                            {session.speaker}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="reg-footer">
                    <span>
                        © {new Date().getFullYear()} EventSphere
                    </span>

                    <span>
                        MADE FOR MEANINGFUL EXPERIENCES
                    </span>
                </footer>
            </main>
        </div>
    );
}

export default MyRegistrations;
