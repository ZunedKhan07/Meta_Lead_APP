import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import webhookRoutes from "./routes/webhookRoutes.js";
import { initSocket } from "./config/socket.js";

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Create raw HTTP server using Node http module (needed for Socket.io)
const server = http.createServer(app);

// Initialize Socket.io by passing the HTTP server
initSocket(server);

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON payloads coming from Meta webhook

// Routes
app.use("/webhook", webhookRoutes);

app.get("/", (req, res) => {
    res.send("Meta Lead Webhook Server is running smoothly!");
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`\n ✅ Server is running live on port ${PORT}`);
});