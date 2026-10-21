
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [resetToken, setResetToken] = useState("");

    const [darkMode, setDarkMode] = useState(
        () => localStorage.getItem("eventSphereDarkMode") === "true"
    );

    useEffect(() => {
        const syncTheme = (event) => {
            if (!event || event.key === "eventSphereDarkMode") {
                setDarkMode(
                    localStorage.getItem("eventSphereDarkMode") === "true"
                );
            }
        };

        window.addEventListener("storage", syncTheme);

        // Allows synchronization with theme changes in the same tab.
        const handleThemeEvent = () => syncTheme();

        window.addEventListener("eventSphereThemeChange", handleThemeEvent);

        return () => {
            window.removeEventListener("storage", syncTheme);
            window.removeEventListener(
                "eventSphereThemeChange",
                handleThemeEvent
            );
        };
    }, []);

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setResetToken("");

        if (!email.trim()) {
            setError("Please enter your registered email address.");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                "http://localhost:5000/api/users/forgot-password",
                { email: email.trim() }
            );

            setSuccess(
                response.data?.message ||
                "If your account exists, password reset instructions will be provided."
            );

            // Development/testing only. Avoid exposing tokens in production.
            if (import.meta.env.DEV && response.data?.resetToken) {
                setResetToken(response.data.resetToken);
            }

            setEmail("");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to process your request. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const c = darkMode
        ? {
            page: "#07111e",
            card: "#0d1928",
            text: "#f0f6ff",
            muted: "#94a6bc",
            border: "rgba(148,177,210,0.15)",
            input: "#091522",
        }
        : {
            page: "#f3f7fc",
            card: "#ffffff",
            text: "#12243a",
            muted: "#718198",
            border: "#e0e8f2",
            input: "#f8faff",
        };

    return (
        <div
            className={`forgot-page ${darkMode ? "forgot-dark" : "forgot-light"}`}
            style={{
                "--page": c.page,
                "--card": c.card,
                "--text": c.text,
                "--muted": c.muted,
                "--border": c.border,
                "--input": c.input,
            }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

                .forgot-page {
                    min-height: 100vh;
                    padding: 35px 5%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-sizing: border-box;
                    position: relative;
                    isolation: isolate;
                    overflow: hidden;
                    background: var(--page);
                    color: var(--text);
                    font-family: 'Inter', sans-serif;
                    transition: background .3s ease, color .3s ease;
                }

                .forgot-page *,
                .forgot-page *::before,
                .forgot-page *::after {
                    box-sizing: border-box;
                }

                .forgot-page::before,
                .forgot-page::after {
                    content: "";
                    position: absolute;
                    z-index: -1;
                    width: 370px;
                    height: 370px;
                    border-radius: 50%;
                    filter: blur(100px);
                    opacity: .22;
                    pointer-events: none;
                }

                .forgot-page::before {
                    background: #168bff;
                    top: -180px;
                    left: -100px;
                }

                .forgot-page::after {
                    background: #12c9e8;
                    bottom: -180px;
                    right: -120px;
                }

                .forgot-layout {
                    width: 100%;
                    max-width: 1080px;
                    min-height: 590px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    background: var(--card);
                    border: 1px solid var(--border);
                    border-radius: 28px;
                    overflow: hidden;
                    box-shadow: 0 30px 100px rgba(10,40,80,.12);
                    animation: forgotEnter .65s ease both;
                }

                .forgot-showcase {
                    padding: 43px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    position: relative;
                    overflow: hidden;
                    color: white;
                    background:
                        radial-gradient(ellipse at 90% 15%, rgba(71,198,255,.3), transparent 40%),
                        linear-gradient(145deg, #09284b, #0b4a82 55%, #087ba5);
                }

                .forgot-showcase::before {
                    content: "";
                    position: absolute;
                    width: 300px;
                    height: 300px;
                    left: 45%;
                    top: 34%;
                    border: 1px solid rgba(255,255,255,.14);
                    border-radius: 50%;
                    box-shadow:
                        0 0 0 35px rgba(255,255,255,.025),
                        0 0 0 70px rgba(255,255,255,.025);
                    animation: forgotOrbit 24s linear infinite;
                }

                .forgot-brand {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    position: relative;
                    z-index: 1;
                    color: white;
                    text-decoration: none;
                    width: fit-content;
                }

                .forgot-brand-mark {
                    width: 44px;
                    height: 44px;
                    display: grid;
                    place-items: center;
                    border-radius: 13px;
                    background: linear-gradient(135deg, #54d7ff, #2388ff);
                    box-shadow: 0 8px 25px rgba(0,145,255,.3);
                    font-size: 19px;
                    font-weight: 800;
                }

                .forgot-brand-name {
                    font-size: 19px;
                    font-weight: 800;
                    letter-spacing: -.5px;
                }

                .forgot-brand-name span {
                    color: #64d8ff;
                }

                .forgot-showcase-content {
                    margin: 48px 0;
                    position: relative;
                    z-index: 1;
                }

                .forgot-eyebrow {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 12px;
                    border: 1px solid rgba(255,255,255,.19);
                    background: rgba(255,255,255,.07);
                    border-radius: 30px;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 1.1px;
                    text-transform: uppercase;
                }

                .forgot-dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #62e8c1;
                    box-shadow: 0 0 12px #62e8c1;
                }

                .forgot-showcase h2 {
                    max-width: 390px;
                    margin: 24px 0 16px;
                    font-size: clamp(31px, 3.3vw, 43px);
                    line-height: 1.17;
                    letter-spacing: -1.7px;
                    font-weight: 800;
                }

                .forgot-gradient {
                    color: #7be4ff;
                }

                .forgot-showcase-description {
                    max-width: 360px;
                    color: #c0d8ee;
                    font-size: 13px;
                    line-height: 1.9;
                }

                .forgot-benefits {
                    display: grid;
                    gap: 13px;
                    margin-top: 30px;
                }

                .forgot-benefit {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: #e0f1ff;
                    font-size: 12px;
                }

                .forgot-benefit-icon {
                    width: 34px;
                    height: 34px;
                    display: grid;
                    place-items: center;
                    border: 1px solid rgba(255,255,255,.15);
                    border-radius: 10px;
                    background: rgba(255,255,255,.08);
                }

                .forgot-footer {
                    position: relative;
                    z-index: 1;
                    color: #a8c6df;
                    font-size: 10px;
                }

                .forgot-form-panel {
                    min-width: 0;
                    padding: 42px clamp(24px, 4vw, 52px);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .forgot-form-icon {
                    width: 55px;
                    height: 55px;
                    display: grid;
                    place-items: center;
                    border-radius: 16px;
                    margin-bottom: 22px;
                    color: white;
                    background: linear-gradient(135deg, #168bff, #21c4df);
                    box-shadow: 0 10px 24px rgba(22,139,255,.24);
                }

                .forgot-heading h1 {
                    margin: 0 0 11px;
                    font-size: clamp(27px, 3vw, 34px);
                    font-weight: 800;
                    letter-spacing: -1.2px;
                }

                .forgot-heading p {
                    color: var(--muted);
                    margin: 0 0 27px;
                    font-size: 12px;
                    line-height: 1.9;
                }

                .forgot-message {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    padding: 13px 14px;
                    margin-bottom: 19px;
                    border-radius: 12px;
                    font-size: 12px;
                    line-height: 1.6;
                    overflow-wrap: anywhere;
                }

                .forgot-error {
                    color: ${darkMode ? "#ffaaaa" : "#bd3030"};
                    background: ${darkMode ? "rgba(239,68,68,.10)" : "#fff1f1"};
                    border: 1px solid ${darkMode ? "rgba(248,113,113,.23)" : "#ffdada"};
                }

                .forgot-success {
                    color: ${darkMode ? "#86efac" : "#147844"};
                    background: ${darkMode ? "rgba(34,197,94,.10)" : "#edfff5"};
                    border: 1px solid ${darkMode ? "rgba(74,222,128,.22)" : "#c8f4d9"};
                }

                .forgot-label {
                    display: block;
                    margin-bottom: 9px;
                    font-size: 12px;
                    font-weight: 700;
                }

                .forgot-input-wrap {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    padding: 0 14px;
                    margin-bottom: 19px;
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    background: var(--input);
                    transition: border-color .2s, box-shadow .2s;
                }

                .forgot-input-wrap:focus-within {
                    border-color: #269cff;
                    box-shadow: 0 0 0 4px rgba(38,156,255,.10);
                }

                .forgot-input-icon {
                    color: var(--muted);
                    font-size: 17px;
                }

                .forgot-input {
                    width: 100%;
                    min-width: 0;
                    padding: 15px 0;
                    border: 0;
                    outline: none;
                    background: transparent;
                    color: var(--text);
                    font-family: inherit;
                    font-size: 12px;
                }

                .forgot-input::placeholder {
                    color: var(--muted);
                    opacity: .8;
                }

                .forgot-submit {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    padding: 15px;
                    border: none;
                    border-radius: 12px;
                    color: white;
                    background: linear-gradient(100deg, #1678ed, #16a9dc);
                    box-shadow: 0 10px 25px rgba(22,139,255,.2);
                    font-family: inherit;
                    font-size: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: transform .2s, box-shadow .2s, opacity .2s;
                }

                .forgot-submit:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 14px 30px rgba(22,139,255,.3);
                }

                .forgot-submit:disabled {
                    cursor: not-allowed;
                    opacity: .7;
                }

                .forgot-spinner {
                    width: 15px;
                    height: 15px;
                    border: 2px solid rgba(255,255,255,.35);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: forgotSpin .7s linear infinite;
                }

                .forgot-token {
                    margin-top: 19px;
                    padding: 14px;
                    border: 1px solid rgba(245,158,11,.3);
                    border-radius: 12px;
                    background: ${darkMode ? "rgba(245,158,11,.08)" : "#fff9e9"};
                    color: ${darkMode ? "#fcd58a" : "#92400e"};
                    overflow-wrap: anywhere;
                }

                .forgot-token-title {
                    font-size: 11px;
                    font-weight: 800;
                    margin-bottom: 8px;
                }

                .forgot-token-value {
                    font-size: 11px;
                    line-height: 1.7;
                    user-select: all;
                }

                .forgot-token-note {
                    margin: 9px 0 0;
                    font-size: 10px;
                    line-height: 1.6;
                }

                .forgot-links {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 17px;
                    margin-top: 24px;
                }

                .forgot-primary-link {
                    color: #269cff;
                    text-decoration: none;
                    font-size: 12px;
                    font-weight: 700;
                }

                .forgot-back-link {
                    color: var(--muted);
                    text-decoration: none;
                    font-size: 12px;
                    font-weight: 600;
                }

                .forgot-primary-link:hover,
                .forgot-back-link:hover {
                    color: #12b9df;
                }

                .forgot-security {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 8px;
                    margin-top: 27px;
                    padding-top: 19px;
                    border-top: 1px solid var(--border);
                    color: var(--muted);
                    text-align: center;
                    font-size: 10px;
                    line-height: 1.7;
                }

                @keyframes forgotEnter {
                    from { opacity: 0; transform: translateY(18px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes forgotSpin {
                    to { transform: rotate(360deg); }
                }

                @keyframes forgotOrbit {
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 760px) {
                    .forgot-page {
                        padding: 20px 13px;
                    }

                    .forgot-layout {
                        max-width: 480px;
                        grid-template-columns: 1fr;
                        border-radius: 22px;
                    }

                    .forgot-showcase {
                        padding: 25px 26px;
                    }

                    .forgot-showcase-content {
                        margin: 30px 0 8px;
                    }

                    .forgot-showcase h2 {
                        margin-top: 18px;
                        font-size: 30px;
                    }

                    .forgot-showcase-description {
                        font-size: 12px;
                    }

                    .forgot-benefits,
                    .forgot-footer {
                        display: none;
                    }

                    .forgot-form-panel {
                        padding: 32px 26px;
                    }

                    .forgot-form-icon {
                        width: 48px;
                        height: 48px;
                        margin-bottom: 18px;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .forgot-page *,
                    .forgot-page *::before,
                    .forgot-page *::after {
                        animation-duration: .01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: .01ms !important;
                    }
                }
            `}</style>

            <div className="forgot-layout">
                {/* LEFT SHOWCASE */}
                <section className="forgot-showcase">
                    <Link to="/" className="forgot-brand">
                        <div className="forgot-brand-mark">E</div>
                        <div className="forgot-brand-name">
                            Event<span>Sphere</span>
                        </div>
                    </Link>

                    <div className="forgot-showcase-content">
                        <div className="forgot-eyebrow">
                            <span className="forgot-dot" />
                            Account Recovery
                        </div>

                        <h2>
                            Let's get you{" "}
                            <span className="forgot-gradient">
                                back in.
                            </span>
                        </h2>

                        <p className="forgot-showcase-description">
                            Forgot your password? No worries. Start the
                            recovery process and get back to planning,
                            organizing, and managing your events.
                        </p>

                        <div className="forgot-benefits">
                            <div className="forgot-benefit">
                                <span className="forgot-benefit-icon">✉</span>
                                Secure account recovery
                            </div>
                            <div className="forgot-benefit">
                                <span className="forgot-benefit-icon">🛡</span>
                                Your account, your control
                            </div>
                            <div className="forgot-benefit">
                                <span className="forgot-benefit-icon">✓</span>
                                Get back to your events
                            </div>
                        </div>
                    </div>

                    <div className="forgot-footer">
                        © {new Date().getFullYear()} EventSphere · Your events, connected.
                    </div>
                </section>

                {/* RIGHT FORM */}
                <section className="forgot-form-panel">
                    <div className="forgot-form-icon">
                        <svg
                            width="27"
                            height="27"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <rect x="3" y="5" width="18" height="14" rx="2" />
                            <path d="m3 7 9 6 9-6" />
                        </svg>
                    </div>

                    <div className="forgot-heading">
                        <h1>Forgot Password?</h1>
                        <p>
                            Enter your registered email address and we'll
                            help you recover access to your account.
                        </p>
                    </div>

                    {error && (
                        <div className="forgot-message forgot-error" role="alert">
                            <span>⚠</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="forgot-message forgot-success" role="status">
                            <span>✓</span>
                            <span>{success}</span>
                        </div>
                    )}

                    <form onSubmit={handleForgotPassword}>
                        <label className="forgot-label" htmlFor="forgot-email">
                            Email Address
                        </label>

                        <div className="forgot-input-wrap">
                            <span className="forgot-input-icon">✉</span>
                            <input
                                id="forgot-email"
                                className="forgot-input"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <button
                            className="forgot-submit"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="forgot-spinner" />
                                    Processing Request...
                                </>
                            ) : (
                                <>
                                    Send Reset Request
                                    <span aria-hidden="true">→</span>
                                </>
                            )}
                        </button>
                    </form>

                    {resetToken && (
                        <div className="forgot-token">
                            <div className="forgot-token-title">
                                Development Reset Token
                            </div>
                            <div className="forgot-token-value">
                                {resetToken}
                            </div>
                            <p className="forgot-token-note">
                                Development only. Use this token on the
                                reset password page. Never expose reset
                                tokens to users in production.
                            </p>
                        </div>
                    )}

                    <div className="forgot-links">
                        <Link
                            to="/reset-password"
                            className="forgot-primary-link"
                        >
                            Go to Reset Password →
                        </Link>

                        <Link to="/login" className="forgot-back-link">
                            ← Back to Login
                        </Link>
                    </div>

                    <div className="forgot-security">
                        <span>🔒</span>
                        <span>
                            Your account security is important to us.
                        </span>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ForgotPassword;
