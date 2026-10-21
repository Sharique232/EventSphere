
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Exhibitors() {
    const [exhibitors, setExhibitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("eventSphereDarkMode") !== "false"
    );

    // Sync theme with Dashboard
    useEffect(() => {
        const syncTheme = () => {
            setDarkMode(
                localStorage.getItem("eventSphereDarkMode") !== "false"
            );
        };

        window.addEventListener("storage", syncTheme);
        const interval = setInterval(syncTheme, 300);

        return () => {
            window.removeEventListener("storage", syncTheme);
            clearInterval(interval);
        };
    }, []);

    // Load exhibitors
    useEffect(() => {
        const loadExhibitors = async () => {
            try {
                const token = localStorage.getItem("token");

                const expoResponse = await axios.get(
                    "api/expos",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const expos =
                    expoResponse.data.expos ||
                    expoResponse.data.data ||
                    [];

                let allExhibitors = [];

                for (const expo of expos) {
                    try {
                        const response = await axios.get(
                            `api/exhibitors/expo/${expo._id}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        const expoExhibitors =
                            response.data.exhibitors ||
                            response.data.data ||
                            [];

                        allExhibitors = [
                            ...allExhibitors,
                            ...expoExhibitors,
                        ];
                    } catch (err) {
                        console.error(
                            `Failed to load exhibitors for expo ${expo._id}`,
                            err
                        );
                    }
                }

                // Avoid duplicates if an API returns the same record twice
                const uniqueExhibitors = Array.from(
                    new Map(
                        allExhibitors.map((item) => [item._id, item])
                    ).values()
                );

                setExhibitors(uniqueExhibitors);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load exhibitors. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        loadExhibitors();
    }, []);

    const theme = darkMode
        ? {
              background: "#05080d",
              surface: "#0c1520",
              surfaceSoft: "#101e2c",
              text: "#f5f8fb",
              muted: "#9aa7b7",
              border: "#202d3b",
              glow: "rgba(22, 143, 255, 0.12)",
              shadow: "0 18px 50px rgba(0,0,0,0.22)",
          }
        : {
              background: "#f4f7fb",
              surface: "#ffffff",
              surfaceSoft: "#f1f6fc",
              text: "#101827",
              muted: "#68778a",
              border: "#dce5ef",
              glow: "rgba(22, 143, 255, 0.08)",
              shadow: "0 18px 40px rgba(15,35,60,0.07)",
          };

    const getStatusStyle = (status) => {
        const value = (status || "pending").toLowerCase();

        if (value === "approved") {
            return {
                color: darkMode ? "#78e6a0" : "#168044",
                background: darkMode
                    ? "rgba(34,197,94,0.12)"
                    : "#e6f8ec",
                border: "1px solid rgba(34,197,94,0.2)",
            };
        }

        if (value === "rejected") {
            return {
                color: darkMode ? "#ff9696" : "#c52d3b",
                background: darkMode
                    ? "rgba(239,68,68,0.12)"
                    : "#fff0f0",
                border: "1px solid rgba(239,68,68,0.2)",
            };
        }

        return {
            color: darkMode ? "#ffd17a" : "#9a690b",
            background: darkMode
                ? "rgba(245,158,11,0.12)"
                : "#fff6df",
            border: "1px solid rgba(245,158,11,0.2)",
        };
    };

    const filteredExhibitors = exhibitors.filter((exhibitor) => {
        const query = search.toLowerCase();

        const matchesSearch = [
            exhibitor.companyName,
            exhibitor.companyDescription,
            exhibitor.productsServices,
            exhibitor.expo?.title,
            exhibitor.booth?.boothNumber,
        ].some((value) =>
            String(value || "").toLowerCase().includes(query)
        );

        const status = (exhibitor.status || "pending").toLowerCase();

        const matchesFilter =
            filter === "all" || status === filter;

        return matchesSearch && matchesFilter;
    });

    const approvedCount = exhibitors.filter(
        (item) => (item.status || "").toLowerCase() === "approved"
    ).length;

    const pendingCount = exhibitors.filter(
        (item) =>
            !["approved", "rejected"].includes(
                (item.status || "").toLowerCase()
            )
    ).length;

    const rejectedCount = exhibitors.filter(
        (item) => (item.status || "").toLowerCase() === "rejected"
    ).length;

    const headingStyle = {
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontWeight: 400,
        letterSpacing: "-0.8px",
    };

    const smallLabel = {
        color: theme.muted,
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "1.2px",
        textTransform: "uppercase",
    };

    const panelStyle = {
        background: theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: "20px",
        boxShadow: theme.shadow,
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                color: theme.text,
                background: darkMode
                    ? "radial-gradient(ellipse at 12% 0%, rgba(22,143,255,0.12), transparent 35%), #05080d"
                    : "radial-gradient(ellipse at 12% 0%, rgba(22,143,255,0.09), transparent 35%), #f4f7fb",
                fontFamily: "Inter, Arial, Helvetica, sans-serif",
                padding: "32px 22px 60px",
                transition: "background 0.3s ease, color 0.3s ease",
            }}
        >
            <style>{`
                * {
                    box-sizing: border-box;
                }

                .exhibitors-page {
                    animation: expoFadeIn .6s ease both;
                }

                .exhibitor-card {
                    transition: transform .25s ease, border-color .25s ease,
                                box-shadow .25s ease;
                    animation: expoFadeIn .5s ease both;
                }

                .exhibitor-card:hover {
                    transform: translateY(-6px);
                    border-color: rgba(73,178,255,.55) !important;
                    box-shadow: 0 22px 45px rgba(22,143,255,.10) !important;
                }

                .exhibitor-link {
                    transition: transform .2s ease, filter .2s ease;
                }

                .exhibitor-link:hover {
                    transform: translateY(-2px);
                    filter: brightness(1.12);
                }

                .exhibitor-search {
                    outline: none;
                    transition: border-color .2s ease, box-shadow .2s ease;
                }

                .exhibitor-search:focus {
                    border-color: #49b2ff !important;
                    box-shadow: 0 0 0 3px rgba(73,178,255,.12);
                }

                .filter-chip {
                    cursor: pointer;
                    transition: all .2s ease;
                }

                .filter-chip:hover {
                    border-color: #49b2ff !important;
                }

                @keyframes expoFadeIn {
                    from { opacity: 0; transform: translateY(14px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes expoPulse {
                    0%, 100% { opacity: .45; }
                    50% { opacity: 1; }
                }

                @media (max-width: 600px) {
                    .exhibitors-page {
                        padding-left: 14px !important;
                        padding-right: 14px !important;
                    }

                    .exhibitors-heading {
                        font-size: 34px !important;
                    }

                    .exhibitor-stats {
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                    }

                    .exhibitor-tools {
                        align-items: stretch !important;
                    }

                    .exhibitor-search {
                        width: 100% !important;
                    }
                }
            `}</style>

            <main
                className="exhibitors-page"
                style={{ maxWidth: "1160px", margin: "0 auto" }}
            >
                {/* TOP NAV */}
                <header
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "18px",
                        flexWrap: "wrap",
                        marginBottom: "42px",
                    }}
                >
                    <Link
                        to="/dashboard"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "11px",
                            textDecoration: "none",
                            color: theme.text,
                        }}
                    >
                        <div
                            style={{
                                width: "42px",
                                height: "42px",
                                display: "grid",
                                placeItems: "center",
                                borderRadius: "13px",
                                color: "#fff",
                                fontSize: "20px",
                                fontWeight: 800,
                                background:
                                    "linear-gradient(135deg,#168fff,#49b2ff)",
                                boxShadow: "0 8px 25px rgba(22,143,255,.25)",
                            }}
                        >
                            E
                        </div>

                        <div>
                            <div
                                style={{
                                    fontWeight: 800,
                                    fontSize: "16px",
                                    letterSpacing: "-0.4px",
                                }}
                            >
                                EventSphere
                            </div>
                            <div
                                style={{
                                    color: theme.muted,
                                    fontSize: "10px",
                                    letterSpacing: "1.5px",
                                    marginTop: "3px",
                                }}
                            >
                                EVENT MANAGEMENT
                            </div>
                        </div>
                    </Link>

                    <Link
                        to="/dashboard"
                        className="exhibitor-link"
                        style={{
                            textDecoration: "none",
                            color: theme.text,
                            border: `1px solid ${theme.border}`,
                            background: theme.surface,
                            padding: "11px 16px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: 700,
                        }}
                    >
                        <span style={{ color: "#49b2ff" }}>←</span>{" "}
                        Dashboard
                    </Link>
                </header>

                {/* HERO */}
                <section
                    style={{
                        position: "relative",
                        overflow: "hidden",
                        padding: "35px 0 32px",
                        marginBottom: "28px",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            width: "230px",
                            height: "230px",
                            borderRadius: "50%",
                            right: "4%",
                            top: "-95px",
                            background:
                                "radial-gradient(circle,rgba(22,143,255,.16),transparent 70%)",
                            pointerEvents: "none",
                        }}
                    />

                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "9px",
                            color: "#49b2ff",
                            fontSize: "10px",
                            fontWeight: 800,
                            letterSpacing: "2.4px",
                            marginBottom: "18px",
                        }}
                    >
                        <span
                            style={{
                                width: "7px",
                                height: "7px",
                                borderRadius: "50%",
                                background: "#49b2ff",
                                boxShadow: "0 0 12px #168fff",
                            }}
                        />
                        THE EVENT NETWORK
                    </div>

                    <h1
                        className="exhibitors-heading"
                        style={{
                            ...headingStyle,
                            fontSize: "48px",
                            lineHeight: 1.12,
                            maxWidth: "650px",
                            margin: "0 0 16px",
                        }}
                    >
                        Meet the people
                        <br />
                        behind the{" "}
                        <span
                            style={{
                                background:
                                    "linear-gradient(100deg,#49b2ff,#168fff)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            innovation.
                        </span>
                    </h1>

                    <p
                        style={{
                            color: theme.muted,
                            maxWidth: "520px",
                            fontSize: "14px",
                            lineHeight: 1.9,
                            margin: 0,
                        }}
                    >
                        Discover companies, explore their solutions, and find
                        the exhibitors shaping your next event experience.
                    </p>
                </section>

                {/* STATS */}
                <section
                    className="exhibitor-stats"
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(4, minmax(0, 1fr))",
                        gap: "14px",
                        marginBottom: "28px",
                    }}
                >
                    {[
                        {
                            label: "Total Exhibitors",
                            value: exhibitors.length,
                            icon: "▦",
                        },
                        {
                            label: "Approved",
                            value: approvedCount,
                            icon: "✓",
                        },
                        {
                            label: "Pending",
                            value: pendingCount,
                            icon: "◷",
                        },
                        {
                            label: "Rejected",
                            value: rejectedCount,
                            icon: "×",
                        },
                    ].map((stat, index) => (
                        <div
                            key={stat.label}
                            style={{
                                ...panelStyle,
                                padding: "20px",
                                minWidth: 0,
                                animation: `expoFadeIn .45s ease ${index * 0.08}s both`,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: "8px",
                                    marginBottom: "18px",
                                }}
                            >
                                <span style={smallLabel}>
                                    {stat.label}
                                </span>
                                <span
                                    style={{
                                        display: "grid",
                                        placeItems: "center",
                                        width: "32px",
                                        height: "32px",
                                        borderRadius: "10px",
                                        color: "#49b2ff",
                                        background: theme.glow,
                                        fontSize: "17px",
                                        fontWeight: 800,
                                    }}
                                >
                                    {stat.icon}
                                </span>
                            </div>

                            <div
                                style={{
                                    fontSize: "29px",
                                    fontWeight: 800,
                                    letterSpacing: "-1px",
                                }}
                            >
                                {loading ? "—" : stat.value}
                            </div>
                        </div>
                    ))}
                </section>

                {/* SEARCH & FILTERS */}
                <section
                    style={{
                        ...panelStyle,
                        padding: "20px",
                        marginBottom: "24px",
                    }}
                >
                    <div
                        className="exhibitor-tools"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: "16px",
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    fontWeight: 800,
                                    fontSize: "15px",
                                    marginBottom: "6px",
                                }}
                            >
                                Explore exhibitors
                            </div>
                            <div
                                style={{
                                    color: theme.muted,
                                    fontSize: "12px",
                                }}
                            >
                                Search companies or filter by status.
                            </div>
                        </div>

                        <input
                            className="exhibitor-search"
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search companies, booths..."
                            aria-label="Search exhibitors"
                            style={{
                                width: "290px",
                                maxWidth: "100%",
                                padding: "13px 15px",
                                borderRadius: "12px",
                                border: `1px solid ${theme.border}`,
                                background: theme.surfaceSoft,
                                color: theme.text,
                                fontSize: "12px",
                            }}
                        />
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "9px",
                            marginTop: "20px",
                        }}
                    >
                        {[
                            ["all", "All exhibitors"],
                            ["approved", "Approved"],
                            ["pending", "Pending"],
                            ["rejected", "Rejected"],
                        ].map(([value, label]) => (
                            <button
                                key={value}
                                type="button"
                                className="filter-chip"
                                onClick={() => setFilter(value)}
                                style={{
                                    padding: "9px 13px",
                                    borderRadius: "10px",
                                    border:
                                        filter === value
                                            ? "1px solid rgba(73,178,255,.55)"
                                            : `1px solid ${theme.border}`,
                                    background:
                                        filter === value
                                            ? "rgba(22,143,255,.13)"
                                            : theme.surfaceSoft,
                                    color:
                                        filter === value
                                            ? "#49b2ff"
                                            : theme.muted,
                                    fontSize: "11px",
                                    fontWeight: 700,
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </section>

                {/* ERROR */}
                {error && (
                    <div
                        role="alert"
                        style={{
                            padding: "17px 20px",
                            marginBottom: "22px",
                            borderRadius: "14px",
                            background: darkMode
                                ? "rgba(239,68,68,.10)"
                                : "#fff0f0",
                            border: "1px solid rgba(239,68,68,.25)",
                            color: darkMode ? "#ffaaaa" : "#b42332",
                            fontSize: "13px",
                        }}
                    >
                        ⚠ {error}
                    </div>
                )}

                {/* LOADING */}
                {loading && (
                    <div
                        style={{
                            ...panelStyle,
                            textAlign: "center",
                            padding: "65px 20px",
                        }}
                    >
                        <div
                            style={{
                                fontSize: "34px",
                                marginBottom: "15px",
                                animation: "expoPulse 1.2s infinite",
                            }}
                        >
                            ◈
                        </div>
                        <div style={{ fontWeight: 700, fontSize: "14px" }}>
                            Loading exhibitors...
                        </div>
                        <p
                            style={{
                                color: theme.muted,
                                fontSize: "12px",
                            }}
                        >
                            Gathering company information from your events.
                        </p>
                    </div>
                )}

                {/* EMPTY STATE */}
                {!loading && !error && filteredExhibitors.length === 0 && (
                    <div
                        style={{
                            ...panelStyle,
                            textAlign: "center",
                            padding: "60px 22px",
                        }}
                    >
                        <div
                            style={{
                                width: "72px",
                                height: "72px",
                                display: "grid",
                                placeItems: "center",
                                margin: "0 auto 22px",
                                borderRadius: "22px",
                                background: theme.glow,
                                border: "1px solid rgba(73,178,255,.16)",
                                color: "#49b2ff",
                                fontSize: "29px",
                            }}
                        >
                            ▦
                        </div>

                        <h2
                            style={{
                                ...headingStyle,
                                fontSize: "27px",
                                margin: "0 0 12px",
                            }}
                        >
                            {exhibitors.length === 0
                                ? "No exhibitors yet"
                                : "No matching companies"}
                        </h2>

                        <p
                            style={{
                                color: theme.muted,
                                fontSize: "13px",
                                lineHeight: 1.8,
                                maxWidth: "410px",
                                margin: "0 auto 22px",
                            }}
                        >
                            {exhibitors.length === 0
                                ? "Exhibitor profiles will appear here when companies are added to your events."
                                : "Try another search term or change the status filter to discover more exhibitors."}
                        </p>

                        {(search || filter !== "all") && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setFilter("all");
                                }}
                                style={{
                                    border: 0,
                                    borderRadius: "11px",
                                    padding: "12px 17px",
                                    background:
                                        "linear-gradient(110deg,#0878e8,#49b2ff)",
                                    color: "#fff",
                                    fontSize: "12px",
                                    fontWeight: 800,
                                    cursor: "pointer",
                                }}
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                )}

                {/* EXHIBITOR GRID */}
                {!loading && !error && filteredExhibitors.length > 0 && (
                    <>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "12px",
                                flexWrap: "wrap",
                                marginBottom: "17px",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "13px",
                                    fontWeight: 700,
                                }}
                            >
                                Company directory
                            </div>

                            <div
                                style={{
                                    fontSize: "11px",
                                    color: theme.muted,
                                }}
                            >
                                Showing{" "}
                                <span
                                    style={{
                                        color: "#49b2ff",
                                        fontWeight: 800,
                                    }}
                                >
                                    {filteredExhibitors.length}
                                </span>{" "}
                                of {exhibitors.length} companies
                            </div>
                        </div>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(min(100%, 310px), 1fr))",
                                gap: "20px",
                            }}
                        >
                            {filteredExhibitors.map((exhibitor, index) => (
                                <article
                                    key={exhibitor._id}
                                    className="exhibitor-card"
                                    style={{
                                        ...panelStyle,
                                        padding: "23px",
                                        minWidth: 0,
                                        animationDelay: `${Math.min(index * 0.06, 0.4)}s`,
                                    }}
                                >
                                    {/* COMPANY HEADER */}
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: "14px",
                                            marginBottom: "19px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                flexShrink: 0,
                                                width: "54px",
                                                height: "54px",
                                                display: "grid",
                                                placeItems: "center",
                                                borderRadius: "16px",
                                                background:
                                                    "linear-gradient(135deg,rgba(22,143,255,.23),rgba(73,178,255,.08))",
                                                border: "1px solid rgba(73,178,255,.22)",
                                                color: "#49b2ff",
                                                fontSize: "25px",
                                            }}
                                        >
                                            ▦
                                        </div>

                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div
                                                style={{
                                                    ...smallLabel,
                                                    color: "#49b2ff",
                                                    marginBottom: "7px",
                                                }}
                                            >
                                                COMPANY PROFILE
                                            </div>

                                            <h2
                                                style={{
                                                    ...headingStyle,
                                                    fontSize: "23px",
                                                    lineHeight: 1.3,
                                                    margin: 0,
                                                    overflowWrap: "anywhere",
                                                }}
                                            >
                                                {exhibitor.companyName ||
                                                    "Unnamed Company"}
                                            </h2>
                                        </div>
                                    </div>

                                    {/* STATUS */}
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            gap: "10px",
                                            flexWrap: "wrap",
                                            marginBottom: "18px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                ...getStatusStyle(
                                                    exhibitor.status
                                                ),
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "7px",
                                                padding: "7px 10px",
                                                borderRadius: "8px",
                                                fontSize: "10px",
                                                fontWeight: 800,
                                                textTransform: "capitalize",
                                            }}
                                        >
                                            <span>●</span>
                                            {exhibitor.status || "Pending"}
                                        </span>

                                        <span
                                            style={{
                                                color: theme.muted,
                                                fontSize: "10px",
                                                letterSpacing: ".5px",
                                            }}
                                        >
                                            EXHIBITOR
                                        </span>
                                    </div>

                                    {/* DESCRIPTION */}
                                    <p
                                        style={{
                                            color: theme.muted,
                                            fontSize: "12px",
                                            lineHeight: 1.9,
                                            margin: "0 0 20px",
                                            minHeight: "46px",
                                            overflowWrap: "anywhere",
                                        }}
                                    >
                                        {exhibitor.companyDescription ||
                                            "This company has not added a description yet."}
                                    </p>

                                    {/* COMPANY DETAILS */}
                                    <div
                                        style={{
                                            padding: "16px",
                                            borderRadius: "14px",
                                            background: theme.surfaceSoft,
                                            border: `1px solid ${theme.border}`,
                                            marginBottom: "20px",
                                        }}
                                    >
                                        {[
                                            {
                                                icon: "✧",
                                                label: "Products / Services",
                                                value:
                                                    exhibitor.productsServices ||
                                                    "Not specified",
                                            },
                                            {
                                                icon: "⌖",
                                                label: "Booth",
                                                value:
                                                    exhibitor.booth?.boothNumber ||
                                                    "Not assigned",
                                            },
                                            {
                                                icon: "◈",
                                                label: "Expo",
                                                value:
                                                    exhibitor.expo?.title ||
                                                    "Not specified",
                                            },
                                        ].map((item, i) => (
                                            <div
                                                key={item.label}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "flex-start",
                                                    gap: "11px",
                                                    paddingBottom:
                                                        i < 2 ? "13px" : 0,
                                                    marginBottom:
                                                        i < 2 ? "13px" : 0,
                                                    borderBottom:
                                                        i < 2
                                                            ? `1px solid ${theme.border}`
                                                            : "none",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        color: "#49b2ff",
                                                        fontSize: "17px",
                                                        width: "20px",
                                                        flexShrink: 0,
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {item.icon}
                                                </span>

                                                <div
                                                    style={{
                                                        minWidth: 0,
                                                        flex: 1,
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            ...smallLabel,
                                                            fontSize: "9px",
                                                            marginBottom: "5px",
                                                            letterSpacing: ".8px",
                                                        }}
                                                    >
                                                        {item.label}
                                                    </div>

                                                    <div
                                                        style={{
                                                            color: theme.text,
                                                            fontSize: "12px",
                                                            lineHeight: 1.7,
                                                            overflowWrap: "anywhere",
                                                        }}
                                                    >
                                                        {item.value}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* VIEW DETAILS */}
                                    <Link
                                        to={`/exhibitors/${exhibitor._id}`}
                                        className="exhibitor-link"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "10px",
                                            width: "100%",
                                            padding: "13px 15px",
                                            borderRadius: "12px",
                                            background:
                                                "linear-gradient(110deg,#0878e8,#168fff,#49b2ff)",
                                            color: "#fff",
                                            textDecoration: "none",
                                            fontWeight: 800,
                                            fontSize: "12px",
                                            boxShadow:
                                                "0 9px 24px rgba(22,143,255,.18)",
                                        }}
                                    >
                                        Explore Company <span>→</span>
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </>
                )}

                {/* FOOTER */}
                <footer
                    style={{
                        borderTop: `1px solid ${theme.border}`,
                        marginTop: "55px",
                        paddingTop: "22px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "12px",
                        color: theme.muted,
                        fontSize: "11px",
                    }}
                >
                    <span>
                        © {new Date().getFullYear()} EventSphere
                    </span>
                    <span>
                        Discover. Connect. Create.
                    </span>
                </footer>
            </main>
        </div>
    );
}

export default Exhibitors;
