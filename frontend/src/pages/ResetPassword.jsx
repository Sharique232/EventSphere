
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
    const navigate = useNavigate();

    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [darkMode, setDarkMode] = useState(
        () => localStorage.getItem("eventSphereDarkMode") === "true"
    );

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === "eventSphereDarkMode") {
                setDarkMode(event.newValue === "true");
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!token.trim() || !newPassword) {
            setError("Reset token and new password are required.");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                "http://localhost:5000/api/users/reset-password",
                {
                    token: token.trim(),
                    newPassword,
                }
            );

            setSuccess(
                response.data?.message ||
                "Password reset successfully!"
            );

            setToken("");
            setNewPassword("");

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to reset password. Please check your token."
            );
        } finally {
            setLoading(false);
        }
    };

    const colors = darkMode
        ? {
            page: "#07111e",
            card: "#0d1928",
            text: "#f0f6ff",
            muted: "#94a6bc",
            border: "rgba(148, 177, 210, 0.15)",
            input: "#091522",
            soft: "rgba(45, 145, 255, 0.10)",
        }
        : {
            page: "#f3f7fc",
            card: "#ffffff",
            text: "#12243a",
            muted: "#718198",
            border: "#e0e8f2",
            input: "#f8faff",
            soft: "#edf5ff",
        };

    return (
        <div
            className={`reset-page ${darkMode ? "reset-dark" : "reset-light"}`}
            style={{
                "--page": colors.page,
                "--card": colors.card,
                "--text": colors.text,
                "--muted": colors.muted,
                "--border": colors.border,
                "--input": colors.input,
                "--soft": colors.soft,
            }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

                .reset-page {
                    min-height: 100vh;
                    box-sizing: border-box;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 35px 5%;
                    background: var(--page);
                    color: var(--text);
                    font-family: 'Inter', sans-serif;
                    position: relative;
                    overflow: hidden;
                    isolation: isolate;
                    transition: background .3s ease, color .3s ease;
                }

                .reset-page *,
                .reset-page *::before,
                .reset-page *::after {
                    box-sizing: border-box;
                }

                .reset-page::before,
                .reset-page::after {
                    content: "";
                    position: absolute;
                    width: 340px;
                    height: 340px;
                    border-radius: 50%;
                    filter: blur(100px);
                    opacity: .24;
                    pointer-events: none;
                    z-index: -1;
                }

                .reset-page::before {
                    background: #168bff;
                    top: -170px;
                    left: -100px;
                }

                .reset-page::after {
                    background: #12c9e8;
                    right: -130px;
                    bottom: -180px;
                }

                .reset-layout {
                    width: 100%;
                    max-width: 1080px;
                    min-height: 620px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    border: 1px solid var(--border);
                    border-radius: 28px;
                    overflow: hidden;
                    background: var(--card);
                    box-shadow: 0 30px 100px rgba(10, 40, 80, .12);
                    animation: resetAppear .7s ease both;
                    position: relative;
                    z-index: 1;
                }

                .reset-showcase {
                    padding: 48px 42px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    position: relative;
                    overflow: hidden;
                    color: white;
                    background:
                        radial-gradient(ellipse at 85% 15%, rgba(71, 198, 255, .30), transparent 38%),
                        linear-gradient(145deg, #09284b 0%, #0b4a82 54%, #087ba5 100%);
                }

                .reset-showcase::before {
                    content: "";
                    position: absolute;
                    width: 300px;
                    height: 300px;
                    border: 1px solid rgba(255,255,255,.14);
                    border-radius: 50%;
                    top: 36%;
                    left: 45%;
                    box-shadow:
                        0 0 0 35px rgba(255,255,255,.025),
                        0 0 0 70px rgba(255,255,255,.025);
                    animation: orbit 22s linear infinite;
                }

                .reset-brand {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    position: relative;
                    z-index: 1;
                }

                .reset-logo {
                    width: 44px;
                    height: 44px;
                    border-radius: 13px;
                    display: grid;
                    place-items: center;
                    background: linear-gradient(135deg, #54d7ff, #2388ff);
                    box-shadow: 0 8px 25px rgba(0, 145, 255, .3);
                    font-size: 24px;
                    font-weight: 800;
                }

                .reset-brand-name {
                    font-size: 19px;
                    font-weight: 800;
                    letter-spacing: -.5px;
                }

                .reset-brand-name span {
                    color: #64d8ff;
                }

                .reset-showcase-content {
                    position: relative;
                    z-index: 1;
                    margin: 55px 0;
                }

                .reset-eyebrow {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 12px;
                    border: 1px solid rgba(255,255,255,.19);
                    background: rgba(255,255,255,.07);
                    border-radius: 30px;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 1.2px;
                    text-transform: uppercase;
                }

                .reset-eyebrow-dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #62e8c1;
                    box-shadow: 0 0 12px #62e8c1;
                }

                .reset-showcase h2 {
                    max-width: 390px;
                    margin: 24px 0 16px;
                    font-size: clamp(32px, 3.4vw, 44px);
                    line-height: 1.16;
                    letter-spacing: -1.7px;
                    font-weight: 800;
                }

                .reset-gradient-text {
                    background: linear-gradient(90deg, #6ae0ff, #b8f2ff);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }

                .reset-showcase-description {
                    max-width: 365px;
                    font-size: 14px;
                    line-height: 1.9;
                    color: #c0d8ee;
                }

                .reset-security-card {
                    margin-top: 28px;
                    max-width: 360px;
                    padding: 17px;
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    border-radius: 15px;
                    border: 1px solid rgba(255,255,255,.15);
                    background: rgba(255,255,255,.07);
                    backdrop-filter: blur(12px);
                }

                .reset-security-icon {
                    width: 42px;
                    height: 42px;
                    flex-shrink: 0;
                    display: grid;
                    place-items: center;
                    border-radius: 12px;
                    background: rgba(72, 199, 255, .15);
                    font-size: 21px;
                }

                .reset-security-title {
                    font-size: 13px;
                    font-weight: 700;
                    margin-bottom: 5px;
                }

                .reset-security-subtitle {
                    color: #b5cfe4;
                    font-size: 11px;
                    line-height: 1.6;
                }

                .reset-showcase-footer {
                    color: #a8c6df;
                    font-size: 11px;
                    position: relative;
                    z-index: 1;
                }

                .reset-form-panel {
                    padding: 48px clamp(25px, 4.2vw, 54px);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    min-width: 0;
                }

                .reset-form-heading {
                    margin-bottom: 28px;
                }

                .reset-form-icon {
                    width: 54px;
                    height: 54px;
                    display: grid;
                    place-items: center;
                    border-radius: 16px;
                    margin-bottom: 23px;
                    background: linear-gradient(135deg, #168bff, #21c4df);
                    box-shadow: 0 10px 24px rgba(22, 139, 255, .24);
                    color: white;
                }

                .reset-form-heading h1 {
                    margin: 0 0 11px;
                    font-size: clamp(27px, 3vw, 34px);
                    letter-spacing: -1.2px;
                    font-weight: 800;
                }

                .reset-form-heading p {
                    color: var(--muted);
                    margin: 0;
                    font-size: 13px;
                    line-height: 1.8;
                }

                .reset-message {
                    display: flex;
                    gap: 10px;
                    align-items: flex-start;
                    padding: 13px 14px;
                    border-radius: 12px;
                    font-size: 12px;
                    line-height: 1.6;
                    margin-bottom: 20px;
                    overflow-wrap: anywhere;
                }

                .reset-error {
                    background: ${darkMode ? "rgba(239,68,68,.10)" : "#fff1f1"};
                    color: ${darkMode ? "#ffaaaa" : "#bd3030"};
                    border: 1px solid ${darkMode ? "rgba(248,113,113,.23)" : "#ffdada"};
                }

                .reset-success {
                    background: ${darkMode ? "rgba(34,197,94,.10)" : "#edfff5"};
                    color: ${darkMode ? "#86efac" : "#147844"};
                    border: 1px solid ${darkMode ? "rgba(74,222,128,.22)" : "#c8f4d9"};
                }

                .reset-field {
                    margin-bottom: 20px;
                }

                .reset-label {
                    display: block;
                    color: var(--text);
                    font-size: 12px;
                    font-weight: 700;
                    margin-bottom: 9px;
                }

                .reset-input-wrap {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    background: var(--input);
                    padding: 0 13px;
                    transition: border-color .2s, box-shadow .2s, background .2s;
                }

                .reset-input-wrap:focus-within {
                    border-color: #269cff;
                    box-shadow: 0 0 0 4px rgba(38,156,255,.10);
                }

                .reset-input-icon {
                    color: var(--muted);
                    font-size: 17px;
                    flex-shrink: 0;
                }

                .reset-input {
                    width: 100%;
                    min-width: 0;
                    padding: 14px 0;
                    outline: none;
                    border: 0;
                    background: transparent;
                    color: var(--text);
                    font-family: inherit;
                    font-size: 12px;
                }

                .reset-input::placeholder {
                    color: var(--muted);
                    opacity: .8;
                }

                .reset-eye {
                    padding: 5px;
                    border: 0;
                    background: transparent;
                    color: var(--muted);
                    cursor: pointer;
                    font-size: 11px;
                    font-weight: 700;
                }

                .reset-eye:hover {
                    color: #269cff;
                }

                .reset-hint {
                    color: var(--muted);
                    font-size: 10px;
                    margin-top: 8px;
                }

                .reset-submit {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    padding: 15px;
                    border: 0;
                    border-radius: 12px;
                    margin-top: 4px;
                    color: white;
                    background: linear-gradient(100deg, #1678ed, #16a9dc);
                    box-shadow: 0 10px 25px rgba(22,139,255,.20);
                    font-family: inherit;
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: transform .2s, box-shadow .2s, opacity .2s;
                }

                .reset-submit:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 14px 30px rgba(22,139,255,.30);
                }

                .reset-submit:disabled {
                    cursor: not-allowed;
                    opacity: .7;
                }

                .reset-spinner {
                    width: 15px;
                    height: 15px;
                    border: 2px solid rgba(255,255,255,.35);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: resetSpin .7s linear infinite;
                }

                .reset-back {
                    display: flex;
                    justify-content: center;
                    margin-top: 23px;
                }

                .reset-back a {
                    color: #269cff;
                    text-decoration: none;
                    font-size: 12px;
                    font-weight: 700;
                    transition: color .2s;
                }

                .reset-back a:hover {
                    color: #12b9df;
                }

                .reset-bottom-note {
                    margin-top: 28px;
                    padding-top: 19px;
                    border-top: 1px solid var(--border);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    color: var(--muted);
                    font-size: 10px;
                    text-align: center;
                    line-height: 1.7;
                }

                @keyframes resetAppear {
                    from { opacity: 0; transform: translateY(18px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes resetSpin {
                    to { transform: rotate(360deg); }
                }

                @keyframes orbit {
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 760px) {
                    .reset-page {
                        padding: 22px 14px;
                    }

                    .reset-layout {
                        max-width: 480px;
                        grid-template-columns: 1fr;
                        border-radius: 22px;
                    }

                    .reset-showcase {
                        min-height: 285px;
                        padding: 25px 26px;
                    }

                    .reset-showcase-content {
                        margin: 32px 0 8px;
                    }

                    .reset-showcase h2 {
                        font-size: 30px;
                        margin-top: 18px;
                    }

                    .reset-showcase-description {
                        font-size: 12px;
                    }

                    .reset-security-card,
                    .reset-showcase-footer {
                        display: none;
                    }

                    .reset-form-panel {
                        padding: 32px 26px;
                    }

                    .reset-form-heading {
                        margin-bottom: 24px;
                    }

                    .reset-form-icon {
                        width: 48px;
                        height: 48px;
                        margin-bottom: 18px;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .reset-page *,
                    .reset-page *::before,
                    .reset-page *::after {
                        animation-duration: .01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: .01ms !important;
                    }
                }
            `}</style>

            <div className="reset-layout">
                {/* LEFT SHOWCASE */}
                <section className="reset-showcase">
                    <div className="reset-brand">
                        <div className="reset-logo">E</div>
                        <div className="reset-brand-name">
                            Event<span>Sphere</span>
                        </div>
                    </div>

                    <div className="reset-showcase-content">
                        <div className="reset-eyebrow">
                            <span className="reset-eyebrow-dot" />
                            Account Security
                        </div>

                        <h2>
                            A fresh start begins with a{" "}
                            <span className="reset-gradient-text">
                                secure password.
                            </span>
                        </h2>

                        <p className="reset-showcase-description">
                            Protect your EventSphere account with a new
                            password and get back to managing your events
                            with confidence.
                        </p>

                        <div className="reset-security-card">
                            <div className="reset-security-icon">🛡️</div>
                            <div>
                                <div className="reset-security-title">
                                    Your security matters
                                </div>
                                <div className="reset-security-subtitle">
                                    Use a password you don't use on other
                                    websites.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="reset-showcase-footer">
                        © {new Date().getFullYear()} EventSphere · Your events, connected.
                    </div>
                </section>

                {/* RIGHT RESET FORM */}
                <section className="reset-form-panel">
                    <div className="reset-form-heading">
                        <div className="reset-form-icon">
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
                                <rect x="4" y="10" width="16" height="11" rx="2" />
                                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                <path d="M12 14v3" />
                            </svg>
                        </div>

                        <h1>Reset Password</h1>
                        <p>
                            Enter the reset token you received and create
                            a new password for your account.
                        </p>
                    </div>

                    {error && (
                        <div className="reset-message reset-error" role="alert">
                            <span>⚠</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="reset-message reset-success" role="status">
                            <span>✓</span>
                            <span>
                                {success} Redirecting you to login...
                            </span>
                        </div>
                    )}

                    <form onSubmit={handleResetPassword}>
                        <div className="reset-field">
                            <label className="reset-label" htmlFor="reset-token">
                                Reset Token
                            </label>

                            <div className="reset-input-wrap">
                                <span className="reset-input-icon">⌘</span>
                                <input
                                    id="reset-token"
                                    className="reset-input"
                                    type="text"
                                    placeholder="Paste your reset token"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    autoComplete="off"
                                    required
                                />
                            </div>
                        </div>

                        <div className="reset-field">
                            <label className="reset-label" htmlFor="new-password">
                                New Password
                            </label>

                            <div className="reset-input-wrap">
                                <span className="reset-input-icon">♙</span>
                                <input
                                    id="new-password"
                                    className="reset-input"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    autoComplete="new-password"
                                    minLength={6}
                                    required
                                />

                                <button
                                    className="reset-eye"
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? "HIDE" : "SHOW"}
                                </button>
                            </div>

                            <div className="reset-hint">
                                Use at least 6 characters.
                            </div>
                        </div>

                        <button
                            className="reset-submit"
                            type="submit"
                            disabled={loading || Boolean(success)}
                        >
                            {loading ? (
                                <>
                                    <span className="reset-spinner" />
                                    Resetting Password...
                                </>
                            ) : (
                                <>
                                    Reset Password
                                    <span aria-hidden="true">→</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="reset-back">
                        <Link to="/login">← Back to Login</Link>
                    </div>

                    <div className="reset-bottom-note">
                        <span>🔒</span>
                        <span>
                            Your password is updated after successful
                            token verification.
                        </span>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ResetPassword;
