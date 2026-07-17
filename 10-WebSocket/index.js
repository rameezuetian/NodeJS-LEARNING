// const http = require("http");
// const express = require("express");
// const path = require("path");
// const { Server } = require("socket.io");

// const app =  express();
// const server = http.createServer(app);
// const io = new Server(server);

// io.on("connection", (socket) => {
//     socket.on("user-message", (message) => {
//         io.emit("message", message);
//     });
//     console.log("A new user has connected", socket.id);
// });

// app.use(express.static(path.resolve("./public")));
// const PORT = 9000;

// app.get("/", (req, res) => {
//     return res.sendFile(path.resolve("./public/index.html"));
// });

// server.listen(PORT, () => console.log(`Running on port ${PORT}`));


const express= require("express");
const fs = require("fs");
const status = require("express-status-monitor");
const Stream = require("stream");
const zlib = require("zlib")

const app = express();
const PORT = 8000;

app.use(status());

app.get("/",(req, res)=>{
    stream = fs.createReadStream("./sample.txt","utf-8");
    stream.on("data" ,(chunk)=> res.write(chunk))
    stream.on("end" , ()=>res.end())
})

app.listen(PORT , ()=>{})