# Component Migration Map

This document maps the existing monolithic [`FanVerseAI.jsx`](../Downloads/FanVerseAI.jsx) component structure to the new modular architecture.

## 🎯 Migration Strategy

### Phase 1: Extract Shared Components
Extract reusable UI components that are used across multiple pages.

### Phase 2: Create Page Components
Break down main page sections into separate page components.

### Phase 3: Add State Management
Integrate Redux Toolkit for global state.

### Phase 4: Implement Routing
Add React Router for navigation.

### Phase 5: Connect to Backend
Replace mock data with API calls.

---

## 📦 Component Breakdown

### Current Structure (Monolithic)

```
FanVerseAI.jsx (1381 lines)
├── STYLES (inline CSS)
├── DATA (mock data objects)
├── Badge
├── XPBar
├── MiniBar
├── StatTile
├── SectionHeader
├── LivePill
├── RarityColor
├── Sidebar
├── LandingPage
├── Dashboard
├── PredictionArena
├── Leaderboard
├── ClanBattles
├── Profile
├── QuestCenter
└── FanVerseAI (root component)
```

### Target Structure (Modular)

```
frontend/src/
├── components/
│   ├── common/
│   │   ├── Badge.tsx
│   │   ├── XPBar.tsx
│   │   ├── MiniBar.tsx
│   │   ├── StatTile.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── LivePill.tsx
│   │   ├── RarityBadge.tsx
│   │   └── index.ts
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── MainLayout.tsx
│   │   └── index.ts
│   └── features/
│       ├── matches/
│       │   ├── MatchCard.tsx
│       │   ├── LiveMatchCard.tsx
│       │   └── MatchCommentary.tsx
│       ├── predictions/
│       │   ├── PredictionButton.tsx
│       │   └── PredictionStats.tsx
│       ├── leaderboard/
│       │   ├── LeaderboardRow.tsx
│       │   └── LeaderboardFilters.tsx
│       ├── profile/
│       │   ├── BadgeGrid.tsx
│       │   ├── SkillRadar.tsx
│       │   └── BattlePass.tsx
│       └── quests/
│           ├── QuestCard.tsx
│           └── AIQuestCard.tsx
├── pages/
│   ├── Landing/
│   │   └── Landing.tsx
│   ├── Dashboard/
│   │   └── Dashboard.tsx
│   ├── PredictionArena/
│   │   └── PredictionArena.tsx
│   ├── Leaderboard/
│   │   └── Leaderboard.tsx
│   ├── ClanBattles/
│   │   └── ClanBattles.tsx
│   ├── Profile/
│   │   └── Profile.tsx
│   └── QuestCenter/
│       └── QuestCenter.tsx
└── styles/
    ├── GlobalStyles.ts
    └── theme.ts
```

---

## 🔄 Detailed Migration Map

### 1. Shared Components (Lines 188-256)

#### [`Badge`](../Downloads/FanVerseAI.jsx:188-199)
**Current Location**: Lines 188-199  
**New Location**: `frontend/src/components/common/Badge.tsx`  
**Dependencies**: None  
**Props**: `color`, `children`, `size`

```typescript
// Migration example
interface BadgeProps {
  color?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ 
  color = '#00d4ff', 
  children, 
  size = 'sm' 
}) => {
  // Implementation
};
```

#### [`XPBar`](../Downloads/FanVerseAI.jsx:201-212)
**Current Location**: Lines 201-212  
**New Location**: `frontend/src/components/common/XPBar.tsx`  
**Dependencies**: None  
**Props**: `pct`, `height`, `glow`

#### [`MiniBar`](../Downloads/FanVerseAI.jsx:214-220)
**Current Location**: Lines 214-220  
**New Location**: `frontend/src/components/common/MiniBar.tsx`  
**Dependencies**: None  
**Props**: `pct`, `color`

#### [`StatTile`](../Downloads/FanVerseAI.jsx:222-231)
**Current Location**: Lines 222-231  
**New Location**: `frontend/src/components/common/StatTile.tsx`  
**Dependencies**: None  
**Props**: `icon`, `label`, `value`, `color`, `sub`

#### [`SectionHeader`](../Downloads/FanVerseAI.jsx:233-243)
**Current Location**: Lines 233-243  
**New Location**: `frontend/src/components/common/SectionHeader.tsx`  
**Dependencies**: None  
**Props**: `title`, `sub`, `right`

#### [`LivePill`](../Downloads/FanVerseAI.jsx:245-253)
**Current Location**: Lines 245-253  
**New Location**: `frontend/src/components/common/LivePill.tsx`  
**Dependencies**: None  
**Props**: None

#### [`RarityColor`](../Downloads/FanVerseAI.jsx:255-256)
**Current Location**: Lines 255-256  
**New Location**: `frontend/src/components/common/RarityBadge.tsx`  
**Dependencies**: None  
**Props**: `rarity`

---

### 2. Layout Components

#### [`Sidebar`](../Downloads/FanVerseAI.jsx:258-323)
**Current Location**: Lines 258-323  
**New Location**: `frontend/src/components/layout/Sidebar.tsx`  
**Dependencies**: `Badge`, User data from Redux  
**Props**: `page`, `setPage` (will be replaced with React Router)

**Migration Notes**:
- Replace `setPage` with `useNavigate()` from React Router
- Get user data from Redux store instead of props
- Add active route detection using `useLocation()`

```typescript
// New implementation
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Badge } from '@components/common';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.user.profile);
  
  const isActive = (path: string) => location.pathname === path;
  
  // Implementation
};
```

---

### 3. Page Components

#### [`LandingPage`](../Downloads/FanVerseAI.jsx:325-449)
**Current Location**: Lines 325-449  
**New Location**: `frontend/src/pages/Landing/Landing.tsx`  
**Dependencies**: None  
**Props**: `onEnter` (will be replaced with navigation)

**Migration Notes**:
- Replace `onEnter` callback with `navigate('/dashboard')`
- Extract hero section into separate component
- Add authentication check

#### [`Dashboard`](../Downloads/FanVerseAI.jsx:451-669)
**Current Location**: Lines 451-669  
**New Location**: `frontend/src/pages/Dashboard/Dashboard.tsx`  
**Dependencies**: 
- `StatTile`, `SectionHeader`, `Badge`, `XPBar`, `MiniBar`
- `AreaChart` from Recharts
- User data, matches data, activity data from Redux

**Sub-components to extract**:
- `ActivityChart` (lines 520-545)
- `LiveMatchCard` (lines 547-600)
- `QuestCard` (lines 602-640)

**Migration Notes**:
- Fetch user stats from API on mount
- Fetch live matches from API
- Subscribe to WebSocket for live updates
- Replace mock data with Redux state

```typescript
// New implementation
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserStats, fetchLiveMatches } from '@store/slices';
import { websocketService } from '@services/websocket.service';

export const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const matches = useSelector((state: RootState) => state.matches.live);
  
  useEffect(() => {
    dispatch(fetchUserStats());
    dispatch(fetchLiveMatches());
    
    // Subscribe to live updates
    websocketService.onMatchUpdate((data) => {
      // Update match in Redux
    });
    
    return () => {
      websocketService.removeListener('match:update');
    };
  }, [dispatch]);
  
  // Implementation
};
```

#### [`PredictionArena`](../Downloads/FanVerseAI.jsx:671-869)
**Current Location**: Lines 671-869  
**New Location**: `frontend/src/pages/PredictionArena/PredictionArena.tsx`  
**Dependencies**:
- `SectionHeader`, `Badge`, `LivePill`
- Match data from Redux
- Prediction service

**Sub-components to extract**:
- `MatchCard` with prediction buttons
- `CommentaryFeed`
- `MomentumMeter`

**Migration Notes**:
- Fetch matches from API
- Handle prediction submission via API
- Real-time commentary updates via WebSocket
- Add loading and error states

#### [`Leaderboard`](../Downloads/FanVerseAI.jsx:871-1003)
**Current Location**: Lines 871-1003  
**New Location**: `frontend/src/pages/Leaderboard/Leaderboard.tsx`  
**Dependencies**:
- `SectionHeader`, `Badge`
- Leaderboard data from Redux

**Sub-components to extract**:
- `LeaderboardRow`
- `FilterTabs` (Global, Clan, Weekly)

**Migration Notes**:
- Fetch leaderboard data from API
- Add pagination
- Add search/filter functionality
- Highlight current user

#### [`ClanBattles`](../Downloads/FanVerseAI.jsx:1005-1145)
**Current Location**: Lines 1005-1145  
**New Location**: `frontend/src/pages/ClanBattles/ClanBattles.tsx`  
**Dependencies**:
- `SectionHeader`, `Badge`, `MiniBar`
- Clan data from Redux

**Sub-components to extract**:
- `ClanCard`
- `BattleMeter`
- `TopContributors`

**Migration Notes**:
- Fetch clan data from API
- Real-time battle updates via WebSocket
- Add join/leave clan functionality

#### [`Profile`](../Downloads/FanVerseAI.jsx:1147-1283)
**Current Location**: Lines 1147-1283  
**New Location**: `frontend/src/pages/Profile/Profile.tsx`  
**Dependencies**:
- `SectionHeader`, `Badge`, `XPBar`, `StatTile`
- `RadarChart` from Recharts
- User profile data from Redux

**Sub-components to extract**:
- `BadgeGrid` (lines 1195-1220)
- `SkillRadar` (lines 1222-1245)
- `BattlePass` (lines 1247-1280)

**Migration Notes**:
- Fetch user profile from API
- Add edit profile functionality
- Badge unlock animations

#### [`QuestCenter`](../Downloads/FanVerseAI.jsx:1285-1351)
**Current Location**: Lines 1285-1351  
**New Location**: `frontend/src/pages/QuestCenter/QuestCenter.tsx`  
**Dependencies**:
- `SectionHeader`, `Badge`, `MiniBar`
- Quest data from Redux

**Sub-components to extract**:
- `QuestCard` (regular quests)
- `AIQuestCard` (AI-generated quests)

**Migration Notes**:
- Fetch quests from API
- Add quest start/complete functionality
- Progress tracking
- AI quest generation

---

### 4. Root Component

#### [`FanVerseAI`](../Downloads/FanVerseAI.jsx:1356-1380)
**Current Location**: Lines 1356-1380  
**New Location**: `frontend/src/App.tsx`

**Migration**:
```typescript
// Old (state-based routing)
const [page, setPage] = useState("landing");
{page === "landing" && <LandingPage onEnter={() => setPage("dashboard")} />}
{page === "dashboard" && <Dashboard setPage={setPage} />}

// New (React Router)
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@store/store';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/arena" element={<PredictionArena />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/clans" element={<ClanBattles />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/quests" element={<QuestCenter />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
```

---

### 5. Styles Migration

#### Global Styles (Lines 7-91)
**Current Location**: Lines 7-91 (inline `<style>` tag)  
**New Location**: `frontend/src/styles/GlobalStyles.ts`

**Migration**:
```typescript
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');
  
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    background: #060912;
    font-family: 'Rajdhani', sans-serif;
  }
  
  // ... rest of styles
`;
```

---

### 6. Data Migration

#### Mock Data (Lines 96-183)
**Current Location**: Lines 96-183  
**New Location**: 
- `backend/scripts/seed.ts` (for database seeding)
- `frontend/src/utils/mockData.ts` (for development)

**Migration Strategy**:
1. Create MongoDB schemas matching data structure
2. Create seed script to populate database
3. Replace hardcoded data with API calls
4. Keep mock data for development/testing

---

## 📋 Migration Checklist

### Phase 1: Setup ✅
- [ ] Create project structure
- [ ] Initialize frontend with Vite + React + TypeScript
- [ ] Initialize backend with Express + TypeScript
- [ ] Set up Redux Toolkit
- [ ] Set up React Router

### Phase 2: Shared Components
- [ ] Migrate [`Badge`](../Downloads/FanVerseAI.jsx:188-199)
- [ ] Migrate [`XPBar`](../Downloads/FanVerseAI.jsx:201-212)
- [ ] Migrate [`MiniBar`](../Downloads/FanVerseAI.jsx:214-220)
- [ ] Migrate [`StatTile`](../Downloads/FanVerseAI.jsx:222-231)
- [ ] Migrate [`SectionHeader`](../Downloads/FanVerseAI.jsx:233-243)
- [ ] Migrate [`LivePill`](../Downloads/FanVerseAI.jsx:245-253)
- [ ] Migrate [`RarityColor`](../Downloads/FanVerseAI.jsx:255-256)

### Phase 3: Layout Components
- [ ] Migrate [`Sidebar`](../Downloads/FanVerseAI.jsx:258-323)
- [ ] Create `MainLayout` wrapper

### Phase 4: Page Components
- [ ] Migrate [`LandingPage`](../Downloads/FanVerseAI.jsx:325-449)
- [ ] Migrate [`Dashboard`](../Downloads/FanVerseAI.jsx:451-669)
- [ ] Migrate [`PredictionArena`](../Downloads/FanVerseAI.jsx:671-869)
- [ ] Migrate [`Leaderboard`](../Downloads/FanVerseAI.jsx:871-1003)
- [ ] Migrate [`ClanBattles`](../Downloads/FanVerseAI.jsx:1005-1145)
- [ ] Migrate [`Profile`](../Downloads/FanVerseAI.jsx:1147-1283)
- [ ] Migrate [`QuestCenter`](../Downloads/FanVerseAI.jsx:1285-1351)

### Phase 5: Styles
- [ ] Create `GlobalStyles.ts`
- [ ] Create `theme.ts`
- [ ] Apply styled-components

### Phase 6: State Management
- [ ] Create Redux slices
- [ ] Connect components to Redux
- [ ] Replace local state with global state

### Phase 7: API Integration
- [ ] Create API services
- [ ] Replace mock data with API calls
- [ ] Add loading states
- [ ] Add error handling

### Phase 8: Real-time Features
- [ ] Set up WebSocket service
- [ ] Connect to live match updates
- [ ] Add real-time notifications

---

## 🎯 Priority Order

1. **High Priority** (Core functionality)
   - Shared components (Badge, XPBar, etc.)
   - Sidebar navigation
   - Dashboard page
   - Authentication flow

2. **Medium Priority** (Main features)
   - Prediction Arena
   - Leaderboard
   - Profile page

3. **Low Priority** (Additional features)
   - Clan Battles
   - Quest Center
   - Advanced animations

---

## 📝 Notes

- Keep the original file as reference during migration
- Test each component individually before integration
- Maintain the same visual design and animations
- Add TypeScript types for all props and state
- Write unit tests for each component
- Document any breaking changes or new features

---

**Migration Status**: Planning Phase  
**Last Updated**: 2026-05-16  
**Estimated Completion**: 2-3 weeks for full migration