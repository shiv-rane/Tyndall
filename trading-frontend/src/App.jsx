// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Journal from './pages/Journal';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoutes';  
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import { Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TokenWatcher from './components/TokenWatcher';

export default function App() {
  return (
    <Router>
       <TokenWatcher />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes Wrapper */}
        <Route element={<ProtectedRoute />}>
          <Route path="/journal" element={<Journal />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
