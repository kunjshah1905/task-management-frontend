# Quick Start Guide

## 🚀 Getting Started

### 1. Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 2. Install Dependencies (Already Done ✅)

Dependencies have been installed. If you need to reinstall:

```bash
npm install --legacy-peer-deps
```

### 3. Start the Backend API

Make sure your NestJS backend is running on `http://localhost:3000`

The backend should have the following endpoints available:
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/tasks`
- POST `/api/tasks`
- PUT `/api/tasks/:id`
- DELETE `/api/tasks/:id`

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:8080**

## 📱 Using the Application

### First Time Setup

1. **Navigate to** `http://localhost:8080`
2. **Click "Get Started"** or go to `/register`
3. **Create an account** with your email and password
4. **Sign in** with your credentials
5. **Start creating tasks!**

### Creating Tasks

1. Click the **"New Task"** button
2. Fill in:
   - **Title**: Task name
   - **Description**: Task details
   - **Status**: To Do, In Progress, or Completed
   - **Due Date**: Deadline for the task
3. Click **"Create Task"**

### Managing Tasks

- **Drag & Drop**: Move tasks between columns by dragging
- **Edit**: Click the edit icon on any task card
- **Delete**: Click the trash icon (with confirmation)
- **View Stats**: See task counts at the top of the page

## 🎨 Features

### Kanban Board
- **To Do**: Tasks that haven't been started
- **In Progress**: Tasks currently being worked on
- **Completed**: Finished tasks

### Drag & Drop
- Smooth animations
- Real-time status updates
- Optimistic UI updates

### Task Cards
- Title and description
- Due date display
- Overdue indicators
- Quick edit and delete actions

## 🔧 Troubleshooting

### Backend Connection Issues

If you see authentication or API errors:

1. Verify backend is running: `http://localhost:3000`
2. Check `.env.local` has correct API URL
3. Ensure CORS is enabled in backend
4. Check browser console for detailed errors

### Build Issues

If you encounter build errors:

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Port Already in Use

If port 8080 is busy:

```bash
# Use a different port
npm run dev -- -p 3001
```

## 📚 API Integration

The frontend expects these response formats:

### Register Response
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

### Login Response
```json
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

### Task Response
```json
{
  "id": 1,
  "title": "Task Title",
  "description": "Task Description",
  "status": "To Do",
  "dueDate": "2025-12-31",
  "userId": 1,
  "createdAt": "2025-11-30T...",
  "updatedAt": "2025-11-30T..."
}
```

## 🎯 Next Steps

1. **Customize Styling**: Edit `app/globals.css` for theme changes
2. **Add Features**: Extend functionality in `components/` and `store/`
3. **Deploy**: Build for production with `npm run build`

## 💡 Tips

- Use **Ctrl/Cmd + Click** to open links in new tabs
- Tasks are **automatically saved** when you drag them
- **Overdue tasks** are highlighted in red
- **Logout** to switch accounts

## 🐛 Common Issues

### "Cannot find module" errors
Run: `npm install --legacy-peer-deps`

### API not responding
Check that backend is running and `.env.local` is configured

### Tasks not loading
Verify JWT token is valid (check browser localStorage)

---

**Enjoy managing your tasks! 🎉**
