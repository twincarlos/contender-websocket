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

    socket.on("join-tournament", ({ id }) => {
        socket.join(id);
        console.log(`User joined tournament **${id}**`);
    });
    socket.on("update-tournament", ({ tournament }) => {
        io.emit("update-tournament", tournament);
        console.log(`Tournament updated: **tournament-${tournament.id}**`);
    });
    socket.on("add-tournament", ({ tournament }) => {
        io.emit("add-tournament", tournament);
        console.log(`Tournament added: **tournament-${tournament.id}**`);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});


httpServer.listen(port, () => {
  console.log("WebSocket server running on port 3001");
});