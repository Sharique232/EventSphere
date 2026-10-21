import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Analytics() {
    const [expos, setExpos] = useState([]);
    const [selectedExpo, setSelectedExpo] = useState("");
    const [analytics, setAnalytics] = useState(null);
    const [loadingExpos, setLoadingExpos] = useState(true);
    const [loadingAnalytics, setLoadingAnalytics] = useState(false);
    const [error, setError] = useState("");
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("eventSphereDarkMode") !== "false"
    );

    const token = localStorage.getItem("token");

    useEffect(() => {
        const syncDarkMode = () => {
            setDarkMode(
                localStorage.getItem("eventSphereDarkMode") !== "false"
            );
        };

        window.addEventListener("storage", syncDarkMode);
        const interval = setInterval(syncDarkMode, 500);

        return () => {
            window.removeEventListener("storage", syncDarkMode);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        const loadExpos = async () => {
            try {
                setLoadingExpos(true);
                setError("");

                const response = await axios.get(
                    "api/expos",
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

                if (expoData.length > 0) {
                    setSelectedExpo((current) => current || expoData[0]._id);
                }
            } catch (err) {
                console.error(err);
                setError(
                    err.response?.data?.message || "Failed to load expos."
                );
            } finally {
                setLoadingExpos(false);
            }
        };

        loadExpos();
    }, [token]);

    useEffect(() => {
        const loadAnalytics = async () => {
            if (!selectedExpo) {
                setAnalytics(null);
                return;
            }

            try {
                setLoadingAnalytics(true);
                setError("");

                const response = await axios.get(
                    `api/analytics/expo/${selectedExpo}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setAnalytics(response.data.analytics);
            } catch (err) {
                console.error(err);
                setAnalytics(null);
                setError(
                    err.response?.data?.message ||
                    "Failed to load analytics."
                );
            } finally {
                setLoadingAnalytics(false);
            }
        };

        loadAnalytics();
    }, [selectedExpo, token]);

    const metrics = analytics
        ? [
              {
                  label: "Total Attendees",
                  value: analytics.totalAttendees ?? 0,
                  icon: "♙",
                  note: "People attending",
                  color: "blue",
              },
              {
                  label: "Total Exhibitors",
                  value: analytics.totalExhibitors ?? 0,
                  icon: "▦",
                  note: "Participating exhibitors",
                  color: "violet",
              },
              {
                  label: "Registrations",
                  value: analytics.totalRegistrations ?? 0,
                  icon: "▤",
                  note: "Total event sign-ups",
                  color: "cyan",
              },
              {
                  label: "Total Booths",
                  value: analytics.totalBooths ?? 0,
                  icon: "⌂",
                  note: "Available event booths",
                  color: "pink",
              },
              {
                  label: "Occupied Booths",
                  value: analytics.occupiedBooths ?? 0,
                  icon: "◈",
                  note: "Booths currently occupied",
                  color: "orange",
              },
              {
                  label: "Total Sessions",
                  value: analytics.totalSessions ?? 0,
                  icon: "▦",
                  note: "Scheduled sessions",
                  color: "green",
              },
              {
                  label: "Total Bookmarks",
                  value: analytics.totalBookmarks ?? 0,
                  icon: "◇",
                  note: "Saved event items",
                  color: "yellow",
              },
              {
                  label: "Total Feedbacks",
                  value: analytics.totalFeedbacks ?? 0,
                  icon: "✎",
                  note: "Feedback submissions",
                  color: "indigo",
              },
              {
                  label: "Average Rating",
                  value: `${analytics.averageRating ?? 0} / 5`,
                  icon: "★",
                  note: "Average attendee rating",
                  color: "gold",
              },
          ]
        : [];

    if (loadingExpos) {
        return (
            <div className={`analytics-page ${darkMode ? "dark" : "light"}`}>
                <style>{styles}</style>
                <div className="analytics-loading-screen">
                    <div className="loading-orbit">
                        <span>ES</span>
                    </div>
                    <h2>Loading analytics</h2>
                    <p>Preparing your event insights...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`analytics-page ${darkMode ? "dark" : "light"}`}>
            <style>{styles}</style>

            <header className="analytics-topbar">
                <Link to="/dashboard" className="analytics-brand">
                    <span className="brand-mark">E</span>
                    <span>
                        Event<span className="brand-blue">Sphere</span>
                    </span>
                </Link>

                <div className="topbar-right">
                    <span className="topbar-context">
                        <span className="live-dot" />
                        EVENT INTELLIGENCE
                    </span>
                    <Link to="/dashboard" className="back-dashboard">
                        <span aria-hidden="true">←</span>
                        Dashboard
                    </Link>
                </div>
            </header>

            <main className="analytics-container">
                <section className="analytics-hero">
                    <div className="hero-copy">
                        <div className="eyebrow">
                            <span className="eyebrow-line" />
                            PERFORMANCE OVERVIEW
                        </div>
                        <h1>
                            Your events.
                            <br />
                            <span>In clear focus.</span>
                        </h1>
                        <p>
                            Track engagement, registrations, and event activity
                            from one streamlined analytics workspace.
                        </p>
                    </div>

                    <div className="hero-visual" aria-hidden="true">
                        <div className="visual-ring ring-one" />
                        <div className="visual-ring ring-two" />
                        <div className="visual-core">
                            <span className="visual-chart">↗</span>
                            <span className="visual-caption">INSIGHTS</span>
                        </div>
                        <span className="float-dot dot-one" />
                        <span className="float-dot dot-two" />
                        <span className="float-dot dot-three" />
                    </div>
                </section>

                {error && (
                    <div className="analytics-alert" role="alert">
                        <span className="alert-icon">!</span>
                        <span>{error}</span>
                    </div>
                )}

                {expos.length === 0 && !error ? (
                    <section className="empty-state">
                        <div className="empty-icon">◇</div>
                        <p className="eyebrow">NOTHING TO ANALYSE YET</p>
                        <h2>No expos available</h2>
                        <p>
                            Once an expo is available, its performance
                            information will appear here.
                        </p>
                        <Link to="/dashboard" className="primary-action">
                            Return to dashboard <span>→</span>
                        </Link>
                    </section>
                ) : (
                    <>
                        <section className="expo-selector-panel">
                            <div className="selector-copy">
                                <span className="selector-icon">⌘</span>
                                <div>
                                    <h2>Analytics workspace</h2>
                                    <p>Choose an expo to explore its metrics.</p>
                                </div>
                            </div>

                            <div className="expo-select-wrap">
                                <label htmlFor="analytics-expo">CURRENT EXPO</label>
                                <select
                                    id="analytics-expo"
                                    value={selectedExpo}
                                    onChange={(e) => setSelectedExpo(e.target.value)}
                                >
                                    {expos.map((expo) => (
                                        <option key={expo._id} value={expo._id}>
                                            {expo.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </section>

                        <section className="metrics-section">
                            <div className="section-heading">
                                <div>
                                    <p className="eyebrow">LIVE SNAPSHOT</p>
                                    <h2>Performance metrics</h2>
                                </div>
                                <span className="metric-count">
                                    <span className="live-dot" />
                                    {metrics.length || 9} KEY METRICS
                                </span>
                            </div>

                            {loadingAnalytics ? (
                                <div className="metrics-loading">
                                    <div className="mini-spinner" />
                                    <strong>Updating your insights...</strong>
                                    <span>Fetching the selected expo's metrics.</span>
                                </div>
                            ) : analytics ? (
                                <div className="metrics-grid">
                                    {metrics.map((metric, index) => (
                                        <article
                                            className={`metric-card accent-${metric.color}`}
                                            key={metric.label}
                                            style={{ "--card-index": index }}
                                        >
                                            <div className="metric-card-top">
                                                <span className="metric-icon">
                                                    {metric.icon}
                                                </span>
                                                <span className="metric-index">
                                                    {String(index + 1).padStart(2, "0")}
                                                </span>
                                            </div>
                                            <p className="metric-label">{metric.label}</p>
                                            <h3 className="metric-value">{metric.value}</h3>
                                            <div className="metric-card-footer">
                                                <span className="metric-indicator" />
                                                <span>{metric.note}</span>
                                            </div>
                                            <span className="metric-card-glow" />
                                        </article>
                                    ))}
                                </div>
                            ) : (
                                <div className="metrics-loading">
                                    <div className="empty-icon small">↗</div>
                                    <strong>No analytics to display</strong>
                                    <span>Select an expo to load its performance data.</span>
                                </div>
                            )}
                        </section>

                        {analytics && !loadingAnalytics && (
                            <section className="insight-footer">
                                <div className="insight-symbol">✦</div>
                                <div>
                                    <h3>Your overview, all in one place.</h3>
                                    <p>
                                        These figures reflect the data returned
                                        for your selected expo.
                                    </p>
                                </div>
                                <span className="insight-status">
                                    <span className="live-dot" />
                                    DATA LOADED
                                </span>
                            </section>
                        )}
                    </>
                )}
            </main>

            <footer className="analytics-footer">
                <span>© 2026 EventSphere</span>
                <span>Designed for better event decisions.</span>
            </footer>
        </div>
    );
}

const styles = `
    .analytics-page {
        --bg: #060a11;
        --surface: #0d1420;
        --surface-raised: #111c2b;
        --text: #f3f7fc;
        --muted: #8795a8;
        --border: rgba(148, 163, 184, .14);
        --blue: #168fff;
        --blue-light: #49b2ff;
        min-height: 100vh;
        background:
            radial-gradient(ellipse at 12% 15%, rgba(22,143,255,.09), transparent 32%),
            radial-gradient(ellipse at 88% 35%, rgba(73,178,255,.055), transparent 30%),
            var(--bg);
        color: var(--text);
        font-family: Inter, Poppins, Arial, sans-serif;
        position: relative;
        overflow: hidden;
        transition: background .3s ease, color .3s ease;
    }

    .analytics-page.light {
        --bg: #f3f7fc;
        --surface: #ffffff;
        --surface-raised: #f8fbff;
        --text: #101a2b;
        --muted: #64748b;
        --border: rgba(51, 65, 85, .13);
        background:
            radial-gradient(ellipse at 12% 15%, rgba(22,143,255,.08), transparent 32%),
            #f3f7fc;
    }

    .analytics-page * { box-sizing: border-box; }

    .analytics-topbar {
        height: 78px;
        padding: 0 6%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        border-bottom: 1px solid var(--border);
        background: color-mix(in srgb, var(--bg) 88%, transparent);
        backdrop-filter: blur(18px);
        position: relative;
        z-index: 2;
    }

    .analytics-brand {
        display: inline-flex;
        align-items: center;
        gap: 11px;
        color: var(--text);
        text-decoration: none;
        font-size: 21px;
        font-weight: 800;
        letter-spacing: -.8px;
    }

    .brand-mark {
        display: grid;
        place-items: center;
        width: 35px;
        height: 35px;
        border-radius: 11px;
        color: #fff;
        background: linear-gradient(135deg, #0879ef, #49b2ff);
        box-shadow: 0 7px 20px rgba(22,143,255,.25);
    }

    .brand-blue { color: var(--blue-light); }

    .topbar-right { display: flex; align-items: center; gap: 25px; }

    .topbar-context, .metric-count, .insight-status {
        display: inline-flex;
        align-items: center;
        gap: 9px;
        color: var(--muted);
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 1.2px;
    }

    .live-dot {
        display: inline-block;
        flex: 0 0 auto;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #35d99a;
        box-shadow: 0 0 12px rgba(53,217,154,.5);
    }

    .back-dashboard {
        display: inline-flex;
        align-items: center;
        gap: 9px;
        color: var(--text);
        text-decoration: none;
        font-size: 12px;
        font-weight: 700;
        padding: 11px 15px;
        border: 1px solid var(--border);
        border-radius: 10px;
        background: var(--surface);
        transition: .25s ease;
    }

    .back-dashboard:hover {
        border-color: rgba(73,178,255,.6);
        transform: translateY(-2px);
        color: var(--blue-light);
    }

    .analytics-container {
        width: min(1120px, calc(100% - 48px));
        margin: 0 auto;
        padding: 55px 0 65px;
        position: relative;
        z-index: 1;
    }

    .analytics-hero {
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-height: 255px;
        gap: 30px;
        margin-bottom: 35px;
        animation: analyticsFadeUp .65s ease both;
    }

    .hero-copy { max-width: 650px; }

    .eyebrow {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0 0 16px;
        color: var(--blue-light);
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 1.7px;
    }

    .eyebrow-line {
        width: 25px;
        height: 2px;
        border-radius: 5px;
        background: var(--blue-light);
    }

    .hero-copy h1 {
        margin: 0;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: clamp(42px, 5.3vw, 66px);
        line-height: 1.06;
        font-weight: 500;
        letter-spacing: -2px;
    }

    .hero-copy h1 span {
        color: var(--blue-light);
        font-style: italic;
    }

    .hero-copy > p {
        max-width: 510px;
        margin: 19px 0 0;
        color: var(--muted);
        font-size: 14px;
        line-height: 1.85;
    }

    .hero-visual {
        width: 210px;
        height: 210px;
        flex: 0 0 210px;
        display: grid;
        place-items: center;
        position: relative;
        margin-right: 25px;
    }

    .visual-ring {
        position: absolute;
        border: 1px solid rgba(73,178,255,.2);
        border-radius: 50%;
        animation: ringPulse 5s ease-in-out infinite;
    }

    .ring-one { inset: 8px; }
    .ring-two { inset: 28px; animation-delay: -2s; border-style: dashed; }

    .visual-core {
        width: 105px;
        height: 105px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 5px;
        border: 1px solid rgba(73,178,255,.35);
        border-radius: 29px;
        background: linear-gradient(145deg, rgba(22,143,255,.2), var(--surface));
        box-shadow: 0 0 55px rgba(22,143,255,.12), inset 0 1px rgba(255,255,255,.08);
        transform: rotate(-8deg);
    }

    .visual-chart { color: var(--blue-light); font-size: 37px; line-height: 1; }
    .visual-caption { font-size: 8px; letter-spacing: 2px; color: var(--muted); }

    .float-dot {
        position: absolute;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--blue-light);
        box-shadow: 0 0 18px var(--blue);
    }

    .dot-one { top: 22px; right: 37px; }
    .dot-two { bottom: 29px; left: 22px; width: 5px; height: 5px; }
    .dot-three { right: 12px; bottom: 65px; width: 4px; height: 4px; }

    .analytics-alert {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 15px 17px;
        margin-bottom: 24px;
        border: 1px solid rgba(248,113,113,.25);
        border-radius: 12px;
        background: rgba(127,29,29,.16);
        color: #fca5a5;
        font-size: 13px;
        animation: analyticsFadeUp .3s ease both;
    }

    .alert-icon {
        display: grid;
        place-items: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: rgba(248,113,113,.15);
        font-weight: 800;
    }

    .expo-selector-panel {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 24px;
        padding: 23px 25px;
        margin-bottom: 42px;
        border: 1px solid var(--border);
        border-radius: 17px;
        background: linear-gradient(115deg, var(--surface-raised), var(--surface));
        box-shadow: 0 16px 45px rgba(0,0,0,.08);
        animation: analyticsFadeUp .7s .08s ease both;
    }

    .selector-copy { display: flex; align-items: center; gap: 14px; }

    .selector-icon {
        display: grid;
        place-items: center;
        width: 45px;
        height: 45px;
        flex: 0 0 auto;
        border-radius: 13px;
        color: var(--blue-light);
        background: rgba(22,143,255,.12);
        border: 1px solid rgba(73,178,255,.14);
        font-size: 22px;
    }

    .selector-copy h2 { margin: 0 0 5px; font-size: 15px; font-weight: 750; }
    .selector-copy p { margin: 0; color: var(--muted); font-size: 12px; }

    .expo-select-wrap { width: min(360px, 48%); }
    .expo-select-wrap label {
        display: block;
        margin-bottom: 8px;
        color: var(--muted);
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 1.3px;
    }

    .expo-select-wrap select {
        width: 100%;
        height: 45px;
        padding: 0 13px;
        border: 1px solid var(--border);
        border-radius: 9px;
        background: var(--bg);
        color: var(--text);
        outline: none;
        font-size: 12px;
        cursor: pointer;
        transition: border-color .2s;
    }

    .expo-select-wrap select:focus { border-color: var(--blue); }
    .expo-select-wrap option { background: var(--surface); color: var(--text); }

    .section-heading {
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 18px;
        margin-bottom: 20px;
    }

    .section-heading .eyebrow { margin-bottom: 9px; font-size: 9px; }
    .section-heading h2 { margin: 0; font-size: 24px; letter-spacing: -.7px; }

    .metric-count {
        padding: 9px 12px;
        border: 1px solid var(--border);
        border-radius: 30px;
        background: var(--surface);
        font-size: 9px;
        letter-spacing: .8px;
        white-space: nowrap;
    }

    .metrics-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 17px;
    }

    .metric-card {
        --accent: #168fff;
        --accent-rgb: 22,143,255;
        min-width: 0;
        min-height: 190px;
        position: relative;
        overflow: hidden;
        padding: 21px;
        border: 1px solid var(--border);
        border-radius: 16px;
        background: linear-gradient(145deg, var(--surface-raised), var(--surface));
        box-shadow: 0 12px 30px rgba(0,0,0,.055);
        transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
        animation: analyticsFadeUp .5s ease both;
        animation-delay: calc(var(--card-index, 0) * 55ms);
    }

    .metric-card:hover {
        transform: translateY(-5px);
        border-color: rgba(var(--accent-rgb), .48);
        box-shadow: 0 18px 38px rgba(0,0,0,.13);
    }

    .accent-blue { --accent: #49b2ff; --accent-rgb: 73,178,255; }
    .accent-violet { --accent: #b69aff; --accent-rgb: 182,154,255; }
    .accent-cyan { --accent: #4edbe7; --accent-rgb: 78,219,231; }
    .accent-pink { --accent: #ff8bc2; --accent-rgb: 255,139,194; }
    .accent-orange { --accent: #ffad73; --accent-rgb: 255,173,115; }
    .accent-green { --accent: #5ce0a0; --accent-rgb: 92,224,160; }
    .accent-yellow { --accent: #e9d36f; --accent-rgb: 233,211,111; }
    .accent-indigo { --accent: #9ea8ff; --accent-rgb: 158,168,255; }
    .accent-gold { --accent: #ffd16e; --accent-rgb: 255,209,110; }

    .metric-card-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        z-index: 1;
    }

    .metric-icon {
        display: grid;
        place-items: center;
        width: 43px;
        height: 43px;
        border: 1px solid rgba(var(--accent-rgb), .18);
        border-radius: 13px;
        color: var(--accent);
        background: rgba(var(--accent-rgb), .1);
        font-size: 22px;
    }

    .metric-index {
        color: var(--muted);
        opacity: .65;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 1px;
    }

    .metric-label {
        position: relative;
        z-index: 1;
        margin: 18px 0 7px;
        color: var(--muted);
        font-size: 12px;
        font-weight: 600;
    }

    .metric-value {
        position: relative;
        z-index: 1;
        margin: 0;
        color: var(--text);
        font-size: clamp(26px, 3vw, 35px);
        font-weight: 800;
        letter-spacing: -1.1px;
        overflow-wrap: anywhere;
    }

    .metric-card-footer {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 13px;
        color: var(--muted);
        font-size: 10px;
    }

    .metric-indicator {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: var(--accent);
    }

    .metric-card-glow {
        position: absolute;
        right: -45px;
        bottom: -65px;
        width: 130px;
        height: 130px;
        border-radius: 50%;
        background: rgba(var(--accent-rgb), .075);
        filter: blur(25px);
        transition: opacity .25s;
    }

    .metric-card:hover .metric-card-glow { opacity: 1.7; }

    .metrics-loading, .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 55px 25px;
        border: 1px solid var(--border);
        border-radius: 17px;
        background: var(--surface);
        color: var(--muted);
    }

    .metrics-loading strong { margin-top: 15px; color: var(--text); font-size: 14px; }
    .metrics-loading > span { margin-top: 7px; font-size: 12px; }

    .mini-spinner {
        width: 31px;
        height: 31px;
        border: 3px solid var(--border);
        border-top-color: var(--blue-light);
        border-radius: 50%;
        animation: analyticsSpin .8s linear infinite;
    }

    .empty-state { max-width: 620px; margin: 30px auto; padding: 55px 30px; }
    .empty-icon {
        display: grid;
        place-items: center;
        width: 62px;
        height: 62px;
        border-radius: 18px;
        background: rgba(22,143,255,.12);
        border: 1px solid rgba(73,178,255,.2);
        color: var(--blue-light);
        font-size: 30px;
        margin-bottom: 20px;
    }

    .empty-icon.small { width: 45px; height: 45px; font-size: 22px; margin: 0; }
    .empty-state .eyebrow { margin-bottom: 8px; }
    .empty-state h2 { margin: 0; color: var(--text); font-size: 25px; }
    .empty-state > p:not(.eyebrow) { max-width: 370px; margin: 12px 0 23px; font-size: 13px; line-height: 1.8; }

    .primary-action {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 12px 17px;
        border-radius: 10px;
        background: linear-gradient(110deg, #0879ef, #35a7ff);
        color: white;
        text-decoration: none;
        font-size: 12px;
        font-weight: 700;
        transition: transform .2s;
    }

    .primary-action:hover { transform: translateY(-2px); }

    .insight-footer {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-top: 28px;
        padding: 19px 21px;
        border: 1px solid rgba(73,178,255,.17);
        border-radius: 14px;
        background: linear-gradient(100deg, rgba(22,143,255,.08), var(--surface));
        animation: analyticsFadeUp .45s ease both;
    }

    .insight-symbol {
        display: grid;
        place-items: center;
        flex: 0 0 auto;
        width: 39px;
        height: 39px;
        border-radius: 12px;
        color: var(--blue-light);
        background: rgba(22,143,255,.12);
        font-size: 20px;
    }

    .insight-footer h3 { margin: 0 0 5px; font-size: 13px; }
    .insight-footer p { margin: 0; color: var(--muted); font-size: 11px; line-height: 1.6; }
    .insight-status { margin-left: auto; font-size: 9px; white-space: nowrap; }

    .analytics-footer {
        display: flex;
        justify-content: space-between;
        gap: 15px;
        padding: 19px 6%;
        border-top: 1px solid var(--border);
        color: var(--muted);
        opacity: .8;
        font-size: 10px;
        position: relative;
        z-index: 1;
    }

    .analytics-loading-screen {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 25px;
        text-align: center;
    }

    .loading-orbit {
        display: grid;
        place-items: center;
        width: 76px;
        height: 76px;
        border: 2px solid rgba(73,178,255,.15);
        border-top-color: var(--blue-light);
        border-radius: 50%;
        animation: analyticsSpin 1s linear infinite;
    }

    .loading-orbit span {
        font-size: 18px;
        font-weight: 800;
        color: var(--blue-light);
        animation: analyticsSpin 1s linear infinite reverse;
    }

    .analytics-loading-screen h2 { margin: 23px 0 8px; font-size: 20px; }
    .analytics-loading-screen p { margin: 0; color: var(--muted); font-size: 13px; }

    @keyframes analyticsSpin { to { transform: rotate(360deg); } }
    @keyframes ringPulse {
        0%, 100% { transform: scale(1); opacity: .65; }
        50% { transform: scale(1.05); opacity: 1; }
    }
    @keyframes analyticsFadeUp {
        from { opacity: 0; transform: translateY(15px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 900px) {
        .analytics-container { width: min(100% - 38px, 760px); padding-top: 40px; }
        .hero-visual { width: 155px; height: 155px; flex-basis: 155px; margin-right: 0; }
        .visual-core { width: 85px; height: 85px; border-radius: 24px; }
        .visual-chart { font-size: 30px; }
        .metrics-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .analytics-hero { min-height: 215px; }
    }

    @media (max-width: 600px) {
        .analytics-topbar { height: 68px; padding: 0 18px; }
        .analytics-brand { font-size: 18px; gap: 8px; }
        .brand-mark { width: 31px; height: 31px; }
        .topbar-context { display: none; }
        .topbar-right { gap: 0; }
        .back-dashboard { padding: 10px 11px; font-size: 11px; }
        .analytics-container { width: calc(100% - 32px); padding: 35px 0 45px; }
        .analytics-hero { min-height: 0; margin-bottom: 28px; }
        .hero-visual { display: none; }
        .hero-copy h1 { font-size: clamp(39px, 11vw, 52px); letter-spacing: -1.5px; }
        .hero-copy > p { font-size: 13px; }
        .expo-selector-panel { flex-direction: column; align-items: stretch; gap: 20px; padding: 18px; margin-bottom: 32px; }
        .expo-select-wrap { width: 100%; }
        .section-heading { align-items: start; flex-direction: column; gap: 13px; }
        .section-heading h2 { font-size: 22px; }
        .metrics-grid { gap: 12px; }
        .metric-card { min-height: 174px; padding: 15px; border-radius: 13px; }
        .metric-icon { width: 37px; height: 37px; font-size: 19px; border-radius: 11px; }
        .metric-label { font-size: 11px; margin-top: 15px; }
        .metric-value { font-size: clamp(23px, 7vw, 30px); }
        .metric-card-footer { font-size: 9px; line-height: 1.4; }
        .insight-footer { align-items: flex-start; padding: 16px; gap: 11px; }
        .insight-status { display: none; }
        .analytics-footer { padding: 17px 16px; font-size: 9px; }
    }

    @media (max-width: 360px) {
        .metrics-grid { grid-template-columns: 1fr; }
        .metric-card { min-height: 160px; }
        .analytics-footer { flex-direction: column; gap: 7px; }
    }

    @media (prefers-reduced-motion: reduce) {
        .analytics-page *,
        .analytics-page *::before,
        .analytics-page *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
        }
    }
`;

export default Analytics;
