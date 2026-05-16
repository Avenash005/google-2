# 🏏 FanVerseAI - Cricket Fan Engagement Platform

A scalable, production-ready full-stack application for cricket fans featuring real-time predictions, gamification, clan battles, and AI-powered quests.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌟 Features

### Core Features
- **🎯 Prediction Arena**: Make predictions on live cricket matches with real-time odds
- **📊 Live Leaderboards**: Global and clan-based rankings with weekly competitions
- **⚔️ Clan Battles**: Team-based competitions with points and rewards
- **🎮 Gamification**: XP system, levels, badges, and battle pass progression
- **🔮 AI-Generated Quests**: Personalized challenges based on user behavior
- **📈 Analytics Dashboard**: Track your performance with detailed statistics
- **💬 Real-time Updates**: Live match scores, commentary, and momentum tracking

### Technical Features
- **🔐 JWT Authentication**: Secure user authentication with refresh tokens
- **⚡ Real-time Communication**: WebSocket integration for live updates
- **💾 Caching Layer**: Redis for improved performance
- **🐳 Containerized**: Docker support for easy deployment
- **📱 Responsive Design**: Mobile-first approach with glassmorphism UI
- **🔄 State Management**: Redux Toolkit for predictable state updates
- **🎨 Modern UI**: Styled components with custom animations

## 🏗️ Architecture

```
┌─────────────────┐
│  React Frontend │ ──────┐
│  (Vite + TS)    │       │
└─────────────────┘       │
                          ▼
                    ┌──────────┐
                    │   API    │
                    │ Gateway  │
                    └──────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Express    │  │   Socket.io  │  │    Redis     │
│   Server     │  │   WebSocket  │  │    Cache     │
└──────────────┘  └──────────────┘  └──────────────┘
        │
        ▼
┌──────────────┐
│   MongoDB    │
│   Database   │
└──────────────┘
```

## 📁 Project Structure

```
fanverse-ai/
├── frontend/              # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Redux store & slices
│   │   ├── services/     # API & WebSocket services
│   │   ├── hooks/        # Custom React hooks
│   │   ├── types/        # TypeScript definitions
│   │   └── utils/        # Helper functions
│   └── package.json
│
├── backend/              # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── models/      # MongoDB models
│   │   ├── routes/      # API routes
│   │   ├── controllers/ # Route controllers
│   │   ├── services/    # Business logic
│   │   ├── middleware/  # Express middleware
│   │   ├── websocket/   # WebSocket handlers
│   │   └── utils/       # Helper functions
│   ├── scripts/         # Database seeding
│   └── package.json
│
├── docker-compose.yml    # Local development setup
├── ARCHITECTURE.md       # Detailed architecture docs
├── IMPLEMENTATION_GUIDE.md # Step-by-step guide
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm
- Docker & Docker Compose (recommended)
- MongoDB (local or Atlas)
- Redis (local or cloud)

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/fanverse-ai.git
cd fanverse-ai

# Install dependencies
npm install

# Start all services with Docker
npm run docker:up

# Start development servers
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017
- Redis: localhost:6379

### Option 2: Manual Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/fanverse-ai.git
cd fanverse-ai

# Install root dependencies
npm install

# Setup Frontend
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration

# Setup Backend
cd ../backend
npm install
cp .env.example .env
# Edit .env with your configuration

# Start MongoDB and Redis (in separate terminals)
mongod
redis-server

# Start Backend (from backend directory)
npm run dev

# Start Frontend (from frontend directory)
npm run dev
```

## 🔧 Configuration

### Frontend Environment Variables

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=http://localhost:5000
VITE_ENV=development
```

### Backend Environment Variables

Create `backend/.env`:

```env
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/fanverse
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📦 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Styled Components** - Styling
- **Recharts** - Data visualization
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **Redis** - Caching
- **Socket.io** - WebSocket server
- **JWT** - Authentication
- **Winston** - Logging
- **Joi** - Validation

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Vercel** - Frontend hosting
- **Railway/Render** - Backend hosting
- **GitHub Actions** - CI/CD

## 🗄️ Database Schema

### Collections

- **Users**: User profiles, stats, badges, and preferences
- **Matches**: Cricket match data with live updates
- **Predictions**: User predictions and results
- **Clans**: Team information and statistics
- **Quests**: Daily, weekly, and AI-generated challenges
- **Badges**: Achievement badges and rewards

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for detailed schema definitions.

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Matches
- `GET /api/matches` - Get all matches
- `GET /api/matches/:id` - Get match details
- `GET /api/matches/live` - Get live matches

### Predictions
- `POST /api/predictions` - Create prediction
- `GET /api/predictions/user/:userId` - Get user predictions

### Leaderboard
- `GET /api/leaderboard/global` - Global rankings
- `GET /api/leaderboard/clan/:clanId` - Clan rankings

See full API documentation at `/api/docs` when running the server.

## 🔄 Real-time Events

### WebSocket Events

**Client → Server**
- `match:subscribe` - Subscribe to match updates
- `match:unsubscribe` - Unsubscribe from match

**Server → Client**
- `match:update` - Live match score updates
- `match:commentary` - New commentary
- `notification` - User notifications
- `leaderboard:update` - Ranking changes

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
npm run test

# E2E tests
npm run test:e2e
```

## 📊 Performance

- **Frontend**: Code splitting, lazy loading, memoization
- **Backend**: Redis caching, database indexing, connection pooling
- **Real-time**: Event throttling, selective broadcasting
- **API**: Rate limiting, response compression

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add environment variables
4. Deploy

### Backend (Railway/Render)

1. Connect your GitHub repository
2. Configure Dockerfile deployment
3. Add environment variables:
   - MongoDB Atlas connection string
   - Redis Cloud URL
   - JWT secrets
4. Deploy

See [`IMPLEMENTATION_GUIDE.md`](./IMPLEMENTATION_GUIDE.md) for detailed deployment instructions.

## 📝 Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run tests: `npm run test`
4. Commit: `git commit -m "feat: your feature"`
5. Push: `git push origin feature/your-feature`
6. Create a Pull Request

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original single-file React app concept
- Cricket data providers
- Open source community

## 📞 Support

For support, email support@fanverseai.com or join our Discord server.

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Social features (friends, chat)
- [ ] Advanced analytics dashboard
- [ ] Machine learning predictions
- [ ] Multi-sport support
- [ ] NFT badges and rewards
- [ ] Tournament creation
- [ ] Live streaming integration

## 📚 Documentation

- [Architecture Overview](./ARCHITECTURE.md)
- [Implementation Guide](./IMPLEMENTATION_GUIDE.md)
- [API Documentation](http://localhost:5000/api/docs)
- [Contributing Guidelines](./CONTRIBUTING.md)

---

**Built with ❤️ for cricket fans worldwide**

⭐ Star this repo if you find it helpful!