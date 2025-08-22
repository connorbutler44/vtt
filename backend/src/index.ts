import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import registerSocketHandlers from "./socketHandlers";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*", // allow any frontend for now
  },
});

io.on("connection", (socket) => {
  console.log(`Player connected: ${socket.id}`);
  registerSocketHandlers(io, socket);
});

const PORT = process.env.VTT_BACKEND_PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
