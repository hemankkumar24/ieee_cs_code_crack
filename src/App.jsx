import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ieeecstopadminlogin" element={<AdminLogin />} />
        <Route path="/addaccounts" element={<AdminDashboard />} />
      </Routes>
    </>
  )
}

export default App