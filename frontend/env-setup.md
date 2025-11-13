# Environment Setup Instructions

## Frontend Environment Variables

Create a `.env` file in the `frontend` directory with the following content:

```env
# Frontend Environment Variables
VITE_SYS_MODE=development
VITE_BACKEND_URL=http://localhost:3000
VITE_BACKEND_PROD=https://your-production-url.com
VITE_FRONT_END_URL=http://localhost:5173
```

## Backend Environment Variables

Create a `.env` file in the `backend` directory with the following content:

```env
# Backend Environment Variables
PORT=3000
FRONT_END_URL=http://localhost:5173
NODE_ENV=development

# Add your other environment variables here (database, etc.)
```

## Socket.IO Connection Fix

The WebSocket connection issue has been fixed by:

1. **Frontend**: Updated socket configuration to use correct backend URL (localhost:3000)
2. **Backend**: Updated CORS settings to allow frontend URL (localhost:5173)
3. **Added fallback transports**: Both websocket and polling for better compatibility
4. **Added timeout and reconnection settings**: Better error handling

## How to Apply the Fix

1. Create the `.env` files as shown above
2. Restart both frontend and backend servers
3. The WebSocket connection should now work properly

## Troubleshooting

If you still have issues:

1. Check that backend is running on port 3000
2. Check that frontend is running on port 5173
3. Verify the `.env` files are in the correct locations
4. Check browser console for any remaining errors
