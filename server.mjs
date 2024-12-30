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
    socket.on("add-tournament", (tournament) => {
        io.emit("add-tournament", tournament);
        console.log(`Tournament added: **tournament-${tournament.id}**`);
    });
    socket.on("update-tournament", (tournament) => {
        io.emit("update-tournament", tournament);
        io.to(`tournament-${tournament.id}`).emit("update-single-tournament", tournament);
        console.log(`Tournament updated: **tournament-${tournament.id}**`);
    });
    socket.on("delete-tournament", (id) => {
      io.emit("delete-tournament", id);
      io.to(`tournament-${tournament.id}`).emit("delete-single-tournament", id);
      console.log(`Tournament deleted: **tournament-${id}**`);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});


httpServer.listen(3001, () => {
  console.log("WebSocket server running on port 3001");
});
