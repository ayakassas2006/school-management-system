import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

let toastIdCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = ++toastIdCounter;
    setToasts(prev => [...prev, { id, message, type, duration }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const icons = {
    success: <CheckCircle size={18} />,
    error: <XCircle size={18} />,
    warning: <AlertTriangle size={18} />,
    info: <Info size={18} />,
  };

  const colors = {
    success: { bg: 'var(--color-success-light)', border: 'var(--color-success)', color: 'var(--color-text-main)', icon: 'var(--color-success)' },
    error: { bg: 'var(--color-danger-light)', border: 'var(--color-danger)', color: 'var(--color-text-main)', icon: 'var(--color-danger)' },
    warning: { bg: 'var(--color-warning-light)', border: 'var(--color-warning)', color: 'var(--color-text-main)', icon: 'var(--color-warning)' },
    info: { bg: 'var(--color-info-light)', border: 'var(--color-info)', color: 'var(--color-text-main)', icon: 'var(--color-info)' },
  };

  return (
    <ToastContext.Provider value={{ success: (m, d) => addToast(m, 'success', d), error: (m, d) => addToast(m, 'error', d), warning: (m, d) => addToast(m, 'warning', d), info: (m, d) => addToast(m, 'info', d), addToast }}>
      {children}
      <div style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 'var(--z-toast)', display: 'flex', flexDirection: 'column', gap: '0.75rem', pointerEvents: 'none' }}>
        <AnimatePresence>
          {toasts.map(toast => {
            const c = colors[toast.type] || colors.info;
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 100, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{
                  background: c.bg,
                  border: `1px solid ${c.border}`,
                  borderLeft: `4px solid ${c.border}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '0.875rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  minWidth: '280px',
                  maxWidth: '400px',
                  boxShadow: 'var(--shadow-xl)',
                  pointerEvents: 'all',
                  color: c.color,
                }}
              >
                <span style={{ color: c.icon, flexShrink: 0 }}>{icons[toast.type]}</span>
                <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: '500', lineHeight: 1.4 }}>{toast.message}</span>
                <button
                  onClick={() => removeToast(toast.id)}
                  style={{ color: c.icon, opacity: 0.6, flexShrink: 0, padding: '2px', borderRadius: 'var(--radius-sm)', transition: 'opacity var(--transition-fast)' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
