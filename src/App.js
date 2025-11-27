import './App.css';
import ProtectedRoute from './route/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Home from './pages/Outlet/Home';
import MakeAppointment from './pages/Outlet/MakeAppointment';
import ScanQRCode from './pages/Outlet/ScanQRCode';
import VerifyVisitor from './pages/Outlet/VerifyVisitor';
import HistoryVisit from './pages/Outlet/HistoryVisit';
import { UserProvider } from './context/UserContext';
import CheckedInVisitors from './pages/Outlet/CheckedInVisitors';
import HistoryVisitVersionTwo from './pages/Outlet/HistoryVisitVersionTwo';

function App() {
  // Check empID in URL query
  const location = window.location; 
  const queryParams = new URLSearchParams(location.search);
  const jsonParam = queryParams.get("json");
  console.log(jsonParam)
  let empIDFound = false;

  if (jsonParam) {
    try {
      const parsed = JSON.parse(decodeURIComponent(jsonParam));
      console.log(parsed)
      empIDFound = parsed;
    } catch (e) {
      empIDFound = false;
    }
  }
  
  return (
    <UserProvider>
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            empIDFound ? (
              
                <Dashboard />
             
            ) : (
              <ProtectedRoute>
                <Dashboard />
                </ProtectedRoute>
            )
          }
        >
          <Route path="" element={empIDFound ? <ProtectedRoute><Home /></ProtectedRoute> : <Home />} />
          <Route path="makeappointment" element={empIDFound ? <ProtectedRoute><MakeAppointment /></ProtectedRoute> : <MakeAppointment />} />
          <Route path="scanqrcode" element={empIDFound ? <ProtectedRoute><ScanQRCode /></ProtectedRoute> : <ScanQRCode />} />
          <Route path="history" element={empIDFound ? <ProtectedRoute><HistoryVisit /></ProtectedRoute> : <HistoryVisit />} />
          <Route path="verify" element={empIDFound ? <ProtectedRoute><VerifyVisitor /></ProtectedRoute> : <VerifyVisitor />} />
          <Route path="checkedin" element={empIDFound ?<ProtectedRoute><CheckedInVisitors /></ProtectedRoute>:<CheckedInVisitors />} />
          <Route path="historytwo" element={<HistoryVisitVersionTwo></HistoryVisitVersionTwo>} />
        </Route>
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;
