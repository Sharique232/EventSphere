
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const colors = {
    bg: "#05080d",
    nav: "#080e16",
    card: "#0c1520",
    cardAlt: "#111e2c",
    border: "#202d3b",
    blue: "#49b2ff",
    blueStrong: "#168fff",
    text: "#f5f8fb",
    muted: "#9aa7b7",
};

function Dashboard() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("eventSphereDarkMode") !== "false"
    );

    useEffect(() => {
        localStorage.setItem("eventSphereDarkMode", String(darkMode));
    }, [darkMode]);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const theme = {
        bg: darkMode ? colors.bg : "#f3f6fa",
        nav: darkMode ? colors.nav : "#ffffff",
        card: darkMode ? colors.card : "#ffffff",
        cardAlt: darkMode ? colors.cardAlt : "#edf3f9",
        border: darkMode ? colors.border : "#dce4ec",
        text: darkMode ? colors.text : "#111820",
        muted: darkMode ? colors.muted : "#657080",
    };

    const modules = [
        { icon: "🎪", title: "Expos", text: "Explore and manage event expos.", link: "/expos" },
        { icon: "📋", title: "My Registrations", text: "View your registered events and sessions.", link: "/my-registrations" },
        { icon: "🏢", title: "Exhibitors", text: "Explore exhibitors and their profiles.", link: "/exhibitors" },
        { icon: "📦", title: "Products", text: "Explore products from exhibitors.", link: "/products" },
        { icon: "🎤", title: "Sessions", text: "Discover and register for sessions.", link: "/sessions" },
        { icon: "💬", title: "Messages", text: "Connect with other event users.", link: "/messages" },
        { icon: "🔔", title: "Notifications", text: "View your latest notifications.", link: "/notifications" },
        { icon: "⭐", title: "Feedback", text: "Share your event experience.", link: "/feedback" },
        { icon: "🔖", title: "Bookmarks", text: "View your saved sessions.", link: "/bookmarks" },
        { icon: "📊", title: "Analytics", text: "View event performance analytics.", link: "/analytics" },
        { icon: "👨‍💼", title: "Staff", text: "Manage exhibitor staff.", link: "/staff" },
        { icon: "🪧", title: "Booths", text: "Manage event booths.", link: "/booths" },
        { icon: "📅", title: "Schedules", text: "Manage event schedules.", link: "/schedules" },
    ];

    const stats = [
        { icon: "🎪", number: "24", label: "Active Events", text: "Currently available" },
        { icon: "👥", number: "1,240+", label: "Attendees", text: "Connected users" },
        { icon: "🏢", number: "86", label: "Exhibitors", text: "Event partners" },
        { icon: "🎤", number: "120+", label: "Sessions", text: "Upcoming sessions" },
    ];

    const css = `
        .es-dashboard,
        .es-dashboard * {
            box-sizing: border-box;
        }

        .es-dashboard {
            font-family: Inter, Arial, Helvetica, sans-serif;
            position: relative;
            isolation: isolate;
        }

        .es-dashboard h1,
        .es-dashboard h2,
        .es-dashboard h3 {
            font-family: Georgia, "Times New Roman", serif;
        }

        .es-dashboard .es-nav-link,
        .es-dashboard .es-footer-link {
            transition: color .25s ease;
        }

        .es-dashboard .es-nav-link {
            color: ${theme.muted};
            text-decoration: none;
            font-size: 13px;
            font-weight: 600;
        }

        .es-dashboard .es-nav-link:hover,
        .es-dashboard .es-nav-link.active,
        .es-dashboard .es-footer-link:hover {
            color: ${colors.blue};
        }

        .es-dashboard .es-primary,
        .es-dashboard .es-secondary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            border-radius: 30px;
            padding: 13px 21px;
            text-decoration: none;
            font-size: 12px;
            font-weight: 750;
            transition: transform .25s ease, box-shadow .25s ease,
                        background .25s ease;
        }

        .es-dashboard .es-primary {
            color: #fff;
            background: linear-gradient(110deg, #168fff, #0875df);
            border: 1px solid #168fff;
            box-shadow: 0 8px 24px rgba(22,143,255,.18);
        }

        .es-dashboard .es-primary:hover {
            color: #fff;
            transform: translateY(-3px);
            box-shadow: 0 12px 30px rgba(22,143,255,.32);
        }

        .es-dashboard .es-secondary {
            color: ${theme.text};
            background: ${theme.card};
            border: 1px solid ${theme.border};
        }

        .es-dashboard .es-secondary:hover {
            transform: translateY(-3px);
            border-color: ${colors.blue};
        }

        .es-dashboard .es-module {
            display: block;
            min-width: 0;
            position: relative;
            overflow: hidden;
            padding: 25px;
            background: ${theme.card};
            border: 1px solid ${theme.border};
            border-radius: 18px;
            color: ${theme.text};
            text-decoration: none;
            transition: transform .3s ease, border-color .3s ease,
                        box-shadow .3s ease, background .3s ease;
            animation: es-fade-up .65s both;
        }

        .es-dashboard .es-module::before {
            content: "";
            position: absolute;
            width: 150px;
            height: 150px;
            top: -100px;
            right: -100px;
            border-radius: 50%;
            background: rgba(22,143,255,.13);
            filter: blur(28px);
            transition: transform .4s ease;
            pointer-events: none;
        }

        .es-dashboard .es-module:hover {
            transform: translateY(-7px);
            border-color: rgba(73,178,255,.65);
            box-shadow: 0 18px 38px rgba(0,0,0,.10);
        }

        .es-dashboard .es-module:hover::before {
            transform: scale(2.1);
        }

        .es-dashboard .es-stat {
            display: flex;
            align-items: center;
            gap: 14px;
            min-width: 0;
            padding: 22px;
            background: ${theme.card};
            border: 1px solid ${theme.border};
            border-radius: 16px;
            transition: border-color .25s ease, transform .25s ease;
        }

        .es-dashboard .es-stat:hover {
            border-color: ${colors.blue};
            transform: translateY(-4px);
        }

        .es-dashboard .es-footer-link {
            color: ${theme.muted};
            text-decoration: none;
            font-size: 12px;
        }

        .es-dashboard .es-glow {
            position: absolute;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            filter: blur(100px);
            opacity: ${darkMode ? ".12" : ".18"};
            background: #168fff;
            pointer-events: none;
            z-index: -1;
        }

        .es-dashboard .es-animate {
            animation: es-fade-up .75s both;
        }

        .es-dashboard .es-animate-delay {
            animation: es-fade-up .85s .15s both;
        }

        .es-dashboard .es-preview {
            position: relative;
            overflow: hidden;
            backdrop-filter: blur(14px);
            transition: transform .35s ease, border-color .35s ease;
        }

        .es-dashboard .es-preview:hover {
            transform: translateY(-5px);
            border-color: rgba(73,178,255,.5) !important;
        }

        .es-dashboard .es-chart-bar {
            transform-origin: bottom;
            animation: es-grow-bar .9s both;
        }

        .es-dashboard .es-cta {
            position: relative;
            overflow: hidden;
        }

        .es-dashboard .es-cta::before {
            content: "";
            position: absolute;
            width: 240px;
            height: 240px;
            top: -150px;
            right: -80px;
            border-radius: 50%;
            background: rgba(73,178,255,.13);
            filter: blur(35px);
            pointer-events: none;
        }

        @keyframes es-fade-up {
            from { opacity: 0; transform: translateY(22px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes es-grow-bar {
            from { transform: scaleY(0); }
            to { transform: scaleY(1); }
        }

        @media (max-width: 1000px) {
            .es-dashboard .es-nav { padding: 15px 4% !important; }
            .es-dashboard .es-nav-links { display: none !important; }
            .es-dashboard .es-hero {
                grid-template-columns: 1fr !important;
                padding: 55px 5% !important;
                gap: 38px !important;
            }
            .es-dashboard .es-hero-title {
                font-size: clamp(42px, 8vw, 66px) !important;
            }
            .es-dashboard .es-stats {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
            .es-dashboard .es-experience {
                grid-template-columns: 1fr !important;
            }
            .es-dashboard .es-footer {
                flex-direction: column !important;
            }
            .es-dashboard .es-footer-links {
                gap: 30px !important;
                flex-wrap: wrap;
            }
        }

        @media (max-width: 600px) {
            .es-dashboard .es-nav {
                height: auto !important;
                align-items: center !important;
                flex-wrap: wrap;
                gap: 15px !important;
            }
            .es-dashboard .es-nav-right {
                width: 100%;
                flex-wrap: wrap;
            }
            .es-dashboard .es-user-mini { flex: 1; }
            .es-dashboard .es-stats { grid-template-columns: 1fr !important; }
            .es-dashboard .es-modules { grid-template-columns: 1fr !important; }
            .es-dashboard .es-section { padding: 50px 5% !important; }
            .es-dashboard .es-preview-main { padding: 10px !important; }
            .es-dashboard .es-preview-sidebar { width: 42px !important; }
            .es-dashboard .es-preview-stat { padding: 7px !important; }
            .es-dashboard .es-preview-stat strong { font-size: 15px !important; }
            .es-dashboard .es-cta {
                margin: 40px 5% !important;
                padding: 45px 15px !important;
            }
            .es-dashboard .es-experience-title { font-size: 35px !important; }
            .es-dashboard .es-footer-links { gap: 24px !important; }
            .es-dashboard .es-stat { padding: 17px; }
        }

        @media (prefers-reduced-motion: reduce) {
            .es-dashboard *,
            .es-dashboard *::before,
            .es-dashboard *::after {
                animation-duration: .01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: .01ms !important;
                scroll-behavior: auto !important;
            }
        }
    `;

    return (
        <div
            className="es-dashboard"
            style={{
                minHeight: "100vh",
                background: theme.bg,
                color: theme.text,
                overflowX: "hidden",
                transition: "background .3s ease, color .3s ease",
            }}
        >
            <style>{css}</style>

            <div
                className="es-glow"
                style={{ top: 120, right: "-120px" }}
            />
            <div
                className="es-glow"
                style={{ top: 950, left: "-180px", opacity: 0.07 }}
            />

            {/* NAVBAR */}
            <nav
                className="es-nav"
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                    minHeight: 76,
                    padding: "0 7%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 20,
                    background: theme.nav,
                    borderBottom: `1px solid ${theme.border}`,
                    backdropFilter: "blur(18px)",
                }}
            >
                <Link
                    to="/"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        color: theme.text,
                        fontSize: 21,
                        fontWeight: 800,
                        textDecoration: "none",
                    }}
                >
                    <Logo />
                    <span>
                        Event<span style={{ color: colors.blue }}>Sphere</span>
                    </span>
                </Link>

                <div className="es-nav-links" style={{ display: "flex", gap: 24 }}>
                    <Link className="es-nav-link active" to="/dashboard">Dashboard</Link>
                    <Link className="es-nav-link" to="/expos">Expos</Link>
                    <Link className="es-nav-link" to="/sessions">Sessions</Link>
                    <Link className="es-nav-link" to="/messages">Messages</Link>
                </div>

                <div
                    className="es-nav-right"
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                    <button
                        onClick={() => setDarkMode((value) => !value)}
                        title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                        aria-label="Toggle theme"
                        style={{
                            width: 39,
                            height: 39,
                            borderRadius: 12,
                            border: `1px solid ${theme.border}`,
                            background: theme.cardAlt,
                            color: theme.text,
                            cursor: "pointer",
                        }}
                    >
                        {darkMode ? "☀️" : "🌙"}
                    </button>

                    <div
                        className="es-user-mini"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 9,
                            padding: "5px 10px 5px 5px",
                            border: `1px solid ${theme.border}`,
                            borderRadius: 12,
                        }}
                    >
                        <Avatar name={user.name} />
                        <div>
                            <strong style={{ display: "block", fontSize: 11 }}>
                                {user.name || "User"}
                            </strong>
                            <small style={{ color: theme.muted, fontSize: 9 }}>
                                {user.role || "Attendee"}
                            </small>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        style={{
                            border: "1px solid #6c3038",
                            background: darkMode ? "#32171c" : "#fff0f1",
                            color: darkMode ? "#ff9ca5" : "#c12d42",
                            padding: "10px 14px",
                            borderRadius: 10,
                            cursor: "pointer",
                            fontSize: 11,
                            fontWeight: 700,
                        }}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* HERO */}
            <section
                className="es-hero"
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    alignItems: "center",
                    gap: 55,
                    padding: "75px 7%",
                    background: darkMode
                        ? "radial-gradient(ellipse at 80% 20%, #102b47 0%, #05080d 55%)"
                        : "radial-gradient(ellipse at 80% 20%, #d9ebff 0%, #f3f6fa 55%)",
                }}
            >
                <div className="es-animate">
                    <span style={eyebrow}>✦ EVENTSPHERE WORKSPACE</span>

                    <h1
                        className="es-hero-title"
                        style={{
                            fontSize: 62,
                            lineHeight: 1.05,
                            letterSpacing: -2.5,
                            margin: "22px 0",
                            fontWeight: 800,
                        }}
                    >
                        Welcome back,
                        <br />
                        <span style={{ color: colors.blue }}>
                            {user.name || "User"}
                        </span>
                        .
                    </h1>

                    <p style={{ maxWidth: 530, color: theme.muted, lineHeight: 1.9, fontSize: 14 }}>
                        Manage your events, registrations, exhibitors, sessions
                        and everything else from one powerful workspace.
                    </p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
                        <Link className="es-primary" to="/expos">Explore Events →</Link>
                        <Link className="es-secondary" to="/sessions">View Sessions</Link>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 28, marginTop: 42 }}>
                        {[
                            ["24+", "Active Events"],
                            ["1.2K", "Attendees"],
                            ["86+", "Exhibitors"],
                        ].map(([value, label]) => (
                            <div key={label}>
                                <strong style={{ display: "block", fontSize: 25 }}>{value}</strong>
                                <span style={{ color: theme.muted, fontSize: 11 }}>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* DASHBOARD PREVIEW */}
                <div
                    className="es-preview es-animate-delay"
                    style={{
                        padding: 12,
                        background: theme.card,
                        border: `1px solid ${theme.border}`,
                        borderRadius: 22,
                        boxShadow: "0 25px 70px rgba(0,0,0,.2)",
                        minWidth: 0,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 10,
                            padding: "12px 10px 17px",
                            borderBottom: `1px solid ${theme.border}`,
                            fontSize: 11,
                        }}
                    >
                        <strong>EventSphere Overview</strong>
                        <span style={{ color: "#4ade80" }}>● Online</span>
                    </div>

                    <div style={{ display: "flex", minHeight: 300 }}>
                        <div
                            className="es-preview-sidebar"
                            style={{
                                width: 55,
                                flexShrink: 0,
                                background: theme.bg,
                                borderRight: `1px solid ${theme.border}`,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 15,
                                padding: "16px 5px",
                            }}
                        >
                            <Logo />
                            {["▦", "🎪", "🎤", "💬", "📊"].map((icon, index) => (
                                <span
                                    key={index}
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 9,
                                        background: index === 0 ? colors.blueStrong : "transparent",
                                        display: "grid",
                                        placeItems: "center",
                                        fontSize: 14,
                                    }}
                                >
                                    {icon}
                                </span>
                            ))}
                        </div>

                        <div className="es-preview-main" style={{ flex: 1, padding: 16, minWidth: 0 }}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: 8,
                                    padding: 13,
                                    borderRadius: 12,
                                    background: theme.cardAlt,
                                }}
                            >
                                <div>
                                    <small style={{ color: theme.muted, fontSize: 9 }}>OVERVIEW</small>
                                    <h3 style={{ margin: "5px 0 0", fontSize: 16 }}>Event Dashboard</h3>
                                </div>
                                <Avatar name={user.name} />
                            </div>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                                    gap: 8,
                                    marginTop: 12,
                                }}
                            >
                                {[
                                    ["🎪", "24", "Events"],
                                    ["👥", "1.2K", "Attendees"],
                                    ["🎤", "86", "Sessions"],
                                ].map(([icon, value, label]) => (
                                    <div
                                        className="es-preview-stat"
                                        key={label}
                                        style={{
                                            background: theme.cardAlt,
                                            border: `1px solid ${theme.border}`,
                                            borderRadius: 10,
                                            padding: 10,
                                            minWidth: 0,
                                        }}
                                    >
                                        <div>{icon}</div>
                                        <strong style={{ display: "block", fontSize: 19, marginTop: 7 }}>
                                            {value}
                                        </strong>
                                        <small style={{ color: theme.muted, fontSize: 9 }}>
                                            {label}
                                        </small>
                                    </div>
                                ))}
                            </div>

                            <div
                                style={{
                                    marginTop: 12,
                                    padding: 14,
                                    borderRadius: 12,
                                    background: theme.cardAlt,
                                    border: `1px solid ${theme.border}`,
                                }}
                            >
                                <strong style={{ fontSize: 12 }}>Event Activity</strong>
                                <div
                                    style={{
                                        height: 115,
                                        display: "flex",
                                        alignItems: "end",
                                        gap: 10,
                                        marginTop: 12,
                                    }}
                                >
                                    {[35, 55, 42, 70, 58, 82, 67].map((height, index) => (
                                        <div
                                            className="es-chart-bar"
                                            key={index}
                                            style={{
                                                flex: 1,
                                                height: `${height}%`,
                                                borderRadius: "5px 5px 0 0",
                                                background: "linear-gradient(180deg, #49b2ff, #168fff)",
                                                animationDelay: `${index * 0.08}s`,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS */}
            <section
                className="es-section"
                style={{
                    padding: "35px 7%",
                    background: theme.nav,
                    borderTop: `1px solid ${theme.border}`,
                    borderBottom: `1px solid ${theme.border}`,
                }}
            >
                <div className="es-stats" style={gridStyle(4)}>
                    {stats.map((stat) => (
                        <div className="es-stat" key={stat.label}>
                            <div style={iconBox}>{stat.icon}</div>
                            <div>
                                <strong style={{ display: "block", fontSize: 23 }}>
                                    {stat.number}
                                </strong>
                                <div style={{ fontSize: 12, marginTop: 4 }}>{stat.label}</div>
                                <small style={{ color: theme.muted, fontSize: 10 }}>
                                    {stat.text}
                                </small>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* QUICK ACCESS */}
            <section className="es-section" style={{ padding: "85px 7%" }}>
                <span style={eyebrow}>QUICK ACCESS / YOUR WORKSPACE</span>

                <h2 style={sectionTitle(theme.text)}>
                    Everything you need.
                </h2>

                <p style={{ color: theme.muted, fontSize: 13, lineHeight: 1.8 }}>
                    Quickly access every EventSphere module from your dashboard.
                </p>

                <div className="es-modules" style={gridStyle(3, 18)}>
                    {modules.map((module, index) => (
                        <Link className="es-module" to={module.link} key={module.title}>
                            <div style={iconBox}>{module.icon}</div>
                            <span style={{ color: colors.blue, fontSize: 10, letterSpacing: 1 }}>
                                MODULE {String(index + 1).padStart(2, "0")}
                            </span>
                            <h3 style={{ margin: "12px 0 8px", fontSize: 20 }}>
                                {module.title}
                            </h3>
                            <p style={{ color: theme.muted, fontSize: 12, lineHeight: 1.8, margin: 0 }}>
                                {module.text}
                            </p>
                            <span style={{ display: "block", color: colors.blue, marginTop: 18, fontSize: 12, fontWeight: 700 }}>
                                Open module <span aria-hidden="true">↗</span>
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* EXPERIENCE */}
            <section
                className="es-experience es-section"
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    alignItems: "center",
                    gap: 55,
                    padding: "80px 7%",
                    background: darkMode ? "#080d13" : "#e9edf2",
                    borderTop: `1px solid ${theme.border}`,
                    borderBottom: `1px solid ${theme.border}`,
                }}
            >
                <div
                    style={{
                        minHeight: 300,
                        display: "grid",
                        placeItems: "center",
                        position: "relative",
                        background: "radial-gradient(circle, rgba(22,143,255,.15), transparent 68%)",
                    }}
                >
                    <div
                        style={{
                            width: 190,
                            height: 190,
                            borderRadius: "50%",
                            display: "grid",
                            placeItems: "center",
                            background: "linear-gradient(135deg,#168fff,#1547a3)",
                            fontSize: 45,
                            fontWeight: 900,
                            color: "#ffffff",
                            boxShadow: "0 0 60px rgba(22,143,255,.25)",
                            border: "1px solid rgba(255,255,255,.2)",
                        }}
                    >
                        ES
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            bottom: 25,
                            left: "5%",
                            padding: 14,
                            borderRadius: 12,
                            background: theme.card,
                            border: `1px solid ${theme.border}`,
                            fontSize: 12,
                        }}
                    >
                        <span style={{ color: colors.blue }}>✓</span> Easy Management
                    </div>
                </div>

                <div>
                    <span style={eyebrow}>THE EVENTSPHERE EXPERIENCE</span>
                    <h2 className="es-experience-title" style={{ fontSize: 44, lineHeight: 1.12, letterSpacing: -1.5 }}>
                        One platform.
                        <br />
                        <span style={{ color: colors.blue }}>Endless possibilities.</span>
                    </h2>

                    <p style={{ color: theme.muted, fontSize: 13, lineHeight: 1.9 }}>
                        EventSphere connects organizers, exhibitors and attendees
                        in one seamless environment. Manage every aspect of your
                        event without switching between multiple platforms.
                    </p>

                    <div style={{ display: "grid", gap: 13, marginTop: 25, fontSize: 13 }}>
                        {[
                            "Powerful event management",
                            "Seamless attendee experience",
                            "Exhibitor and booth management",
                            "Communication and collaboration",
                            "Analytics and performance insights",
                        ].map((item) => (
                            <div key={item}>
                                <span style={{ color: colors.blue, marginRight: 10 }}>✓</span>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section
                className="es-cta"
                style={{
                    margin: "75px 7%",
                    padding: "65px 25px",
                    textAlign: "center",
                    borderRadius: 24,
                    border: `1px solid ${theme.border}`,
                    background: darkMode
                        ? "linear-gradient(135deg,#10243a,#101329)"
                        : "linear-gradient(135deg,#dcecff,#e8e7ff)",
                }}
            >
                <span style={eyebrow}>READY TO EXPLORE?</span>
                <h2 style={{ fontSize: "clamp(32px, 5vw, 48px)", margin: "18px 0" }}>
                    Your event journey
                    <br />
                    <span style={{ color: colors.blue }}>starts here.</span>
                </h2>
                <p style={{ color: theme.muted, fontSize: 13, lineHeight: 1.8 }}>
                    Explore events, connect with exhibitors and discover new experiences.
                </p>
                <Link className="es-primary" to="/expos" style={{ marginTop: 15 }}>
                    Explore Events →
                </Link>
            </section>

            {/* FOOTER */}
            <footer
                className="es-footer"
                style={{
                    padding: "55px 7% 25px",
                    background: theme.nav,
                    borderTop: `1px solid ${theme.border}`,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 45,
                }}
            >
                <div style={{ maxWidth: 300 }}>
                    <Link
                        to="/"
                        style={{
                            color: theme.text,
                            fontSize: 22,
                            fontWeight: 800,
                            textDecoration: "none",
                        }}
                    >
                        Event<span style={{ color: colors.blue }}>Sphere</span>
                    </Link>
                    <p style={{ color: theme.muted, fontSize: 12, lineHeight: 1.9 }}>
                        A complete platform for modern event management and experiences.
                    </p>
                </div>

                <div className="es-footer-links" style={{ display: "flex", gap: 55 }}>
                    <FooterColumn title="Platform" links={[
                        ["Expos", "/expos"],
                        ["Sessions", "/sessions"],
                        ["Exhibitors", "/exhibitors"],
                        ["Products", "/products"],
                    ]} />

                    <FooterColumn title="Management" links={[
                        ["Analytics", "/analytics"],
                        ["Staff", "/staff"],
                        ["Booths", "/booths"],
                        ["Schedules", "/schedules"],
                    ]} />

                    <FooterColumn title="Account" links={[
                        ["Messages", "/messages"],
                        ["Notifications", "/notifications"],
                        ["Feedback", "/feedback"],
                        ["Bookmarks", "/bookmarks"],
                    ]} />
                </div>
            </footer>

            <div
                style={{
                    background: theme.nav,
                    borderTop: `1px solid ${theme.border}`,
                    textAlign: "center",
                    padding: 18,
                    color: theme.muted,
                    fontSize: 11,
                }}
            >
                © 2026 EventSphere. All rights reserved.
            </div>
        </div>
    );
}

function Logo() {
    return (
        <span
            style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                background: "linear-gradient(135deg,#168fff,#1554b5)",
                display: "inline-grid",
                placeItems: "center",
                color: "#ffffff",
                fontWeight: 900,
                fontSize: 11,
                flexShrink: 0,
                boxShadow: "0 5px 18px rgba(22,143,255,.2)",
            }}
        >
            ES
        </span>
    );
}

function Avatar({ name }) {
    return (
        <div
            style={{
                width: 35,
                height: 35,
                borderRadius: 10,
                background: "linear-gradient(135deg,#168fff,#1554b5)",
                display: "grid",
                placeItems: "center",
                color: "#ffffff",
                fontSize: 12,
                fontWeight: 800,
                flexShrink: 0,
            }}
        >
            {(name || "U").charAt(0).toUpperCase()}
        </div>
    );
}

function FooterColumn({ title, links }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <strong style={{ fontSize: 12, marginBottom: 5 }}>{title}</strong>
            {links.map(([label, path]) => (
                <Link className="es-footer-link" to={path} key={label}>
                    {label}
                </Link>
            ))}
        </div>
    );
}

function gridStyle(columns, gap = 18) {
    return {
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap,
    };
}

function sectionTitle(color) {
    return {
        color,
        fontSize: "clamp(30px, 4vw, 43px)",
        lineHeight: 1.15,
        letterSpacing: -1.5,
        margin: "16px 0 12px",
    };
}

const eyebrow = {
    display: "inline-block",
    color: colors.blue,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: 800,
};

const iconBox = {
    width: 46,
    height: 46,
    borderRadius: 13,
    display: "grid",
    placeItems: "center",
    background: "rgba(73,178,255,.1)",
    border: "1px solid rgba(73,178,255,.2)",
    fontSize: 20,
    flexShrink: 0,
};

export default Dashboard;
