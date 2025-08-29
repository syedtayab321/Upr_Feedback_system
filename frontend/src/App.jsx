import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { fetchProfile } from './redux/slices/authSlice';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/common/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './routes/ProtectedRoutes';
import StudentDashboard from './pages/student/StudentDashboard';
import AcademicDashboard from './pages/academic/AcademicDashboard';
import NonAcademicDashboard from './pages/nonacademic/NonAcademicDashboard';
import AlumniDashboard from './pages/alumni/AlumniDashboard';
import TermsAndConditions from './pages/common/TermAndCondition';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(fetchProfile());
    }
  }, [dispatch]);

  return (
    <Router>
      <div className="App scrollbar-transparent" >
        <Routes>
          <Route path='/terms' element={TermsAndConditions()}/>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} 
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          {/* Placeholder routes for other roles */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/academic"
            element={
              <ProtectedRoute allowedRoles={['academic_staff']}>
                 <AcademicDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/non-academic"
            element={
              <ProtectedRoute allowedRoles={['non_academic_staff']}>
                <NonAcademicDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alumni"
            element={
              <ProtectedRoute allowedRoles={['alumni']}>
                <AlumniDashboard/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/community"
            element={
              <ProtectedRoute allowedRoles={['community']}>
                <DashboardPage /> {/* Replace with CommunityDashboard later */}
              </ProtectedRoute>
            }
          />
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
          />
          <Route 
            path="*" 
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;