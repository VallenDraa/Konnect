import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { getNewMessage } from './socketServer/messages/messages.js';
import mongoose from 'mongoose';
import authRoutes from './api/routes/authRoute.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: ['http://localhost:3000', 'http://192.168.1.5:3000'] },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/auth', authRoutes);

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    throw error;
  }
};

io.on('connection', (socket) => {
  console.log('new user connected with id: ' + socket.id);
  getNewMessage(socket);
});

app.get('/', (req, res) => {
  res.send('this is the konnect API & web sockets');
});

app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    success: false,
    status: err.status || 500,
    message: err.message,
  });
});

httpServer.listen(3001, () => {
  dbConnect();
  mongoose.connection.on('disconnected', () => console.log('db disconnected'));
  mongoose.connection.on('connected', () => console.log('db connected'));
  console.log('listening on 3001');
});
