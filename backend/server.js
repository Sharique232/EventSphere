const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

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

// =========================
// CREATE HTTP SERVER
// =========================

const server = http.createServer(app);


// =========================
// SOCKET.IO
// =========================

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// Make Socket.IO available to controllers
app.set("io", io);


// =========================
// MIDDLEWARE
// =========================

app.use(cors());
app.use(express.json());


// =========================
// API ROUTES
// =========================

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


// =========================
// HOME
// =========================

app.get("/", (req, res) => {
    res.send("EventSphere API is running");
});


// =========================
// SOCKET.IO CONNECTION
// =========================

io.on("connection", (socket) => {

    console.log("User connected:", socket.id);


    // =========================
    // JOIN PERSONAL ROOM
    // =========================

    socket.on("joinRoom", (userId) => {

        socket.join(userId);

        console.log(
            `User ${userId} joined room`
        );

    });


    // =========================
    // REAL-TIME NOTIFICATION
    // =========================

    socket.on("sendNotification", (data) => {

        const {
            userId,
            title,
            message,
            type
        } = data;

        io.to(userId).emit(
            "receiveNotification",
            {
                title,
                message,
                type
            }
        );

    });


    // =========================
    // USER DISCONNECTED
    // =========================

    socket.on("disconnect", () => {

        console.log(
            "User disconnected:",
            socket.id
        );

    });

});


// =========================
// MONGODB CONNECTION
// =========================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {

        console.log(
            "MongoDB Connected Successfully"
        );

        // Start server
        server.listen(
            process.env.PORT,
            () => {

                console.log(
                    `Server running on port ${process.env.PORT}`
                );

            }
        );

    })
    .catch((error) => {

        console.log(
            "MongoDB Connection Failed:",
            error.message
        );

    });