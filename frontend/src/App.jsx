import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import UserDashboard from './pages/UserDashboard';
import ReportIssue from './pages/ReportIssue';
import RulesBreakerComplaint from './pages/RulesBreakerComplaint';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import WorkerLogin from './pages/WorkerLogin';
import WorkerRegister from './pages/WorkerRegister';
import WorkerDashboard from './pages/WorkerDashboard';


const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Home */}
        <Route path="/" element={<Home />} />

        {/* User Routes */}
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRole="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/report-issue"
          element={
            <ProtectedRoute allowedRole="user">
              <ReportIssue />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/file-complaint"
          element={
            <ProtectedRoute allowedRole="user">
              <RulesBreakerComplaint />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Worker Routes */}
        <Route path="/worker/login" element={<WorkerLogin />} />
        <Route path="/worker/register" element={<WorkerRegister />} />
        <Route
          path="/worker/dashboard"
          element={
            <ProtectedRoute allowedRole="worker">
              <WorkerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
