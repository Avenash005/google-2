# FanVerseAI - Implementation Guide

This guide provides detailed technical instructions for transforming the monolithic React app into a scalable full-stack application.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Phase 1: Project Setup](#phase-1-project-setup)
3. [Phase 2: Frontend Refactoring](#phase-2-frontend-refactoring)
4. [Phase 3: Backend Development](#phase-3-backend-development)
5. [Phase 4: Real-time Features](#phase-4-real-time-features)
6. [Phase 5: Deployment Setup](#phase-5-deployment-setup)
7. [Phase 6: Testing & Documentation](#phase-6-testing--documentation)

---

## Prerequisites

### Required Software
- Node.js 20+ and npm/yarn
- MongoDB (local or Atlas account)
- Redis (local or cloud instance)
- Docker & Docker Compose
- Git
- VS Code (recommended)

### Accounts Needed
- GitHub account
- Vercel account (for frontend)
- Railway or Render account (for backend)
- MongoDB Atlas account (optional)
- Redis Cloud account (optional)

---

## Phase 1: Project Setup

### 1.1 Initialize Monorepo Structure

```bash
# Create project root
mkdir fanverse-ai
cd fanverse-ai

# Initialize root package.json
npm init -y

# Create directory structure
mkdir -p frontend backend
```

### 1.2 Root Configuration Files

**`package.json`** (root)
```json
{
  "name": "fanverse-ai",
  "version": "1.0.0",
  "private": true,
  "workspaces": ["frontend", "backend"],
  "scripts": {
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && npm run dev",
    "build": "npm run build:frontend && npm run build:backend",
    "build:frontend": "cd frontend && npm run build",
    "build:backend": "cd backend && npm run build",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

**`.gitignore`**
```
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
build/
dist/

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
logs/
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Docker
docker-compose.override.yml
```

---

## Phase 2: Frontend Refactoring

### 2.1 Initialize Vite + React + TypeScript

```bash
cd frontend
npm create vite@latest . -- --template react-ts
npm install
```

### 2.2 Install Dependencies

```bash
# Core dependencies
npm install react-router-dom @reduxjs/toolkit react-redux
npm install axios socket.io-client
npm install recharts
npm install react-hook-form zod @hookform/resolvers

# UI & Styling
npm install styled-components
npm install @types/styled-components -D

# Dev dependencies
npm install -D @types/node
```

### 2.3 Project Structure

Create the following directory structure:

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Badge.tsx
│   │   │   ├── XPBar.tsx
│   │   │   ├── MiniBar.tsx
│   │   │   ├── StatTile.tsx
│   │   │   ├── SectionHeader.tsx
│   │   │   ├── LivePill.tsx
│   │   │   └── index.ts
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── MainLayout.tsx
│   │   └── features/
│   │       ├── auth/
│   │       ├── matches/
│   │       ├── predictions/
│   │       └── profile/
│   ├── pages/
│   │   ├── Landing/
│   │   │   └── Landing.tsx
│   │   ├── Dashboard/
│   │   │   └── Dashboard.tsx
│   │   ├── PredictionArena/
│   │   │   └── PredictionArena.tsx
│   │   ├── Leaderboard/
│   │   │   └── Leaderboard.tsx
│   │   ├── ClanBattles/
│   │   │   └── ClanBattles.tsx
│   │   ├── Profile/
│   │   │   └── Profile.tsx
│   │   └── QuestCenter/
│   │       └── QuestCenter.tsx
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── userSlice.ts
│   │   │   ├── matchSlice.ts
│   │   │   └── predictionSlice.ts
│   │   └── store.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── match.service.ts
│   │   ├── prediction.service.ts
│   │   └── websocket.service.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useWebSocket.ts
│   │   └── useLocalStorage.ts
│   ├── types/
│   │   ├── user.types.ts
│   │   ├── match.types.ts
│   │   ├── prediction.types.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── validators.ts
│   ├── styles/
│   │   ├── GlobalStyles.ts
│   │   └── theme.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
```

### 2.4 Key Configuration Files

**`vite.config.ts`**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@store': path.resolve(__dirname, './src/store'),
      '@services': path.resolve(__dirname, './src/services'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true,
      },
    },
  },
});
```

**`tsconfig.json`**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@pages/*": ["./src/pages/*"],
      "@store/*": ["./src/store/*"],
      "@services/*": ["./src/services/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@types/*": ["./src/types/*"],
      "@utils/*": ["./src/utils/*"],
      "@styles/*": ["./src/styles/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 2.5 Component Migration Strategy

**Example: Badge Component**

**`src/components/common/Badge.tsx`**
```typescript
import styled from 'styled-components';

interface BadgeProps {
  color?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

const StyledBadge = styled.span<{ $color: string; $size: string }>`
  background: ${props => `${props.$color}18`};
  border: 1px solid ${props => `${props.$color}50`};
  color: ${props => props.$color};
  padding: ${props => props.$size === 'sm' ? '2px 9px' : '4px 14px'};
  border-radius: 20px;
  font-size: ${props => props.$size === 'sm' ? '10px' : '12px'};
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
  font-family: 'Rajdhani', sans-serif;
`;

export const Badge: React.FC<BadgeProps> = ({ 
  color = '#00d4ff', 
  children, 
  size = 'sm' 
}) => {
  return (
    <StyledBadge $color={color} $size={size}>
      {children}
    </StyledBadge>
  );
};
```

### 2.6 Redux Store Setup

**`src/store/store.ts`**
```typescript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import matchReducer from './slices/matchSlice';
import predictionReducer from './slices/predictionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    matches: matchReducer,
    predictions: predictionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**`src/store/slices/authSlice.ts`**
```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '@services/auth.service';
import type { User, LoginCredentials, RegisterData } from '@types/user.types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
```

### 2.7 API Service Setup

**`src/services/api.ts`**
```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## Phase 3: Backend Development

### 3.1 Initialize Backend

```bash
cd backend
npm init -y
npm install express mongoose redis socket.io
npm install jsonwebtoken bcryptjs cors helmet morgan winston
npm install express-rate-limit joi dotenv
npm install -D typescript @types/node @types/express @types/cors
npm install -D @types/jsonwebtoken @types/bcryptjs nodemon ts-node
```

### 3.2 TypeScript Configuration

**`tsconfig.json`**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@config/*": ["src/config/*"],
      "@models/*": ["src/models/*"],
      "@routes/*": ["src/routes/*"],
      "@controllers/*": ["src/controllers/*"],
      "@services/*": ["src/services/*"],
      "@middleware/*": ["src/middleware/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 3.3 Backend Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── env.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Match.ts
│   │   ├── Prediction.ts
│   │   ├── Clan.ts
│   │   ├── Quest.ts
│   │   └── Badge.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── match.routes.ts
│   │   ├── prediction.routes.ts
│   │   ├── clan.routes.ts
│   │   └── quest.routes.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── match.controller.ts
│   │   └── prediction.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── match.service.ts
│   │   └── cache.service.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── rateLimit.middleware.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── jwt.ts
│   │   └── validators.ts
│   ├── websocket/
│   │   ├── socket.ts
│   │   └── handlers/
│   ├── types/
│   │   └── index.ts
│   └── server.ts
├── scripts/
│   └── seed.ts
├── package.json
├── tsconfig.json
└── Dockerfile
```

### 3.4 MongoDB Models

**`src/models/User.ts`**
```typescript
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profile: {
    name: string;
    avatar: string;
    level: number;
    xp: number;
    xpMax: number;
    rank: number;
    persona: string;
    streak: number;
    clanId?: mongoose.Types.ObjectId;
  };
  stats: {
    totalPredictions: number;
    accuracy: number;
    questsDone: number;
    clanWars: number;
  };
  badges: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profile: {
      name: { type: String, required: true },
      avatar: { type: String, default: '' },
      level: { type: Number, default: 1 },
      xp: { type: Number, default: 0 },
      xpMax: { type: Number, default: 1000 },
      rank: { type: Number, default: 0 },
      persona: { type: String, default: 'Rookie' },
      streak: { type: Number, default: 0 },
      clanId: { type: Schema.Types.ObjectId, ref: 'Clan' },
    },
    stats: {
      totalPredictions: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 },
      questsDone: { type: Number, default: 0 },
      clanWars: { type: Number, default: 0 },
    },
    badges: [{ type: Schema.Types.ObjectId, ref: 'Badge' }],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
```

### 3.5 Express Server Setup

**`src/server.ts`**
```typescript
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { connectDatabase } from '@config/database';
import { connectRedis } from '@config/redis';
import { errorHandler } from '@middleware/error.middleware';
import { logger } from '@utils/logger';
import authRoutes from '@routes/auth.routes';
import userRoutes from '@routes/user.routes';
import matchRoutes from '@routes/match.routes';
import predictionRoutes from '@routes/prediction.routes';
import { initializeWebSocket } from './websocket/socket';

const app: Application = express();
const httpServer = createServer(app);
const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/predictions', predictionRoutes);

// Error handling
app.use(errorHandler);

// Initialize WebSocket
initializeWebSocket(io);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();
    await connectRedis();
    
    httpServer.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { app, io };
```

---

## Phase 4: Real-time Features

### 4.1 WebSocket Server

**`src/websocket/socket.ts`**
```typescript
import { Server as SocketServer } from 'socket.io';
import { logger } from '@utils/logger';
import { verifyToken } from '@utils/jwt';

export const initializeWebSocket = (io: SocketServer) => {
  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      
      const decoded = verifyToken(token);
      socket.data.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);
    
    // Join user room
    socket.join(`user:${socket.data.userId}`);
    
    // Match updates
    socket.on('match:subscribe', (matchId: string) => {
      socket.join(`match:${matchId}`);
      logger.info(`User ${socket.data.userId} subscribed to match ${matchId}`);
    });
    
    socket.on('match:unsubscribe', (matchId: string) => {
      socket.leave(`match:${matchId}`);
    });
    
    // Disconnect
    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });
  
  return io;
};

// Emit match update to all subscribers
export const emitMatchUpdate = (io: SocketServer, matchId: string, data: any) => {
  io.to(`match:${matchId}`).emit('match:update', data);
};

// Emit user notification
export const emitUserNotification = (io: SocketServer, userId: string, data: any) => {
  io.to(`user:${userId}`).emit('notification', data);
};
```

### 4.2 Frontend WebSocket Service

**`src/services/websocket.service.ts`**
```typescript
import { io, Socket } from 'socket.io-client';

class WebSocketService {
  private socket: Socket | null = null;
  private readonly url: string;

  constructor() {
    this.url = import.meta.env.VITE_WS_URL || 'http://localhost:5000';
  }

  connect(token: string): void {
    if (this.socket?.connected) return;

    this.socket = io(this.url, {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscribeToMatch(matchId: string): void {
    this.socket?.emit('match:subscribe', matchId);
  }

  unsubscribeFromMatch(matchId: string): void {
    this.socket?.emit('match:unsubscribe', matchId);
  }

  onMatchUpdate(callback: (data: any) => void): void {
    this.socket?.on('match:update', callback);
  }

  onNotification(callback: (data: any) => void): void {
    this.socket?.on('notification', callback);
  }

  removeListener(event: string): void {
    this.socket?.off(event);
  }
}

export const websocketService = new WebSocketService();
```

---

## Phase 5: Deployment Setup

### 5.1 Docker Configuration

**`backend/Dockerfile`**
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["node", "dist/server.js"]
```

**`docker-compose.yml`** (root)
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7
    container_name: fanverse-mongodb
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db

  redis:
    image: redis:7-alpine
    container_name: fanverse-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build: ./backend
    container_name: fanverse-backend
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: development
      PORT: 5000
      MONGODB_URI: mongodb://admin:password@mongodb:27017/fanverse?authSource=admin
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your-jwt-secret-here
      JWT_REFRESH_SECRET: your-refresh-secret-here
      CORS_ORIGIN: http://localhost:3000
    depends_on:
      - mongodb
      - redis
    volumes:
      - ./backend:/app
      - /app/node_modules

volumes:
  mongodb_data:
  redis_data:
```

### 5.2 Vercel Configuration

**`frontend/vercel.json`**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "VITE_API_URL": "@api_url",
    "VITE_WS_URL": "@ws_url"
  }
}
```

### 5.3 Railway Configuration

**`backend/railway.json`**
```json
{
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "startCommand": "node dist/server.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 5.4 Environment Variables

**Frontend (`.env.example`)**
```env
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=http://localhost:5000
VITE_ENV=development
```

**Backend (`.env.example`)**
```env
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/fanverse
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Phase 6: Testing & Documentation

### 6.1 API Documentation

Use Swagger for API documentation:

```bash
cd backend
npm install swagger-jsdoc swagger-ui-express
npm install -D @types/swagger-jsdoc @types/swagger-ui-express
```

### 6.2 Testing Setup

```bash
# Frontend
cd frontend
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Backend
cd backend
npm install -D jest @types/jest ts-jest supertest @types/supertest
```

---

## 🚀 Quick Start Commands

```bash
# Clone and setup
git clone <repo-url>
cd fanverse-ai
npm install

# Start with Docker
npm run docker:up
npm run dev

# Or start manually
# Terminal 1: Start MongoDB and Redis
# Terminal 2: cd backend && npm run dev
# Terminal 3: cd frontend && npm run dev
```

---

## 📝 Next Steps

1. Review this implementation guide
2. Start with Phase 1: Project Setup
3. Follow each phase sequentially
4. Test thoroughly at each stage
5. Deploy to staging environment
6. Conduct user testing
7. Deploy to production

---

**Note**: This guide provides the foundation. Adjust based on specific requirements and scale as needed.