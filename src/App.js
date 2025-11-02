
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './pages/Outlet/Home';
import MakeAppointment from './pages/Outlet/MakeAppointment';
import ScanQRCode from './pages/Outlet/ScanQRCode';



function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        {/*  <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
 */}
       
        {/* Protected - inside Dashboard layout */}
        <Route path="/" element={<Dashboard />}>
          <Route path="" element={<Home />} />
          <Route path="dashboard/makeappointment" element={<MakeAppointment />} />
          <Route path="dashboard/scanqrcode" element={<ScanQRCode />} />
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
