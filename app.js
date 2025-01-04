import express from 'express';
import  connectDB from './db/db.js';
import cors from 'cors';
import userRouter from './routes/user.route.js';
import projectRouter from './routes/project.route.js';
import taskRouter from './routes/task.route.js';
import issueRouter from './routes/issue.route.js';
import discussionRouter from './routes/discussion.route.js';
import commentRouter from './routes/comment.route.js';
import notificationRouter from './routes/notification.route.js';
import chatRouter from './routes/chat.route.js';
import { Server } from 'socket.io';
import http from 'http';

const activeUsers = {};
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static('uploads'));


app.get('/', (req, res) => {
  res.send('Server is working');
});

app.use('/user', userRouter);
app.use('/project', projectRouter);
app.use('/task', taskRouter);
app.use('/issue', issueRouter);
app.use('/discussion', discussionRouter);
app.use('/comment', commentRouter);
app.use('/notification', notificationRouter);
app.use('/chat', chatRouter);
// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this as needed
    methods: ["GET", "POST"]
  }
});

// Set up Socket.IO event listeners
io.on('connection', (socket) => {
    console.log('A user connected');
  
    socket.on('registerUser', (userId) => {
        activeUsers[userId] = socket.id;
        console.log(`User ${userId} is now active with socket ID: ${socket.id}`);
        io.emit('activeUsers',"User JOined");
      });
      
    socket.on('disconnect', () => {
      console.log('User disconnected');
      const userId = Object.keys(activeUsers).find(
        (key) => activeUsers[key] === socket.id
      );
      if (userId) {
        delete activeUsers[userId];
        console.log(`User ${userId} disconnected`);
      }
      io.emit('activeUsers',"User JOined");

    });
  
    // Add more event listeners here
  });

connectDB().then(() => {
    server.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((err) => {
    console.error(err);
});

export { io, activeUsers };