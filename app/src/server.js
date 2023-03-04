const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { createdMessage } = require('./utils/create-message');
const { getUserList, addUser, removeUser } = require('./utils/users');

const publicPathDirectory = path.join(__dirname, '../public');
app.use(express.static(publicPathDirectory));

const server = http.createServer(app);
const io = socketio(server);

//lắng nghe sự kiện kết nối từ client;
io.on("connection", (socket) => {

    socket.on('join room from client to server', ({ room, username }) => {
        socket.join(room);

        //gửi cho client vừa kết nối vào server
        socket.emit(
            'send message from server to client', 
            createdMessage(`Đã vào phòng ${room}`),  
        );

        //gửi cho các client còn lại là có người chat mới
        socket.
            broadcast
            .to(room)
            .emit(
            'send message from server to client',
            createdMessage(`${username} vừa mới tham gia phòng ${room}`),
        );

        socket.on('send message from client to server', (messageText, callback) => {
            const filter = new Filter();
            if(filter.isProfane(messageText)){
                return callback('tin nhắn không hợp lệ');
            }
    
            io.to(room).emit('send message from server to client', createdMessage(messageText));
            callback();
        });
    
        //xử lý chia sẻ vị trí
        socket.on(
            'share location from client to server',
            ({ latitude, longitude }) => {
                const linkLocation = `https://www.google.com/maps?q=${latitude},${longitude}`;
                io.to(room).emit(
                    'share location from server to client',
                    linkLocation,
                )
            }
        )

        //xử lý userList
        const newUser = {
            id: socket.id,
            username,
            room,
        }
        addUser(newUser);
        io.to(room).emit("Send userlist from server to client", getUserList(room));

          //ngắt kết nối
        socket.on("disconnect", () => {
            removeUser(socket.id);
            io.to(room).emit("Send userlist from server to client", getUserList(room));
        })
    });
})

const PORT = 4500;

server.listen(PORT, () => {
    console.log(`App run on http://localhost:${PORT}`);
})