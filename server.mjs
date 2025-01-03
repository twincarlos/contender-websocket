import { Server } from "socket.io";
import { createServer } from "node:http";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: **${socket.id}**`);

  socket.on("join-tournament", (id) => {
    socket.join(`tournament-${id}`);
    console.log(`User joined tournament **${id}**`);
  });
  socket.on("create-tournament", (tournament) => {
    io.emit("create-tournament", tournament);
  });
  socket.on("update-tournament", (tournament) => {
    io.emit("update-tournament", tournament);
    io.to(`tournament-${tournament.id}`).emit("update-single-tournament", tournament);
  });
  socket.on("delete-tournament", (id) => {
    io.emit("delete-tournament", id);
    io.to(`tournament-${id}`).emit("delete-single-tournament");
  });

  socket.on("create-tournament-player", (tournamentPlayer) => {
    io.to(`tournament-${tournamentPlayer.tournamentId}`).emit("create-tournament-player", tournamentPlayer);
  });
  socket.on("update-tournament-player", (tournamentPlayer) => {
    io.to(`tournament-${tournamentPlayer.tournamentId}`).emit("update-tournament-player", tournamentPlayer);
  });
  socket.on("delete-tournament-player", ({ tournamentId, tournamentPlayerId }) => {
    io.to(`tournament-${tournamentId}`).emit("delete-tournament-player", tournamentPlayerId);
  });

  socket.on("create-tournament-event", (tournamentEvent) => {
    io.to(`tournament-${tournamentEvent.tournamentId}`).emit("create-tournament-event", tournamentEvent);
  });
  socket.on("update-tournament-event", (tournamentEvent) => {
    io.to(`tournament-${tournamentEvent.tournamentId}`).emit("update-tournament-event", tournamentEvent);
  });
  socket.on("delete-tournament-event", ({ tournamentId, tournamentEventId }) => {
    io.to(`tournament-${tournamentId}`).emit("delete-tournament-event", tournamentEventId);
    io.to(`tournament-event-${tournamentEventId}`).emit("delete-tournament-event");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});


httpServer.listen(3001, () => {
  console.log("WebSocket server running on port 3001");
});
