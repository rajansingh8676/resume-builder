import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Auth from './pages/Auth.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Builder from './pages/Builder.jsx';
import Public from './pages/Public.jsx';

const Private = ({ children }) => (localStorage.getItem('token') ? children : <Navigate to="/login" />);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Auth mode="login" />} />
      <Route path="/signup" element={<Auth mode="signup" />} />
      <Route path="/app" element={<Private><Dashboard /></Private>} />
      <Route path="/app/builder/:id" element={<Private><Builder /></Private>} />
      <Route path="/r/:id" element={<Public />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
