const express = require("express");
const app = express();
const http = require("http");
const httpServer = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
const tableData = require("./coinsData");

app.get("/", (req, res) => {
  res.send("Backend for Live-Coin Project. Auther: Aref Movahedzadeh");
});

io.on("connection", (socket) => {
  let counter = 0;
  let timing;

  socket.on("page loaded", (msg) => {
    if (msg === true) {
      function traverse() {
        io.emit("new tableData", tableData[counter]);
        if (counter == tableData.length - 1) {
          counter = 0;
        } else {
          counter++;
        }
      }
      timing = setInterval(traverse, 2000);
    }
  });

  socket.on("wake up", (msg) => {
    io.emit("i'm awake", msg);
  });

  socket.on("disconnect", function (msg) {
    console.log(msg);
    x = 0;
    clearInterval(timing);
    socket.disconnect();
  });
});


httpServer.listen(5005, () => {
  console.log("listening on localhost:5005");
});