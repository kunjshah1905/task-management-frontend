# 🏗️ Application Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 15)                         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Landing    │  │    Login     │  │   Register   │         │
│  │     Page     │  │     Page     │  │     Page     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │           Tasks Dashboard (Kanban Board)             │      │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐             │      │
│  │  │ To Do   │  │In Progress│ │Completed│             │      │
│  │  │  [📋]   │  │   [⚙️]    │  │  [✅]   │             │      │
│  │  └─────────┘  └─────────┘  └─────────┘             │      │
│  │         Drag & Drop with @dnd-kit                   │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │              Redux Store (State Management)          │      │
│  │  ┌──────────────┐         ┌──────────────┐          │      │
│  │  │  Auth Slice  │         │  Task Slice  │          │      │
│  │  │  - user      │         │  - tasks[]   │          │      │
│  │  │  - token     │         │  - loading   │          │      │
│  │  │  - isAuth    │         │  - error     │          │      │
│  │  └──────────────┘         └──────────────┘          │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │                  UI Components                        │      │
│  │  • TaskCard    • KanbanBoard   • TaskDialog          │      │
│  │  • Button      • Input         • Select              │      │
│  │  • Card        • Dialog        • Toast               │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                  │
│  Technologies:                                                   │
│  • React 19 • TypeScript • Tailwind CSS                         │
│  • Framer Motion • Redux Toolkit • React Hook Form + Zod       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              │ JWT Token in Headers
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API SERVICE LAYER                             │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │              lib/api.ts (API Client)                 │      │
│  │  • Token Management                                  │      │
│  │  • Error Handling                                    │      │
│  │  • Request/Response Interceptors                     │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND (NestJS API)                           │
│                   http://localhost:3000/api                      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │              Authentication Endpoints                 │      │
│  │  POST /auth/register  - Create new user              │      │
│  │  POST /auth/login     - Login & get JWT token        │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │              Task Endpoints (Protected)               │      │
│  │  GET    /tasks      - Get all user tasks             │      │
│  │  POST   /tasks      - Create new task                │      │
│  │  PUT    /tasks/:id  - Update task                    │      │
│  │  DELETE /tasks/:id  - Delete task                    │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                  │
│  Technologies:                                                   │
│  • NestJS • TypeORM • JWT • class-validator                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE (MySQL)                            │
│                                                                  │
│  ┌──────────────┐              ┌──────────────┐                │
│  │    Users     │              │    Tasks     │                │
│  ├──────────────┤              ├──────────────┤                │
│  │ id           │              │ id           │                │
│  │ email        │◄─────────────│ userId (FK)  │                │
│  │ password     │              │ title        │                │
│  │ createdAt    │              │ description  │                │
│  │ updatedAt    │              │ status       │                │
│  └──────────────┘              │ dueDate      │                │
│                                 │ createdAt    │                │
│                                 │ updatedAt    │                │
│                                 └──────────────┘                │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Authentication Flow
```
User → Register/Login Page → API Service → Backend API → Database
                                    ↓
                              JWT Token Stored
                                    ↓
                              Redux Auth State Updated
                                    ↓
                              Redirect to Tasks Dashboard
```

### 2. Task Creation Flow
```
User → Click "New Task" → TaskDialog Opens → Fill Form → Submit
                                                            ↓
                                                    Validate with Zod
                                                            ↓
                                                    API Service (with JWT)
                                                            ↓
                                                    Backend API
                                                            ↓
                                                    Save to Database
                                                            ↓
                                                    Return Task Object
                                                            ↓
                                                    Redux Store Updated
                                                            ↓
                                                    UI Re-renders
                                                            ↓
                                                    Task Appears on Board
```

### 3. Drag & Drop Flow
```
User → Drag Task Card → Drop in New Column
                              ↓
                    Optimistic UI Update (Redux)
                              ↓
                    API Call to Update Status
                              ↓
                    Backend Updates Database
                              ↓
                    Success → Keep UI Change
                    Error → Revert UI & Show Toast
```

## Component Hierarchy

```
App (layout.tsx)
├── Redux Provider
│   └── Store
│       ├── Auth Slice
│       └── Task Slice
└── Pages
    ├── Landing Page (/)
    │   └── Hero Section
    │       ├── Features Grid
    │       └── CTA Buttons
    │
    ├── Login Page (/login)
    │   └── Login Form
    │       ├── Email Input
    │       ├── Password Input
    │       └── Submit Button
    │
    ├── Register Page (/register)
    │   └── Register Form
    │       ├── Email Input
    │       ├── Password Input
    │       ├── Confirm Password Input
    │       └── Submit Button
    │
    └── Tasks Page (/tasks)
        ├── Header
        │   ├── Title
        │   ├── User Info
        │   ├── New Task Button
        │   └── Logout Button
        │
        ├── Statistics Cards
        │   ├── To Do Count
        │   ├── In Progress Count
        │   └── Completed Count
        │
        ├── Kanban Board
        │   ├── To Do Column
        │   │   └── Task Cards (Draggable)
        │   ├── In Progress Column
        │   │   └── Task Cards (Draggable)
        │   └── Completed Column
        │       └── Task Cards (Draggable)
        │
        └── Task Dialog (Modal)
            └── Task Form
                ├── Title Input
                ├── Description Textarea
                ├── Status Select
                ├── Due Date Input
                └── Submit Button
```

## State Management

### Redux Store Structure
```javascript
{
  auth: {
    user: {
      id: number,
      email: string
    } | null,
    token: string | null,
    isAuthenticated: boolean
  },
  tasks: {
    tasks: Task[],
    loading: boolean,
    error: string | null
  }
}
```

### Task Object Structure
```typescript
{
  id: number,
  title: string,
  description: string,
  status: 'To Do' | 'In Progress' | 'Completed',
  dueDate: string,
  userId: number,
  createdAt: string,
  updatedAt: string
}
```

## Security Layers

1. **Frontend**
   - Form validation (Zod schemas)
   - Protected routes (redirect if not authenticated)
   - XSS prevention (React's built-in escaping)

2. **API Layer**
   - JWT token in Authorization header
   - Token validation before requests
   - Error handling and user feedback

3. **Backend**
   - JWT authentication middleware
   - Password hashing (bcrypt)
   - Input validation (class-validator)
   - CORS configuration
   - SQL injection prevention (TypeORM)

## Performance Optimizations

1. **Code Splitting**
   - Next.js automatic code splitting
   - Dynamic imports for heavy components

2. **State Management**
   - Redux Toolkit for efficient updates
   - Optimistic UI updates for drag & drop

3. **Caching**
   - Browser caching for static assets
   - API response caching (if implemented)

4. **Animations**
   - GPU-accelerated transforms
   - Framer Motion optimization

## Scalability Considerations

1. **Frontend**
   - Static generation where possible
   - CDN deployment (Vercel Edge)
   - Image optimization

2. **Backend**
   - Horizontal scaling capability
   - Database connection pooling
   - Caching layer (Redis - if needed)

3. **Database**
   - Indexed columns (id, userId, status)
   - Query optimization
   - Read replicas for high traffic

---

This architecture provides a solid foundation for a production-ready task management system with room for future enhancements.
