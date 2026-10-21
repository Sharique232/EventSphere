
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Schedules() {
    const [schedules, setSchedules] = useState([]);
    const [expos, setExpos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [search, setSearch] = useState("");

    const [darkMode, setDarkMode] = useState(
        () => localStorage.getItem("eventSphereDarkMode") === "true"
    );

    const initialForm = {
        expo: "",
        title: "",
        date: "",
        startTime: "",
        endTime: "",
        location: "",
        description: "",
    };

    const [formData, setFormData] = useState(initialForm);

    const token = localStorage.getItem("token");

    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem("user")) || {};
        } catch {
            return {};
        }
    })();

    const userRole = user?.role;
    const canManage = ["admin", "organizer"].includes(userRole);

    useEffect(() => {
        const syncTheme = (event) => {
            if (!event || event.key === "eventSphereDarkMode") {
                setDarkMode(
                    localStorage.getItem("eventSphereDarkMode") === "true"
                );
            }
        };

        window.addEventListener("storage", syncTheme);
        window.addEventListener("eventSphereThemeChange", syncTheme);

        return () => {
            window.removeEventListener("storage", syncTheme);
            window.removeEventListener("eventSphereThemeChange", syncTheme);
        };
    }, []);

    const theme = darkMode
        ? {
            background: "#040910",
            card: "#0d1928",
            text: "#f0f6ff",
            muted: "#94a6bc",
            border: "rgba(148,177,210,0.15)",
            input: "#091522",
            soft: "rgba(38,156,255,0.11)",
        }
        : {
            background: "#f3f7fc",
            card: "#ffffff",
            text: "#12243a",
            muted: "#718198",
            border: "#e0e8f2",
            input: "#f8faff",
            soft: "#edf5ff",
        };

    const loadSchedules = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:5000/api/schedules",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const data =
                response.data?.schedules ||
                response.data?.data ||
                [];

            setSchedules(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load schedules."
            );
        } finally {
            setLoading(false);
        }
    };

    const loadExpos = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/expos",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const data =
                response.data?.expos ||
                response.data?.data ||
                [];

            setExpos(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load expos:", err);
        }
    };

    useEffect(() => {
        loadSchedules();
        loadExpos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const openAddForm = () => {
        setEditingSchedule(null);
        setFormData(initialForm);
        setError("");
        setSuccess("");
        setShowForm(true);
    };

    const openEditForm = (schedule) => {
        setEditingSchedule(schedule);

        let formattedDate = "";

        if (schedule.date) {
            const date = new Date(schedule.date);

            if (!Number.isNaN(date.getTime())) {
                formattedDate = [
                    date.getFullYear(),
                    String(date.getMonth() + 1).padStart(2, "0"),
                    String(date.getDate()).padStart(2, "0"),
                ].join("-");
            }
        }

        setFormData({
            expo: schedule.expo?._id || schedule.expo || "",
            title: schedule.title || "",
            date: formattedDate,
            startTime: schedule.startTime || "",
            endTime: schedule.endTime || "",
            location: schedule.location || "",
            description: schedule.description || "",
        });

        setError("");
        setSuccess("");
        setShowForm(true);

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!canManage) {
            setError("You don't have permission to manage schedules.");
            return;
        }

        if (
            !formData.expo ||
            !formData.title.trim() ||
            !formData.date ||
            !formData.startTime ||
            !formData.endTime ||
            !formData.location.trim() ||
            !formData.description.trim()
        ) {
            setError("Please complete all required fields.");
            return;
        }

        if (formData.endTime <= formData.startTime) {
            setError("End time must be later than start time.");
            return;
        }

        const scheduleData = {
            expo: formData.expo,
            title: formData.title.trim(),
            date: formData.date,
            startTime: formData.startTime,
            endTime: formData.endTime,
            location: formData.location.trim(),
            description: formData.description.trim(),
        };

        try {
            setSaving(true);

            let response;

            if (editingSchedule) {
                response = await axios.put(
                    `http://localhost:5000/api/schedules/${editingSchedule._id}`,
                    scheduleData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
            } else {
                response = await axios.post(
                    "http://localhost:5000/api/schedules",
                    scheduleData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
            }

            setSuccess(
                response.data?.message ||
                (editingSchedule
                    ? "Schedule updated successfully."
                    : "Schedule created successfully.")
            );

            setFormData(initialForm);
            setEditingSchedule(null);
            setShowForm(false);

            await loadSchedules();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to save schedule."
            );
        } finally {
            setSaving(false);
        }
    };

    const deleteSchedule = async (id) => {
        if (!canManage) return;

        const confirmed = window.confirm(
            "Are you sure you want to delete this schedule?"
        );

        if (!confirmed) return;

        setError("");
        setSuccess("");

        try {
            await axios.delete(
                `http://localhost:5000/api/schedules/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setSchedules((prev) =>
                prev.filter((schedule) => schedule._id !== id)
            );

            setSuccess("Schedule deleted successfully.");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to delete schedule."
            );
        }
    };

    const formatDate = (value) => {
        if (!value) return "Date not set";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) return "Invalid date";

        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const filteredSchedules = schedules.filter((schedule) => {
        const query = search.toLowerCase();

        const expoName =
            schedule.expo?.title ||
            schedule.expo?.name ||
            "";

        return [
            schedule.title,
            schedule.location,
            schedule.description,
            expoName,
        ].some((value) =>
            String(value || "").toLowerCase().includes(query)
        );
    });

    return (
        <div
            className={`schedule-page ${darkMode ? "schedule-dark" : "schedule-light"}`}
            style={{
                "--page": theme.background,
                "--card": theme.card,
                "--text": theme.text,
                "--muted": theme.muted,
                "--border": theme.border,
                "--input": theme.input,
                "--soft": theme.soft,
            }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

                .schedule-page {
                    min-height: 100vh;
                    padding: 42px 5%;
                    box-sizing: border-box;
                    position: relative;
                    isolation: isolate;
                    overflow: hidden;
                    background: var(--page);
                    color: var(--text);
                    font-family: 'Inter', sans-serif;
                    transition: background .3s ease, color .3s ease;
                }

                .schedule-page *,
                .schedule-page *::before,
                .schedule-page *::after {
                    box-sizing: border-box;
                }

                .schedule-page::before,
                .schedule-page::after {
                    content: "";
                    position: fixed;
                    width: 340px;
                    height: 340px;
                    border-radius: 50%;
                    filter: blur(100px);
                    opacity: .20;
                    pointer-events: none;
                    z-index: -1;
                }

                .schedule-page::before {
                    background: #168bff;
                    top: -150px;
                    right: -100px;
                }

                .schedule-page::after {
                    background: #12c9e8;
                    bottom: -150px;
                    left: -100px;
                }

                .schedule-container {
                    max-width: 1180px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                }

                .schedule-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                    flex-wrap: wrap;
                    margin-bottom: 28px;
                    animation: scheduleIn .5s ease both;
                }

                .schedule-eyebrow {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 12px;
                    border-radius: 30px;
                    background: var(--soft);
                    color: #269cff;
                    font-size: 10px;
                    font-weight: 800;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    margin-bottom: 14px;
                }

                .schedule-eyebrow-dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #20b9e9;
                    box-shadow: 0 0 10px rgba(32,185,233,.6);
                }

                .schedule-header h1 {
                    margin: 0;
                    font-size: clamp(30px, 4vw, 40px);
                    letter-spacing: -1.5px;
                    font-weight: 800;
                }

                .schedule-subtitle {
                    margin: 10px 0 0;
                    color: var(--muted);
                    font-size: 13px;
                    line-height: 1.7;
                }

                .schedule-actions {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }

                .schedule-btn {
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 17px;
                    border-radius: 11px;
                    border: 1px solid var(--border);
                    background: var(--card);
                    color: var(--text);
                    font-family: inherit;
                    font-size: 12px;
                    font-weight: 700;
                    text-decoration: none;
                    cursor: pointer;
                    transition: transform .2s, box-shadow .2s, opacity .2s;
                }

                .schedule-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(20,90,150,.10);
                }

                .schedule-btn:disabled {
                    cursor: not-allowed;
                    opacity: .6;
                }

                .schedule-btn-primary {
                    border: none;
                    color: white;
                    background: linear-gradient(100deg, #1678ed, #16a9dc);
                    box-shadow: 0 8px 20px rgba(22,139,255,.20);
                }

                .schedule-stats {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 16px;
                    margin-bottom: 24px;
                    animation: scheduleIn .6s ease both;
                }

                .schedule-stat {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    min-width: 0;
                    padding: 20px;
                    border-radius: 17px;
                    border: 1px solid var(--border);
                    background: var(--card);
                    box-shadow: 0 8px 25px rgba(10,40,80,.035);
                }

                .schedule-stat-icon {
                    width: 46px;
                    height: 46px;
                    flex-shrink: 0;
                    display: grid;
                    place-items: center;
                    border-radius: 13px;
                    background: var(--soft);
                    font-size: 21px;
                }

                .schedule-stat-number {
                    font-size: 25px;
                    line-height: 1.2;
                    font-weight: 800;
                    letter-spacing: -.8px;
                }

                .schedule-stat-label {
                    color: var(--muted);
                    font-size: 11px;
                    margin-top: 5px;
                }

                .schedule-alert {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    padding: 14px 16px;
                    margin-bottom: 18px;
                    border-radius: 12px;
                    font-size: 12px;
                    line-height: 1.6;
                    overflow-wrap: anywhere;
                    animation: scheduleIn .25s ease both;
                }

                .schedule-alert-success {
                    background: ${darkMode ? "rgba(34,197,94,.10)" : "#edfff5"};
                    color: ${darkMode ? "#86efac" : "#147844"};
                    border: 1px solid ${darkMode ? "rgba(74,222,128,.22)" : "#c8f4d9"};
                }

                .schedule-alert-error {
                    background: ${darkMode ? "rgba(239,68,68,.10)" : "#fff1f1"};
                    color: ${darkMode ? "#ffaaaa" : "#bd3030"};
                    border: 1px solid ${darkMode ? "rgba(248,113,113,.23)" : "#ffdada"};
                }

                .schedule-form {
                    padding: 27px;
                    margin-bottom: 25px;
                    border: 1px solid var(--border);
                    border-radius: 20px;
                    background: var(--card);
                    box-shadow: 0 15px 45px rgba(10,40,80,.06);
                    animation: scheduleIn .3s ease both;
                }

                .schedule-form-heading {
                    display: flex;
                    align-items: flex-start;
                    gap: 13px;
                    margin-bottom: 22px;
                }

                .schedule-form-icon {
                    width: 44px;
                    height: 44px;
                    flex-shrink: 0;
                    display: grid;
                    place-items: center;
                    border-radius: 13px;
                    background: var(--soft);
                    font-size: 20px;
                }

                .schedule-form-heading h2 {
                    margin: 0;
                    font-size: 20px;
                    letter-spacing: -.5px;
                }

                .schedule-form-heading p {
                    margin: 7px 0 0;
                    color: var(--muted);
                    font-size: 12px;
                    line-height: 1.6;
                }

                .schedule-form-grid {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 17px;
                }

                .schedule-field {
                    min-width: 0;
                }

                .schedule-field-full {
                    grid-column: 1 / -1;
                }

                .schedule-label {
                    display: block;
                    margin-bottom: 8px;
                    font-size: 11px;
                    font-weight: 700;
                }

                .schedule-input {
                    width: 100%;
                    min-width: 0;
                    padding: 12px 13px;
                    border: 1px solid var(--border);
                    border-radius: 10px;
                    background: var(--input);
                    color: var(--text);
                    font-family: inherit;
                    font-size: 12px;
                    outline: none;
                    transition: border-color .2s, box-shadow .2s;
                }

                .schedule-input:focus {
                    border-color: #269cff;
                    box-shadow: 0 0 0 4px rgba(38,156,255,.10);
                }

                .schedule-input::placeholder {
                    color: var(--muted);
                    opacity: .8;
                }

                .schedule-textarea {
                    min-height: 105px;
                    resize: vertical;
                }

                .schedule-form-actions {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                    margin-top: 22px;
                }

                .schedule-toolbar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    flex-wrap: wrap;
                    margin: 28px 0 19px;
                }

                .schedule-toolbar h2 {
                    margin: 0;
                    font-size: 19px;
                    letter-spacing: -.5px;
                }

                .schedule-toolbar p {
                    margin: 6px 0 0;
                    color: var(--muted);
                    font-size: 11px;
                }

                .schedule-search {
                    width: min(100%, 300px);
                    padding: 12px 14px;
                    border: 1px solid var(--border);
                    border-radius: 11px;
                    background: var(--card);
                    color: var(--text);
                    font-family: inherit;
                    font-size: 12px;
                    outline: none;
                }

                .schedule-search:focus {
                    border-color: #269cff;
                    box-shadow: 0 0 0 4px rgba(38,156,255,.09);
                }

                .schedule-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 19px;
                }

                .schedule-card {
                    min-width: 0;
                    padding: 22px;
                    border: 1px solid var(--border);
                    border-radius: 18px;
                    background: var(--card);
                    box-shadow: 0 9px 28px rgba(10,40,80,.045);
                    animation: scheduleIn .5s ease both;
                    transition: transform .22s, border-color .22s, box-shadow .22s;
                }

                .schedule-card:hover {
                    transform: translateY(-4px);
                    border-color: rgba(38,156,255,.45);
                    box-shadow: 0 17px 38px rgba(10,70,130,.09);
                }

                .schedule-card-top {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                }

                .schedule-card-icon {
                    width: 47px;
                    height: 47px;
                    display: grid;
                    place-items: center;
                    border-radius: 14px;
                    background: var(--soft);
                    font-size: 22px;
                }

                .schedule-card-tag {
                    padding: 6px 9px;
                    border-radius: 7px;
                    background: var(--soft);
                    color: #269cff;
                    font-size: 9px;
                    font-weight: 800;
                    letter-spacing: .6px;
                    text-transform: uppercase;
                }

                .schedule-card h3 {
                    margin: 17px 0 0;
                    font-size: 18px;
                    line-height: 1.4;
                    letter-spacing: -.4px;
                    overflow-wrap: anywhere;
                }

                .schedule-detail-list {
                    display: grid;
                    gap: 13px;
                    margin-top: 20px;
                }

                .schedule-detail {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    color: var(--muted);
                    font-size: 11px;
                    line-height: 1.6;
                    overflow-wrap: anywhere;
                }

                .schedule-detail-icon {
                    width: 24px;
                    height: 24px;
                    flex-shrink: 0;
                    display: grid;
                    place-items: center;
                    border-radius: 7px;
                    background: var(--soft);
                    font-size: 12px;
                }

                .schedule-detail strong {
                    display: block;
                    color: var(--text);
                    font-size: 10px;
                    margin-bottom: 2px;
                }

                .schedule-description {
                    color: var(--muted);
                    font-size: 12px;
                    line-height: 1.8;
                    margin: 19px 0;
                    overflow-wrap: anywhere;
                    white-space: pre-wrap;
                }

                .schedule-expo {
                    padding: 14px 0;
                    border-top: 1px solid var(--border);
                    border-bottom: 1px solid var(--border);
                }

                .schedule-expo-label {
                    color: var(--muted);
                    font-size: 9px;
                    font-weight: 800;
                    letter-spacing: .8px;
                    text-transform: uppercase;
                }

                .schedule-expo-name {
                    margin-top: 7px;
                    font-size: 12px;
                    font-weight: 700;
                    overflow-wrap: anywhere;
                }

                .schedule-card-actions {
                    display: flex;
                    gap: 9px;
                    margin-top: 16px;
                }

                .schedule-card-actions .schedule-btn {
                    flex: 1;
                    padding: 10px 8px;
                    font-size: 11px;
                }

                .schedule-btn-edit {
                    border: none;
                    color: white;
                    background: linear-gradient(100deg, #1678ed, #16a9dc);
                }

                .schedule-btn-delete {
                    background: ${darkMode ? "rgba(239,68,68,.10)" : "#fff1f1"};
                    color: ${darkMode ? "#ffaaaa" : "#bd3030"};
                    border-color: ${darkMode ? "rgba(248,113,113,.2)" : "#ffdada"};
                }

                .schedule-empty {
                    grid-column: 1 / -1;
                    padding: 55px 24px;
                    border: 1px solid var(--border);
                    border-radius: 20px;
                    background: var(--card);
                    text-align: center;
                }

                .schedule-empty-icon {
                    width: 66px;
                    height: 66px;
                    display: grid;
                    place-items: center;
                    border-radius: 20px;
                    margin: 0 auto 17px;
                    background: var(--soft);
                    font-size: 29px;
                }

                .schedule-empty h3 {
                    margin: 0;
                    font-size: 19px;
                }

                .schedule-empty p {
                    color: var(--muted);
                    font-size: 12px;
                    line-height: 1.7;
                    margin: 9px 0 0;
                }

                .schedule-loading {
                    grid-column: 1 / -1;
                    padding: 55px 20px;
                    border: 1px solid var(--border);
                    border-radius: 18px;
                    background: var(--card);
                    text-align: center;
                    color: var(--muted);
                    font-size: 12px;
                }

                .schedule-spinner {
                    width: 32px;
                    height: 32px;
                    margin: 0 auto 15px;
                    border: 3px solid var(--border);
                    border-top-color: #269cff;
                    border-radius: 50%;
                    animation: scheduleSpin .7s linear infinite;
                }

                @keyframes scheduleIn {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes scheduleSpin {
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 1000px) {
                    .schedule-grid {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }
                }

                @media (max-width: 650px) {
                    .schedule-page {
                        padding: 27px 15px;
                    }

                    .schedule-header {
                        align-items: flex-start;
                    }

                    .schedule-actions {
                        width: 100%;
                    }

                    .schedule-actions .schedule-btn {
                        flex: 1;
                    }

                    .schedule-stats {
                        grid-template-columns: 1fr;
                        gap: 10px;
                    }

                    .schedule-stat {
                        padding: 15px;
                    }

                    .schedule-stat-icon {
                        width: 41px;
                        height: 41px;
                    }

                    .schedule-stat-number {
                        font-size: 22px;
                    }

                    .schedule-form {
                        padding: 19px;
                    }

                    .schedule-form-grid {
                        grid-template-columns: 1fr;
                    }

                    .schedule-field-full {
                        grid-column: auto;
                    }

                    .schedule-grid {
                        grid-template-columns: 1fr;
                    }

                    .schedule-toolbar {
                        align-items: stretch;
                    }

                    .schedule-search {
                        width: 100%;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .schedule-page *,
                    .schedule-page *::before,
                    .schedule-page *::after {
                        animation-duration: .01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: .01ms !important;
                    }
                }
            `}</style>

            <div className="schedule-container">
                {/* HEADER */}
                <header className="schedule-header">
                    <div>
                        <div className="schedule-eyebrow">
                            <span className="schedule-eyebrow-dot" />
                            EventSphere · Event Planning
                        </div>

                        <h1>Schedules</h1>

                        <p className="schedule-subtitle">
                            Organize event sessions, timings and locations.
                        </p>
                    </div>

                    <div className="schedule-actions">
                        {canManage && (
                            <button
                                className="schedule-btn schedule-btn-primary"
                                type="button"
                                onClick={() => {
                                    if (showForm) {
                                        setShowForm(false);
                                        setEditingSchedule(null);
                                        setError("");
                                    } else {
                                        openAddForm();
                                    }
                                }}
                            >
                                {showForm ? "✕ Cancel" : "+ Add Schedule"}
                            </button>
                        )}

                        <Link to="/dashboard" className="schedule-btn">
                            ← Dashboard
                        </Link>
                    </div>
                </header>

                {/* ALERTS */}
                {success && (
                    <div className="schedule-alert schedule-alert-success" role="status">
                        <span>✓</span>
                        <span>{success}</span>
                    </div>
                )}

                {error && (
                    <div className="schedule-alert schedule-alert-error" role="alert">
                        <span>⚠</span>
                        <span>{error}</span>
                    </div>
                )}

                {/* STATS */}
                <section className="schedule-stats">
                    <div className="schedule-stat">
                        <div className="schedule-stat-icon">📅</div>
                        <div>
                            <div className="schedule-stat-number">
                                {schedules.length}
                            </div>
                            <div className="schedule-stat-label">
                                Total Schedules
                            </div>
                        </div>
                    </div>

                    <div className="schedule-stat">
                        <div className="schedule-stat-icon">🎪</div>
                        <div>
                            <div className="schedule-stat-number">
                                {expos.length}
                            </div>
                            <div className="schedule-stat-label">
                                Available Expos
                            </div>
                        </div>
                    </div>

                    <div className="schedule-stat">
                        <div className="schedule-stat-icon">🗓️</div>
                        <div>
                            <div className="schedule-stat-number">
                                {schedules.filter((schedule) => {
                                    if (!schedule.date) return false;

                                    const date = new Date(schedule.date);
                                    if (Number.isNaN(date.getTime())) return false;

                                    const now = new Date();
                                    now.setHours(0, 0, 0, 0);
                                    date.setHours(0, 0, 0, 0);

                                    return date >= now;
                                }).length}
                            </div>
                            <div className="schedule-stat-label">
                                Upcoming Schedule Dates
                            </div>
                        </div>
                    </div>
                </section>

                {/* ADD / EDIT FORM */}
                {showForm && canManage && (
                    <section className="schedule-form">
                        <div className="schedule-form-heading">
                            <div className="schedule-form-icon">
                                {editingSchedule ? "✏️" : "＋"}
                            </div>

                            <div>
                                <h2>
                                    {editingSchedule
                                        ? "Edit Schedule"
                                        : "Create New Schedule"}
                                </h2>
                                <p>
                                    Add the event details, date and session timings.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="schedule-form-grid">
                                <div className="schedule-field schedule-field-full">
                                    <label className="schedule-label" htmlFor="schedule-expo">
                                        Select Expo *
                                    </label>

                                    <select
                                        id="schedule-expo"
                                        className="schedule-input"
                                        name="expo"
                                        value={formData.expo}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Choose an expo</option>

                                        {expos.map((expo) => (
                                            <option key={expo._id} value={expo._id}>
                                                {expo.title || expo.name || expo._id}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="schedule-field schedule-field-full">
                                    <label className="schedule-label" htmlFor="schedule-title">
                                        Schedule Title *
                                    </label>

                                    <input
                                        id="schedule-title"
                                        className="schedule-input"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Opening Ceremony"
                                        required
                                    />
                                </div>

                                <div className="schedule-field">
                                    <label className="schedule-label" htmlFor="schedule-date">
                                        Event Date *
                                    </label>

                                    <input
                                        id="schedule-date"
                                        className="schedule-input"
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="schedule-field">
                                    <label className="schedule-label" htmlFor="schedule-location">
                                        Location *
                                    </label>

                                    <input
                                        id="schedule-location"
                                        className="schedule-input"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g. Main Hall"
                                        required
                                    />
                                </div>

                                <div className="schedule-field">
                                    <label className="schedule-label" htmlFor="schedule-start">
                                        Start Time *
                                    </label>

                                    <input
                                        id="schedule-start"
                                        className="schedule-input"
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="schedule-field">
                                    <label className="schedule-label" htmlFor="schedule-end">
                                        End Time *
                                    </label>

                                    <input
                                        id="schedule-end"
                                        className="schedule-input"
                                        type="time"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="schedule-field schedule-field-full">
                                    <label className="schedule-label" htmlFor="schedule-description">
                                        Description *
                                    </label>

                                    <textarea
                                        id="schedule-description"
                                        className="schedule-input schedule-textarea"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Describe the session or event..."
                                        required
                                    />
                                </div>
                            </div>

                            <div className="schedule-form-actions">
                                <button
                                    className="schedule-btn schedule-btn-primary"
                                    type="submit"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingSchedule
                                            ? "✓ Update Schedule"
                                            : "+ Create Schedule"}
                                </button>

                                <button
                                    className="schedule-btn"
                                    type="button"
                                    disabled={saving}
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingSchedule(null);
                                        setFormData(initialForm);
                                        setError("");
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </section>
                )}

                {/* SEARCH + LIST HEADER */}
                <div className="schedule-toolbar">
                    <div>
                        <h2>All Schedules</h2>
                        <p>
                            {filteredSchedules.length}{" "}
                            {filteredSchedules.length === 1 ? "schedule" : "schedules"} found
                        </p>
                    </div>

                    <input
                        className="schedule-search"
                        type="search"
                        placeholder="⌕  Search schedules..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        aria-label="Search schedules"
                    />
                </div>

                {/* SCHEDULE CARDS */}
                <section className="schedule-grid">
                    {loading ? (
                        <div className="schedule-loading">
                            <div className="schedule-spinner" />
                            Loading schedules...
                        </div>
                    ) : filteredSchedules.length === 0 ? (
                        <div className="schedule-empty">
                            <div className="schedule-empty-icon">
                                {search ? "⌕" : "📅"}
                            </div>

                            <h3>
                                {search
                                    ? "No Matching Schedules"
                                    : "No Schedules Yet"}
                            </h3>

                            <p>
                                {search
                                    ? "Try a different search term."
                                    : canManage
                                        ? "Create your first schedule to start organizing your event."
                                        : "There are currently no schedules to display."}
                            </p>

                            {!search && canManage && (
                                <button
                                    className="schedule-btn schedule-btn-primary"
                                    style={{ marginTop: 20 }}
                                    type="button"
                                    onClick={openAddForm}
                                >
                                    + Create First Schedule
                                </button>
                            )}
                        </div>
                    ) : (
                        filteredSchedules.map((schedule, index) => (
                            <article
                                className="schedule-card"
                                key={schedule._id}
                                style={{
                                    animationDelay: `${Math.min(index * 60, 360)}ms`,
                                }}
                            >
                                <div className="schedule-card-top">
                                    <div className="schedule-card-icon">📅</div>
                                    <span className="schedule-card-tag">
                                        Event Session
                                    </span>
                                </div>

                                <h3>{schedule.title || "Untitled Schedule"}</h3>

                                <div className="schedule-detail-list">
                                    <div className="schedule-detail">
                                        <span className="schedule-detail-icon">🗓️</span>
                                        <div>
                                            <strong>Date</strong>
                                            {formatDate(schedule.date)}
                                        </div>
                                    </div>

                                    <div className="schedule-detail">
                                        <span className="schedule-detail-icon">🕒</span>
                                        <div>
                                            <strong>Time</strong>
                                            {schedule.startTime || "--:--"} –{" "}
                                            {schedule.endTime || "--:--"}
                                        </div>
                                    </div>

                                    <div className="schedule-detail">
                                        <span className="schedule-detail-icon">📍</span>
                                        <div>
                                            <strong>Location</strong>
                                            {schedule.location || "Not specified"}
                                        </div>
                                    </div>
                                </div>

                                <p className="schedule-description">
                                    {schedule.description || "No description provided."}
                                </p>

                                <div className="schedule-expo">
                                    <div className="schedule-expo-label">
                                        Associated Expo
                                    </div>
                                    <div className="schedule-expo-name">
                                        {schedule.expo?.title ||
                                            schedule.expo?.name ||
                                            (typeof schedule.expo === "string"
                                                ? "Expo details unavailable"
                                                : "Unknown Expo")}
                                    </div>
                                </div>

                                {canManage && (
                                    <div className="schedule-card-actions">
                                        <button
                                            type="button"
                                            className="schedule-btn schedule-btn-edit"
                                            onClick={() => openEditForm(schedule)}
                                        >
                                            ✏ Edit
                                        </button>

                                        <button
                                            type="button"
                                            className="schedule-btn schedule-btn-delete"
                                            onClick={() => deleteSchedule(schedule._id)}
                                        >
                                            🗑 Delete
                                        </button>
                                    </div>
                                )}
                            </article>
                        ))
                    )}
                </section>
            </div>
        </div>
    );
}

export default Schedules;
