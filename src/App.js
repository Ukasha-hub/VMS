
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './pages/Outlet/Home';
import MakeAppointment from './pages/Outlet/MakeAppointment';
import ScanQRCode from './pages/Outlet/ScanQRCode';
import VerifyVisitor from './pages/Outlet/VerifyVisitor';




function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
          <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
 
       
        {/* Protected - inside Dashboard layout */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
          <Route path="" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="dashboard/makeappointment" element={<ProtectedRoute><MakeAppointment /></ProtectedRoute>} />
          <Route path="dashboard/scanqrcode" element={<ProtectedRoute><ScanQRCode /></ProtectedRoute>} />
          <Route path="dashboard/verify/:id"
  element={<ProtectedRoute><VerifyVisitor /></ProtectedRoute>}
/>
          
          
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
