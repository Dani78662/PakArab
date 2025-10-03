import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [expandedRole, setExpandedRole] = useState(null);
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { id: 'admin', name: 'Admin', color: 'bg-red-500 hover:bg-red-600', dashboard: '/admin-dashboard' },
    { id: 'ramzin', name: 'Ramzin', color: 'bg-blue-500 hover:bg-blue-600', dashboard: '/ramzin-dashboard' },
    { id: 'editor', name: 'Editor', color: 'bg-green-500 hover:bg-green-600', dashboard: '/editor-dashboard' }
  ];

  const handleRoleClick = (roleId) => {
    if (expandedRole === roleId) {
      setExpandedRole(null);
      setLoginData({ username: '', password: '' });
      setError('');
    } else {
      setExpandedRole(roleId);
      setLoginData({ username: '', password: '' });
      setError('');
    }
  };

  const handleInputChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleLogin = async (role) => {
    if (!loginData.username || !loginData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(loginData.username, loginData.password, role);
      
      if (result.success) {
        const roleConfig = roles.find(r => r.id === role);
        navigate(roleConfig.dashboard);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to MERN Stack App
          </h1>
          <p className="text-gray-600">
            Choose your role to continue
          </p>
        </div>

        <div className="space-y-4">
          {roles.map((role) => (
            <div key={role.id} className="relative">
              <button
                onClick={() => handleRoleClick(role.id)}
                className={`w-full ${role.color} text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg`}
                disabled={loading}
              >
                Login as {role.name}
              </button>

              {expandedRole === role.id && (
                <div className="mt-4 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={loginData.username}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter username"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter password"
                        disabled={loading}
                      />
                    </div>

                    {error && (
                      <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                        {error}
                      </div>
                    )}

                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleLogin(role.id)}
                        disabled={loading}
                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Logging in...' : 'Login'}
                      </button>
                      <button
                        onClick={() => handleRoleClick(role.id)}
                        disabled={loading}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center text-sm text-gray-500 mt-8">
          <p>Default credentials:</p>
          <p>Admin: admin / admin123</p>
          <p>Ramzin: ramzin / ramzin123</p>
          <p>Editor: editor / editor123</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
