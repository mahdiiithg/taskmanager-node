const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
require("./db/mongose");
const userRouter = require("./router/users");
const tasksRouter = require("./router/tasks");
const categoryRouter = require("./router/categories");
var cors = require("cors");
const crudEmitter = require("./events/crudEvents");

// const multer = require('multer')

const app = express();
const port = process.env.PORT;

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());

// app.use(cors({ origin: "*" }));
// app.use(cors({ origin: "http://localhost:3001/" }));
// app.use(cors({ origin: "http://116.203.241.176:3000" }));
// app.use(cors({ origin: "http://localhost:3002/" }));
// app.use(cors({ origin: "http://localhost:3000/" }));

console.log("process.env.PORT", process.env.PORT);

app.use(express.json());
app.use(userRouter);
app.use(tasksRouter);
app.use(categoryRouter);

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
  "Cherish every tiny moment."
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

server.listen(3002, () => {
  console.log("Server is running on port");
});

module.exports = { server, io };
