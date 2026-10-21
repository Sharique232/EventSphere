
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

function Messages() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("eventSphereDarkMode") === "true"
    );

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");
    const currentUserId = user?.id || user?._id;

    const attendeeId = "6abcb141fff4337707e336ef";
    const organizerId = "6abcbaedc04243b24a4b29d0";
    const expoId = "6abcbc9bc04243b24a4b29d2";

    const receiverId =
        currentUserId === attendeeId ? organizerId : attendeeId;

    // Theme synchronization
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

    const theme = darkMode
        ? {
              background: "#05080d",
              surface: "#0c1520",
              surfaceSoft: "#101e2c",
              text: "#f5f8fb",
              muted: "#9aa7b7",
              border: "#202d3b",
              chatArea: "#080f18",
              received: "#142232",
              input: "#080f18",
              shadow: "0 24px 65px rgba(0,0,0,.25)",
          }
        : {
              background: "#f4f7fb",
              surface: "#ffffff",
              surfaceSoft: "#f1f6fc",
              text: "#101827",
              muted: "#68778a",
              border: "#dce5ef",
              chatArea: "#f7faff",
              received: "#eaf1f9",
              input: "#ffffff",
              shadow: "0 20px 55px rgba(15,35,60,.08)",
          };

    const headingStyle = {
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontWeight: 400,
        letterSpacing: "-0.8px",
    };

    // Normalize MongoDB IDs whether populated or plain strings
    const getId = (value) => {
        if (!value) return "";
        if (typeof value === "object") {
            return String(value._id || value.id || "");
        }
        return String(value);
    };

    // Load existing messages
    useEffect(() => {
        let cancelled = false;

        const loadMessages = async () => {
            if (!currentUserId || !receiverId || !token) {
                setError("Please log in to access your messages.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response = await axios.get(
                    `api/messages/conversation/${currentUserId}/${receiverId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!cancelled) {
                    setMessages(response.data.messages || []);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.response?.data?.message ||
                        "Failed to load messages. Please try again."
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadMessages();

        return () => {
            cancelled = true;
        };
    }, [currentUserId, receiverId, token]);

    // Socket.IO real-time messages
    useEffect(() => {
        if (!currentUserId) return;

        const socket = io("");

        socket.on("connect", () => {
            socket.emit("joinRoom", currentUserId);
        });

        const handleReceiveMessage = (newMessage) => {
            const senderId = getId(newMessage.sender);
            const targetId = getId(newMessage.receiver);

            const isCurrentConversation =
                (senderId === String(currentUserId) &&
                    targetId === String(receiverId)) ||
                (senderId === String(receiverId) &&
                    targetId === String(currentUserId));

            if (!isCurrentConversation) return;

            setMessages((previous) => {
                if (
                    previous.some(
                        (item) => item._id === newMessage._id
                    )
                ) {
                    return previous;
                }

                return [...previous, newMessage];
            });
        };

        socket.on("receiveMessage", handleReceiveMessage);

        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
            socket.disconnect();
        };
    }, [currentUserId, receiverId]);

    // Auto-scroll when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [messages, loading]);

    // Send message
    const sendMessage = async (event) => {
        event.preventDefault();

        const trimmedMessage = message.trim();

        if (!trimmedMessage || sending) return;

        if (!currentUserId || !receiverId || !token) {
            setError("Sender or receiver is missing. Please log in again.");
            return;
        }

        try {
            setSending(true);
            setError("");

            const response = await axios.post(
                "api/messages",
                {
                    sender: currentUserId,
                    receiver: receiverId,
                    expo: expoId,
                    message: trimmedMessage,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const savedMessage = response.data.data;

            if (savedMessage) {
                setMessages((previous) => {
                    if (
                        previous.some(
                            (item) => item._id === savedMessage._id
                        )
                    ) {
                        return previous;
                    }

                    return [...previous, savedMessage];
                });
            }

            setMessage("");
            inputRef.current?.focus();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to send message. Please try again."
            );
        } finally {
            setSending(false);
        }
    };

    const formatTime = (date) => {
        if (!date) return "";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) return "";

        return parsedDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDay = (date) => {
        if (!date) return "";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) return "";

        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (parsedDate.toDateString() === today.toDateString()) {
            return "Today";
        }

        if (parsedDate.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        }

        return parsedDate.toLocaleDateString([], {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const statusColor = "#49b2ff";

    return (
        <div
            className="messages-page"
            style={{
                minHeight: "100vh",
                padding: "28px 22px 45px",
                color: theme.text,
                background: darkMode
                    ? "radial-gradient(ellipse at 10% 0%, rgba(22,143,255,.13), transparent 35%), #05080d"
                    : "radial-gradient(ellipse at 10% 0%, rgba(22,143,255,.08), transparent 35%), #f4f7fb",
                fontFamily: "Inter, Arial, Helvetica, sans-serif",
                transition: "background .3s ease, color .3s ease",
            }}
        >
            <style>{`
                * { box-sizing: border-box; }

                .messages-page {
                    animation: messageEnter .45s ease both;
                }

                .message-bubble {
                    animation: bubbleEnter .25s ease both;
                    transition: transform .2s ease;
                }

                .message-bubble:hover {
                    transform: translateY(-1px);
                }

                .message-input:focus {
                    outline: none;
                    border-color: #49b2ff !important;
                    box-shadow: 0 0 0 3px rgba(73,178,255,.12);
                }

                .send-message-button {
                    transition: transform .2s ease, filter .2s ease;
                }

                .send-message-button:not(:disabled):hover {
                    transform: translateY(-2px);
                    filter: brightness(1.1);
                }

                .send-message-button:disabled {
                    opacity: .55;
                    cursor: not-allowed;
                }

                .messages-scroll::-webkit-scrollbar {
                    width: 6px;
                }

                .messages-scroll::-webkit-scrollbar-thumb {
                    background: rgba(148,163,184,.3);
                    border-radius: 20px;
                }

                @keyframes messageEnter {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes bubbleEnter {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes messageSpin {
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 600px) {
                    .messages-page {
                        padding: 18px 12px 25px !important;
                    }

                    .messages-heading {
                        font-size: 35px !important;
                    }

                    .chat-panel {
                        height: calc(100dvh - 200px) !important;
                        min-height: 430px !important;
                    }

                    .chat-message-area {
                        padding: 16px 12px !important;
                    }

                    .message-bubble {
                        max-width: 88% !important;
                    }

                    .chat-send-form {
                        padding: 12px !important;
                        gap: 8px !important;
                    }

                    .chat-send-button {
                        padding: 12px 14px !important;
                    }
                }
            `}</style>

            <main style={{ maxWidth: "1100px", margin: "0 auto" }}>
                {/* HEADER */}
                <header
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "18px",
                        flexWrap: "wrap",
                        marginBottom: "30px",
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
                                width: "43px",
                                height: "43px",
                                display: "grid",
                                placeItems: "center",
                                borderRadius: "13px",
                                background: "linear-gradient(135deg,#168fff,#49b2ff)",
                                color: "#fff",
                                fontWeight: 900,
                                fontSize: "20px",
                                boxShadow: "0 8px 24px rgba(22,143,255,.25)",
                            }}
                        >
                            E
                        </div>

                        <div>
                            <div style={{ fontWeight: 800, fontSize: "16px" }}>
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
                        to="/dashboard"
                        style={{
                            textDecoration: "none",
                            color: theme.text,
                            background: theme.surface,
                            border: `1px solid ${theme.border}`,
                            borderRadius: "12px",
                            padding: "11px 16px",
                            fontSize: "12px",
                            fontWeight: 700,
                        }}
                    >
                        <span style={{ color: statusColor }}>←</span>{" "}
                        Dashboard
                    </Link>
                </header>

                {/* PAGE INTRO */}
                <section style={{ marginBottom: "25px" }}>
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "9px",
                            color: statusColor,
                            fontSize: "10px",
                            fontWeight: 800,
                            letterSpacing: "2.4px",
                            marginBottom: "15px",
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
                        EVENTSPHERE CONNECT
                    </div>

                    <h1
                        className="messages-heading"
                        style={{
                            fontFamily: 'Georgia, "Times New Roman", serif',
                            fontWeight: 400,
                            fontSize: "46px",
                            letterSpacing: "-1px",
                            lineHeight: 1.15,
                            margin: "0 0 12px",
                        }}
                    >
                        Conversations,{" "}
                        <span
                            style={{
                                background: "linear-gradient(100deg,#49b2ff,#168fff)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            connected.
                        </span>
                    </h1>

                    <p
                        style={{
                            color: theme.muted,
                            fontSize: "13px",
                            lineHeight: 1.8,
                            margin: 0,
                        }}
                    >
                        Stay connected with your EventSphere community.
                    </p>
                </section>

                {/* ERROR */}
                {error && (
                    <div
                        role="alert"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "14px 16px",
                            marginBottom: "16px",
                            borderRadius: "13px",
                            border: "1px solid rgba(239,68,68,.25)",
                            background: darkMode
                                ? "rgba(239,68,68,.10)"
                                : "#fff0f0",
                            color: darkMode ? "#ffaaaa" : "#b42332",
                            fontSize: "12px",
                            fontWeight: 600,
                        }}
                    >
                        <span>⚠</span>
                        <span>{error}</span>
                        <button
                            type="button"
                            onClick={() => setError("")}
                            aria-label="Dismiss error"
                            style={{
                                marginLeft: "auto",
                                border: 0,
                                background: "transparent",
                                color: "inherit",
                                fontSize: "18px",
                                cursor: "pointer",
                            }}
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* CHAT PANEL */}
                <section
                    className="chat-panel"
                    style={{
                        height: "min(690px, calc(100vh - 280px))",
                        minHeight: "480px",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        borderRadius: "22px",
                        background: theme.surface,
                        border: `1px solid ${theme.border}`,
                        boxShadow: theme.shadow,
                    }}
                >
                    {/* CHAT HEADER */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                            padding: "18px 22px",
                            borderBottom: `1px solid ${theme.border}`,
                            background: theme.surface,
                        }}
                    >
                        <div
                            style={{
                                position: "relative",
                                width: "48px",
                                height: "48px",
                                flexShrink: 0,
                                display: "grid",
                                placeItems: "center",
                                borderRadius: "15px",
                                background: "linear-gradient(135deg,rgba(22,143,255,.22),rgba(73,178,255,.07))",
                                border: "1px solid rgba(73,178,255,.2)",
                                color: "#49b2ff",
                                fontSize: "23px",
                            }}
                        >
                            ◈
                            <span
                                style={{
                                    position: "absolute",
                                    right: "-3px",
                                    bottom: "-3px",
                                    width: "12px",
                                    height: "12px",
                                    borderRadius: "50%",
                                    background: "#22c55e",
                                    border: `2px solid ${theme.surface}`,
                                }}
                            />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: "15px",
                                    fontWeight: 800,
                                }}
                            >
                                EventSphere Chat
                            </h2>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "7px",
                                    color: "#22c55e",
                                    fontSize: "11px",
                                    marginTop: "6px",
                                }}
                            >
                                <span>●</span>
                                Real-time messaging
                            </div>
                        </div>

                        <div
                            style={{
                                color: theme.muted,
                                fontSize: "10px",
                                padding: "8px 10px",
                                border: `1px solid ${theme.border}`,
                                borderRadius: "9px",
                            }}
                        >
                            PRIVATE CHAT
                        </div>
                    </div>

                    {/* MESSAGES */}
                    <div
                        className="messages-scroll chat-message-area"
                        style={{
                            flex: 1,
                            minHeight: 0,
                            overflowY: "auto",
                            padding: "24px",
                            background: theme.chatArea,
                        }}
                    >
                        {loading ? (
                            <div
                                style={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "14px",
                                }}
                            >
                                <div
                                    style={{
                                        width: "34px",
                                        height: "34px",
                                        borderRadius: "50%",
                                        border: "3px solid rgba(73,178,255,.18)",
                                        borderTopColor: "#49b2ff",
                                        animation: "messageSpin .8s linear infinite",
                                    }}
                                />
                                <span style={{ color: theme.muted, fontSize: "12px" }}>
                                    Loading your conversation...
                                </span>
                            </div>
                        ) : messages.length === 0 ? (
                            <div
                                style={{
                                    height: "100%",
                                    minHeight: "220px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    textAlign: "center",
                                    padding: "20px",
                                }}
                            >
                                <div
                                    style={{
                                        width: "72px",
                                        height: "72px",
                                        display: "grid",
                                        placeItems: "center",
                                        borderRadius: "23px",
                                        background: "rgba(22,143,255,.10)",
                                        border: "1px solid rgba(73,178,255,.18)",
                                        color: "#49b2ff",
                                        fontSize: "31px",
                                        marginBottom: "18px",
                                    }}
                                >
                                    ◈
                                </div>

                                <h3
                                    style={{
                                        fontFamily: 'Georgia, "Times New Roman", serif',
                                        fontSize: "24px",
                                        fontWeight: 400,
                                        margin: "0 0 10px",
                                    }}
                                >
                                    Your conversation starts here
                                </h3>

                                <p
                                    style={{
                                        color: theme.muted,
                                        fontSize: "12px",
                                        lineHeight: 1.8,
                                        margin: 0,
                                    }}
                                >
                                    Send a message to start connecting.
                                </p>
                            </div>
                        ) : (
                            messages.map((item, index) => {
                                const senderId = getId(item.sender);
                                const mine =
                                    senderId === String(currentUserId);

                                const currentDay = formatDay(item.createdAt);
                                const previousDay =
                                    index > 0
                                        ? formatDay(messages[index - 1].createdAt)
                                        : "";

                                return (
                                    <div key={item._id || `${item.createdAt}-${index}`}>
                                        {currentDay && currentDay !== previousDay && (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    margin: "8px 0 22px",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        padding: "7px 12px",
                                                        borderRadius: "999px",
                                                        background: theme.surface,
                                                        border: `1px solid ${theme.border}`,
                                                        color: theme.muted,
                                                        fontSize: "10px",
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    {currentDay}
                                                </span>
                                            </div>
                                        )}

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: mine
                                                    ? "flex-end"
                                                    : "flex-start",
                                                alignItems: "flex-end",
                                                gap: "9px",
                                                marginBottom: "15px",
                                            }}
                                        >
                                            {!mine && (
                                                <div
                                                    style={{
                                                        width: "29px",
                                                        height: "29px",
                                                        flexShrink: 0,
                                                        display: "grid",
                                                        placeItems: "center",
                                                        borderRadius: "10px",
                                                        background: "rgba(22,143,255,.14)",
                                                        color: "#49b2ff",
                                                        fontSize: "12px",
                                                        fontWeight: 800,
                                                    }}
                                                >
                                                    E
                                                </div>
                                            )}

                                            <div
                                                className="message-bubble"
                                                style={{
                                                    maxWidth: "75%",
                                                    padding: "12px 15px",
                                                    background: mine
                                                        ? "linear-gradient(125deg,#0878e8,#168fff,#319ff6)"
                                                        : theme.received,
                                                    color: mine ? "#fff" : theme.text,
                                                    border: mine
                                                        ? "1px solid rgba(73,178,255,.35)"
                                                        : `1px solid ${theme.border}`,
                                                    borderRadius: mine
                                                        ? "17px 17px 5px 17px"
                                                        : "17px 17px 17px 5px",
                                                    boxShadow: mine
                                                        ? "0 7px 18px rgba(22,143,255,.12)"
                                                        : "none",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontSize: "13px",
                                                        lineHeight: 1.7,
                                                        whiteSpace: "pre-wrap",
                                                        overflowWrap: "anywhere",
                                                    }}
                                                >
                                                    {item.message}
                                                </div>

                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "flex-end",
                                                        gap: "6px",
                                                        marginTop: "7px",
                                                        fontSize: "10px",
                                                        color: mine
                                                            ? "rgba(255,255,255,.76)"
                                                            : theme.muted,
                                                    }}
                                                >
                                                    {formatTime(item.createdAt)}
                                                    {mine && <span>✓</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* MESSAGE INPUT */}
                    <form
                        className="chat-send-form"
                        onSubmit={sendMessage}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "11px",
                            padding: "17px 19px",
                            background: theme.surface,
                            borderTop: `1px solid ${theme.border}`,
                        }}
                    >
                        <input
                            ref={inputRef}
                            className="message-input"
                            type="text"
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            placeholder="Write a message..."
                            aria-label="Write a message"
                            autoComplete="off"
                            maxLength={2000}
                            disabled={loading || !currentUserId}
                            style={{
                                flex: 1,
                                minWidth: 0,
                                padding: "14px 16px",
                                borderRadius: "12px",
                                border: `1px solid ${theme.border}`,
                                background: theme.input,
                                color: theme.text,
                                fontSize: "13px",
                                fontFamily: "inherit",
                                transition: "border .2s ease, box-shadow .2s ease",
                            }}
                        />

                        <button
                            className="send-message-button chat-send-button"
                            type="submit"
                            disabled={sending || loading || !message.trim() || !currentUserId}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "9px",
                                border: 0,
                                borderRadius: "12px",
                                padding: "14px 21px",
                                background: "linear-gradient(110deg,#0878e8,#168fff,#49b2ff)",
                                color: "#fff",
                                fontSize: "12px",
                                fontWeight: 800,
                                boxShadow: "0 8px 20px rgba(22,143,255,.18)",
                            }}
                        >
                            {sending ? "Sending..." : "Send"}
                            {!sending && <span>➤</span>}
                        </button>
                    </form>
                </section>

                <footer
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "12px",
                        marginTop: "22px",
                        color: theme.muted,
                        fontSize: "10px",
                    }}
                >
                    <span>© {new Date().getFullYear()} EventSphere</span>
                    <span>Connect. Communicate. Collaborate.</span>
                </footer>
            </main>
        </div>
    );
}

export default Messages;
