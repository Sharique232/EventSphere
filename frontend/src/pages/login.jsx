
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeSlide, setActiveSlide] = useState(0);

    const slides = [
        {
            number: "01",
            category: "EVENT MANAGEMENT",
            title: "Bring Your Events to Life.",
            description:
                "Create and manage expos, organize exhibitors, assign booths and keep every part of your event connected.",
            icon: "◈",
            features: ["Expo Management", "Booth Planning", "Event Control"],
            stat: "01",
            statLabel: "CONNECTED EVENT WORKSPACE",
            accent: "#168fff",
        },
        {
            number: "02",
            category: "SESSIONS & CONFERENCES",
            title: "Ideas Meet Opportunity.",
            description:
                "Discover conference sessions, explore speaker information and keep event schedules organized in one place.",
            icon: "✦",
            features: ["Expert Sessions", "Speaker Details", "Smart Scheduling"],
            stat: "02",
            statLabel: "SESSIONS & SCHEDULES",
            accent: "#49b2ff",
        },
        {
            number: "03",
            category: "EXHIBITOR EXPERIENCE",
            title: "Showcase Your Business.",
            description:
                "Manage exhibitor participation, review booth assignments and bring businesses together at every expo.",
            icon: "▦",
            features: ["Exhibitor Profiles", "Booth Assignments", "Products"],
            stat: "03",
            statLabel: "EXHIBITOR WORKSPACE",
            accent: "#38bdf8",
        },
        {
            number: "04",
            category: "REGISTRATION & CONNECTION",
            title: "Every Guest Matters.",
            description:
                "Keep track of registrations, bookmark important sessions and connect attendees with event organizers.",
            icon: "⌁",
            features: ["Registrations", "Bookmarks", "Messaging"],
            stat: "04",
            statLabel: "ATTENDEE EXPERIENCE",
            accent: "#60a5fa",
        },
        {
            number: "05",
            category: "INSIGHTS & ANALYTICS",
            title: "Turn Data Into Decisions.",
            description:
                "Explore event performance and registration insights to help plan and manage your next successful expo.",
            icon: "↗",
            features: ["Event Analytics", "Performance Insights", "Organized Data"],
            stat: "05",
            statLabel: "SMARTER EVENT INSIGHTS",
            accent: "#22d3ee",
        },
    ];

    useEffect(() => {
        const timer = window.setInterval(() => {
            setActiveSlide((current) => (current + 1) % slides.length);
        }, 4500);

        return () => window.clearInterval(timer);
    }, [slides.length]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password) {
            setError("Email and password are required");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                "api/users/login",
                {
                    email: email.trim(),
                    password,
                }
            );

            localStorage.setItem("token", response.data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.message || "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="es-login">
            <style>{`
                .es-login,
                .es-login * {
                    box-sizing: border-box;
                }

                .es-login {
                    --bg: #05080d;
                    --panel: #0a1018;
                    --text: #f5f8fb;
                    --muted: #8b98a8;
                    --blue: #168fff;
                    --blue2: #49b2ff;
                    --line: rgba(255,255,255,.10);

                    min-height: 100vh;
                    position: relative;
                    isolation: isolate;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    background: var(--bg);
                    color: var(--text);
                    font-family: Inter, Arial, Helvetica, sans-serif;
                }

                .es-login a,
                .es-login button,
                .es-login input {
                    font-family: inherit;
                }

                .es-login a {
                    -webkit-tap-highlight-color: transparent;
                }

                .es-login-glow {
                    position: absolute;
                    z-index: -1;
                    width: 420px;
                    height: 420px;
                    border-radius: 50%;
                    filter: blur(110px);
                    pointer-events: none;
                }

                .es-login-glow-one {
                    top: -250px;
                    left: -130px;
                    background: rgba(22,143,255,.16);
                }

                .es-login-glow-two {
                    right: -200px;
                    bottom: -220px;
                    background: rgba(22,143,255,.12);
                }

                /* NAVBAR */

                .es-login-nav {
                    height: 78px;
                    flex-shrink: 0;
                    padding: 0 6%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    position: relative;
                    z-index: 5;
                    background: rgba(5,8,13,.82);
                    border-bottom: 1px solid rgba(255,255,255,.07);
                    backdrop-filter: blur(18px);
                }

                .es-login-brand {
                    display: inline-flex;
                    align-items: center;
                    gap: 11px;
                    color: var(--text);
                    text-decoration: none;
                }

                .es-login-brand-icon {
                    width: 40px;
                    height: 40px;
                    display: grid;
                    place-items: center;
                    border-radius: 12px;
                    background: linear-gradient(145deg,#45b7ff,#0878e8);
                    color: #fff;
                    font-size: 14px;
                    font-weight: 900;
                    box-shadow: 0 0 28px rgba(20,143,255,.24);
                }

                .es-login-brand-name {
                    font-size: 20px;
                    font-weight: 800;
                    letter-spacing: -.7px;
                }

                .es-login-brand-name span {
                    color: var(--blue2);
                }

                .es-login-home {
                    color: var(--muted);
                    text-decoration: none;
                    font-size: 12px;
                    font-weight: 600;
                    transition: color .25s ease;
                }

                .es-login-home:hover {
                    color: var(--blue2);
                }

                /* MAIN LAYOUT */

                .es-login-main {
                    width: 100%;
                    max-width: 1600px;
                    flex: 1;
                    margin: 0 auto;
                    padding: 45px 6%;
                    display: grid;
                    grid-template-columns: minmax(0, 1.08fr) minmax(350px, .82fr);
                    align-items: center;
                    gap: clamp(35px, 6vw, 95px);
                }

                /* LEFT SLIDER */

                .es-showcase {
                    width: 100%;
                    min-width: 0;
                    position: relative;
                    padding: 12px 0;
                    animation: esFadeIn .65s ease both;
                }

                .es-showcase-top {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 25px;
                    color: #b8c8d8;
                    font-size: 10px;
                    font-weight: 800;
                    letter-spacing: 2.5px;
                }

                .es-live-dot {
                    width: 8px;
                    height: 8px;
                    flex-shrink: 0;
                    border-radius: 50%;
                    background: #45d483;
                    box-shadow: 0 0 12px rgba(69,212,131,.65);
                    animation: esPulse 1.8s ease-in-out infinite;
                }

                .es-showcase-heading {
                    max-width: 620px;
                    margin: 0 0 16px;
                    color: var(--text);
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: clamp(34px, 4.1vw, 55px);
                    font-weight: 400;
                    line-height: 1.12;
                    letter-spacing: -1.5px;
                }

                .es-showcase-heading span {
                    color: var(--blue2);
                }

                .es-showcase-intro {
                    max-width: 510px;
                    margin: 0 0 30px;
                    color: var(--muted);
                    font-size: 13px;
                    line-height: 1.9;
                }

                .es-slider {
                    width: 100%;
                    position: relative;
                    overflow: hidden;
                    border: 1px solid rgba(255,255,255,.11);
                    border-radius: 23px;
                    background: rgba(10,16,24,.83);
                    box-shadow:
                        0 28px 80px rgba(0,0,0,.24),
                        0 0 45px rgba(22,143,255,.045);
                    backdrop-filter: blur(20px);
                }

                .es-slider::before {
                    content: "";
                    height: 2px;
                    position: absolute;
                    z-index: 2;
                    top: 0;
                    left: 8%;
                    right: 8%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        #168fff,
                        #49b2ff,
                        transparent
                    );
                }

                .es-slider-track {
                    display: flex;
                    align-items: stretch;
                    transition: transform .75s cubic-bezier(.22,.75,.25,1);
                    will-change: transform;
                }

                .es-slide {
                    min-width: 100%;
                    width: 100%;
                    flex: 0 0 100%;
                    padding: clamp(24px, 3.2vw, 39px);
                    position: relative;
                    overflow: hidden;
                }

                .es-slide::after {
                    content: "";
                    width: 230px;
                    height: 230px;
                    position: absolute;
                    top: 30px;
                    right: -100px;
                    border: 1px solid rgba(73,178,255,.12);
                    border-radius: 50%;
                    box-shadow:
                        0 0 0 28px rgba(73,178,255,.025),
                        0 0 0 58px rgba(73,178,255,.018);
                    pointer-events: none;
                }

                .es-slide-category {
                    display: inline-flex;
                    align-items: center;
                    gap: 9px;
                    margin-bottom: 22px;
                    color: var(--blue2);
                    font-size: 9px;
                    font-weight: 800;
                    letter-spacing: 2px;
                }

                .es-slide-category-mark {
                    width: 7px;
                    height: 7px;
                    border-radius: 2px;
                    background: var(--blue2);
                    transform: rotate(45deg);
                }

                .es-slide-title {
                    max-width: 440px;
                    margin: 0 0 14px;
                    position: relative;
                    z-index: 1;
                    color: var(--text);
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: clamp(28px, 3vw, 39px);
                    font-weight: 400;
                    line-height: 1.2;
                    letter-spacing: -.7px;
                }

                .es-slide-description {
                    max-width: 440px;
                    min-height: 68px;
                    margin: 0 0 25px;
                    position: relative;
                    z-index: 1;
                    color: #9aa9b9;
                    font-size: 12px;
                    line-height: 1.9;
                }

                .es-slide-features {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-bottom: 30px;
                    position: relative;
                    z-index: 1;
                }

                .es-feature-chip {
                    padding: 9px 11px;
                    border: 1px solid rgba(255,255,255,.09);
                    border-radius: 9px;
                    background: rgba(255,255,255,.035);
                    color: #d4e0eb;
                    font-size: 10px;
                    font-weight: 600;
                }

                .es-slide-bottom {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 15px;
                    padding-top: 19px;
                    border-top: 1px solid rgba(255,255,255,.08);
                }

                .es-slide-stat {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .es-slide-stat-number {
                    color: var(--blue2);
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: 30px;
                }

                .es-slide-stat-label {
                    max-width: 120px;
                    color: #8495a7;
                    font-size: 8px;
                    font-weight: 800;
                    line-height: 1.7;
                    letter-spacing: 1.5px;
                }

                .es-slide-icon {
                    width: 48px;
                    height: 48px;
                    display: grid;
                    place-items: center;
                    border: 1px solid rgba(73,178,255,.22);
                    border-radius: 15px;
                    background: rgba(22,143,255,.09);
                    color: var(--blue2);
                    font-size: 25px;
                    box-shadow: inset 0 0 25px rgba(22,143,255,.04);
                }

                .es-slider-controls {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 18px;
                    margin-top: 19px;
                }

                .es-slider-dots {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .es-slider-dot {
                    width: 7px;
                    height: 7px;
                    padding: 0;
                    border: 0;
                    border-radius: 20px;
                    background: #344354;
                    cursor: pointer;
                    transition:
                        width .3s ease,
                        background .3s ease;
                }

                .es-slider-dot.active {
                    width: 27px;
                    background: linear-gradient(90deg,#168fff,#49b2ff);
                    box-shadow: 0 0 12px rgba(22,143,255,.3);
                }

                .es-slider-controls-label {
                    color: #75879a;
                    font-size: 10px;
                    letter-spacing: 1px;
                }

                .es-showcase-footnote {
                    margin-top: 25px;
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    color: #8191a2;
                    font-size: 10px;
                    line-height: 1.7;
                }

                .es-showcase-footnote span {
                    color: var(--blue2);
                }

                /* LOGIN FORM */

                .es-login-panel {
                    width: 100%;
                    min-width: 0;
                    display: flex;
                    justify-content: center;
                    animation: esFadeIn .8s ease both;
                }

                .es-login-card {
                    width: 100%;
                    max-width: 440px;
                    padding: clamp(27px, 3.4vw, 41px);
                    position: relative;
                    overflow: hidden;
                    border: 1px solid rgba(255,255,255,.10);
                    border-radius: 23px;
                    background: rgba(10,16,24,.88);
                    box-shadow:
                        0 25px 80px rgba(0,0,0,.3),
                        0 0 45px rgba(22,143,255,.04);
                    backdrop-filter: blur(20px);
                }

                .es-login-card::before {
                    content: "";
                    height: 2px;
                    position: absolute;
                    top: 0;
                    left: 12%;
                    right: 12%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        #168fff,
                        #49b2ff,
                        transparent
                    );
                }

                .es-login-card-logo {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 22px;
                }

                .es-login-card-logo-mark {
                    width: 58px;
                    height: 58px;
                    display: grid;
                    place-items: center;
                    border-radius: 17px;
                    background: linear-gradient(145deg,#45b7ff,#0878e8);
                    color: white;
                    font-size: 17px;
                    font-weight: 900;
                    box-shadow: 0 12px 35px rgba(20,143,255,.23);
                }

                .es-login-eyebrow {
                    margin: 0 0 10px;
                    color: var(--blue2);
                    text-align: center;
                    font-size: 9px;
                    font-weight: 800;
                    letter-spacing: 2.4px;
                }

                .es-login-title {
                    margin: 0;
                    color: var(--text);
                    text-align: center;
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: clamp(29px, 3vw, 36px);
                    font-weight: 400;
                    letter-spacing: -.8px;
                }

                .es-login-subtitle {
                    margin: 11px 0 27px;
                    color: var(--muted);
                    text-align: center;
                    font-size: 12px;
                    line-height: 1.7;
                }

                .es-login-error {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    margin-bottom: 19px;
                    padding: 12px;
                    border: 1px solid rgba(248,113,113,.3);
                    border-radius: 11px;
                    background: rgba(127,29,29,.2);
                    color: #fca5a5;
                    font-size: 11px;
                    line-height: 1.7;
                    overflow-wrap: anywhere;
                }

                .es-login-field {
                    margin-bottom: 19px;
                }

                .es-login-label {
                    display: block;
                    margin-bottom: 9px;
                    color: #e2e8f0;
                    font-size: 11px;
                    font-weight: 700;
                }

                .es-login-input-wrap {
                    position: relative;
                }

                .es-login-input-icon {
                    position: absolute;
                    top: 50%;
                    left: 14px;
                    z-index: 1;
                    transform: translateY(-50%);
                    color: #8295a8;
                    font-size: 14px;
                    pointer-events: none;
                }

                .es-login-input {
                    width: 100%;
                    height: 48px;
                    padding: 0 13px 0 41px;
                    outline: none;
                    border: 1px solid rgba(255,255,255,.12);
                    border-radius: 10px;
                    background: rgba(5,8,13,.78);
                    color: #f5f8fb;
                    font-size: 12px;
                    transition:
                        border-color .25s ease,
                        box-shadow .25s ease;
                }

                .es-login-input::placeholder {
                    color: #69798b;
                }

                .es-login-input:focus {
                    border-color: var(--blue);
                    box-shadow: 0 0 0 3px rgba(22,143,255,.12);
                }

                .es-login-forgot-row {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: -3px;
                    margin-bottom: 20px;
                }

                .es-login-forgot {
                    color: var(--blue2);
                    text-decoration: none;
                    font-size: 10px;
                    font-weight: 700;
                }

                .es-login-forgot:hover {
                    color: #a3ddff;
                }

                .es-login-submit {
                    width: 100%;
                    min-height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 9px;
                    border: 1px solid rgba(73,178,255,.4);
                    border-radius: 10px;
                    background: linear-gradient(110deg,#0878e8,#168fff,#49b2ff);
                    color: #fff;
                    font-size: 12px;
                    font-weight: 800;
                    cursor: pointer;
                    box-shadow: 0 10px 28px rgba(22,143,255,.18);
                    transition:
                        transform .25s ease,
                        box-shadow .25s ease,
                        opacity .25s ease;
                }

                .es-login-submit:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 14px 32px rgba(22,143,255,.27);
                }

                .es-login-submit:disabled {
                    cursor: not-allowed;
                    opacity: .65;
                }

                .es-login-register {
                    margin-top: 23px;
                    color: var(--muted);
                    text-align: center;
                    font-size: 11px;
                    line-height: 1.8;
                }

                .es-login-register a {
                    color: var(--blue2);
                    text-decoration: none;
                    font-weight: 800;
                }

                .es-login-register a:hover {
                    color: #a3ddff;
                }

                .es-login-security {
                    margin-top: 21px;
                    padding: 11px 9px;
                    border: 1px solid rgba(255,255,255,.07);
                    border-radius: 9px;
                    background: rgba(255,255,255,.025);
                    color: #8b9aaa;
                    text-align: center;
                    font-size: 9px;
                    line-height: 1.7;
                }

                .es-login-footer {
                    padding: 17px 20px;
                    border-top: 1px solid rgba(255,255,255,.06);
                    color: #758395;
                    text-align: center;
                    font-size: 10px;
                }

                @keyframes esPulse {
                    0%, 100% {
                        opacity: 1;
                        box-shadow: 0 0 12px rgba(69,212,131,.65);
                    }
                    50% {
                        opacity: .55;
                        box-shadow: 0 0 4px rgba(69,212,131,.3);
                    }
                }

                @keyframes esFadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (min-width: 1500px) {
                    .es-login-main {
                        padding-top: 60px;
                        padding-bottom: 60px;
                    }
                }

                @media (max-width: 1050px) {
                    .es-login-main {
                        grid-template-columns: minmax(0, 1fr) minmax(320px, .9fr);
                        gap: 30px;
                        padding-left: 4%;
                        padding-right: 4%;
                    }

                    .es-showcase-heading {
                        font-size: clamp(32px, 4vw, 43px);
                    }

                    .es-login-card {
                        padding: 30px 25px;
                    }
                }

                @media (max-width: 780px) {
                    .es-login-nav {
                        height: 70px;
                        padding: 0 5%;
                    }

                    .es-login-main {
                        max-width: 560px;
                        grid-template-columns: minmax(0, 1fr);
                        gap: 35px;
                        padding: 35px 20px 42px;
                    }

                    .es-showcase {
                        padding-top: 4px;
                    }

                    .es-showcase-heading {
                        max-width: 480px;
                        font-size: clamp(34px, 7vw, 46px);
                    }

                    .es-showcase-intro {
                        margin-bottom: 23px;
                    }

                    .es-slide {
                        padding: 28px;
                    }

                    .es-slide-description {
                        min-height: 0;
                    }

                    .es-login-panel {
                        width: 100%;
                    }

                    .es-login-card {
                        max-width: none;
                    }
                }

                @media (max-width: 480px) {
                    .es-login-brand-name {
                        font-size: 18px;
                    }

                    .es-login-brand-icon {
                        width: 36px;
                        height: 36px;
                    }

                    .es-login-home {
                        font-size: 10px;
                    }

                    .es-login-main {
                        padding: 27px 15px 32px;
                        gap: 30px;
                    }

                    .es-showcase-top {
                        margin-bottom: 17px;
                        font-size: 9px;
                        letter-spacing: 1.7px;
                    }

                    .es-showcase-heading {
                        font-size: 34px;
                    }

                    .es-showcase-intro {
                        font-size: 12px;
                        line-height: 1.8;
                    }

                    .es-slide {
                        padding: 23px 20px;
                    }

                    .es-slide-title {
                        font-size: 29px;
                    }

                    .es-slide-description {
                        font-size: 11px;
                    }

                    .es-feature-chip {
                        font-size: 9px;
                        padding: 8px;
                    }

                    .es-slide-stat-number {
                        font-size: 26px;
                    }

                    .es-slide-icon {
                        width: 42px;
                        height: 42px;
                    }

                    .es-login-card {
                        padding: 28px 21px;
                        border-radius: 19px;
                    }

                    .es-login-title {
                        font-size: 31px;
                    }

                    .es-login-footer {
                        padding: 15px;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .es-login *,
                    .es-login *::before,
                    .es-login *::after {
                        animation-duration: .01ms !important;
                        animation-iteration-count: 1 !important;
                        scroll-behavior: auto !important;
                        transition-duration: .01ms !important;
                    }
                }
            `}</style>

            <div className="es-login-glow es-login-glow-one" />
            <div className="es-login-glow es-login-glow-two" />

            {/* NAVBAR */}
            <nav className="es-login-nav">
                <Link to="/" className="es-login-brand">
                    <div className="es-login-brand-icon">ES</div>

                    <span className="es-login-brand-name">
                        Event<span>Sphere</span>
                    </span>
                </Link>

                <Link to="/" className="es-login-home">
                    ← Back to Home
                </Link>
            </nav>

            {/* MAIN CONTENT */}
            <main className="es-login-main">

                {/* LEFT: AUTOMATIC EVENT SLIDER */}
                <section className="es-showcase">
                    <div className="es-showcase-top">
                        <span className="es-live-dot" />
                        YOUR COMPLETE EVENT PLATFORM
                    </div>

                    <h2 className="es-showcase-heading">
                        One Platform.
                        <br />
                        <span>Endless Possibilities.</span>
                    </h2>

                    <p className="es-showcase-intro">
                        Discover a smarter way to organize events,
                        manage exhibitions and bring people together
                        with EventSphere.
                    </p>

                    <div
                        className="es-slider"
                        aria-label="EventSphere features"
                        aria-roledescription="carousel"
                    >
                        <div
                            className="es-slider-track"
                            style={{
                                transform: `translateX(-${activeSlide * 100}%)`,
                            }}
                        >
                            {slides.map((slide, index) => (
                                <article
                                    className="es-slide"
                                    key={slide.number}
                                    aria-label={`${index + 1} of ${slides.length}`}
                                    aria-hidden={index !== activeSlide}
                                    style={{
                                        "--slide-accent": slide.accent,
                                    }}
                                >
                                    <div className="es-slide-category">
                                        <span className="es-slide-category-mark" />
                                        {slide.category}
                                    </div>

                                    <h3 className="es-slide-title">
                                        {slide.title}
                                    </h3>

                                    <p className="es-slide-description">
                                        {slide.description}
                                    </p>

                                    <div className="es-slide-features">
                                        {slide.features.map((feature) => (
                                            <span
                                                className="es-feature-chip"
                                                key={feature}
                                            >
                                                <span
                                                    style={{
                                                        color: "var(--blue2)",
                                                        marginRight: 6,
                                                    }}
                                                >
                                                    ✓
                                                </span>
                                                {feature}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="es-slide-bottom">
                                        <div className="es-slide-stat">
                                            <span className="es-slide-stat-number">
                                                {slide.stat}
                                            </span>

                                            <span className="es-slide-stat-label">
                                                {slide.statLabel}
                                            </span>
                                        </div>

                                        <div className="es-slide-icon">
                                            {slide.icon}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    {/* SLIDER DOTS */}
                    <div className="es-slider-controls">
                        <div
                            className="es-slider-dots"
                            aria-label="Choose event slide"
                        >
                            {slides.map((slide, index) => (
                                <button
                                    key={slide.number}
                                    type="button"
                                    className={`es-slider-dot ${
                                        activeSlide === index ? "active" : ""
                                    }`}
                                    aria-label={`Show slide ${index + 1}`}
                                    aria-current={
                                        activeSlide === index ? "true" : undefined
                                    }
                                    onClick={() => setActiveSlide(index)}
                                />
                            ))}
                        </div>

                        <span className="es-slider-controls-label">
                            {String(activeSlide + 1).padStart(2, "0")} /{" "}
                            {String(slides.length).padStart(2, "0")}
                        </span>
                    </div>

                    <div className="es-showcase-footnote">
                        <span>✦</span>
                        One connected workspace for organizers, exhibitors
                        and attendees.
                    </div>
                </section>

                {/* RIGHT: EXISTING LOGIN FUNCTIONALITY */}
                <section className="es-login-panel">
                    <div className="es-login-card">
                        <div className="es-login-card-logo">
                            <div className="es-login-card-logo-mark">
                                ES
                            </div>
                        </div>

                        <p className="es-login-eyebrow">
                            WELCOME BACK
                        </p>

                        <h1 className="es-login-title">
                            Sign In
                        </h1>

                        <p className="es-login-subtitle">
                            Login to your EventSphere account
                        </p>

                        {error && (
                            <div className="es-login-error" role="alert">
                                <span>⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleLogin}>
                            <div className="es-login-field">
                                <label
                                    className="es-login-label"
                                    htmlFor="es-login-email"
                                >
                                    Email Address
                                </label>

                                <div className="es-login-input-wrap">
                                    <span className="es-login-input-icon">
                                        ✉
                                    </span>

                                    <input
                                        id="es-login-email"
                                        className="es-login-input"
                                        type="email"
                                        placeholder="Enter your email"
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="es-login-field">
                                <label
                                    className="es-login-label"
                                    htmlFor="es-login-password"
                                >
                                    Password
                                </label>

                                <div className="es-login-input-wrap">
                                    <span className="es-login-input-icon">
                                        🔒
                                    </span>

                                    <input
                                        id="es-login-password"
                                        className="es-login-input"
                                        type="password"
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="es-login-forgot-row">
                                <Link
                                    to="/forgot-password"
                                    className="es-login-forgot"
                                >
                                    Forgot Password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="es-login-submit"
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login →"}
                            </button>
                        </form>

                        <div className="es-login-register">
                            Don't have an account?{" "}
                            <Link to="/register">
                                Create Account
                            </Link>
                        </div>

                        <div className="es-login-security">
                            🔐 Your account information is securely protected.
                        </div>
                    </div>
                </section>
            </main>

            <footer className="es-login-footer">
                © 2026 EventSphere. All rights reserved.
            </footer>
        </div>
    );
}

export default Login;
