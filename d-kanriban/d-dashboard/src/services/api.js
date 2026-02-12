import axios from 'axios';

const API_BASE_URL = 'http://172.27.6.191:4000/api';

// Buat instance axios
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Tambahkan interceptor untuk menyertakan token di header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Definisikan endpoint untuk "productions"
const productionApi = {
  getAll: () => api.get('/productions').then(res => res.data),
  create: (data) => api.post('/productions', data).then(res => res.data),
  update: (id, data) => api.put(`/productions/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/productions/${id}`).then(res => res.data),
};

// Ekspor semuanya dengan satu `export`
export { api };
export default productionApi;
