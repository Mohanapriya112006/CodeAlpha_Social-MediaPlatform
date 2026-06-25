import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Feed from './pages/Feed';
import Explore from './pages/Explore';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={
            <ProtectedRoute><Feed /></ProtectedRoute>
          } />
          <Route path="/explore" element={
            <ProtectedRoute><Explore /></ProtectedRoute>
          } />
          <Route path="/profile/:username" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
