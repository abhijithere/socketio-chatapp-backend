const http=require("http");
const express = require("express")
const cors = require("cors")

const socketIO= require("socket.io");
const { Socket } = require("dgram");
const PORT=process.env.PORT;
const app = express();
const server = http.createServer(app);
const IO=socketIO(server);

const users=[{}]

app.use(cors());
app.get("/",(req,res)=>{
        res.send("yo working")
})

IO.on("connection",(socket)=>{
    console.log("new connection")
    socket.on('joined',({user})=>{
        users[socket.id]=user;
        console.log(`${user} has joined`)
        IO.emit('welcome',{user:"admin",message:`welcome to the chat ${users[socket.id]}`})
        socket.broadcast.emit('userjoined',{user:"Admin",message:`${users[socket.id]} has joined`})
    })
    socket.on('message',({message,id})=>{

        IO.emit(`sendMessage`,{user:users[id],message,id})
    })
    socket.on("disconnect",()=>{
        socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]} has left`})
        console.log(`user left`)
    })
})

server.listen(PORT,()=>{
    console.log(`server is working at ${PORT}`)
})