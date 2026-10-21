
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function ExhibitorDetails() {
    const { id } = useParams();

    const [exhibitor, setExhibitor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("eventSphereDarkMode") !== "false"
    );

    // Sync theme with EventSphere
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

    // Load exhibitor details
    useEffect(() => {
        let cancelled = false;

        const loadExhibitor = async () => {
            setLoading(true);
            setError("");
            setExhibitor(null);

            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    `api/exhibitors/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!cancelled) {
                    const data =
                        response.data.exhibitor ||
                        response.data.data;

                    if (!data) {
                        setError("No exhibitor details were returned.");
                    } else {
                        setExhibitor(data);
                    }
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.response?.data?.message ||
                        "Failed to load exhibitor details. Please try again."
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        if (id) {
            loadExhibitor();
        } else {
            setError("Exhibitor ID is missing.");
            setLoading(false);
        }

        return () => {
            cancelled = true;
        };
    }, [id]);

    const theme = darkMode
        ? {
              background: "#05080d",
              surface: "#0c1520",
              surfaceSoft: "#101e2c",
              text: "#f5f8fb",
              muted: "#9aa7b7",
              border: "#202d3b",
              shadow: "0 20px 55px rgba(0,0,0,.24)",
          }
        : {
              background: "#f4f7fb",
              surface: "#ffffff",
              surfaceSoft: "#f1f6fc",
              text: "#101827",
              muted: "#68778a",
              border: "#dce5ef",
              shadow: "0 18px 45px rgba(15,35,60,.07)",
          };

    const status = (exhibitor?.status || "pending").toLowerCase();

    const getStatusStyle = () => {
        if (status === "approved") {
            return {
                color: darkMode ? "#78e6a0" : "#168044",
                background: darkMode
                    ? "rgba(34,197,94,.12)"
                    : "#e6f8ec",
                border: "1px solid rgba(34,197,94,.25)",
            };
        }

        if (status === "rejected") {
            return {
                color: darkMode ? "#ff9696" : "#c52d3b",
                background: darkMode
                    ? "rgba(239,68,68,.12)"
                    : "#fff0f0",
                border: "1px solid rgba(239,68,68,.25)",
            };
        }

        return {
            color: darkMode ? "#ffd17a" : "#9a690b",
            background: darkMode
                ? "rgba(245,158,11,.12)"
                : "#fff6df",
            border: "1px solid rgba(245,158,11,.25)",
        };
    };

    const headingStyle = {
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontWeight: 400,
        letterSpacing: "-0.8px",
    };

    const panelStyle = {
        background: theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: "20px",
        boxShadow: theme.shadow,
    };

    const labelStyle = {
        color: theme.muted,
        fontSize: "10px",
        fontWeight: 800,
        letterSpacing: "1.5px",
        textTransform: "uppercase",
    };

    const DetailCard = ({ icon, label, value, description }) => (
        <div
            className="detail-card"
            style={{
                ...panelStyle,
                padding: "23px",
                minWidth: 0,
            }}
        >
            <div
                style={{
                    width: "44px",
                    height: "44px",
                    display: "grid",
                    placeItems: "center",
                    borderRadius: "13px",
                    color: "#49b2ff",
                    background: "rgba(22,143,255,.12)",
                    border: "1px solid rgba(73,178,255,.18)",
                    fontSize: "20px",
                    marginBottom: "20px",
                }}
            >
                {icon}
            </div>

            <div style={labelStyle}>{label}</div>

            <div
                style={{
                    color: theme.text,
                    fontSize: "17px",
                    fontWeight: 700,
                    lineHeight: 1.6,
                    marginTop: "10px",
                    overflowWrap: "anywhere",
                }}
            >
                {value}
            </div>

            {description && (
                <p
                    style={{
                        color: theme.muted,
                        fontSize: "11px",
                        lineHeight: 1.8,
                        margin: "8px 0 0",
                    }}
                >
                    {description}
                </p>
            )}
        </div>
    );

    return (
        <div
            className="details-page"
            style={{
                minHeight: "100vh",
                padding: "30px 22px 55px",
                color: theme.text,
                background: darkMode
                    ? "radial-gradient(ellipse at 12% 0%, rgba(22,143,255,.12), transparent 35%), #05080d"
                    : "radial-gradient(ellipse at 12% 0%, rgba(22,143,255,.08), transparent 35%), #f4f7fb",
                fontFamily: "Inter, Arial, Helvetica, sans-serif",
                transition: "background .3s ease, color .3s ease",
            }}
        >
            <style>{`
                * {
                    box-sizing: border-box;
                }

                .details-page {
                    animation: detailEnter .55s ease both;
                }

                .detail-card {
                    transition: transform .25s ease, border-color .25s ease,
                                box-shadow .25s ease;
                }

                .detail-card:hover {
                    transform: translateY(-4px);
                    border-color: rgba(73,178,255,.45) !important;
                    box-shadow: 0 20px 40px rgba(22,143,255,.08) !important;
                }

                .detail-action {
                    transition: transform .2s ease, filter .2s ease;
                }

                .detail-action:hover {
                    transform: translateY(-2px);
                    filter: brightness(1.12);
                }

                @keyframes detailEnter {
                    from {
                        opacity: 0;
                        transform: translateY(14px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes detailSpin {
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 600px) {
                    .details-page {
                        padding: 20px 14px 40px !important;
                    }

                    .detail-hero-title {
                        font-size: 36px !important;
                    }

                    .detail-company-panel {
                        padding: 22px !important;
                    }

                    .detail-company-heading {
                        font-size: 29px !important;
                    }

                    .detail-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>

            <main style={{ maxWidth: "1100px", margin: "0 auto" }}>
                {/* NAVIGATION */}
                <header
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "16px",
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
                                background:
                                    "linear-gradient(135deg,#168fff,#49b2ff)",
                                color: "#fff",
                                fontWeight: 900,
                                fontSize: "20px",
                                boxShadow: "0 8px 25px rgba(22,143,255,.25)",
                            }}
                        >
                            E
                        </div>

                        <div>
                            <div
                                style={{
                                    fontSize: "16px",
                                    fontWeight: 800,
                                    letterSpacing: "-.4px",
                                }}
                            >
                                EventSphere
                            </div>
                            <div
                                style={{
                                    color: theme.muted,
                                    fontSize: "9px",
                                    letterSpacing: "1.6px",
                                    marginTop: "4px",
                                }}
                            >
                                EVENT MANAGEMENT
                            </div>
                        </div>
                    </Link>

                    <Link
                        to="/exhibitors"
                        className="detail-action"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "9px",
                            padding: "12px 16px",
                            borderRadius: "12px",
                            border: `1px solid ${theme.border}`,
                            background: theme.surface,
                            color: theme.text,
                            fontSize: "12px",
                            fontWeight: 700,
                            textDecoration: "none",
                        }}
                    >
                        <span style={{ color: "#49b2ff" }}>←</span>
                        All Exhibitors
                    </Link>
                </header>

                {/* HERO */}
                <section
                    style={{
                        position: "relative",
                        overflow: "hidden",
                        padding: "20px 0 35px",
                        marginBottom: "12px",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            width: "260px",
                            height: "260px",
                            top: "-110px",
                            right: "5%",
                            borderRadius: "50%",
                            background:
                                "radial-gradient(circle,rgba(22,143,255,.16),transparent 70%)",
                            pointerEvents: "none",
                        }}
                    />

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "9px",
                            color: "#49b2ff",
                            fontSize: "10px",
                            fontWeight: 800,
                            letterSpacing: "2.5px",
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
                        EXHIBITOR DIRECTORY
                    </div>

                    <h1
                        className="detail-hero-title"
                        style={{
                            ...headingStyle,
                            fontSize: "46px",
                            lineHeight: 1.15,
                            margin: "0 0 14px",
                        }}
                    >
                        Company{" "}
                        <span
                            style={{
                                background:
                                    "linear-gradient(100deg,#49b2ff,#168fff)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            profile.
                        </span>
                    </h1>

                    <p
                        style={{
                            color: theme.muted,
                            maxWidth: "540px",
                            fontSize: "13px",
                            lineHeight: 1.9,
                            margin: 0,
                        }}
                    >
                        Get to know the company, discover its products and
                        services, and find its event booth.
                    </p>
                </section>

                {/* LOADING */}
                {loading && (
                    <div
                        style={{
                            ...panelStyle,
                            padding: "70px 25px",
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                width: "38px",
                                height: "38px",
                                border: "3px solid rgba(73,178,255,.18)",
                                borderTopColor: "#49b2ff",
                                borderRadius: "50%",
                                margin: "0 auto 20px",
                                animation: "detailSpin .8s linear infinite",
                            }}
                        />

                        <div
                            style={{
                                fontSize: "14px",
                                fontWeight: 700,
                            }}
                        >
                            Loading company profile
                        </div>

                        <p
                            style={{
                                color: theme.muted,
                                fontSize: "12px",
                            }}
                        >
                            Please wait while we retrieve the details.
                        </p>
                    </div>
                )}

                {/* ERROR */}
                {!loading && error && (
                    <div
                        role="alert"
                        style={{
                            ...panelStyle,
                            padding: "35px 25px",
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                width: "58px",
                                height: "58px",
                                display: "grid",
                                placeItems: "center",
                                margin: "0 auto 17px",
                                borderRadius: "17px",
                                background: "rgba(239,68,68,.12)",
                                color: "#ff7777",
                                fontSize: "25px",
                            }}
                        >
                            !
                        </div>

                        <h2
                            style={{
                                ...headingStyle,
                                fontSize: "25px",
                                margin: "0 0 10px",
                            }}
                        >
                            Unable to load profile
                        </h2>

                        <p
                            style={{
                                color: theme.muted,
                                fontSize: "13px",
                                lineHeight: 1.8,
                                margin: "0 auto 22px",
                            }}
                        >
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="detail-action"
                            style={{
                                border: 0,
                                borderRadius: "11px",
                                padding: "12px 20px",
                                background:
                                    "linear-gradient(110deg,#0878e8,#49b2ff)",
                                color: "#fff",
                                fontSize: "12px",
                                fontWeight: 800,
                                cursor: "pointer",
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* COMPANY PROFILE */}
                {!loading && !error && exhibitor && (
                    <>
                        <section
                            className="detail-company-panel"
                            style={{
                                ...panelStyle,
                                position: "relative",
                                overflow: "hidden",
                                padding: "32px",
                                marginBottom: "22px",
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    height: "3px",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    background:
                                        "linear-gradient(90deg,#0878e8,#49b2ff,transparent)",
                                }}
                            />

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    flexWrap: "wrap",
                                    gap: "24px",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: "19px",
                                        flex: 1,
                                        minWidth: 0,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "76px",
                                            height: "76px",
                                            flexShrink: 0,
                                            display: "grid",
                                            placeItems: "center",
                                            borderRadius: "22px",
                                            background:
                                                "linear-gradient(135deg,rgba(22,143,255,.25),rgba(73,178,255,.07))",
                                            border: "1px solid rgba(73,178,255,.3)",
                                            color: "#49b2ff",
                                            fontSize: "35px",
                                        }}
                                    >
                                        ▦
                                    </div>

                                    <div style={{ minWidth: 0, flex: 1 }}>
                                        <div
                                            style={{
                                                ...labelStyle,
                                                color: "#49b2ff",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            COMPANY PROFILE
                                        </div>

                                        <h2
                                            className="detail-company-heading"
                                            style={{
                                                ...headingStyle,
                                                fontSize: "35px",
                                                lineHeight: 1.25,
                                                overflowWrap: "anywhere",
                                                margin: "0 0 13px",
                                            }}
                                        >
                                            {exhibitor.companyName ||
                                                "Unnamed Company"}
                                        </h2>

                                        <div
                                            style={{
                                                color: theme.muted,
                                                fontSize: "12px",
                                            }}
                                        >
                                            EventSphere Exhibitor
                                        </div>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        ...getStatusStyle(),
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        padding: "10px 14px",
                                        borderRadius: "10px",
                                        fontSize: "11px",
                                        fontWeight: 800,
                                        textTransform: "capitalize",
                                        flexShrink: 0,
                                    }}
                                >
                                    <span>●</span>
                                    {status}
                                </div>
                            </div>
                        </section>

                        {/* KEY INFORMATION */}
                        <section
                            className="detail-grid"
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(2, minmax(0, 1fr))",
                                gap: "18px",
                                marginBottom: "22px",
                            }}
                        >
                            <DetailCard
                                icon="◈"
                                label="Associated Expo"
                                value={
                                    exhibitor.expo?.title ||
                                    "Not specified"
                                }
                                description="The event this company is associated with."
                            />

                            <DetailCard
                                icon="⌖"
                                label="Booth Assignment"
                                value={
                                    exhibitor.booth?.boothNumber ||
                                    "Not assigned"
                                }
                                description="The company's booth location at the event."
                            />
                        </section>

                        {/* DESCRIPTION */}
                        <section
                            style={{
                                ...panelStyle,
                                padding: "27px",
                                marginBottom: "22px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "13px",
                                    marginBottom: "18px",
                                }}
                            >
                                <div
                                    style={{
                                        width: "42px",
                                        height: "42px",
                                        display: "grid",
                                        placeItems: "center",
                                        borderRadius: "12px",
                                        background: "rgba(22,143,255,.12)",
                                        color: "#49b2ff",
                                        fontSize: "19px",
                                    }}
                                >
                                    ◉
                                </div>

                                <div>
                                    <div style={labelStyle}>
                                        ABOUT THE COMPANY
                                    </div>
                                    <h3
                                        style={{
                                            ...headingStyle,
                                            fontSize: "23px",
                                            margin: "6px 0 0",
                                        }}
                                    >
                                        Company overview
                                    </h3>
                                </div>
                            </div>

                            <p
                                style={{
                                    color: theme.muted,
                                    fontSize: "13px",
                                    lineHeight: 2,
                                    whiteSpace: "pre-wrap",
                                    overflowWrap: "anywhere",
                                    margin: 0,
                                }}
                            >
                                {exhibitor.companyDescription ||
                                    "This company has not provided a description yet."}
                            </p>
                        </section>

                        {/* PRODUCTS AND SERVICES */}
                        <section
                            style={{
                                ...panelStyle,
                                padding: "27px",
                                marginBottom: "22px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "13px",
                                    marginBottom: "18px",
                                }}
                            >
                                <div
                                    style={{
                                        width: "42px",
                                        height: "42px",
                                        display: "grid",
                                        placeItems: "center",
                                        borderRadius: "12px",
                                        background: "rgba(22,143,255,.12)",
                                        color: "#49b2ff",
                                        fontSize: "19px",
                                    }}
                                >
                                    ✧
                                </div>

                                <div>
                                    <div style={labelStyle}>
                                        WHAT THEY OFFER
                                    </div>
                                    <h3
                                        style={{
                                            ...headingStyle,
                                            fontSize: "23px",
                                            margin: "6px 0 0",
                                        }}
                                    >
                                        Products & Services
                                    </h3>
                                </div>
                            </div>

                            <p
                                style={{
                                    color: theme.muted,
                                    fontSize: "13px",
                                    lineHeight: 2,
                                    whiteSpace: "pre-wrap",
                                    overflowWrap: "anywhere",
                                    margin: 0,
                                }}
                            >
                                {exhibitor.productsServices ||
                                    "No product or service information has been added yet."}
                            </p>
                        </section>

                        {/* DOCUMENTS */}
                        <section
                            style={{
                                ...panelStyle,
                                padding: "27px",
                                marginBottom: "25px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "13px",
                                    marginBottom: "20px",
                                }}
                            >
                                <div
                                    style={{
                                        width: "42px",
                                        height: "42px",
                                        display: "grid",
                                        placeItems: "center",
                                        borderRadius: "12px",
                                        background: "rgba(22,143,255,.12)",
                                        color: "#49b2ff",
                                        fontSize: "19px",
                                    }}
                                >
                                    ▤
                                </div>

                                <div>
                                    <div style={labelStyle}>
                                        COMPANY RESOURCES
                                    </div>
                                    <h3
                                        style={{
                                            ...headingStyle,
                                            fontSize: "23px",
                                            margin: "6px 0 0",
                                        }}
                                    >
                                        Documents
                                    </h3>
                                </div>
                            </div>

                            {Array.isArray(exhibitor.documents) &&
                            exhibitor.documents.length > 0 ? (
                                <div
                                    style={{
                                        display: "grid",
                                        gap: "10px",
                                    }}
                                >
                                    {exhibitor.documents.map(
                                        (document, index) => {
                                            const isObject =
                                                typeof document === "object" &&
                                                document !== null;

                                            const documentName = isObject
                                                ? document.name ||
                                                  document.title ||
                                                  `Document ${index + 1}`
                                                : String(document);

                                            const documentUrl = isObject
                                                ? document.url ||
                                                  document.fileUrl ||
                                                  document.path
                                                : null;

                                            return (
                                                <div
                                                    key={
                                                        document._id ||
                                                        documentUrl ||
                                                        index
                                                    }
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "space-between",
                                                        gap: "14px",
                                                        flexWrap: "wrap",
                                                        padding: "14px 16px",
                                                        borderRadius: "12px",
                                                        background:
                                                            theme.surfaceSoft,
                                                        border: `1px solid ${theme.border}`,
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: "12px",
                                                            minWidth: 0,
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                color: "#49b2ff",
                                                                fontSize: "20px",
                                                            }}
                                                        >
                                                            ▤
                                                        </span>
                                                        <span
                                                            style={{
                                                                color: theme.text,
                                                                fontSize: "12px",
                                                                overflowWrap:
                                                                    "anywhere",
                                                            }}
                                                        >
                                                            {documentName}
                                                        </span>
                                                    </div>

                                                    {documentUrl && (
                                                        <a
                                                            href={documentUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="detail-action"
                                                            style={{
                                                                color: "#49b2ff",
                                                                fontSize: "11px",
                                                                fontWeight: 800,
                                                                textDecoration:
                                                                    "none",
                                                            }}
                                                        >
                                                            Open ↗
                                                        </a>
                                                    )}
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            ) : (
                                <div
                                    style={{
                                        padding: "22px",
                                        borderRadius: "13px",
                                        background: theme.surfaceSoft,
                                        border: `1px solid ${theme.border}`,
                                        color: theme.muted,
                                        fontSize: "12px",
                                        lineHeight: 1.8,
                                    }}
                                >
                                    No documents are available for this
                                    company yet.
                                </div>
                            )}
                        </section>

                        {/* BOTTOM NAVIGATION */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "15px",
                                flexWrap: "wrap",
                                paddingTop: "10px",
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        fontWeight: 700,
                                        fontSize: "13px",
                                    }}
                                >
                                    Want to explore more companies?
                                </div>
                                <div
                                    style={{
                                        color: theme.muted,
                                        fontSize: "11px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Return to the complete exhibitor directory.
                                </div>
                            </div>

                            <Link
                                to="/exhibitors"
                                className="detail-action"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    padding: "14px 19px",
                                    borderRadius: "12px",
                                    background:
                                        "linear-gradient(110deg,#0878e8,#168fff,#49b2ff)",
                                    color: "#fff",
                                    textDecoration: "none",
                                    fontSize: "12px",
                                    fontWeight: 800,
                                    boxShadow:
                                        "0 10px 24px rgba(22,143,255,.2)",
                                }}
                            >
                                Browse Exhibitors →
                            </Link>
                        </div>
                    </>
                )}

                {/* FOOTER */}
                <footer
                    style={{
                        marginTop: "55px",
                        paddingTop: "22px",
                        borderTop: `1px solid ${theme.border}`,
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
                    <span>Discover. Connect. Create.</span>
                </footer>
            </main>
        </div>
    );
}

export default ExhibitorDetails;
