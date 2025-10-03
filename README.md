# MERN Stack Project with Role-Based Authentication

A full-stack web application built with MongoDB, Express.js, React, and Node.js featuring role-based authentication and data management.

## Features

### 🔐 Authentication System
- JWT-based authentication
- Three distinct user roles: Admin, Ramzin, and Editor
- Secure password hashing with bcrypt
- Protected routes with role-based access control

### 👥 User Roles & Dashboards

#### Admin Dashboard
- Full system access
- Welcome page with admin privileges overview
- Placeholder for future admin features

#### Ramzin Dashboard
- Search functionality across all data entries
- View all data in a table format
- Detailed view for individual entries
- Real-time data filtering

#### Editor Dashboard
- Create new data entries
- Form validation
- Success/error feedback
- Data immediately visible to Ramzin users

### 🛠 Technical Features
- Modern React with Hooks and Context API
- Responsive design with Tailwind CSS
- RESTful API with Express.js
- MongoDB for data persistence
- Axios for HTTP requests
- React Router for navigation

## Project Structure

```
mern-stack-project/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React Context (Auth)
│   │   ├── pages/          # Page components
│   │   └── App.js          # Main app component
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── config.env          # Environment variables
│   ├── index.js            # Server entry point
│   └── package.json
├── package.json            # Root package.json
└── README.md
```

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (running locally or MongoDB Atlas)
- **npm** or **yarn**

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mern-stack-project
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
npm run install-server

# Install client dependencies
npm run install-client
```

### 3. Environment Configuration

Create a `.env` file in the `server` directory:
```bash
cd server
cp config.env .env
```

Update the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern_project
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
NODE_ENV=development
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For local MongoDB
mongod

# Or if using MongoDB as a service
sudo systemctl start mongod
```

### 5. Create Default Users
Start the server and create default users:
```bash
# Start the server
cd server
npm run dev

# In another terminal, create default users
curl -X POST http://localhost:5000/api/auth/create-default-users
```

### 6. Run the Application

#### Option 1: Run both client and server concurrently
```bash
npm run dev
```

#### Option 2: Run separately
```bash
# Terminal 1 - Start the server
npm run server

# Terminal 2 - Start the client
npm run client
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Default Login Credentials

| Role    | Username | Password  |
|---------|----------|-----------|
| Admin   | admin    | admin123  |
| Ramzin  | ramzin   | ramzin123 |
| Editor  | editor   | editor123 |

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/create-default-users` - Create default users (dev only)

### Data Management
- `POST /api/data/create` - Create new data entry (Editor only)
- `GET /api/data/list` - Get all data entries (Ramzin only)
- `GET /api/data/search?query=<search_term>` - Search data (Ramzin only)
- `GET /api/data/:id` - Get specific data entry (Ramzin only)

## Usage Guide

### 1. Landing Page
- Choose your role (Admin, Ramzin, or Editor)
- Click on the role button to expand the login form
- Enter your credentials and click Login

### 2. Admin Dashboard
- View admin privileges and system overview
- Placeholder for future admin features

### 3. Ramzin Dashboard
- Use the search bar to find specific data entries
- Click "View All" to see all data entries
- Click "View Details" on any entry to see full information
- Data is displayed in a clean table format

### 4. Editor Dashboard
- Fill out the form with required information:
  - Name (required)
  - Email (required, validated)
  - Phone (required)
  - Description (required)
- Click "Create Data Entry" to save
- Success/error messages will be displayed
- Created data is immediately available to Ramzin users

## Technologies Used

### Frontend
- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Development Tools
- **Nodemon** - Development server
- **Concurrently** - Run multiple commands
- **PostCSS** - CSS processing

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Protected API routes

## Future Enhancements

- User registration system
- Password reset functionality
- Data editing and deletion
- File upload capabilities
- Real-time notifications
- Advanced search filters
- Data export functionality
- Admin user management
- Audit logging
- Email notifications

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the connection string in `.env`
   - Verify MongoDB is accessible on the specified port

2. **Port Already in Use**
   - Change the PORT in `.env` file
   - Kill existing processes using the port

3. **Authentication Issues**
   - Ensure JWT_SECRET is set in `.env`
   - Check if default users are created
   - Verify token is being sent in requests

4. **CORS Errors**
   - Check CORS configuration in server
   - Ensure frontend is running on correct port

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
