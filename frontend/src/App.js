import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLogin from './pages/AdminLogin';
import Feed from './pages/feed';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/Homepage" element={<Homepage />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
