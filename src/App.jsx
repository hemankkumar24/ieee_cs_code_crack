import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard'
import AdminLogin from './components/AdminLogin'
import AddAccounts from './components/AddAccounts';
import Login from './components/Login';
import AddQuestions from './components/AddQuestions';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ieeecstopadminlogin" element={<AdminLogin />} />
        <Route path="/addaccounts" element={<AddAccounts />} />
        <Route path="/addquestions" element={<AddQuestions />} />
      </Routes>
    </>
  )
}

export default App