const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*", // Ganti dengan domain frontend Anda jika sudah deploy
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User subscribe ke room sesuai userId
  socket.on("subscribe", (userId) => {
    socket.join(userId);
  });

  // Untuk testing: broadcast notifikasi ke semua client
  socket.on("test-notification", (data) => {
    io.emit("notification", data);
  });
});

// Fungsi untuk trigger notifikasi dari backend
function sendNotification(userId, notification) {
  io.to(userId).emit("notification", notification);
}

server.listen(4000, () => {
  console.log("Notification server running on port 4000");
});

module.exports = { sendNotification }; 