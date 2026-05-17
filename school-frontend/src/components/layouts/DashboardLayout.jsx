import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../ui/PageTransition';
import {
  LogOut, LayoutDashboard, Users, BookOpen, Calendar, Settings, Bell,
  DollarSign, FileText, BarChart2, MessageSquare, User, CheckSquare,
  Upload, ChevronLeft, ChevronRight, Sun, Moon, Menu, X, GraduationCap,
  ClipboardList, UserCheck, TrendingUp, Home, Shield
} from 'lucide-react';

const MENUS = {
  admin: [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard/admin' },
    { icon: <Users size={20} />, label: 'Directory', path: '/dashboard/admin/directory' },
    { icon: <BookOpen size={20} />, label: 'Classes', path: '/dashboard/admin/classes' },
    { icon: <Calendar size={20} />, label: 'Schedule', path: '/dashboard/admin/schedule' },
    { icon: <DollarSign size={20} />, label: 'Payments', path: '/dashboard/admin/payments' },
    { icon: <FileText size={20} />, label: 'Reports', path: '/dashboard/admin/reports' },
    { icon: <BarChart2 size={20} />, label: 'Analytics', path: '/dashboard/admin/analytics' },
    { icon: <MessageSquare size={20} />, label: 'Messages', path: '/dashboard/admin/messages' },
    { icon: <Bell size={20} />, label: 'Notifications', path: '/dashboard/admin/notifications' },
    { icon: <User size={20} />, label: 'Profile', path: '/dashboard/admin/profile' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/dashboard/admin/settings' },
  ],
  teacher: [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard/teacher' },
    { icon: <BookOpen size={20} />, label: 'My Classes', path: '/dashboard/teacher/classes' },
    { icon: <Users size={20} />, label: 'Students', path: '/dashboard/teacher/students' },
    { icon: <UserCheck size={20} />, label: 'Attendance', path: '/dashboard/teacher/attendance' },
    { icon: <ClipboardList size={20} />, label: 'Grades', path: '/dashboard/teacher/grades' },
    { icon: <CheckSquare size={20} />, label: 'Assignments', path: '/dashboard/teacher/assignments' },
    { icon: <Upload size={20} />, label: 'Materials', path: '/dashboard/teacher/materials' },
    { icon: <Calendar size={20} />, label: 'Calendar', path: '/dashboard/teacher/calendar' },
    { icon: <MessageSquare size={20} />, label: 'Messages', path: '/dashboard/teacher/messages' },
    { icon: <Bell size={20} />, label: 'Notifications', path: '/dashboard/teacher/notifications' },
    { icon: <User size={20} />, label: 'Profile', path: '/dashboard/teacher/profile' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/dashboard/teacher/settings' },
  ],
  student: [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard/student' },
    { icon: <GraduationCap size={20} />, label: 'My Courses', path: '/dashboard/student/courses' },
    { icon: <ClipboardList size={20} />, label: 'Grades', path: '/dashboard/student/grades' },
    { icon: <UserCheck size={20} />, label: 'Attendance', path: '/dashboard/student/attendance' },
    { icon: <CheckSquare size={20} />, label: 'Assignments', path: '/dashboard/student/assignments' },
    { icon: <Calendar size={20} />, label: 'Schedule', path: '/dashboard/student/schedule' },
    { icon: <MessageSquare size={20} />, label: 'Messages', path: '/dashboard/student/messages' },
    { icon: <Bell size={20} />, label: 'Notifications', path: '/dashboard/student/notifications' },
    { icon: <TrendingUp size={20} />, label: 'Reports', path: '/dashboard/student/reports' },
    { icon: <User size={20} />, label: 'Profile', path: '/dashboard/student/profile' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/dashboard/student/settings' },
  ],
  parent: [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard/parent' },
    { icon: <Users size={20} />, label: 'My Children', path: '/dashboard/parent/children' },
    { icon: <ClipboardList size={20} />, label: 'Grades', path: '/dashboard/parent/grades' },
    { icon: <UserCheck size={20} />, label: 'Attendance', path: '/dashboard/parent/attendance' },
    { icon: <DollarSign size={20} />, label: 'Fees', path: '/dashboard/parent/fees' },
    { icon: <MessageSquare size={20} />, label: 'Messages', path: '/dashboard/parent/messages' },
    { icon: <Bell size={20} />, label: 'Notifications', path: '/dashboard/parent/notifications' },
    { icon: <TrendingUp size={20} />, label: 'Reports', path: '/dashboard/parent/reports' },
    { icon: <User size={20} />, label: 'Profile', path: '/dashboard/parent/profile' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/dashboard/parent/settings' },
  ],
};

const ROLE_COLORS = {
  admin: { gradient: 'linear-gradient(135deg, #4F46E5, #06B6D4)', icon: <Shield size={18} />, badge: '#4F46E5' },
  teacher: { gradient: 'linear-gradient(135deg, #10B981, #06B6D4)', icon: <BookOpen size={18} />, badge: '#10B981' },
  student: { gradient: 'linear-gradient(135deg, #F43F5E, #F59E0B)', icon: <GraduationCap size={18} />, badge: '#F43F5E' },
  parent: { gradient: 'linear-gradient(135deg, #8B5CF6, #EC4899)', icon: <Users size={18} />, badge: '#8B5CF6' },
};

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector(state => state.auth);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifCount] = useState(3);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = MENUS[user?.role] || [];
  const roleTheme = ROLE_COLORS[user?.role] || ROLE_COLORS.admin;

  const isActive = (item) => {
    if (item.label === 'Dashboard') return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  const sidebarW = collapsed ? 72 : 264;

  // --- Sidebar JSX (shared for desktop collapse + mobile overlay) ---
  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div
        style={{
          padding: collapsed ? '1.5rem 0' : '1.5rem 1.25rem',
          display: 'flex', alignItems: 'center',
          gap: '0.75rem', cursor: 'pointer',
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
        onClick={() => navigate(`/dashboard/${user?.role || ''}`)}
      >
        <div style={{
          width: 40, height: 40, borderRadius: 'var(--radius-lg)',
          background: roleTheme.gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', flexShrink: 0,
          boxShadow: `0 4px 12px rgba(79,70,229,0.35)`,
        }}>
          {roleTheme.icon}
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
            >
              <div style={{ fontFamily: 'var(--font-family-heading)', fontWeight: 800, fontSize: '1.125rem', color: 'var(--color-text-main)' }}>EduSaaS</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'capitalize', fontWeight: 600, letterSpacing: '0.05em' }}>
                {user?.role} Portal
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: collapsed ? '0 0.5rem' : '0 0.75rem', scrollbarWidth: 'none' }}>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', listStyle: 'none' }}>
          {menuItems.map((item, idx) => {
            const active = isActive(item);
            return (
              <motion.li
                key={idx}
                whileHover={{ x: collapsed ? 0 : 3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(item.path)}
                title={collapsed ? item.label : ''}
                style={{
                  display: 'flex', alignItems: 'center',
                  gap: '0.875rem',
                  padding: collapsed ? '0.875rem 0' : '0.75rem 1rem',
                  borderRadius: 'var(--radius-lg)',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  cursor: 'pointer',
                  position: 'relative',
                  color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  background: active ? 'var(--color-primary-light)' : 'transparent',
                  fontWeight: active ? 600 : 500,
                  fontSize: '0.875rem',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--color-bg-2)'; e.currentTarget.style.color = 'var(--color-text-main)'; }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)'; } }}
              >
                {active && (
                  <motion.div
                    layoutId="activeNav"
                    style={{
                      position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                      width: 3, height: '60%', background: 'var(--color-primary)',
                      borderRadius: '0 2px 2px 0',
                    }}
                  />
                )}
                <span style={{ flexShrink: 0 }}>{item.icon}</span>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div style={{ padding: collapsed ? '1rem 0.5rem' : '1rem 0.75rem', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: '0.875rem',
            padding: collapsed ? '0.875rem 0' : '0.75rem 1rem',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--color-danger)',
            fontWeight: 600, fontSize: '0.875rem', width: '100%',
            background: 'transparent',
            transition: 'background var(--transition-fast)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-danger-light)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          title={collapsed ? 'Logout' : ''}
        >
          <LogOut size={20} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg)', overflow: 'hidden' }}>

      {/* DESKTOP SIDEBAR */}
      <motion.aside
        animate={{ width: sidebarW }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          background: 'var(--color-surface)',
          borderRight: '1px solid var(--color-border)',
          flexShrink: 0, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          position: 'relative', zIndex: 10,
        }}
      >
        <SidebarContent />
        {/* Collapse Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setCollapsed(c => !c)}
          style={{
            position: 'absolute', right: -14, top: '50%', transform: 'translateY(-50%)',
            width: 28, height: 28, borderRadius: '50%',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-text-muted)',
            boxShadow: 'var(--shadow-md)',
            zIndex: 20, cursor: 'pointer',
          }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </motion.button>
      </motion.aside>

      {/* MOBILE SIDEBAR OVERLAY */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
            />
            <motion.aside
              initial={{ x: -264 }} animate={{ x: 0 }} exit={{ x: -264 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                position: 'fixed', left: 0, top: 0, height: '100vh', width: 264,
                background: 'var(--color-surface)',
                borderRight: '1px solid var(--color-border)',
                zIndex: 50, display: 'flex', flexDirection: 'column',
              }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--color-text-muted)', zIndex: 1 }}
              >
                <X size={20} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* TOP HEADER */}
        <header style={{
          height: 'var(--header-height)',
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 1.5rem',
          flexShrink: 0, position: 'relative', zIndex: 9,
        }}>
          {/* Left: Mobile menu + Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setMobileOpen(true)}
              style={{ display: 'none', color: 'var(--color-text-muted)', padding: '0.25rem' }}
              className="mobile-menu-btn"
            >
              <Menu size={22} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => navigate('/')}
                style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <Home size={14} /> Home
              </button>
              <span style={{ color: 'var(--color-border-strong)' }}>/</span>
              <span style={{ color: 'var(--color-primary)', fontSize: '0.8125rem', fontWeight: 600, textTransform: 'capitalize' }}>
                {location.pathname.split('/').filter(Boolean).slice(1).join(' / ')}
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Dark mode toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(d => !d)}
              style={{
                width: 36, height: 36, borderRadius: 'var(--radius-lg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--color-bg-2)',
                color: 'var(--color-text-muted)', transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--color-border)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--color-bg-2)'}
            >
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </motion.button>

            {/* Notifications Bell */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(`/dashboard/${user?.role}/notifications`)}
              style={{
                position: 'relative', width: 36, height: 36, borderRadius: 'var(--radius-lg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--color-bg-2)',
                color: 'var(--color-text-muted)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--color-border)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--color-bg-2)'}
            >
              <Bell size={17} />
              {notifCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  style={{
                    position: 'absolute', top: 5, right: 5,
                    width: 8, height: 8, borderRadius: '50%',
                    background: 'var(--color-accent)',
                    border: '1.5px solid var(--color-surface)',
                  }}
                />
              )}
            </motion.button>

            {/* User Avatar & Menu */}
            <div style={{ position: 'relative' }}>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowUserMenu(s => !s)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer' }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: roleTheme.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: '0.875rem',
                  boxShadow: 'var(--shadow-md)',
                }}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div style={{ textAlign: 'left', display: 'none' }} className="user-info-desktop">
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-main)' }}>{user?.name}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{user?.role}</div>
                </div>
              </motion.button>

              <AnimatePresence>
                {showUserMenu && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 'var(--z-dropdown)' }} onClick={() => setShowUserMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: 'absolute', top: 'calc(100% + 0.75rem)', right: 0,
                        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)',
                        padding: '0.5rem', minWidth: 200, zIndex: 'calc(var(--z-dropdown) + 1)',
                      }}
                    >
                      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)', marginBottom: '0.25rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text-main)' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{user?.role}</div>
                      </div>
                      {[
                        { label: 'My Profile', icon: <User size={15} />, path: `/dashboard/${user?.role}/profile` },
                        { label: 'Settings', icon: <Settings size={15} />, path: `/dashboard/${user?.role}/settings` },
                      ].map((item, i) => (
                        <button
                          key={i}
                          onClick={() => { navigate(item.path); setShowUserMenu(false); }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            width: '100%', padding: '0.625rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--color-text-body)', fontWeight: 500, fontSize: '0.875rem',
                            background: 'transparent', transition: 'background var(--transition-fast)',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          {item.icon} {item.label}
                        </button>
                      ))}
                      <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '0.25rem', paddingTop: '0.25rem' }}>
                        <button
                          onClick={handleLogout}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            width: '100%', padding: '0.625rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--color-danger)', fontWeight: 500, fontSize: '0.875rem',
                            background: 'transparent', transition: 'background var(--transition-fast)',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-danger-light)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <LogOut size={15} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main style={{ flex: 1, overflowY: 'auto', background: 'var(--color-bg)', padding: '2rem' }}>
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
