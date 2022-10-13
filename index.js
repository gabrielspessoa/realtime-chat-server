const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3000;

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://192.168.25.5:5173',
      'realtime-chat-server-kqhzj42u2-gabrielspessoa.vercel.app',
      'realtime-chat-server.vercel.app',
    ],
    methods: ['GET', 'POST'],
  },
});

const CHAT_BOT = 'ChatBot';
let allUsers = [];

io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);

  socket.on('join', (data) => {
    const { username } = data;

    socket.join('main');

    let __createdtime__ = Date.now();
    socket.to('main').emit('receive_message', {
      message: `${username} entrou na sala`,
      username: CHAT_BOT,
      __createdtime__,
    });

    socket.emit('receive_message', {
      message: `Bem-vindo ${username}`,
      username: CHAT_BOT,
      __createdtime__,
    });

    allUsers.push({ id: socket.id, username });
    socket.emit('chatroom_users', allUsers);

    socket.on('send_message', (data) => {
      io.in('main').emit('receive_message', {
        message: data.message,
        username: data.username,
        __createdtime__: data.__createdtime__,
      });
    });
  });
});

app.get('/', (req, res) => {
  res.send('Hello world');
});

server.listen(PORT, () => 'Server is running on port 4000');
