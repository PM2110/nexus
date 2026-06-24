import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: '*', // Allow all in development; tighten in production
}));
app.use(express.json());

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Nexus API is running smoothly' });
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});

// Socket presence & state mapping
const activeUsers = new Map<string, { username: string; activeSheet: string }>();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a workspace room
  socket.on('join-workspace', ({ workspaceId, username }) => {
    socket.join(workspaceId);
    activeUsers.set(socket.id, { username, activeSheet: 'Shared' });
    
    // Broadcast join event
    socket.to(workspaceId).emit('user-joined', {
      id: socket.id,
      username,
      activeSheet: 'Shared'
    });

    console.log(`${username} joined workspace: ${workspaceId}`);
  });

  // Track cursor movement
  socket.on('cursor-move', ({ workspaceId, cursor }) => {
    socket.to(workspaceId).emit('cursor-update', {
      userId: socket.id,
      cursor
    });
  });

  // Handle active sheet transitions
  socket.on('sheet-change', ({ workspaceId, sheetName }) => {
    const user = activeUsers.get(socket.id);
    if (user) {
      user.activeSheet = sheetName;
      socket.to(workspaceId).emit('user-sheet-updated', {
        userId: socket.id,
        activeSheet: sheetName
      });
    }
  });

  // Handle workspace messages (chat)
  socket.on('send-message', ({ workspaceId, content, sender }) => {
    io.to(workspaceId).emit('receive-message', {
      id: `${Date.now()}-${Math.random()}`,
      content,
      sender,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    const user = activeUsers.get(socket.id);
    if (user) {
      console.log(`User disconnected: ${user.username}`);
      // Notify rooms
      socket.broadcast.emit('user-left', {
        id: socket.id,
        username: user.username
      });
      activeUsers.delete(socket.id);
    }
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Nexus server is listening on port ${port}`);
});
