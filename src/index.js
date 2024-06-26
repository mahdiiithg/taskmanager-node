const express = require("express");
require("./db/mongose");
const http = require("http");
const socketIo = require("socket.io");

const userRouter = require("./router/users");
const tasksRouter = require("./router/tasks");
const categoryRouter = require("./router/categories");
var cors = require("cors");
const crudEmitter = require("./events/crudEvents");

// const multer = require('multer')

const app = express();
const port = process.env.PORT || 8082;
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.json());
app.use("/api", userRouter);
app.use("/api", tasksRouter);
app.use("/api", categoryRouter);

app.listen(port, () => {
  console.log("server is up on port", port);
});

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const goodFeelingSentences = [
  "Life is beautifully unpredictable.",
  "Dream big, fear less.",
  "Embrace the glorious mess.",
  "Choose joy every day.",
  "Keep shining, keep smiling.",
  "Believe in endless possibilities.",
  "Stay strong, stay positive.",
  "Love more, worry less.",
  "Be kind to yourself.",
  "Cherish every tiny moment.",
];

// CRUD event listeners
crudEmitter.on("create", (item) => {
  console.log("item", item);
  io.emit("notification", {
    message: `New item created: ${item}`,
  });
});

crudEmitter.on("update", (item) => {
  io.emit("notification", {
    message: `Item updated: ${item.description}`,
  });
});

crudEmitter.on("delete", (item) => {
  io.emit("notification", {
    message: `Item deleted: ${item}`,
  });
});

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  // Send a notification to the client
  socket.emit("notification", {
    message: getRandomSentence(),
  });
});

function getRandomSentence() {
  const randomIndex = Math.floor(Math.random() * goodFeelingSentences.length);
  return goodFeelingSentences[randomIndex];
}

// ! WEBRTC SEBSOCKET
io.on("connection", (socket) => {
  socket.emit("me", socket.id);
  socket.on("disconnect", () => {
      socket.broadcast.emit("callEnded")
  });
  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    console.log("callUser", from);
      io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });
  socket.on("answerCall", (data) => {
      io.to(data.to).emit("callAccepted", data.signal)
  });
});

server.listen(8082, () => {
  console.log("Server is running on port", 8082);
});

// Listen on both IPv6 and IPv4 addresses

module.exports = { server, io };
