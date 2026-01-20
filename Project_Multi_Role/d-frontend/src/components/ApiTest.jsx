import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Collapse,
  List,
  ListItemText,
  ListItemButton
} from '@mui/material';
import {
  Send as SendIcon,
  ContentCopy as CopyIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Work as WorkIcon
} from '@mui/icons-material';

const ApiTest = () => {
  // State untuk konfigurasi API
  const [config, setConfig] = useState({
    baseUrl: 'http://localhost:5000',
    environment: 'local',
    useLocal: true
  });

  // State untuk token JWT
  const [token, setToken] = useState(localStorage.getItem('api_token') || '');
  const [currentUser, setCurrentUser] = useState(null);

  // State untuk data form
  const [registerData, setRegisterData] = useState({
    username: 'test_user',
    email: 'test@example.com',
    password: 'password123',
    role: 'user'
  });

  const [loginData, setLoginData] = useState({
    email: 'test@example.com',
    password: 'password123'
  });

  const [updateUserData, setUpdateUserData] = useState({
    id: '',
    username: '',
    email: '',
    role: 'user'
  });

  const [deleteUserData, setDeleteUserData] = useState({
    id: ''
  });

  const [projectData, setProjectData] = useState({
    name: 'Project Baru',
    description: 'Deskripsi project baru'
  });

  // State untuk response dan status
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [expandedSections, setExpandedSections] = useState({});
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);

  // State untuk notifikasi
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Role options
  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'leader', label: 'Leader' },
    { value: 'user', label: 'User' }
  ];

  // Konfigurasi endpoints
  const endpoints = [
    {
      name: 'Register',
      method: 'POST',
      url: '/api/auth/register',
      requiresToken: false,
      tab: 0
    },
    {
      name: 'Login',
      method: 'POST',
      url: '/api/auth/login',
      requiresToken: false,
      tab: 0
    },
    {
      name: 'Get Current User',
      method: 'GET',
      url: '/api/auth/me',
      requiresToken: true,
      tab: 1
    },
    {
      name: 'Get All Users',
      method: 'GET',
      url: '/api/users',
      requiresToken: true,
      requiresRole: ['admin'],
      tab: 1
    },
    {
      name: 'Update User',
      method: 'PUT',
      url: '/api/users/:id',
      requiresToken: true,
      requiresRole: ['admin', 'manager'],
      tab: 1
    },
    {
      name: 'Delete User',
      method: 'DELETE',
      url: '/api/users/:id',
      requiresToken: true,
      requiresRole: ['admin'],
      tab: 1
    },
    {
      name: 'Get Dashboard Stats',
      method: 'GET',
      url: '/api/dashboard/stats',
      requiresToken: true,
      requiresRole: ['admin', 'manager', 'supervisor'],
      tab: 2
    },
    {
      name: 'Create Project',
      method: 'POST',
      url: '/api/projects',
      requiresToken: true,
      requiresRole: ['admin', 'manager', 'leader'],
      tab: 3
    },
    {
      name: 'Get All Projects',
      method: 'GET',
      url: '/api/projects',
      requiresToken: true,
      tab: 3
    }
  ];

  // Setup axios default
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Fungsi untuk menampilkan snackbar
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Fungsi untuk toggle expanded section
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Fungsi untuk copy text
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showSnackbar('Berhasil disalin ke clipboard!', 'info');
  };

  // Fungsi untuk membuat request
  const makeRequest = async (endpointName, data = null) => {
    setLoading(prev => ({ ...prev, [endpointName]: true }));
    
    try {
      const endpoint = endpoints.find(e => e.name === endpointName);
      let url = config.baseUrl + endpoint.url;
      
      if (endpointName === 'Update User' || endpointName === 'Delete User') {
        url = url.replace(':id', data?.id || '');
      }

      let response;
      const configAxios = {
        headers: {}
      };

      // Tambahkan token jika diperlukan
      if (endpoint.requiresToken && token) {
        configAxios.headers['Authorization'] = `Bearer ${token}`;
      }

      switch (endpoint.method) {
        case 'GET':
          response = await axios.get(url, configAxios);
          break;
        case 'POST':
          response = await axios.post(url, data, configAxios);
          break;
        case 'PUT':
          response = await axios.put(url, data, configAxios);
          break;
        case 'DELETE':
          response = await axios.delete(url, configAxios);
          break;
        default:
          throw new Error('Method not supported');
      }

      setResponses(prev => ({
        ...prev,
        [endpointName]: {
          status: response.status,
          data: response.data,
          timestamp: new Date().toLocaleTimeString()
        }
      }));

      switch (endpointName) {
        case 'Login':
          const newToken = response.data.token;
          setToken(newToken);
          localStorage.setItem('api_token', newToken);
          setCurrentUser(response.data.user);
          showSnackbar('Login berhasil!', 'success');
          break;
        case 'Get Current User':
          setCurrentUser(response.data);
          break;
        case 'Get All Users':
          setUsers(response.data);
          break;
        case 'Get Dashboard Stats':
          setStats(response.data);
          break;
        case 'Get All Projects':
          setProjects(response.data);
          break;
        case 'Register':
        case 'Update User':
        case 'Delete User':
        case 'Create Project':
          showSnackbar(`${endpointName} berhasil!`, 'success');
          if (token) {
            if (endpointName === 'Delete User' || endpointName === 'Update User') {
              makeRequest('Get All Users');
            }
            if (endpointName === 'Create Project') {
              makeRequest('Get All Projects');
            }
          }
          break;
      }

    } catch (error) {
      console.error('API Error:', error);
      setResponses(prev => ({
        ...prev,
        [endpointName]: {
          status: error.response?.status || 500,
          data: error.response?.data || { message: error.message },
          timestamp: new Date().toLocaleTimeString(),
          error: true
        }
      }));
      
      // Tampilkan error yang lebih spesifik
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Terjadi kesalahan';
      showSnackbar(errorMessage, 'error');
    } finally {
      setLoading(prev => ({ ...prev, [endpointName]: false }));
    }
  };

  // Fungsi untuk logout
  const handleLogout = () => {
    setToken('');
    setCurrentUser(null);
    localStorage.removeItem('api_token');
    showSnackbar('Logout berhasil!', 'info');
  };

  // Fungsi untuk switch environment
  const switchEnvironment = () => {
    if (config.useLocal) {
      setConfig(prev => ({
        ...prev,
        baseUrl: 'http://api-v1.pasbatron.net',
        useLocal: false,
        environment: 'production'
      }));
      showSnackbar('Switched to Production environment', 'info');
    } else {
      setConfig(prev => ({
        ...prev,
        baseUrl: 'http://localhost:5000',
        useLocal: true,
        environment: 'local'
      }));
      showSnackbar('Switched to Local environment', 'info');
    }
  };

  // Check if user has access to endpoint
  const hasAccessToEndpoint = (endpoint) => {
    if (!endpoint.requiresToken) return true;
    if (!token) return false;
    if (!endpoint.requiresRole) return true;
    if (!currentUser) return false;
    return endpoint.requiresRole.includes(currentUser.role);
  };

  return (
    <Box sx={{ p: 3, maxWidth: '100%', overflow: 'auto' }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          🔧 API Testing Dashboard
        </Typography>
        <Typography variant="subtitle1">
          Testing tool untuk User Management System API
        </Typography>
      </Paper>

      {/* Configuration Panel */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              ⚙️ Configuration
            </Typography>
            <Chip 
              label={config.environment === 'local' ? '🖥️ Local Environment' : '🌐 Production Environment'} 
              color={config.environment === 'local' ? 'primary' : 'secondary'}
              onClick={switchEnvironment}
              clickable
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
            <TextField
              fullWidth
              label="Base URL"
              value={config.baseUrl}
              onChange={(e) => setConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
              size="small"
            />
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: { xs: '100%', md: '50%' } }}>
              <TextField
                fullWidth
                label="JWT Token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                size="small"
                type="password"
              />
              <IconButton
                onClick={() => copyToClipboard(token)}
                disabled={!token}
                size="small"
              >
                <CopyIcon />
              </IconButton>
              {token && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              )}
            </Box>
          </Box>

          {/* Status Bar */}
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              icon={token ? <CheckCircleIcon /> : <ErrorIcon />}
              label={token ? "Authenticated" : "Not Authenticated"}
              color={token ? "success" : "error"}
              size="small"
            />
            <Chip
              label={`User: ${currentUser?.username || 'None'}`}
              color="info"
              size="small"
            />
            <Chip
              label={`Role: ${currentUser?.role || 'None'}`}
              color="warning"
              size="small"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Tabs Navigation */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<LockIcon />} label="Authentication" />
          <Tab icon={<PersonIcon />} label="User Management" />
          <Tab icon={<DashboardIcon />} label="Dashboard" />
          <Tab icon={<WorkIcon />} label="Projects" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Register User
                </Typography>
                <TextField
                  fullWidth
                  label="Username"
                  value={registerData.username}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                  margin="normal"
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                  margin="normal"
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                  margin="normal"
                  size="small"
                />
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={registerData.role}
                    label="Role"
                    onChange={(e) => setRegisterData(prev => ({ ...prev, role: e.target.value }))}
                  >
                    {roleOptions.map(role => (
                      <MenuItem key={role.value} value={role.value}>
                        {role.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={() => makeRequest('Register', registerData)}
                  disabled={loading['Register']}
                  startIcon={loading['Register'] ? <CircularProgress size={20} /> : <SendIcon />}
                  fullWidth
                >
                  Register
                </Button>
              </Paper>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Login
                </Typography>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                  margin="normal"
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  margin="normal"
                  size="small"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => makeRequest('Login', loginData)}
                  disabled={loading['Login']}
                  startIcon={loading['Login'] ? <CircularProgress size={20} /> : <LockIcon />}
                  fullWidth
                >
                  Login
                </Button>
              </Paper>
            </Box>
          </Box>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Button
              variant="outlined"
              onClick={() => makeRequest('Get Current User')}
              disabled={loading['Get Current User'] || !token}
              startIcon={loading['Get Current User'] ? <CircularProgress size={20} /> : <PersonIcon />}
            >
              Get Current User
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => makeRequest('Get All Users')}
              disabled={loading['Get All Users'] || !token || !hasAccessToEndpoint(endpoints.find(e => e.name === 'Get All Users'))}
              startIcon={loading['Get All Users'] ? <CircularProgress size={20} /> : <RefreshIcon />}
            >
              Get All Users
            </Button>
          </Box>

          {currentUser && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="subtitle2">
                Logged in as: {currentUser.username} ({currentUser.role})
              </Typography>
              <Typography variant="caption">
                Email: {currentUser.email}
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                <strong>Access Info:</strong> {currentUser.role === 'admin' ? 'Full access' : 
                  currentUser.role === 'manager' ? 'Can manage users & projects' :
                  currentUser.role === 'supervisor' ? 'Can view dashboard' :
                  currentUser.role === 'leader' ? 'Can create projects' : 'Basic user access'}
              </Typography>
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Update User
                  {currentUser && !['admin', 'manager'].includes(currentUser.role) && (
                    <Chip label="Admin/Manager only" color="warning" size="small" sx={{ ml: 1 }} />
                  )}
                </Typography>
                <TextField
                  fullWidth
                  label="User ID"
                  value={updateUserData.id}
                  onChange={(e) => setUpdateUserData(prev => ({ ...prev, id: e.target.value }))}
                  margin="normal"
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Username"
                  value={updateUserData.username}
                  onChange={(e) => setUpdateUserData(prev => ({ ...prev, username: e.target.value }))}
                  margin="normal"
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={updateUserData.email}
                  onChange={(e) => setUpdateUserData(prev => ({ ...prev, email: e.target.value }))}
                  margin="normal"
                  size="small"
                />
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={updateUserData.role}
                    label="Role"
                    onChange={(e) => setUpdateUserData(prev => ({ ...prev, role: e.target.value }))}
                  >
                    {roleOptions.map(role => (
                      <MenuItem key={role.value} value={role.value}>
                        {role.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => makeRequest('Update User', updateUserData)}
                  disabled={loading['Update User'] || !token || !hasAccessToEndpoint(endpoints.find(e => e.name === 'Update User'))}
                  startIcon={loading['Update User'] ? <CircularProgress size={20} /> : <SendIcon />}
                  fullWidth
                >
                  Update User
                </Button>
              </Paper>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Delete User
                  {currentUser && currentUser.role !== 'admin' && (
                    <Chip label="Admin only" color="error" size="small" sx={{ ml: 1 }} />
                  )}
                </Typography>
                <TextField
                  fullWidth
                  label="User ID"
                  value={deleteUserData.id}
                  onChange={(e) => setDeleteUserData(prev => ({ ...prev, id: e.target.value }))}
                  margin="normal"
                  size="small"
                />
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => makeRequest('Delete User', deleteUserData)}
                  disabled={loading['Delete User'] || !token || !hasAccessToEndpoint(endpoints.find(e => e.name === 'Delete User'))}
                  startIcon={loading['Delete User'] ? <CircularProgress size={20} /> : <SendIcon />}
                  fullWidth
                >
                  Delete User
                </Button>
              </Paper>
            </Box>
          </Box>

          {users.length > 0 && (
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Users List ({users.length} users)
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Username</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Created At</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip 
                            label={user.role} 
                            size="small"
                            color={
                              user.role === 'admin' ? 'error' :
                              user.role === 'manager' ? 'warning' :
                              user.role === 'supervisor' ? 'info' :
                              user.role === 'leader' ? 'primary' : 'default'
                            }
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Button
            variant="contained"
            onClick={() => makeRequest('Get Dashboard Stats')}
            disabled={loading['Get Dashboard Stats'] || !token || !hasAccessToEndpoint(endpoints.find(e => e.name === 'Get Dashboard Stats'))}
            startIcon={loading['Get Dashboard Stats'] ? <CircularProgress size={20} /> : <RefreshIcon />}
            sx={{ mb: 3 }}
          >
            Get Dashboard Statistics
          </Button>

          {!hasAccessToEndpoint(endpoints.find(e => e.name === 'Get Dashboard Stats')) && currentUser && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body2">
                Your role ({currentUser.role}) does not have access to dashboard statistics.
                Only Admin, Manager, and Supervisor roles can access this endpoint.
              </Typography>
            </Alert>
          )}

          {stats && (
            <Box>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
                <Paper sx={{ p: 3, textAlign: 'center', flex: 1 }}>
                  <Typography variant="h3" color="primary">
                    {stats.totalUsers}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    Total Users
                  </Typography>
                </Paper>
              </Box>

              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Role Distribution
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {stats.roleDistribution.map((item, index) => (
                    <Paper 
                      key={index}
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        minWidth: 150,
                        bgcolor: 'primary.light',
                        color: 'white',
                        flex: 1
                      }}
                    >
                      <Typography variant="h6">
                        {item.count}
                      </Typography>
                      <Typography variant="body2">
                        {item.role}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </Paper>
            </Box>
          )}
        </Box>
      )}

      {activeTab === 3 && (
        <Box>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Create Project
                  {currentUser && !['admin', 'manager', 'leader'].includes(currentUser.role) && (
                    <Chip label="Admin/Manager/Leader only" color="warning" size="small" sx={{ ml: 1 }} />
                  )}
                </Typography>
                <TextField
                  fullWidth
                  label="Project Name"
                  value={projectData.name}
                  onChange={(e) => setProjectData(prev => ({ ...prev, name: e.target.value }))}
                  margin="normal"
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={projectData.description}
                  onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                  margin="normal"
                  size="small"
                />
                <Button
                  variant="contained"
                  onClick={() => makeRequest('Create Project', projectData)}
                  disabled={loading['Create Project'] || !token || !hasAccessToEndpoint(endpoints.find(e => e.name === 'Create Project'))}
                  startIcon={loading['Create Project'] ? <CircularProgress size={20} /> : <SendIcon />}
                  fullWidth
                >
                  Create Project
                </Button>
              </Paper>
            </Box>
          </Box>

          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1">
              Projects List
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => makeRequest('Get All Projects')}
              disabled={loading['Get All Projects'] || !token}
              startIcon={<RefreshIcon />}
            >
              Refresh
            </Button>
          </Box>

          {projects.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {projects.map(project => (
                <Paper key={project.id} sx={{ p: 2, flex: '1 1 300px', maxWidth: '100%' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {project.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {project.description}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption">
                      Created by: {project.creator}
                    </Typography>
                    <Typography variant="caption">
                      {new Date(project.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          ) : (
            <Alert severity="info">
              No projects found. Create a project or login to view projects.
            </Alert>
          )}
        </Box>
      )}

      {/* API Responses Section */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              📊 API Responses
            </Typography>
            <Button
              size="small"
              onClick={() => setResponses({})}
            >
              Clear All
            </Button>
          </Box>

          {Object.keys(responses).length === 0 ? (
            <Alert severity="info">
              No API responses yet. Make a request to see responses here.
            </Alert>
          ) : (
            <List>
              {Object.entries(responses).map(([endpointName, response]) => (
                <React.Fragment key={endpointName}>
                  <ListItemButton 
                    onClick={() => toggleSection(endpointName)}
                    sx={{ 
                      bgcolor: response.error ? 'error.light' : 'success.light',
                      mb: 1,
                      borderRadius: 1
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          {response.error ? <ErrorIcon color="error" /> : <CheckCircleIcon color="success" />}
                          <Typography variant="subtitle1">
                            {endpointName}
                          </Typography>
                          <Chip 
                            label={`Status: ${response.status}`} 
                            size="small"
                            color={response.status >= 400 ? 'error' : 'success'}
                          />
                          <Typography variant="caption" sx={{ ml: 'auto' }}>
                            {response.timestamp}
                          </Typography>
                        </Box>
                      }
                    />
                    {expandedSections[endpointName] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </ListItemButton>
                  <Collapse in={expandedSections[endpointName]} timeout="auto" unmountOnExit>
                    <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption">
                          Response Data:
                        </Typography>
                        <Button
                          size="small"
                          onClick={() => copyToClipboard(JSON.stringify(response.data, null, 2))}
                        >
                          <CopyIcon fontSize="small" />
                          Copy JSON
                        </Button>
                      </Box>
                      <Paper 
                        sx={{ 
                          p: 2, 
                          bgcolor: 'grey.900', 
                          color: 'white',
                          fontFamily: 'monospace',
                          fontSize: '0.875rem',
                          overflow: 'auto',
                          maxHeight: '300px'
                        }}
                      >
                        <pre style={{ margin: 0 }}>
                          {JSON.stringify(response.data, null, 2)}
                        </pre>
                      </Paper>
                    </Paper>
                  </Collapse>
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions Panel */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🚀 Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {endpoints.map((endpoint) => (
              <Button
                key={endpoint.name}
                variant="outlined"
                onClick={() => {
                  switch(endpoint.name) {
                    case 'Login':
                      makeRequest('Login', loginData);
                      break;
                    case 'Register':
                      makeRequest('Register', registerData);
                      break;
                    default:
                      makeRequest(endpoint.name);
                  }
                }}
                disabled={
                  loading[endpoint.name] || 
                  (endpoint.requiresToken && !token) ||
                  (endpoint.requiresRole && !hasAccessToEndpoint(endpoint))
                }
                size="small"
                sx={{ flex: '1 1 150px' }}
              >
                {endpoint.name}
              </Button>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Footer */}
      <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="body2" color="textSecondary" align="center">
          API Testing Dashboard • {new Date().getFullYear()} • 
          Base URL: {config.baseUrl} • 
          Environment: {config.environment}
        </Typography>
      </Box>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ApiTest;
