import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("eventSphereDarkMode") === "true"
    );

    useEffect(() => {
        localStorage.setItem("eventSphereDarkMode", darkMode);
    }, [darkMode]);

    const theme = darkMode ? darkTheme : lightTheme;

    return (
        <div style={{ ...styles.page, ...theme.page }}>

            {/* NAVBAR */}
            <nav style={{ ...styles.navbar, ...theme.navbar }}>

                <Link to="/" style={{ ...styles.logo, ...theme.logo }}>
                    <div style={styles.logoIcon}>ES</div>

                    <span>
                        Event<span style={styles.logoBlue}>Sphere</span>
                    </span>
                </Link>

                <div style={styles.navLinks}>
                    <a href="#home" style={{ ...styles.navLink, ...theme.text }}>
                        Home
                    </a>
                    <a href="#features" style={{ ...styles.navLink, ...theme.text }}>
                        Features
                    </a>
                    <a href="#events" style={{ ...styles.navLink, ...theme.text }}>
                        Events
                    </a>
                    <a href="#sessions" style={{ ...styles.navLink, ...theme.text }}>
                        Sessions
                    </a>
                    <a href="#about" style={{ ...styles.navLink, ...theme.text }}>
                        About
                    </a>
                </div>

                <div style={styles.navButtons}>

                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        style={{ ...styles.modeButton, ...theme.modeButton }}
                    >
                        {darkMode ? "☀️" : "🌙"}
                    </button>

                    <Link
                        to="/login"
                        style={{ ...styles.loginButton, ...theme.text }}
                    >
                        Login
                    </Link>

                    <Link to="/register" style={styles.registerButton}>
                        Get Started →
                    </Link>

                </div>

            </nav>


            {/* HERO */}
            <section
                id="home"
                style={{ ...styles.hero, ...theme.hero }}
            >

                <div style={styles.heroBackground}></div>

                <div style={styles.heroContent}>

                    <div style={styles.heroBadge}>
                        ✦ THE FUTURE OF EVENT MANAGEMENT
                    </div>

                    <h1 style={{ ...styles.heroTitle, ...theme.heading }}>
                        Create.
                        <br />

                        <span style={styles.gradientText}>
                            Connect.
                        </span>

                        <br />

                        Experience.
                    </h1>

                    <p style={{ ...styles.heroDescription, ...theme.muted }}>
                        EventSphere brings organizers, exhibitors
                        and attendees together in one powerful
                        event management platform.
                    </p>

                    <div style={styles.heroButtons}>

                        <Link to="/register" style={styles.primaryButton}>
                            Start Your Journey →
                        </Link>

                        <a
                            href="#events"
                            style={{
                                ...styles.secondaryButton,
                                ...theme.secondaryButton
                            }}
                        >
                            Explore Events
                        </a>

                    </div>

                </div>


                <div style={styles.heroVisual}>

                    <div style={styles.imageGlow}></div>

                    <div style={styles.heroImageCard}>

                        <div style={styles.heroImage}>

                            <div style={styles.imageOverlay}></div>

                            <div style={styles.eventFloatingCard}>

                                <div style={styles.liveDot}></div>

                                <div>
                                    <small style={styles.liveSmall}>
                                        LIVE EVENT
                                    </small>

                                    <strong style={styles.liveTitle}>
                                        Future Tech Expo
                                    </strong>
                                </div>

                            </div>

                        </div>

                        <div style={styles.imageBottom}>

                            <div>
                                <small style={styles.muted}>
                                    NEXT EVENT
                                </small>

                                <h3 style={theme.heading}>
                                    Technology & Innovation
                                </h3>
                            </div>

                            <div style={styles.eventDate}>
                                DEC
                                <strong>20</strong>
                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* STATS */}
            <section style={{ ...styles.statsSection, ...theme.cardBackground }}>

                <Stat value="01" text="Unified Platform" theme={theme} />
                <Stat value="∞" text="Event Possibilities" theme={theme} />
                <Stat value="24/7" text="Platform Access" theme={theme} />
                <Stat value="3+" text="User Experiences" theme={theme} />

            </section>


            {/* FEATURES */}
            <section
                id="features"
                style={{ ...styles.section, ...theme.section }}
            >

                <SectionHeading
                    label="POWERFUL FEATURES"
                    title={
                        <>
                            Everything your event
                            <br />
                            needs, in one place.
                        </>
                    }
                    text="From planning and exhibitors to sessions, registrations and communication — EventSphere keeps everything connected."
                    theme={theme}
                />

                <div style={styles.featureGrid}>

                    <Feature icon="🎪" title="Event Management"
                        text="Create and manage expos, schedules and sessions with ease."
                        theme={theme}
                    />

                    <Feature icon="🏢" title="Exhibitor Management"
                        text="Manage exhibitors, booths, products and staff from one place."
                        theme={theme}
                    />

                    <Feature icon="👥" title="Attendee Experience"
                        text="Give attendees an easy way to discover and register for events."
                        theme={theme}
                    />

                    <Feature icon="💬" title="Real-Time Messaging"
                        text="Connect organizers, exhibitors and attendees instantly."
                        theme={theme}
                    />

                    <Feature icon="🔔" title="Smart Notifications"
                        text="Keep everyone updated with important event notifications."
                        theme={theme}
                    />

                    <Feature icon="📊" title="Event Analytics"
                        text="Understand registrations, sessions, exhibitors and event performance."
                        theme={theme}
                    />

                </div>

            </section>


            {/* EVENTS */}
            <section
                id="events"
                style={{ ...styles.eventsSection, ...theme.eventsSection }}
            >

                <SectionHeading
                    label="DISCOVER"
                    title="Explore amazing events"
                    text="Discover expos, connect with exhibitors and experience unforgettable events."
                    theme={theme}
                />

                <div style={styles.eventGrid}>

                    <EventCard
                        image="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80"
                        category="TECHNOLOGY"
                        title="Future Tech Expo"
                        location="Main Convention Center"
                        date="20 December 2026"
                        theme={theme}
                    />

                    <EventCard
                        image="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80"
                        category="BUSINESS"
                        title="Global Business Summit"
                        location="Grand Conference Hall"
                        date="15 January 2027"
                        theme={theme}
                    />

                    <EventCard
                        image="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=80"
                        category="INNOVATION"
                        title="Innovation Conference"
                        location="Innovation Arena"
                        date="05 February 2027"
                        theme={theme}
                    />

                </div>

            </section>


            {/* SESSIONS */}
            <section
                id="sessions"
                style={{ ...styles.section, ...theme.section }}
            >

                <SectionHeading
                    label="UPCOMING SESSIONS"
                    title="Learn from industry leaders."
                    text="Join insightful sessions, discover new ideas and connect with people shaping the future."
                    theme={theme}
                />

                <div style={styles.sessionList}>

                    <Session
                        number="01"
                        time="11:30 AM"
                        title="Future of Artificial Intelligence"
                        speaker="Dr. Ahmed Khan"
                        theme={theme}
                    />

                    <Session
                        number="02"
                        time="02:00 PM"
                        title="Building Modern Digital Experiences"
                        speaker="Industry Expert"
                        theme={theme}
                    />

                    <Session
                        number="03"
                        time="04:30 PM"
                        title="The Future of Business Technology"
                        speaker="Technology Leader"
                        theme={theme}
                    />

                </div>

                <div style={{ textAlign: "center", marginTop: "30px" }}>
                    <Link to="/sessions" style={styles.primaryButton}>
                        View All Sessions →
                    </Link>
                </div>

            </section>


            {/* WHY */}
            <section id="about" style={styles.whySection}>

                <div style={styles.whyVisual}>

                    <div style={styles.bigCircle}>
                        ES
                    </div>

                    <div style={styles.floatingCardOne}>
                        ✓ Easy Management
                    </div>

                    <div style={styles.floatingCardTwo}>
                        ⚡ Real-Time
                    </div>

                </div>

                <div style={styles.whyContent}>

                    <span style={styles.sectionLabel}>
                        WHY EVENTSPHERE
                    </span>

                    <h2 style={styles.whyTitle}>
                        One platform.
                        <br />
                        Endless possibilities.
                    </h2>

                    <p style={styles.whyText}>
                        EventSphere is designed to simplify every
                        part of the event experience. Whether you
                        organize events, exhibit products or attend
                        sessions, everything is connected.
                    </p>

                    <div style={styles.checkList}>
                        <div>✓ Simple event management</div>
                        <div>✓ Powerful exhibitor tools</div>
                        <div>✓ Seamless attendee experience</div>
                        <div>✓ Real-time communication</div>
                    </div>

                </div>

            </section>


            {/* CTA */}
            <section style={styles.cta}>

                <div style={styles.ctaContent}>

                    <span style={styles.ctaLabel}>
                        READY TO BEGIN?
                    </span>

                    <h2 style={styles.ctaTitle}>
                        Your next great event
                        <br />
                        starts here.
                    </h2>

                    <p style={styles.ctaText}>
                        Join EventSphere and experience a smarter
                        way to manage events.
                    </p>

                    <Link to="/register" style={styles.ctaButton}>
                        Create Your Account →
                    </Link>

                </div>

            </section>


            {/* FOOTER */}
            <footer style={styles.footer}>

                <div>

                    <Link to="/" style={styles.footerLogo}>
                        <div style={styles.logoIcon}>ES</div>

                        <span>
                            Event<span style={styles.logoBlue}>
                                Sphere
                            </span>
                        </span>
                    </Link>

                    <p style={styles.footerText}>
                        A complete platform for modern event
                        management and experiences.
                    </p>

                </div>

                <div style={styles.footerLinks}>

                    <div style={styles.footerColumn}>
                        <strong>Platform</strong>
                        <Link to="/expos">Expos</Link>
                        <Link to="/sessions">Sessions</Link>
                        <Link to="/exhibitors">Exhibitors</Link>
                    </div>

                    <div style={styles.footerColumn}>
                        <strong>Account</strong>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </div>

                </div>

            </footer>

            <div style={styles.copyright}>
                © 2026 EventSphere. All rights reserved.
            </div>

        </div>
    );
}


/* COMPONENTS */

function Stat({ value, text, theme }) {
    return (
        <div style={{ ...styles.statBox, ...theme.border }}>
            <strong style={theme.heading}>{value}</strong>
            <span style={theme.muted}>{text}</span>
        </div>
    );
}


function SectionHeading({ label, title, text, theme }) {
    return (
        <div style={styles.sectionHeading}>

            <span style={styles.sectionLabel}>
                {label}
            </span>

            <h2 style={{ ...styles.sectionHeadingTitle, ...theme.heading }}>
                {title}
            </h2>

            <p style={{ ...styles.sectionHeadingText, ...theme.muted }}>
                {text}
            </p>

        </div>
    );
}


function Feature({ icon, title, text, theme }) {
    return (
        <div style={{ ...styles.featureCard, ...theme.card }}>

            <div style={styles.featureIcon}>
                {icon}
            </div>

            <h3 style={{ ...styles.featureTitle, ...theme.heading }}>
                {title}
            </h3>

            <p style={{ ...styles.featureText, ...theme.muted }}>
                {text}
            </p>

            <span style={styles.featureArrow}>
                →
            </span>

        </div>
    );
}


function EventCard({
    image,
    category,
    title,
    location,
    date,
    theme
}) {
    return (
        <div style={{ ...styles.eventCard, ...theme.card }}>

            <div
                style={{
                    ...styles.eventImage,
                    backgroundImage: `url(${image})`
                }}
            >
                <span style={styles.category}>
                    {category}
                </span>
            </div>

            <div style={styles.eventContent}>

                <h3 style={{ ...styles.eventTitle, ...theme.heading }}>
                    {title}
                </h3>

                <p style={{ ...styles.eventLocation, ...theme.muted }}>
                    📍 {location}
                </p>

                <div style={{ ...styles.eventFooter, ...theme.border }}>

                    <span style={theme.muted}>
                        📅 {date}
                    </span>

                    <span style={styles.eventArrow}>
                        →
                    </span>

                </div>

            </div>

        </div>
    );
}


function Session({
    number,
    time,
    title,
    speaker,
    theme
}) {
    return (
        <div style={{ ...styles.session, ...theme.border }}>

            <span style={styles.sessionNumber}>
                {number}
            </span>

            <div style={styles.sessionTime}>
                {time}
            </div>

            <div style={styles.sessionDetails}>

                <h3 style={{ ...styles.sessionTitle, ...theme.heading }}>
                    {title}
                </h3>

                <p style={{ ...styles.sessionSpeaker, ...theme.muted }}>
                    {speaker}
                </p>

            </div>

            <span style={styles.sessionArrow}>
                ↗
            </span>

        </div>
    );
}


/* LIGHT THEME */

const lightTheme = {

    page: {
        background: "#f8fafc",
        color: "#111827"
    },

    navbar: {
        background: "rgba(255,255,255,0.96)",
        borderBottom: "1px solid #e5e7eb"
    },

    logo: {
        color: "#111827"
    },

    text: {
        color: "#475569"
    },

    heading: {
        color: "#111827"
    },

    muted: {
        color: "#64748b"
    },

    hero: {
        background: "linear-gradient(135deg,#f8fbff 0%,#eef4ff 55%,#f5f0ff 100%)"
    },

    secondaryButton: {
        background: "white",
        color: "#334155",
        border: "1px solid #cbd5e1"
    },

    cardBackground: {
        background: "white"
    },

    section: {
        background: "#f8fafc"
    },

    eventsSection: {
        background: "linear-gradient(180deg,#f1f5ff,#f8fafc)"
    },

    card: {
        background: "white",
        border: "1px solid #e2e8f0"
    },

    border: {
        borderColor: "#e2e8f0"
    },

    modeButton: {
        background: "#f1f5f9",
        color: "#334155",
        border: "1px solid #e2e8f0"
    }
};


/* DARK THEME */

const darkTheme = {

    page: {
        background: "#070b16",
        color: "#f8fafc"
    },

    navbar: {
        background: "rgba(7,11,22,0.96)",
        borderBottom: "1px solid #1e293b"
    },

    logo: {
        color: "#f8fafc"
    },

    text: {
        color: "#cbd5e1"
    },

    heading: {
        color: "#f8fafc"
    },

    muted: {
        color: "#94a3b8"
    },

    hero: {
        background: "linear-gradient(135deg,#070b16 0%,#0d1730 55%,#170e2c 100%)"
    },

    secondaryButton: {
        background: "#111827",
        color: "#e2e8f0",
        border: "1px solid #334155"
    },

    cardBackground: {
        background: "#0b1120"
    },

    section: {
        background: "#070b16"
    },

    eventsSection: {
        background: "linear-gradient(180deg,#0d1426,#070b16)"
    },

    card: {
        background: "#0d1424",
        border: "1px solid #1e293b"
    },

    border: {
        borderColor: "#1e293b"
    },

    modeButton: {
        background: "#1e293b",
        color: "#f8fafc",
        border: "1px solid #334155"
    }
};


/* STYLES */

const styles = {

    page: {
        minHeight: "100vh",
        fontFamily: "'Inter','Segoe UI',Arial,sans-serif",
        transition: "background 0.3s,color 0.3s"
    },

    navbar: {
        height: "76px",
        padding: "0 7%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backdropFilter: "blur(15px)",
        position: "sticky",
        top: 0,
        zIndex: 100
    },

    logo: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "21px",
        fontWeight: "800",
        textDecoration: "none"
    },

    logoIcon: {
        width: "38px",
        height: "38px",
        borderRadius: "11px",
        background: "linear-gradient(135deg,#2563eb,#7c3aed)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "11px",
        fontWeight: "800"
    },

    logoBlue: {
        color: "#2563eb"
    },

    navLinks: {
        display: "flex",
        gap: "28px"
    },

    navLink: {
        textDecoration: "none",
        fontSize: "13px",
        fontWeight: "500"
    },

    navButtons: {
        display: "flex",
        gap: "10px",
        alignItems: "center"
    },

    modeButton: {
        width: "35px",
        height: "35px",
        borderRadius: "9px",
        cursor: "pointer",
        fontSize: "15px"
    },

    loginButton: {
        textDecoration: "none",
        fontSize: "13px",
        padding: "10px 14px"
    },

    registerButton: {
        background: "linear-gradient(135deg,#2563eb,#4f46e5)",
        color: "white",
        textDecoration: "none",
        padding: "11px 17px",
        borderRadius: "9px",
        fontSize: "12px",
        fontWeight: "700"
    },

    hero: {
        minHeight: "620px",
        padding: "70px 7%",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        gap: "50px",
        position: "relative",
        overflow: "hidden"
    },

    heroBackground: {
        position: "absolute",
        width: "500px",
        height: "500px",
        borderRadius: "50%",
        right: "-150px",
        top: "-150px",
        background: "rgba(124,58,237,0.12)",
        filter: "blur(70px)"
    },

    heroContent: {
        position: "relative",
        zIndex: 2
    },

    heroBadge: {
        display: "inline-block",
        color: "#4f46e5",
        background: "#eef2ff",
        border: "1px solid #ddd6fe",
        borderRadius: "30px",
        padding: "8px 13px",
        fontSize: "9px",
        letterSpacing: "1.2px",
        fontWeight: "800",
        marginBottom: "20px"
    },

    heroTitle: {
        fontSize: "64px",
        lineHeight: "1.02",
        letterSpacing: "-3px",
        margin: 0,
        fontWeight: "850"
    },

    gradientText: {
        background: "linear-gradient(90deg,#2563eb,#7c3aed)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
    },

    heroDescription: {
        maxWidth: "570px",
        fontSize: "16px",
        lineHeight: "1.7",
        margin: "25px 0"
    },

    heroButtons: {
        display: "flex",
        gap: "12px"
    },

    primaryButton: {
        display: "inline-block",
        background: "linear-gradient(135deg,#2563eb,#4f46e5)",
        color: "white",
        textDecoration: "none",
        padding: "14px 20px",
        borderRadius: "10px",
        fontSize: "11px",
        fontWeight: "700",
        boxShadow: "0 12px 30px rgba(37,99,235,0.22)"
    },

    secondaryButton: {
        textDecoration: "none",
        padding: "13px 20px",
        borderRadius: "10px",
        fontSize: "11px",
        fontWeight: "600"
    },

    heroVisual: {
        position: "relative",
        display: "flex",
        justifyContent: "center"
    },

    imageGlow: {
        position: "absolute",
        width: "390px",
        height: "390px",
        borderRadius: "50%",
        background: "rgba(99,102,241,0.2)",
        filter: "blur(50px)"
    },

    heroImageCard: {
        width: "100%",
        maxWidth: "500px",
        background: "white",
        padding: "12px",
        borderRadius: "22px",
        boxShadow: "0 30px 80px rgba(30,41,59,0.18)",
        position: "relative",
        zIndex: 2
    },

    heroImage: {
        height: "330px",
        borderRadius: "15px",
        backgroundImage: "url(https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1000&q=85)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden"
    },

    imageOverlay: {
        position: "absolute",
        inset: 0,
        background: "linear-gradient(180deg,transparent 35%,rgba(15,23,42,0.55))"
    },

    eventFloatingCard: {
        position: "absolute",
        left: "18px",
        bottom: "18px",
        background: "rgba(255,255,255,0.94)",
        borderRadius: "11px",
        padding: "11px 14px",
        display: "flex",
        alignItems: "center",
        gap: "9px"
    },

    liveDot: {
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        background: "#22c55e"
    },

    liveSmall: {
        display: "block",
        color: "#64748b",
        fontSize: "7px"
    },

    liveTitle: {
        display: "block",
        fontSize: "11px"
    },

    imageBottom: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 5px 3px"
    },

    eventDate: {
        width: "42px",
        height: "48px",
        background: "#eff6ff",
        color: "#2563eb",
        borderRadius: "9px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "8px",
        fontWeight: "700"
    },

    statsSection: {
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        borderTop: "1px solid",
        borderBottom: "1px solid"
    },

    statBox: {
        padding: "25px",
        textAlign: "center",
        borderRight: "1px solid",
        display: "flex",
        flexDirection: "column",
        gap: "6px"
    },

    section: {
        padding: "100px 7%"
    },

    sectionHeading: {
        textAlign: "center",
        maxWidth: "650px",
        margin: "0 auto 50px"
    },

    sectionLabel: {
        color: "#4f46e5",
        fontSize: "9px",
        letterSpacing: "1.7px",
        fontWeight: "800"
    },

    sectionHeadingTitle: {
        fontSize: "40px",
        letterSpacing: "-1.5px",
        lineHeight: "1.15",
        margin: "12px 0"
    },

    sectionHeadingText: {
        lineHeight: "1.7",
        fontSize: "13px"
    },

    featureGrid: {
        maxWidth: "1150px",
        margin: "auto",
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: "18px"
    },

    featureCard: {
        borderRadius: "16px",
        padding: "25px",
        minHeight: "185px",
        position: "relative",
        boxSizing: "border-box"
    },

    featureIcon: {
        width: "45px",
        height: "45px",
        borderRadius: "12px",
        background: "#eef2ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px",
        marginBottom: "18px"
    },

    featureTitle: {
        margin: 0,
        fontSize: "15px"
    },

    featureText: {
        fontSize: "11px",
        lineHeight: "1.6",
        maxWidth: "270px"
    },

    featureArrow: {
        position: "absolute",
        right: "20px",
        bottom: "20px",
        color: "#2563eb"
    },

    eventsSection: {
        padding: "100px 7%"
    },

    eventGrid: {
        maxWidth: "1150px",
        margin: "auto",
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: "20px"
    },

    eventCard: {
        borderRadius: "17px",
        overflow: "hidden"
    },

    eventImage: {
        height: "220px",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative"
    },

    category: {
        position: "absolute",
        top: "15px",
        left: "15px",
        background: "rgba(255,255,255,0.92)",
        padding: "6px 9px",
        borderRadius: "7px",
        fontSize: "8px",
        fontWeight: "800"
    },

    eventContent: {
        padding: "18px"
    },

    eventTitle: {
        margin: "0 0 9px",
        fontSize: "16px"
    },

    eventLocation: {
        fontSize: "10px"
    },

    eventFooter: {
        display: "flex",
        justifyContent: "space-between",
        borderTop: "1px solid",
        marginTop: "14px",
        paddingTop: "13px",
        fontSize: "9px"
    },

    eventArrow: {
        color: "#2563eb"
    },

    sessionList: {
        maxWidth: "950px",
        margin: "auto",
        borderTop: "1px solid"
    },

    session: {
        display: "flex",
        alignItems: "center",
        gap: "20px",
        padding: "22px 5px",
        borderBottom: "1px solid"
    },

    sessionNumber: {
        color: "#64748b",
        fontSize: "10px"
    },

    sessionTime: {
        color: "#2563eb",
        fontSize: "10px",
        fontWeight: "700",
        width: "75px"
    },

    sessionDetails: {
        flex: 1
    },

    sessionTitle: {
        margin: 0,
        fontSize: "13px"
    },

    sessionSpeaker: {
        margin: "5px 0 0",
        fontSize: "9px"
    },

    sessionArrow: {
        color: "#2563eb"
    },

    whySection: {
        padding: "100px 7%",
        background: "#111827",
        color: "white",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        gap: "80px"
    },

    whyVisual: {
        height: "400px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },

    bigCircle: {
        width: "270px",
        height: "270px",
        borderRadius: "50%",
        background: "linear-gradient(135deg,#2563eb,#7c3aed)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "55px",
        fontWeight: "900",
        boxShadow: "0 0 90px rgba(99,102,241,0.35)"
    },

    floatingCardOne: {
        position: "absolute",
        top: "65px",
        right: "15%",
        background: "white",
        color: "#1e293b",
        padding: "12px 16px",
        borderRadius: "9px",
        fontSize: "10px"
    },

    floatingCardTwo: {
        position: "absolute",
        bottom: "65px",
        left: "15%",
        background: "linear-gradient(135deg,#2563eb,#4f46e5)",
        padding: "12px 16px",
        borderRadius: "9px",
        fontSize: "10px"
    },

    whyContent: {
        maxWidth: "520px"
    },

    whyTitle: {
        fontSize: "43px",
        lineHeight: "1.1",
        letterSpacing: "-1.5px",
        margin: "13px 0 20px"
    },

    whyText: {
        color: "#94a3b8",
        fontSize: "13px",
        lineHeight: "1.8"
    },

    checkList: {
        marginTop: "25px",
        display: "grid",
        gap: "12px",
        color: "#cbd5e1",
        fontSize: "11px"
    },

    cta: {
        margin: "80px 7%",
        padding: "75px 40px",
        borderRadius: "25px",
        textAlign: "center",
        color: "white",
        background: "linear-gradient(135deg,#2563eb,#4f46e5,#7c3aed)"
    },

    ctaContent: {
        position: "relative"
    },

    ctaLabel: {
        fontSize: "9px",
        letterSpacing: "1.7px",
        fontWeight: "800"
    },

    ctaTitle: {
        fontSize: "42px",
        lineHeight: "1.1",
        margin: "13px 0"
    },

    ctaText: {
        color: "#dbeafe",
        fontSize: "13px",
        marginBottom: "25px"
    },

    ctaButton: {
        display: "inline-block",
        background: "white",
        color: "#2563eb",
        textDecoration: "none",
        padding: "13px 20px",
        borderRadius: "9px",
        fontSize: "11px",
        fontWeight: "800"
    },

    footer: {
        padding: "60px 7%",
        background: "#0f172a",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        gap: "50px"
    },

    footerLogo: {
        display: "flex",
        alignItems: "center",
        gap: "9px",
        fontSize: "18px",
        fontWeight: "800",
        color: "white",
        textDecoration: "none"
    },

    footerText: {
        color: "#64748b",
        fontSize: "11px",
        maxWidth: "280px",
        lineHeight: "1.6"
    },

    footerLinks: {
        display: "flex",
        gap: "80px"
    },

    footerColumn: {
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },

    copyright: {
        background: "#0f172a",
        borderTop: "1px solid #1e293b",
        color: "#475569",
        textAlign: "center",
        padding: "18px",
        fontSize: "9px"
    }
};

export default Home;