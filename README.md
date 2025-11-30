# Task Management System

A modern, production-ready task management application built with Next.js 15 and NestJS, featuring a beautiful drag-and-drop Kanban board.

## Features

- 🎯 **Task Management**: Create, read, update, and delete tasks
- 🎨 **Drag & Drop Kanban Board**: Smooth animations with @dnd-kit
- 🔐 **JWT Authentication**: Secure user authentication
- 📊 **Real-time Statistics**: Track your productivity
- 🎭 **Beautiful UI**: Modern design with Tailwind CSS and Framer Motion
- 📱 **Responsive**: Works on all devices
- ⚡ **Next.js 15**: Latest features and optimizations
- 🔄 **Redux Toolkit**: Efficient state management

## Tech Stack

### Frontend
- **Next.js 15**: React framework
- **TypeScript**: Type safety
- **Redux Toolkit**: State management
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations
- **@dnd-kit**: Drag and drop
- **Radix UI**: Accessible components
- **React Hook Form + Zod**: Form validation

### Backend
- **NestJS**: Node.js framework
- **MySQL**: Database
- **TypeORM**: ORM
- **JWT**: Authentication
- **class-validator**: Validation

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MySQL database
- Backend API running on `http://localhost:3000/api`

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment**:
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

3. **Run the development server**:
```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with Redux Provider
│   ├── page.tsx            # Landing page
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   └── tasks/              # Main tasks page with Kanban board
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── TaskCard.tsx        # Task card with drag support
│   ├── KanbanBoard.tsx     # Kanban board component
│   └── TaskDialog.tsx      # Task create/edit dialog
├── store/
│   ├── index.ts            # Redux store configuration
│   ├── authSlice.ts        # Authentication state
│   └── taskSlice.ts        # Tasks state
├── lib/
│   ├── api.ts              # API service layer
│   └── utils.ts            # Utility functions
└── types/
    └── task.ts             # TypeScript type definitions
```

## API Endpoints

The frontend connects to the following backend endpoints:

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Tasks (Protected)
- `GET /api/tasks` - Get all tasks for logged-in user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Features in Detail

### Kanban Board
- Three columns: To Do, In Progress, Completed
- Drag and drop tasks between columns
- Smooth animations and transitions
- Real-time status updates

### Task Management
- Create tasks with title, description, status, and due date
- Edit existing tasks
- Delete tasks with confirmation
- Overdue task indicators

### Authentication
- Secure JWT-based authentication
- Protected routes
- Automatic token management
- Session persistence

### UI/UX
- Modern, clean design
- Smooth animations with Framer Motion
- Toast notifications for user feedback
- Responsive layout for all screen sizes
- Dark mode support

## Building for Production

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3000/api` |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Author

Built with ❤️ using Next.js 15 and modern web technologies
