
import { useEffect, useState } from "react";
import axios from "axios";

function Feedback() {
    const [type, setType] = useState("feedback");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [rating, setRating] = useState(5);

    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(true);

    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("eventSphereDarkMode") === "true"
    );

    const currentUserId = localStorage.getItem("userId");
    const currentExpoId = localStorage.getItem("expoId");

    // Sync theme
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

    // Load user's feedback
    const loadFeedbacks = async () => {
        try {
            if (!currentUserId) {
                setFeedbacks([]);
                return;
            }

            const response = await axios.get(
                `http://localhost:5000/api/feedback/user/${currentUserId}`
            );

            setFeedbacks(response.data.feedbacks || []);
        } catch (error) {
            console.error(
                "Failed to fetch feedback:",
                error.response?.data || error.message
            );
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        loadFeedbacks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUserId]);

    // Submit feedback
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentUserId) {
            alert("User ID not found. Please login again.");
            return;
        }

        if (!currentExpoId) {
            alert("Expo ID not found.");
            return;
        }

        if (!subject.trim() || !message.trim()) {
            alert("Please fill all required fields.");
            return;
        }

        try {
            setLoading(true);

            await axios.post(
                "http://localhost:5000/api/feedback",
                {
                    user: currentUserId,
                    expo: currentExpoId,
                    type,
                    subject: subject.trim(),
                    message: message.trim(),
                    rating: type === "feedback" ? Number(rating) : null,
                }
            );

            alert("Feedback submitted successfully!");

            setSubject("");
            setMessage("");
            setRating(5);
            setType("feedback");

            await loadFeedbacks();
        } catch (error) {
            console.error(
                "Failed to submit feedback:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to submit feedback."
            );
        } finally {
            setLoading(false);
        }
    };

    const resolvedCount = feedbacks.filter(
        (item) => item.status === "resolved"
    ).length;

    const getStatusClass = (status) => {
        if (status === "resolved") return "resolved";
        if (status === "in-progress") return "in-progress";
        return "pending";
    };

    return (
        <div className={`es-feedback-page ${darkMode ? "dark" : "light"}`}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

                .es-feedback-page {
                    --accent: #168fff;
                    --accent-light: #49b2ff;
                    --accent-soft: rgba(22,143,255,0.12);
                    --page: #05080d;
                    --surface: rgba(10,16,24,0.88);
                    --surface-soft: #0d1520;
                    --text: #f5f8fb;
                    --muted: #8b98a8;
                    --border: rgba(139,165,190,0.16);
                    --input: rgba(5,10,17,0.75);
                    --shadow: 0 22px 60px rgba(0,0,0,0.25);

                    position: relative;
                    isolation: isolate;
                    min-height: 100vh;
                    overflow: hidden;
                    padding: 36px 24px 70px;
                    box-sizing: border-box;
                    background: var(--page);
                    color: var(--text);
                    font-family: Inter, Arial, Helvetica, sans-serif;
                    transition: background 0.3s ease, color 0.3s ease;
                }

                .es-feedback-page.light {
                    --page: #f4f8fc;
                    --surface: rgba(255,255,255,0.94);
                    --surface-soft: #f4f8fc;
                    --text: #101a29;
                    --muted: #68788b;
                    --border: rgba(71,100,130,0.16);
                    --input: #ffffff;
                    --shadow: 0 22px 55px rgba(29,59,91,0.08);
                }

                .es-feedback-page *,
                .es-feedback-page *::before,
                .es-feedback-page *::after {
                    box-sizing: border-box;
                }

                .es-feedback-page .fb-glow {
                    position: absolute;
                    z-index: -1;
                    width: 380px;
                    height: 380px;
                    border-radius: 50%;
                    background: #087cff;
                    filter: blur(110px);
                    opacity: 0.13;
                    pointer-events: none;
                }

                .es-feedback-page .fb-glow-one {
                    top: -190px;
                    right: -100px;
                }

                .es-feedback-page .fb-glow-two {
                    top: 650px;
                    left: -270px;
                    background: #6045ff;
                    opacity: 0.09;
                }

                .es-feedback-page .fb-container {
                    width: 100%;
                    max-width: 1000px;
                    margin: 0 auto;
                    position: relative;
                }

                .es-feedback-page .fb-topbar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                    margin-bottom: 65px;
                    animation: fbFadeDown 0.6s ease both;
                }

                .es-feedback-page .fb-brand {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .es-feedback-page .fb-brand-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 43px;
                    height: 43px;
                    border-radius: 14px;
                    border: 1px solid rgba(73,178,255,0.35);
                    background: linear-gradient(145deg,#168fff,#1355c8);
                    box-shadow: 0 8px 25px rgba(22,143,255,0.2);
                    color: white;
                    font-size: 21px;
                }

                .es-feedback-page .fb-brand-name {
                    font-size: 17px;
                    font-weight: 800;
                    letter-spacing: -0.5px;
                }

                .es-feedback-page .fb-brand-name span {
                    color: var(--accent-light);
                }

                .es-feedback-page .fb-brand-caption {
                    margin-top: 4px;
                    color: var(--muted);
                    font-size: 10px;
                    letter-spacing: 1.7px;
                    text-transform: uppercase;
                }

                .es-feedback-page .fb-top-label {
                    padding: 10px 14px;
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    background: var(--surface);
                    color: var(--muted);
                    font-size: 11px;
                    font-weight: 600;
                }

                .es-feedback-page .fb-hero {
                    display: grid;
                    grid-template-columns: minmax(0,1fr) 185px;
                    align-items: end;
                    gap: 28px;
                    margin-bottom: 34px;
                    animation: fbFadeUp 0.7s ease both;
                }

                .es-feedback-page .fb-eyebrow {
                    display: inline-flex;
                    align-items: center;
                    gap: 9px;
                    padding: 8px 12px;
                    border: 1px solid rgba(22,143,255,0.23);
                    border-radius: 999px;
                    background: var(--accent-soft);
                    color: var(--accent-light);
                    font-size: 10px;
                    font-weight: 800;
                    letter-spacing: 1.6px;
                    text-transform: uppercase;
                }

                .es-feedback-page .fb-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: var(--accent-light);
                    box-shadow: 0 0 10px var(--accent-light);
                }

                .es-feedback-page .fb-hero h1 {
                    margin: 20px 0 14px;
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: clamp(38px,5vw,57px);
                    font-weight: 500;
                    line-height: 1.1;
                    letter-spacing: -1.5px;
                }

                .es-feedback-page .fb-hero h1 span {
                    color: var(--accent-light);
                }

                .es-feedback-page .fb-hero p {
                    max-width: 580px;
                    margin: 0;
                    color: var(--muted);
                    font-size: 13px;
                    line-height: 1.9;
                }

                .es-feedback-page .fb-stat {
                    padding: 20px;
                    border: 1px solid var(--border);
                    border-radius: 18px;
                    background: var(--surface);
                    box-shadow: var(--shadow);
                }

                .es-feedback-page .fb-stat-number {
                    display: block;
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: 34px;
                }

                .es-feedback-page .fb-stat-label {
                    display: block;
                    margin-top: 6px;
                    color: var(--muted);
                    font-size: 10px;
                    line-height: 1.6;
                    letter-spacing: 0.8px;
                    text-transform: uppercase;
                }

                .es-feedback-page .fb-divider {
                    height: 1px;
                    margin-bottom: 28px;
                    background: linear-gradient(
                        90deg,var(--accent),var(--border) 40%,transparent
                    );
                    opacity: 0.75;
                }

                .es-feedback-page .fb-layout {
                    display: grid;
                    grid-template-columns: minmax(0,1.12fr) minmax(280px,0.88fr);
                    align-items: start;
                    gap: 22px;
                }

                .es-feedback-page .fb-card {
                    min-width: 0;
                    padding: 27px;
                    border: 1px solid var(--border);
                    border-radius: 22px;
                    background: var(--surface);
                    box-shadow: var(--shadow);
                    backdrop-filter: blur(18px);
                    animation: fbFadeUp 0.7s ease both;
                }

                .es-feedback-page .fb-card.history {
                    animation-delay: 0.12s;
                }

                .es-feedback-page .fb-card-header {
                    display: flex;
                    align-items: center;
                    gap: 13px;
                    margin-bottom: 25px;
                }

                .es-feedback-page .fb-card-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 47px;
                    height: 47px;
                    flex-shrink: 0;
                    border: 1px solid rgba(73,178,255,0.2);
                    border-radius: 14px;
                    background: var(--accent-soft);
                    font-size: 21px;
                }

                .es-feedback-page .fb-card-title {
                    margin: 0;
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: 23px;
                    font-weight: 500;
                }

                .es-feedback-page .fb-card-subtitle {
                    margin: 5px 0 0;
                    color: var(--muted);
                    font-size: 11px;
                    line-height: 1.7;
                }

                .es-feedback-page .fb-label {
                    display: block;
                    margin: 0 0 9px;
                    color: var(--text);
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                }

                .es-feedback-page .fb-required {
                    color: var(--accent-light);
                }

                .es-feedback-page .fb-input {
                    display: block;
                    width: 100%;
                    min-width: 0;
                    margin-bottom: 20px;
                    padding: 13px 14px;
                    outline: none;
                    border: 1px solid var(--border);
                    border-radius: 11px;
                    background: var(--input);
                    color: var(--text);
                    font-family: inherit;
                    font-size: 12px;
                    line-height: 1.6;
                    transition: border-color 0.2s ease, box-shadow 0.2s ease;
                }

                .es-feedback-page .fb-input:focus {
                    border-color: var(--accent);
                    box-shadow: 0 0 0 3px rgba(22,143,255,0.12);
                }

                .es-feedback-page .fb-input::placeholder {
                    color: var(--muted);
                    opacity: 0.8;
                }

                .es-feedback-page select.fb-input {
                    cursor: pointer;
                }

                .es-feedback-page select.fb-input option {
                    background: var(--page);
                    color: var(--text);
                }

                .es-feedback-page textarea.fb-input {
                    min-height: 135px;
                    resize: vertical;
                }

                .es-feedback-page .fb-rating-box {
                    margin-bottom: 21px;
                    padding: 15px;
                    border: 1px solid var(--border);
                    border-radius: 13px;
                    background: var(--surface-soft);
                }

                .es-feedback-page .fb-rating-top {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    margin-bottom: 12px;
                }

                .es-feedback-page .fb-rating-caption {
                    color: var(--muted);
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                }

                .es-feedback-page .fb-rating-value {
                    color: var(--accent-light);
                    font-size: 11px;
                    font-weight: 700;
                }

                .es-feedback-page .fb-stars {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                .es-feedback-page .fb-star {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 38px;
                    height: 38px;
                    padding: 0;
                    border: 1px solid var(--border);
                    border-radius: 10px;
                    background: var(--input);
                    color: #526174;
                    font-size: 20px;
                    cursor: pointer;
                    transition: 0.2s ease;
                }

                .es-feedback-page .fb-star.active {
                    color: #ffc857;
                    border-color: rgba(255,200,87,0.35);
                    background: rgba(255,200,87,0.09);
                }

                .es-feedback-page .fb-star:hover {
                    transform: translateY(-2px);
                }

                .es-feedback-page .fb-submit {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    width: 100%;
                    padding: 15px 18px;
                    border: 1px solid rgba(73,178,255,0.3);
                    border-radius: 12px;
                    background: linear-gradient(110deg,#087bea,#1763d5);
                    color: white;
                    font-family: inherit;
                    font-size: 12px;
                    font-weight: 800;
                    cursor: pointer;
                    box-shadow: 0 10px 25px rgba(22,110,230,0.18);
                    transition: transform 0.25s ease, box-shadow 0.25s ease;
                }

                .es-feedback-page .fb-submit:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 14px 30px rgba(22,143,255,0.28);
                }

                .es-feedback-page .fb-submit:disabled {
                    opacity: 0.65;
                    cursor: not-allowed;
                }

                .es-feedback-page .fb-history-count {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 27px;
                    height: 27px;
                    margin-left: auto;
                    padding: 0 8px;
                    border: 1px solid rgba(73,178,255,0.2);
                    border-radius: 9px;
                    background: var(--accent-soft);
                    color: var(--accent-light);
                    font-size: 11px;
                    font-weight: 800;
                }

                .es-feedback-page .fb-history-list {
                    display: grid;
                    gap: 13px;
                }

                .es-feedback-page .fb-feedback-item {
                    min-width: 0;
                    padding: 17px;
                    border: 1px solid var(--border);
                    border-radius: 15px;
                    background: var(--surface-soft);
                    transition: border-color 0.25s ease, transform 0.25s ease;
                }

                .es-feedback-page .fb-feedback-item:hover {
                    border-color: rgba(73,178,255,0.32);
                    transform: translateY(-2px);
                }

                .es-feedback-page .fb-feedback-top {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 10px;
                    margin-bottom: 13px;
                }

                .es-feedback-page .fb-feedback-title {
                    margin: 0;
                    overflow-wrap: anywhere;
                    font-size: 13px;
                    font-weight: 700;
                    line-height: 1.6;
                }

                .es-feedback-page .fb-status {
                    display: inline-flex;
                    flex-shrink: 0;
                    padding: 6px 8px;
                    border-radius: 7px;
                    font-size: 9px;
                    font-weight: 800;
                    text-transform: capitalize;
                }

                .es-feedback-page .fb-status.resolved {
                    color: #22c55e;
                    background: rgba(34,197,94,0.12);
                }

                .es-feedback-page .fb-status.in-progress {
                    color: #f59e0b;
                    background: rgba(245,158,11,0.12);
                }

                .es-feedback-page .fb-status.pending {
                    color: #49a5ff;
                    background: rgba(59,130,246,0.12);
                }

                .es-feedback-page .fb-meta {
                    margin: 7px 0;
                    color: var(--muted);
                    font-size: 11px;
                    line-height: 1.8;
                    overflow-wrap: anywhere;
                    white-space: pre-wrap;
                }

                .es-feedback-page .fb-meta strong {
                    color: var(--text);
                }

                .es-feedback-page .fb-rating-display {
                    color: #ffc857;
                    letter-spacing: 1px;
                }

                .es-feedback-page .fb-reply {
                    margin-top: 14px;
                    padding: 13px;
                    border: 1px solid var(--border);
                    border-radius: 11px;
                    background: var(--accent-soft);
                }

                .es-feedback-page .fb-reply-title {
                    color: var(--accent-light);
                    font-size: 10px;
                    font-weight: 800;
                    letter-spacing: 0.5px;
                }

                .es-feedback-page .fb-reply p {
                    margin: 8px 0 0;
                    color: var(--muted);
                    font-size: 11px;
                    line-height: 1.8;
                    white-space: pre-wrap;
                    overflow-wrap: anywhere;
                }

                .es-feedback-page .fb-date {
                    display: block;
                    margin-top: 13px;
                    padding-top: 12px;
                    border-top: 1px solid var(--border);
                    color: var(--muted);
                    font-size: 9px;
                    line-height: 1.7;
                }

                .es-feedback-page .fb-empty {
                    padding: 40px 14px;
                    text-align: center;
                    border: 1px dashed var(--border);
                    border-radius: 15px;
                    background: var(--surface-soft);
                }

                .es-feedback-page .fb-empty-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 58px;
                    height: 58px;
                    margin: 0 auto 17px;
                    border: 1px solid rgba(73,178,255,0.2);
                    border-radius: 18px;
                    background: var(--accent-soft);
                    font-size: 25px;
                }

                .es-feedback-page .fb-empty h3 {
                    margin: 0 0 9px;
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: 21px;
                    font-weight: 500;
                }

                .es-feedback-page .fb-empty p {
                    margin: 0;
                    color: var(--muted);
                    font-size: 11px;
                    line-height: 1.8;
                }

                .es-feedback-page .fb-history-loading {
                    padding: 35px 12px;
                    text-align: center;
                    color: var(--muted);
                    font-size: 12px;
                }

                .es-feedback-page .fb-spinner {
                    width: 27px;
                    height: 27px;
                    margin: 0 auto 13px;
                    border: 2px solid var(--border);
                    border-top-color: var(--accent);
                    border-radius: 50%;
                    animation: fbSpin 0.8s linear infinite;
                }

                .es-feedback-page .fb-footer {
                    display: flex;
                    justify-content: space-between;
                    gap: 15px;
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid var(--border);
                    color: var(--muted);
                    font-size: 9px;
                    letter-spacing: 0.7px;
                }

                @keyframes fbFadeUp {
                    from { opacity: 0; transform: translateY(18px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes fbFadeDown {
                    from { opacity: 0; transform: translateY(-12px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes fbSpin {
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 850px) {
                    .es-feedback-page .fb-layout {
                        grid-template-columns: minmax(0,1fr);
                    }

                    .es-feedback-page .fb-history-list {
                        grid-template-columns: repeat(2,minmax(0,1fr));
                    }
                }

                @media (max-width: 600px) {
                    .es-feedback-page {
                        padding: 23px 15px 40px;
                    }

                    .es-feedback-page .fb-topbar {
                        margin-bottom: 43px;
                    }

                    .es-feedback-page .fb-brand-caption {
                        font-size: 8px;
                        letter-spacing: 1px;
                    }

                    .es-feedback-page .fb-top-label {
                        padding: 9px;
                        font-size: 9px;
                    }

                    .es-feedback-page .fb-hero {
                        grid-template-columns: minmax(0,1fr);
                        gap: 20px;
                    }

                    .es-feedback-page .fb-hero h1 {
                        font-size: 42px;
                    }

                    .es-feedback-page .fb-stat {
                        display: inline-block;
                        min-width: 135px;
                        padding: 13px 16px;
                    }

                    .es-feedback-page .fb-stat-number {
                        font-size: 27px;
                    }

                    .es-feedback-page .fb-card {
                        padding: 20px;
                        border-radius: 18px;
                    }

                    .es-feedback-page .fb-card-title {
                        font-size: 21px;
                    }

                    .es-feedback-page .fb-history-list {
                        grid-template-columns: minmax(0,1fr);
                    }

                    .es-feedback-page .fb-feedback-top {
                        flex-wrap: wrap;
                    }

                    .es-feedback-page .fb-footer {
                        flex-direction: column;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .es-feedback-page *,
                    .es-feedback-page *::before,
                    .es-feedback-page *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `}</style>

            <div className="fb-glow fb-glow-one" />
            <div className="fb-glow fb-glow-two" />

            <div className="fb-container">
                {/* Header */}
                <header className="fb-topbar">
                    <div className="fb-brand">
                        <div className="fb-brand-icon">✦</div>
                        <div>
                            <div className="fb-brand-name">
                                Event<span>Sphere</span>
                            </div>
                            <div className="fb-brand-caption">
                                Your Voice Matters
                            </div>
                        </div>
                    </div>

                    <div className="fb-top-label">
                        ◈ Feedback Center
                    </div>
                </header>

                {/* Hero */}
                <section className="fb-hero">
                    <div>
                        <div className="fb-eyebrow">
                            <span className="fb-dot" />
                            Feedback & Support
                        </div>

                        <h1>
                            Let's make
                            <br />
                            it <span>better.</span>
                        </h1>

                        <p>
                            Every experience has a story. Share your thoughts,
                            tell us what could improve, or ask our team for
                            assistance. Your feedback helps us create better
                            events for everyone.
                        </p>
                    </div>

                    <div className="fb-stat">
                        <span className="fb-stat-number">
                            {String(feedbacks.length).padStart(2, "0")}
                        </span>
                        <span className="fb-stat-label">
                            Messages submitted
                        </span>
                        <span className="fb-stat-label">
                            {resolvedCount} resolved
                        </span>
                    </div>
                </section>

                <div className="fb-divider" />

                <div className="fb-layout">
                    {/* Feedback form */}
                    <section className="fb-card">
                        <div className="fb-card-header">
                            <div className="fb-card-icon">✉</div>
                            <div>
                                <h2 className="fb-card-title">
                                    Send a Message
                                </h2>
                                <p className="fb-card-subtitle">
                                    Tell us how we can help.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <label className="fb-label" htmlFor="fb-type">
                                Message Type <span className="fb-required">*</span>
                            </label>

                            <select
                                id="fb-type"
                                className="fb-input"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="feedback">Feedback</option>
                                <option value="support">Support Request</option>
                            </select>

                            <label className="fb-label" htmlFor="fb-subject">
                                Subject <span className="fb-required">*</span>
                            </label>

                            <input
                                id="fb-subject"
                                className="fb-input"
                                type="text"
                                placeholder="What would you like to discuss?"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                maxLength={150}
                                required
                            />

                            <label className="fb-label" htmlFor="fb-message">
                                Your Message <span className="fb-required">*</span>
                            </label>

                            <textarea
                                id="fb-message"
                                className="fb-input"
                                placeholder="Share your experience or describe the issue..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={5}
                                maxLength={3000}
                                required
                            />

                            <div
                                style={{
                                    marginTop: "-12px",
                                    marginBottom: "20px",
                                    textAlign: "right",
                                    color: "var(--muted)",
                                    fontSize: "10px",
                                }}
                            >
                                {message.length}/3000 characters
                            </div>

                            {type === "feedback" && (
                                <div className="fb-rating-box">
                                    <div className="fb-rating-top">
                                        <span className="fb-rating-caption">
                                            Rate your experience
                                        </span>
                                        <span className="fb-rating-value">
                                            {rating} out of 5
                                        </span>
                                    </div>

                                    <div
                                        className="fb-stars"
                                        role="group"
                                        aria-label="Rate your experience from 1 to 5 stars"
                                    >
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                className={`fb-star ${star <= Number(rating) ? "active" : ""}`}
                                                onClick={() => setRating(star)}
                                                aria-label={`${star} star${star === 1 ? "" : "s"}`}
                                                aria-pressed={Number(rating) === star}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                className="fb-submit"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Submitting..." : "Submit Message"}
                                {!loading && <span>→</span>}
                            </button>
                        </form>
                    </section>

                    {/* Feedback history */}
                    <section className="fb-card history">
                        <div className="fb-card-header">
                            <div className="fb-card-icon">▤</div>
                            <div>
                                <h2 className="fb-card-title">
                                    My Messages
                                </h2>
                                <p className="fb-card-subtitle">
                                    Your feedback and support history.
                                </p>
                            </div>

                            <span className="fb-history-count">
                                {feedbacks.length}
                            </span>
                        </div>

                        {historyLoading ? (
                            <div className="fb-history-loading">
                                <div className="fb-spinner" />
                                Loading your messages...
                            </div>
                        ) : feedbacks.length === 0 ? (
                            <div className="fb-empty">
                                <div className="fb-empty-icon">💬</div>
                                <h3>Your story starts here.</h3>
                                <p>
                                    You haven't submitted any messages yet.
                                    Once you send feedback, it will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="fb-history-list">
                                {feedbacks.map((item) => (
                                    <article
                                        key={item._id}
                                        className="fb-feedback-item"
                                    >
                                        <div className="fb-feedback-top">
                                            <h3 className="fb-feedback-title">
                                                {item.subject}
                                            </h3>

                                            <span
                                                className={`fb-status ${getStatusClass(item.status)}`}
                                            >
                                                {(item.status || "pending")
                                                    .replace("-", " ")}
                                            </span>
                                        </div>

                                        <p className="fb-meta">
                                            <strong>Type: </strong>
                                            {item.type}
                                        </p>

                                        <p className="fb-meta">
                                            <strong>Message: </strong>
                                            {item.message}
                                        </p>

                                        {item.rating && (
                                            <p className="fb-meta">
                                                <strong>Rating: </strong>
                                                <span className="fb-rating-display">
                                                    {"★".repeat(
                                                        Math.min(
                                                            5,
                                                            Math.max(
                                                                0,
                                                                Number(item.rating) || 0
                                                            )
                                                        )
                                                    )}
                                                </span>
                                            </p>
                                        )}

                                        {item.adminReply && (
                                            <div className="fb-reply">
                                                <div className="fb-reply-title">
                                                    ✦ ADMIN RESPONSE
                                                </div>
                                                <p>{item.adminReply}</p>
                                            </div>
                                        )}

                                        <small className="fb-date">
                                            Submitted:{" "}
                                            {item.createdAt &&
                                            !Number.isNaN(
                                                new Date(item.createdAt).getTime()
                                            )
                                                ? new Date(
                                                      item.createdAt
                                                  ).toLocaleString()
                                                : "Date unavailable"}
                                        </small>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                <footer className="fb-footer">
                    <span>© {new Date().getFullYear()} EventSphere</span>
                    <span>YOUR EXPERIENCE. YOUR VOICE. OUR IMPROVEMENT.</span>
                </footer>
            </div>
        </div>
    );
}

export default Feedback;
