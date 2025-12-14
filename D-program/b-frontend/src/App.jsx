import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import SuperAdminDashboard from './components/dashboard/SuperAdminDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import UserDashboard from './components/dashboard/UserDashboard';
import Nais_React from './node_tps_it_box/react/Card';
import './App.css';


import IoT from './components/IoT/ControlESP8266';
import Lora from './components/custom/Lora/Lora'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/react'element={<Nais_React />}></Route>
        <Route path="/iot" element={<IoT />}></Route>
        <Route path="/lora" element={<Lora />}></Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <Layout>
            <SuperAdminDashboard />
          </Layout>
        } />
        <Route path="/admin" element={
          <Layout>
            <AdminDashboard />
          </Layout>
        } />
        <Route path="/user" element={
          <Layout>
            <UserDashboard />
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;