import { useState, useEffect, createContext, useContext } from 'react';
import ApiTest from './components/ApiTest';


const API_URL = 'http://localhost:5000/api';

const AuthContext = createContext(null);

const makeRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
};

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const data = await makeRequest('/auth/me');
        setUser(data);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const data = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const register = async (username, email, password, role) => {
    const data = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, role }),
    });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => useContext(AuthContext);

function LoginPage({ onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} className="text-blue-600 hover:underline">
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

function RegisterPage({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useAuth();

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    try {
      await register(formData.username, formData.email, formData.password, formData.role);
      setSuccess('Registration successful! Please login.');
      setTimeout(() => onSwitchToLogin(), 2000);
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Register</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="user">User</option>
              <option value="leader">Leader</option>
              <option value="supervisor">Supervisor</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Register
          </button>
        </div>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="text-green-600 hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

function Dashboard() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [projectForm, setProjectForm] = useState({ name: '', description: '' });

  useEffect(() => {
    loadData();
  }, [user, activeTab]);

  const loadData = async () => {
    try {
      if (activeTab === 'users' && ['admin', 'manager'].includes(user.role)) {
        const data = await makeRequest('/users');
        setUsers(data);
      }
      if (activeTab === 'projects') {
        const data = await makeRequest('/projects');
        setProjects(data);
      }
      if (activeTab === 'dashboard' && ['admin', 'manager', 'supervisor'].includes(user.role)) {
        const data = await makeRequest('/dashboard/stats');
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleCreateProject = async () => {
    try {
      await makeRequest('/projects', {
        method: 'POST',
        body: JSON.stringify(projectForm),
      });
      setProjectForm({ name: '', description: '' });
      loadData();
      alert('Project created successfully!');
    } catch (error) {
      alert(error.message || 'Failed to create project');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await makeRequest(`/users/${id}`, { method: 'DELETE' });
        loadData();
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'bg-red-500',
      manager: 'bg-purple-500',
      supervisor: 'bg-blue-500',
      leader: 'bg-green-500',
      user: 'bg-gray-500'
    };
    return colors[role] || 'bg-gray-500';
  };

  const canAccessTab = (tab) => {
    if (tab === 'users') return ['admin', 'manager'].includes(user.role);
    if (tab === 'dashboard') return ['admin', 'manager', 'supervisor'].includes(user.role);
    if (tab === 'create-project') return ['admin', 'manager', 'leader'].includes(user.role);
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Multi-Role App</h1>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-white text-sm ${getRoleBadgeColor(user.role)}`}>
              {user.role.toUpperCase()}
            </span>
            <span className="text-gray-700">{user.username}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 whitespace-nowrap ${activeTab === 'profile' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Profile
            </button>
            {canAccessTab('dashboard') && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-3 whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Dashboard
              </button>
            )}
            {canAccessTab('users') && (
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-3 whitespace-nowrap ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Users
              </button>
            )}
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-6 py-3 whitespace-nowrap ${activeTab === 'projects' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Projects
            </button>
            {canAccessTab('create-project') && (
              <button
                onClick={() => setActiveTab('create-project')}
                className={`px-6 py-3 whitespace-nowrap ${activeTab === 'create-project' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Create Project
              </button>
            )}
          </div>

          <div className="p-6">



            <ApiTest />
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
                <div className="space-y-3">
                  <p><span className="font-semibold">Username:</span> {user.username}</p>
                  <p><span className="font-semibold">Email:</span> {user.email}</p>
                  <p><span className="font-semibold">Role:</span> <span className={`px-3 py-1 rounded-full text-white text-sm ${getRoleBadgeColor(user.role)}`}>{user.role}</span></p>
                </div>
              </div>
            )}

            {activeTab === 'dashboard' && stats && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Dashboard Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-100 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Total Users</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                  </div>
                  <div className="bg-green-100 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Role Distribution</h3>
                    <div className="space-y-2">
                      {stats.roleDistribution.map((r) => (
                        <div key={r.role} className="flex justify-between">
                          <span className="capitalize">{r.role}:</span>
                          <span className="font-bold">{r.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">User Management</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Username</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Role</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2">{u.id}</td>
                          <td className="px-4 py-2">{u.username}</td>
                          <td className="px-4 py-2">{u.email}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded text-white text-xs ${getRoleBadgeColor(u.role)}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            {user.role === 'admin' && u.id !== user.id && (
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((p) => (
                    <div key={p.id} className="bg-gray-50 p-4 rounded-lg border">
                      <h3 className="font-bold text-lg mb-2">{p.name}</h3>
                      <p className="text-gray-600 mb-2">{p.description}</p>
                      <p className="text-sm text-gray-500">Created by: {p.creator}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'create-project' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-gray-700 mb-2">Project Name</label>
                    <input
                      type="text"
                      value={projectForm.name}
                      onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Description</label>
                    <textarea
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                    />
                  </div>
                  <button
                    onClick={handleCreateProject}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Create Project
                  </button>
                </div>
              </div>
            )}




          </div>
        </div>
      </div>
    </div>
  );
}












export default function App() {
  const [showRegister, setShowRegister] = useState(false);

  return (

    
    <AuthProvider>
      <AuthContext.Consumer>
        {({ user, loading }) => {
          if (loading) {
            return (
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl">Loading...</div>
              </div>
            );
          }

          if (!user) {
            return showRegister ? (
              <RegisterPage onSwitchToLogin={() => setShowRegister(false)} />
            ) : (
              <LoginPage onSwitchToRegister={() => setShowRegister(true)} />
            );
          }

          return <Dashboard />;
        }}
      </AuthContext.Consumer>
    </AuthProvider>
  );
}
