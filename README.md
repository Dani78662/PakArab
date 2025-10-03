# MERN Stack Project

This is a MERN stack application with role-based authentication for electricity bill management.

## Features

- User authentication with JWT
- Role-based access (Admin, Ramzin, Editor)
- Bill creation and management
- Image upload functionality
- Responsive design
- Print functionality

## Deployment on Render

### Backend Deployment

1. **Create a new Web Service on Render**
   - Connect your GitHub repository
   - Set the following configuration:
     - **Build Command**: `cd server && npm install`
     - **Start Command**: `cd server && npm start`
     - **Environment**: Node

2. **Environment Variables** (Set in Render dashboard):
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret
   ```

3. **Update CORS Configuration** in `server/index.js`:
   - Replace `https://your-frontend-render-url.onrender.com` with your actual frontend URL

### Frontend Deployment

1. **Create a new Static Site on Render**
   - Connect your GitHub repository
   - Set the following configuration:
     - **Build Command**: `cd client && npm install && npm run build`
     - **Publish Directory**: `client/build`

2. **Environment Variables** (Set in Render dashboard):
   ```
   REACT_APP_API_URL=https://your-backend-render-url.onrender.com
   ```

### Important Notes

- Make sure to replace the placeholder URLs with your actual Render URLs
- The backend URL should be the full URL including `https://`
- Both services should be deployed and running before testing
- Check the Render logs for any deployment issues

### Local Development

1. **Backend**:
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. **Frontend**:
   ```bash
   cd client
   npm install
   npm start
   ```

The application will be available at `http://localhost:3000` and the API at `http://localhost:5000`.

### Troubleshooting

If buttons are not working on Render:

1. Check browser console for CORS errors
2. Verify the `REACT_APP_API_URL` environment variable is set correctly
3. Ensure the backend URL in CORS configuration matches your frontend URL
4. Check Render logs for both frontend and backend services
5. Verify MongoDB connection is working

### Default Users

The application includes default users for testing:
- Admin: admin/admin123
- Ramzin: ramzin/ramzin123  
- Editor: editor/editor123