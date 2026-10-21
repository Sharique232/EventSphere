const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const path = require("path");
const dns = require("node:dns");
const { Server } = require("socket.io");

// Fix DNS resolution for MongoDB Atlas
dns.setServers(["8.8.8.8"]);

// Load environment variables from backend/.env
require("dotenv").config({
    path: path.join(__dirname, ".env")
});

// Import routes
const userRoutes = require("./routes/userRoutes");
const expoRoutes = require("./routes/expoRoutes");
const boothRoutes = require("./routes/boothRoutes");
const exhibitorRoutes = require("./routes/exhibitorRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const productRoutes = require("./routes/productRoutes");
const staffRoutes = require("./routes/staffRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Reuse MongoDB connection
let mongoConnectionPromise;

function connectDB() {
    if (mongoose.connection.readyState === 1) {
        return Promise.resolve();
    }

    if (!process.env.MONGO_URI) {
        return Promise.reject(
            new Error("MONGO_URI is not configured. Check backend/.env")
        );
    }

    if (!mongoConnectionPromise) {
        mongoConnectionPromise = mongoose
            .connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 10000
            })
            .then(() => {
                console.log("MongoDB Connected Successfully");
            })
            .catch((error) => {
                mongoConnectionPromise = null;
                console.error("MongoDB Connection Failed:", error.message);
                throw error;
            });
    }

    return mongoConnectionPromise;
}

// Connect to database before handling requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database initialization failed:", error.message);

        res.status(503).json({
            message: "Database connection failed. Check server configuration."
        });
    }
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/expos", expoRoutes);
app.use("/api/booths", boothRoutes);
app.use("/api/exhibitors", exhibitorRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/products", productRoutes);
app.use("/api/staff", staffRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("EventSphere API is running");
});

// Local HTTP server and Socket.IO
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
    }
});

app.set("io", io);

// Socket.IO events for local development
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinRoom", (userId) => {
        if (userId) {
            socket.join(String(userId));
            console.log(`User ${userId} joined room`);
        }
    });

    socket.on("sendNotification", (data) => {
        if (!data || !data.userId) return;

        const { userId, title, message, type } = data;

        io.to(String(userId)).emit("receiveNotification", {
            title,
            message,
            type
        });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Export Express app for deployment
module.exports = app;

// Start local server
if (require.main === module) {
    const PORT = process.env.PORT || 5000;

    connectDB()
        .then(() => {
            server.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        })
        .catch((error) => {
            console.error("Could not start server:", error.message);
            process.exit(1);
        });
}