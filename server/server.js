require('dotenv').config({ path: '.env'});
const port = process.env.PORT || 3001;
const path = require('path');

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const socket = require("socket.io");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// DELETE IF NOT NEEDED
const User = require('./models/User');
const Chat = require('./models/Chat');

const mongoDatabase = process.env.MONGO_URI

mongoose.connect(mongoDatabase).catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("Connected");
});


var route = require('./routes/routes');

app.use("/", route);


const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Connected database: ${mongoDatabase}`);
} )

const io = socket(server, {
    cors:{
        origin:"http://localhost:3000",
        credentials: true,
    }
})

global.onlineUsers = new Map();

io.on("connection", (socket)=>{
    global.chatSocket = socket;
    socket.on("add-user",(userId) => {
        onlineUsers.set(userId, socket.id)
    });

    socket.on("send-msg", (data)=>{
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-receive", data.message);
        }
    })
})