const express = require('express');

const app = express();

const PORT = 3000;



const socketIo = require('socket.io');
const http = require('http');   
const path = require('path');

app.use(express.static('public'));

const server = http.createServer(app);
const io = socketIo(server);

app.set('view engine', 'ejs');
app.set(express.static( path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    socket.on('locationUpdate', (data) => {
        console.log('Location update received:', data);
        io.emit('locationUpdate',{id: socket.id, ...data});
    });

    socket.on('disconnect', () => {
        io.emit('userDisconnected', socket.id);
    });

  console.log('A user connected');  

});



app.get('/', (req, res) => {
  res.render('index', { title: 'Realtime Device Tracker' });
});



server.listen(PORT, () => {
  console.log(`Server is running on port number ${PORT || 3000}`);
});

