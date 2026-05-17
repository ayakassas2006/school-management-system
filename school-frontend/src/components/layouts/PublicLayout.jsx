import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import PageTransition from '../ui/PageTransition';

export default function PublicLayout() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Programs', path: '/programs' },
    { name: 'Teachers', path: '/teachers' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'News', path: '/news' },
    { name: 'Contact', path: '/contact' }
  ];

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scrolled ? '1rem 5%' : '1.5rem 5%',
    background: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 1000,
    transition: 'all 0.3s ease',
    boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
  };

  const desktopNavStyle = {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
    fontWeight: '500',
  };

  const getLinkStyle = (path) => {
    const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
    return {
      color: isActive ? 'var(--color-primary)' : 'var(--color-text-main)',
      transition: 'all var(--transition-fast)',
      position: 'relative',
      cursor: 'pointer',
      fontWeight: isActive ? '600' : '500',
      textDecoration: 'none'
    };
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={headerStyle}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{ background: 'var(--gradient-primary)', padding: '0.5rem', borderRadius: 'var(--radius-md)', color: 'white' }}>
            <GraduationCap size={24} />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-family-heading)', color: 'var(--color-text-main)' }}>
            EduSaaS
          </span>
        </Link>
        
        {/* Desktop Nav */}
        <nav style={desktopNavStyle} className="desktop-nav">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              style={getLinkStyle(item.path)}
            >
              {item.name}
              {(location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))) && (
                <span style={{
                  position: 'absolute',
                  bottom: '-4px',
                  left: 0,
                  width: '100%',
                  height: '2px',
                  background: 'var(--color-primary)',
                  borderRadius: '2px'
                }} />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div style={{ display: 'flex', gap: '1rem' }} className="desktop-nav">
          <button 
            onClick={() => navigate('/login')}
            style={{ 
              padding: '0.5rem 1.25rem', 
              borderRadius: 'var(--radius-md)', 
              fontWeight: '600', 
              border: 'none',
              background: 'var(--gradient-primary)',
              color: 'white',
              boxShadow: 'var(--shadow-md)',
              transition: 'all var(--transition-fast)'
            }}
            onMouseOver={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-glow)'}
            onMouseOut={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
          >
            Sign In
          </button>
        </div>
        
        {/* Mobile menu button (hidden on large screens through css) */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'none' }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <main style={{ flex: 1, marginTop: scrolled ? '80px' : '90px', transition: 'margin-top 0.3s', display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>

      <footer style={{ background: '#0F172A', color: 'white', padding: '5rem 5% 2rem', marginTop: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', textDecoration: 'none' }}>
              <div style={{ background: 'var(--gradient-primary)', padding: '0.5rem', borderRadius: 'var(--radius-md)', color: 'white' }}>
                <GraduationCap size={24} />
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-family-heading)', color: 'white' }}>
                EduSaaS
              </span>
            </Link>
            <p style={{ color: '#94A3B8', lineHeight: '1.8', fontSize: '0.95rem' }}>
              Empowering the next generation of digital learning and completely integrated school management systems. Modern intuitive solution for forward-thinking institutions.
            </p>
          </div>
          <div>
            <h4 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.1rem', fontFamily: 'var(--font-family-heading)' }}>Quick Links</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#94A3B8' }}>
              <li><Link to="/about" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}>About Us</Link></li>
              <li><Link to="/programs" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}>Programs</Link></li>
              <li><Link to="/teachers" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}>Teachers</Link></li>
              <li><Link to="/gallery" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}>Gallery</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.1rem', fontFamily: 'var(--font-family-heading)' }}>Contact Info</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#94A3B8' }}>
              <li>hello@edusaas.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Education Ave, Tech District, SF 94105</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.1rem', fontFamily: 'var(--font-family-heading)' }}>Legal</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#94A3B8' }}>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cookie Policy</li>
            </ul>
          </div>
        </div>
        <div style={{ textAlign: 'center', color: '#475569', borderTop: '1px solid #1E293B', paddingTop: '2rem', fontSize: '0.9rem' }}>
          © 2026 EduSaaS. Designed for excellence. Handcrafted with modern best practices.
        </div>
      </footer>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
            background: none;
            border: none;
            color: var(--color-text-main);
            cursor: pointer;
          }
        }
      `}} />
    </div>
  );
}
