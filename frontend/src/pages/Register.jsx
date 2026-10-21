
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("attendee");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!name.trim() || !email.trim() || !password) {
            setError("Please fill in all fields.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        try {
            setLoading(true);

            await axios.post(
                "api/users/register",
                {
                    name: name.trim(),
                    email: email.trim(),
                    password,
                    role,
                }
            );

            setSuccess("Account created! Redirecting to login...");

            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <style>{`
                * { box-sizing: border-box; }

                .register-page {
                    min-height: 100vh;
                    color: #fff;
                    background: #060a11;
                    font-family: Arial, sans-serif;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    position: relative;
                }

                .register-page::before {
                    content: "";
                    position: fixed;
                    width: 480px;
                    height: 480px;
                    left: -200px;
                    bottom: -200px;
                    background: #087dff;
                    opacity: .10;
                    filter: blur(110px);
                    pointer-events: none;
                }

                .register-navbar {
                    height: 78px;
                    padding: 0 6%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #ffffff0d;
                    background: #060a11d9;
                    position: relative;
                    z-index: 2;
                }

                .register-logo {
                    font-size: 25px;
                    font-weight: 800;
                    letter-spacing: -1px;
                    color: white;
                    text-decoration: none;
                }

                .register-logo span { color: #389fff; }

                .nav-account {
                    color: #8994a4;
                    font-size: 13px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .nav-login {
                    color: white;
                    text-decoration: none;
                    padding: 10px 18px;
                    border: 1px solid #ffffff24;
                    border-radius: 9px;
                    transition: .25s;
                }

                .nav-login:hover {
                    border-color: #389fff;
                    background: #168fff18;
                }

                .register-layout {
                    width: 100%;
                    max-width: 1280px;
                    margin: auto;
                    padding: 42px 35px;
                    display: grid;
                    grid-template-columns: 1fr 460px;
                    gap: 65px;
                    align-items: center;
                    position: relative;
                    z-index: 1;
                }

                /* DIFFERENT SHOWCASE DESIGN */

                .register-showcase {
                    position: relative;
                    padding: 20px 0 20px 15px;
                    animation: slideLeft .8s ease both;
                }

                @keyframes slideLeft {
                    from { opacity: 0; transform: translateX(-35px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                .showcase-label {
                    display: inline-flex;
                    align-items: center;
                    gap: 9px;
                    padding: 9px 13px;
                    border-radius: 30px;
                    border: 1px solid #389fff40;
                    background: #168fff12;
                    color: #82c5ff;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 1.5px;
                }

                .label-dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #42b6ff;
                    box-shadow: 0 0 12px #42b6ff;
                }

                .showcase-heading {
                    font-family: Georgia, serif;
                    font-size: clamp(40px, 4.4vw, 62px);
                    line-height: 1.13;
                    font-weight: 500;
                    letter-spacing: -2px;
                    margin: 25px 0 18px;
                    max-width: 570px;
                }

                .showcase-heading span {
                    color: #50adff;
                    font-style: italic;
                }

                .showcase-description {
                    color: #8995a5;
                    font-size: 15px;
                    line-height: 1.9;
                    max-width: 460px;
                    margin-bottom: 30px;
                }

                /* MINI EVENT CARDS */

                .event-preview {
                    display: grid;
                    grid-template-columns: 1.15fr .85fr;
                    gap: 13px;
                    max-width: 520px;
                    margin-bottom: 27px;
                }

                .event-card {
                    min-height: 155px;
                    border: 1px solid #ffffff12;
                    border-radius: 17px;
                    padding: 19px;
                    position: relative;
                    overflow: hidden;
                    background: linear-gradient(140deg, #15253a, #0b111c);
                    transition: transform .3s, border-color .3s;
                }

                .event-card:hover {
                    transform: translateY(-5px);
                    border-color: #389fff65;
                }

                .event-card.primary {
                    background:
                        radial-gradient(circle at 100% 0%, #168fff40, transparent 55%),
                        linear-gradient(140deg, #142b43, #0b111c);
                }

                .event-card .card-symbol {
                    font-size: 27px;
                    margin-bottom: 18px;
                    display: block;
                }

                .event-card strong {
                    display: block;
                    font-size: 14px;
                    margin-bottom: 7px;
                }

                .event-card small {
                    color: #8b9aab;
                    font-size: 11px;
                    line-height: 1.6;
                }

                .preview-number {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    font-size: 10px;
                    color: #7abfff;
                    letter-spacing: 1px;
                }

                .showcase-bottom {
                    display: flex;
                    align-items: center;
                    gap: 13px;
                    color: #7f8c9d;
                    font-size: 12px;
                }

                .avatar-stack {
                    display: flex;
                    padding-left: 3px;
                }

                .avatar-stack span {
                    width: 29px;
                    height: 29px;
                    border-radius: 50%;
                    display: grid;
                    place-items: center;
                    margin-left: -4px;
                    border: 2px solid #0b111c;
                    background: #203b56;
                    font-size: 10px;
                }

                .showcase-bottom strong { color: #dce8f5; }

                /* REGISTER PANEL */

                .register-panel {
                    width: 100%;
                    padding: 34px;
                    background: linear-gradient(145deg, #111a27f5, #0a101af7);
                    border: 1px solid #ffffff12;
                    border-radius: 22px;
                    box-shadow: 0 30px 90px #0006;
                    position: relative;
                    animation: slideRight .8s ease both;
                }

                @keyframes slideRight {
                    from { opacity: 0; transform: translateX(35px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                .panel-topline {
                    width: 55px;
                    height: 3px;
                    border-radius: 5px;
                    background: linear-gradient(90deg, #168fff, #78c8ff);
                    margin-bottom: 24px;
                }

                .panel-title {
                    font-family: Georgia, serif;
                    font-size: 33px;
                    font-weight: 500;
                    letter-spacing: -.7px;
                    margin: 0 0 10px;
                }

                .panel-subtitle {
                    color: #8995a5;
                    font-size: 13px;
                    line-height: 1.7;
                    margin: 0 0 27px;
                }

                .register-field { margin-bottom: 17px; }

                .register-field label {
                    display: block;
                    font-size: 12px;
                    font-weight: 600;
                    color: #cbd5e1;
                    margin-bottom: 9px;
                }

                .register-input-wrap {
                    height: 48px;
                    display: flex;
                    align-items: center;
                    border: 1px solid #ffffff14;
                    background: #ffffff05;
                    border-radius: 10px;
                    transition: .25s;
                }

                .register-input-wrap:focus-within {
                    border-color: #389fff;
                    box-shadow: 0 0 0 3px #168fff13;
                }

                .field-icon {
                    width: 43px;
                    text-align: center;
                    color: #66b7ff;
                    font-size: 15px;
                }

                .register-input-wrap input,
                .register-input-wrap select {
                    width: 100%;
                    min-width: 0;
                    height: 100%;
                    color: white;
                    border: 0;
                    outline: 0;
                    background: transparent;
                    padding: 0 12px 0 0;
                    font-size: 13px;
                }

                .register-input-wrap input::placeholder {
                    color: #657286;
                }

                .register-input-wrap select { cursor: pointer; }

                .register-input-wrap select option {
                    background: #111a27;
                    color: white;
                }

                .show-password {
                    border: 0;
                    background: transparent;
                    color: #8b9bad;
                    cursor: pointer;
                    padding: 10px 12px;
                }

                .show-password:hover { color: #50adff; }

                .register-submit {
                    margin-top: 7px;
                    height: 51px;
                    width: 100%;
                    border: 0;
                    border-radius: 10px;
                    background: linear-gradient(110deg, #0879ef, #35a7ff);
                    color: white;
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    box-shadow: 0 10px 25px #168fff25;
                    transition: .25s;
                }

                .register-submit:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 14px 30px #168fff40;
                }

                .register-submit:disabled {
                    opacity: .7;
                    cursor: not-allowed;
                }

                .form-message {
                    font-size: 12px;
                    line-height: 1.6;
                    border-radius: 8px;
                    padding: 11px;
                    margin-bottom: 14px;
                }

                .form-error {
                    color: #ff9999;
                    background: #ff454510;
                    border: 1px solid #ff45452a;
                }

                .form-success {
                    color: #7ce6ad;
                    background: #2cc77b10;
                    border: 1px solid #2cc77b2a;
                }

                .register-terms {
                    color: #657286;
                    font-size: 10px;
                    text-align: center;
                    line-height: 1.8;
                    margin-top: 18px;
                }

                .register-terms span { color: #67b7ff; }

                .register-divider {
                    height: 1px;
                    background: #ffffff0e;
                    margin: 21px 0;
                }

                .register-signin {
                    color: #8995a5;
                    text-align: center;
                    font-size: 12px;
                }

                .register-signin a {
                    color: #55b0ff;
                    text-decoration: none;
                    font-weight: 700;
                }

                .register-footer {
                    display: flex;
                    justify-content: space-between;
                    padding: 17px 6%;
                    color: #586474;
                    font-size: 11px;
                    border-top: 1px solid #ffffff0b;
                }

                @media (max-width: 1000px) {
                    .register-layout {
                        grid-template-columns: 1fr 420px;
                        gap: 30px;
                        padding: 35px 25px;
                    }

                    .register-panel { padding: 28px; }

                    .showcase-heading { font-size: 43px; }
                }

                @media (max-width: 760px) {
                    .register-layout {
                        grid-template-columns: 1fr;
                        max-width: 520px;
                        gap: 35px;
                        padding: 35px 20px 45px;
                    }

                    .register-showcase {
                        padding: 0;
                        text-align: center;
                    }

                    .showcase-heading {
                        font-size: 40px;
                        margin-top: 20px;
                    }

                    .showcase-description {
                        margin: 0 auto 22px;
                        font-size: 13px;
                    }

                    .event-preview {
                        text-align: left;
                        margin: 0 auto 22px;
                    }

                    .showcase-bottom { justify-content: center; }

                    .register-panel { padding: 28px 23px; }

                    .register-navbar { padding: 0 20px; }

                    .register-footer { padding: 17px 20px; }
                }

                @media (max-width: 420px) {
                    .register-logo { font-size: 21px; }
                    .nav-account { gap: 8px; }
                    .nav-login { padding: 9px 12px; }
                    .showcase-heading { font-size: 35px; }
                    .event-card { padding: 14px; min-height: 145px; }
                    .event-card strong { font-size: 12px; }
                    .register-panel { padding: 25px 18px; }
                    .panel-title { font-size: 29px; }
                }

                @media (prefers-reduced-motion: reduce) {
                    .register-showcase,
                    .register-panel {
                        animation: none;
                    }

                    .event-card,
                    .register-submit {
                        transition: none;
                    }
                }
            `}</style>

            <nav className="register-navbar">
                <Link to="/" className="register-logo">
                    Event<span>Sphere</span>
                </Link>

                <div className="nav-account">
                    <span>Already a member?</span>
                    <Link to="/login" className="nav-login">
                        Sign in
                    </Link>
                </div>
            </nav>

            <main className="register-layout">
                <section className="register-showcase">
                    <div className="showcase-label">
                        <span className="label-dot"></span>
                        YOUR NEXT CHAPTER STARTS HERE
                    </div>

                    <h1 className="showcase-heading">
                        Make room for
                        <br />
                        <span>great moments.</span>
                    </h1>

                    <p className="showcase-description">
                        Discover opportunities, connect with your
                        community, and create experiences people
                        will remember. Your event journey starts here.
                    </p>

                    <div className="event-preview">
                        <div className="event-card primary">
                            <span className="preview-number">01 / EVENTS</span>
                            <span className="card-symbol">✦</span>
                            <strong>Discover experiences</strong>
                            <small>
                                Find events that match your interests
                                and bring new ideas to life.
                            </small>
                        </div>

                        <div className="event-card">
                            <span className="preview-number">02 / PEOPLE</span>
                            <span className="card-symbol">◎</span>
                            <strong>Build connections</strong>
                            <small>
                                Meet people and grow your network.
                            </small>
                        </div>
                    </div>

                    <div className="showcase-bottom">
                        <div className="avatar-stack">
                            <span>✦</span>
                            <span>◈</span>
                            <span>◎</span>
                        </div>

                        <div>
                            <strong>One account, more possibilities</strong>
                            <br />
                            A smarter way to experience events.
                        </div>
                    </div>
                </section>

                <section className="register-panel">
                    <div className="panel-topline"></div>

                    <h2 className="panel-title">Create account</h2>

                    <p className="panel-subtitle">
                        Set up your profile to get started with EventSphere.
                    </p>

                    <form onSubmit={handleRegister}>
                        <div className="register-field">
                            <label htmlFor="reg-name">Full name</label>
                            <div className="register-input-wrap">
                                <span className="field-icon">♙</span>
                                <input
                                    id="reg-name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    autoComplete="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="register-field">
                            <label htmlFor="reg-email">Email address</label>
                            <div className="register-input-wrap">
                                <span className="field-icon">✉</span>
                                <input
                                    id="reg-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="register-field">
                            <label htmlFor="reg-password">Password</label>
                            <div className="register-input-wrap">
                                <span className="field-icon">⌑</span>
                                <input
                                    id="reg-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="At least 6 characters"
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    minLength={6}
                                    required
                                />
                                <button
                                    type="button"
                                    className="show-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <div className="register-field">
                            <label htmlFor="reg-role">Account type</label>
                            <div className="register-input-wrap">
                                <span className="field-icon">◇</span>
                                <select
                                    id="reg-role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="attendee">Attendee</option>
                                    <option value="exhibitor">Exhibitor</option>
                                    <option value="organizer">Organizer</option>
                                </select>
                            </div>
                        </div>

                        {error && (
                            <div className="form-message form-error">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="form-message form-success">
                                {success}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="register-submit"
                            disabled={loading}
                        >
                            {loading ? "Creating account..." : "Create account"}
                            {!loading && <span>→</span>}
                        </button>
                    </form>

                    <div className="register-terms">
                        By continuing, you agree to our
                        <span> Terms &amp; Conditions </span>
                        and community guidelines.
                    </div>

                    <div className="register-divider"></div>

                    <div className="register-signin">
                        Already have an account?
                        <Link to="/login"> Sign in</Link>
                    </div>
                </section>
            </main>

            <footer className="register-footer">
                <span>© 2026 EventSphere</span>
                <span>Made for meaningful experiences.</span>
            </footer>
        </div>
    );
}

export default Register;
