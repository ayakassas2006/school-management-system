import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Public Pages
import Home from './pages/public/Home.jsx';
import About from './pages/public/About.jsx';
import Programs from './pages/public/Programs.jsx';
import ProgramDetails from './pages/public/ProgramDetails.jsx';
import PublicTeachers from './pages/public/PublicTeachers.jsx';
import TeacherProfile from './pages/public/TeacherProfile.jsx';
import Gallery from './pages/public/Gallery.jsx';
import News from './pages/public/News.jsx';
import Article from './pages/public/Article.jsx';
import Contact from './pages/public/Contact.jsx';

// Auth Pages
import RoleSelection from './pages/auth/RoleSelection.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';

// Admin Dashboard
import AdminDashboard from './pages/dashboards/AdminDashboard.jsx';
import AdminDirectory from './pages/dashboards/admin/AdminDirectory.jsx';
import AdminClasses from './pages/dashboards/admin/AdminClasses.jsx';
import AdminSettings from './pages/dashboards/admin/AdminSettings.jsx';
import AdminStudentDetails from './pages/dashboards/admin/AdminStudentDetails.jsx';
import AdminAddStudent from './pages/dashboards/admin/AdminAddStudent.jsx';
import AdminTeacherDetails from './pages/dashboards/admin/AdminTeacherDetails.jsx';
import AdminSchedule from './pages/dashboards/admin/AdminSchedule.jsx';
import AdminPayments from './pages/dashboards/admin/AdminPayments.jsx';
import AdminReports from './pages/dashboards/admin/AdminReports.jsx';
import AdminAnalytics from './pages/dashboards/admin/AdminAnalytics.jsx';
import AdminMessages from './pages/dashboards/admin/AdminMessages.jsx';
import AdminNotifications from './pages/dashboards/admin/AdminNotifications.jsx';
import AdminProfile from './pages/dashboards/admin/AdminProfile.jsx';

// Teacher Dashboard
import TeacherDashboard from './pages/dashboards/TeacherDashboard.jsx';
import TeacherClasses from './pages/dashboards/teacher/TeacherClasses.jsx';
import TeacherClassDetails from './pages/dashboards/teacher/TeacherClassDetails.jsx';
import TeacherAssignments from './pages/dashboards/teacher/TeacherAssignments.jsx';
import TeacherStudents from './pages/dashboards/teacher/TeacherStudents.jsx';
import TeacherAttendance from './pages/dashboards/teacher/TeacherAttendance.jsx';
import TeacherGrades from './pages/dashboards/teacher/TeacherGrades.jsx';
import TeacherUploadMaterials from './pages/dashboards/teacher/TeacherUploadMaterials.jsx';
import TeacherCalendar from './pages/dashboards/teacher/TeacherCalendar.jsx';
import TeacherMessages from './pages/dashboards/teacher/TeacherMessages.jsx';
import TeacherNotifications from './pages/dashboards/teacher/TeacherNotifications.jsx';
import TeacherProfilePage from './pages/dashboards/teacher/TeacherProfile.jsx';
import TeacherSettings from './pages/dashboards/teacher/TeacherSettings.jsx';
import TeacherAddStudent from './pages/dashboards/teacher/TeacherAddStudent.jsx';

// Student Dashboard
import StudentDashboard from './pages/dashboards/StudentDashboard.jsx';
import StudentCourses from './pages/dashboards/student/StudentCourses.jsx';
import StudentCourseDetails from './pages/dashboards/student/StudentCourseDetails.jsx';
import StudentSchedule from './pages/dashboards/student/StudentSchedule.jsx';
import StudentGrades from './pages/dashboards/student/StudentGrades.jsx';
import StudentAttendance from './pages/dashboards/student/StudentAttendance.jsx';
import StudentAssignments from './pages/dashboards/student/StudentAssignments.jsx';
import StudentMessages from './pages/dashboards/student/StudentMessages.jsx';
import StudentNotifications from './pages/dashboards/student/StudentNotifications.jsx';
import StudentReports from './pages/dashboards/student/StudentReports.jsx';
import StudentProfile from './pages/dashboards/student/StudentProfile.jsx';
import StudentSettings from './pages/dashboards/student/StudentSettings.jsx';

// Parent Dashboard
import ParentDashboard from './pages/dashboards/ParentDashboard.jsx';
import ParentChildren from './pages/dashboards/parent/ParentChildren.jsx';
import ParentChildDetails from './pages/dashboards/parent/ParentChildDetails.jsx';
import ParentFees from './pages/dashboards/parent/ParentFees.jsx';
import ParentSettings from './pages/dashboards/parent/ParentSettings.jsx';
import ParentGradesMonitoring from './pages/dashboards/parent/ParentGradesMonitoring.jsx';
import ParentAttendanceMonitoring from './pages/dashboards/parent/ParentAttendanceMonitoring.jsx';
import ParentMessages from './pages/dashboards/parent/ParentMessages.jsx';
import ParentNotifications from './pages/dashboards/parent/ParentNotifications.jsx';
import ParentReports from './pages/dashboards/parent/ParentReports.jsx';
import ParentProfile from './pages/dashboards/parent/ParentProfile.jsx';
import ParentChildBehavior from './pages/dashboards/parent/ParentChildBehavior.jsx';

// Layouts
import DashboardLayout from './components/layouts/DashboardLayout.jsx';
import PublicLayout from './components/layouts/PublicLayout.jsx';

function AppContent() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  return (
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/:id" element={<ProgramDetails />} />
          <Route path="/teachers" element={<PublicTeachers />} />
          <Route path="/teachers/:id" element={<TeacherProfile />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<Article />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Authentication Routes */}
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to={`/dashboard/${user?.role}`} /> : <Login />} 
        />

        {/* Protected Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}
        >
          {/* ===== Admin Routes ===== */}
          <Route path="admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="admin/directory" element={user?.role === 'admin' ? <AdminDirectory /> : <Navigate to="/login" />} />
          <Route path="admin/directory/student/add" element={user?.role === 'admin' ? <AdminAddStudent /> : <Navigate to="/login" />} />
          <Route path="admin/directory/student/:id" element={user?.role === 'admin' ? <AdminStudentDetails /> : <Navigate to="/login" />} />
          <Route path="admin/directory/teacher/:id" element={user?.role === 'admin' ? <AdminTeacherDetails /> : <Navigate to="/login" />} />
          <Route path="admin/classes" element={user?.role === 'admin' ? <AdminClasses /> : <Navigate to="/login" />} />
          <Route path="admin/schedule" element={user?.role === 'admin' ? <AdminSchedule /> : <Navigate to="/login" />} />
          <Route path="admin/payments" element={user?.role === 'admin' ? <AdminPayments /> : <Navigate to="/login" />} />
          <Route path="admin/reports" element={user?.role === 'admin' ? <AdminReports /> : <Navigate to="/login" />} />
          <Route path="admin/analytics" element={user?.role === 'admin' ? <AdminAnalytics /> : <Navigate to="/login" />} />
          <Route path="admin/messages" element={user?.role === 'admin' ? <AdminMessages /> : <Navigate to="/login" />} />
          <Route path="admin/notifications" element={user?.role === 'admin' ? <AdminNotifications /> : <Navigate to="/login" />} />
          <Route path="admin/profile" element={user?.role === 'admin' ? <AdminProfile /> : <Navigate to="/login" />} />
          <Route path="admin/settings" element={user?.role === 'admin' ? <AdminSettings /> : <Navigate to="/login" />} />

          {/* ===== Teacher Routes ===== */}
          <Route path="teacher" element={user?.role === 'teacher' ? <TeacherDashboard /> : <Navigate to="/login" />} />
          <Route path="teacher/classes" element={user?.role === 'teacher' ? <TeacherClasses /> : <Navigate to="/login" />} />
          <Route path="teacher/classes/:id" element={user?.role === 'teacher' ? <TeacherClassDetails /> : <Navigate to="/login" />} />
          <Route path="teacher/students" element={user?.role === 'teacher' ? <TeacherStudents /> : <Navigate to="/login" />} />
          <Route path="teacher/attendance" element={user?.role === 'teacher' ? <TeacherAttendance /> : <Navigate to="/login" />} />
          <Route path="teacher/students/add" element={user?.role === 'teacher' ? <TeacherAddStudent /> : <Navigate to="/login" />} />
          <Route path="teacher/grades" element={user?.role === 'teacher' ? <TeacherGrades /> : <Navigate to="/login" />} />
          <Route path="teacher/assignments" element={user?.role === 'teacher' ? <TeacherAssignments /> : <Navigate to="/login" />} />
          <Route path="teacher/materials" element={user?.role === 'teacher' ? <TeacherUploadMaterials /> : <Navigate to="/login" />} />
          <Route path="teacher/calendar" element={user?.role === 'teacher' ? <TeacherCalendar /> : <Navigate to="/login" />} />
          <Route path="teacher/messages" element={user?.role === 'teacher' ? <TeacherMessages /> : <Navigate to="/login" />} />
          <Route path="teacher/notifications" element={user?.role === 'teacher' ? <TeacherNotifications /> : <Navigate to="/login" />} />
          <Route path="teacher/profile" element={user?.role === 'teacher' ? <TeacherProfilePage /> : <Navigate to="/login" />} />
          <Route path="teacher/settings" element={user?.role === 'teacher' ? <TeacherSettings /> : <Navigate to="/login" />} />

          {/* ===== Student Routes ===== */}
          <Route path="student" element={user?.role === 'student' ? <StudentDashboard /> : <Navigate to="/login" />} />
          <Route path="student/courses" element={user?.role === 'student' ? <StudentCourses /> : <Navigate to="/login" />} />
          <Route path="student/courses/:id" element={user?.role === 'student' ? <StudentCourseDetails /> : <Navigate to="/login" />} />
          <Route path="student/grades" element={user?.role === 'student' ? <StudentGrades /> : <Navigate to="/login" />} />
          <Route path="student/attendance" element={user?.role === 'student' ? <StudentAttendance /> : <Navigate to="/login" />} />
          <Route path="student/assignments" element={user?.role === 'student' ? <StudentAssignments /> : <Navigate to="/login" />} />
          <Route path="student/schedule" element={user?.role === 'student' ? <StudentSchedule /> : <Navigate to="/login" />} />
          <Route path="student/messages" element={user?.role === 'student' ? <StudentMessages /> : <Navigate to="/login" />} />
          <Route path="student/notifications" element={user?.role === 'student' ? <StudentNotifications /> : <Navigate to="/login" />} />
          <Route path="student/reports" element={user?.role === 'student' ? <StudentReports /> : <Navigate to="/login" />} />
          <Route path="student/profile" element={user?.role === 'student' ? <StudentProfile /> : <Navigate to="/login" />} />
          <Route path="student/settings" element={user?.role === 'student' ? <StudentSettings /> : <Navigate to="/login" />} />

          {/* ===== Parent Routes ===== */}
          <Route path="parent" element={user?.role === 'parent' ? <ParentDashboard /> : <Navigate to="/login" />} />
          <Route path="parent/children" element={user?.role === 'parent' ? <ParentChildren /> : <Navigate to="/login" />} />
          <Route path="parent/children/:id" element={user?.role === 'parent' ? <ParentChildDetails /> : <Navigate to="/login" />} />
          <Route path="parent/behavior/:id" element={user?.role === 'parent' ? <ParentChildBehavior /> : <Navigate to="/login" />} />
          <Route path="parent/grades" element={user?.role === 'parent' ? <ParentGradesMonitoring /> : <Navigate to="/login" />} />
          <Route path="parent/attendance" element={user?.role === 'parent' ? <ParentAttendanceMonitoring /> : <Navigate to="/login" />} />
          <Route path="parent/fees" element={user?.role === 'parent' ? <ParentFees /> : <Navigate to="/login" />} />
          <Route path="parent/messages" element={user?.role === 'parent' ? <ParentMessages /> : <Navigate to="/login" />} />
          <Route path="parent/notifications" element={user?.role === 'parent' ? <ParentNotifications /> : <Navigate to="/login" />} />
          <Route path="parent/reports" element={user?.role === 'parent' ? <ParentReports /> : <Navigate to="/login" />} />
          <Route path="parent/profile" element={user?.role === 'parent' ? <ParentProfile /> : <Navigate to="/login" />} />
          <Route path="parent/settings" element={user?.role === 'parent' ? <ParentSettings /> : <Navigate to="/login" />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
