import express from "express";
import { createServer } from "http";
import registerSocketHandlers from "./socketHandlers";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { VttServer } from "@vtt/shared/types";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io: VttServer = new Server(httpServer, {
  cors: {
    origin: "*", // TODO: restrict
  },
});

io.on("connection", (socket) => {
  console.log(`Player connected: ${socket.id}`);
  registerSocketHandlers(io, socket);
});

io.on("disconnect", (socket) => {
  console.log(`Player disconnected: ${socket.id}`);
});

const PORT = process.env.VTT_BACKEND_PORT ?? 8080;

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
