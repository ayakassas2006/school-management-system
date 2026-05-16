import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md', danger = false }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const sizes = {
    sm: '400px',
    md: '540px',
    lg: '700px',
    xl: '900px',
    '2xl': '1100px',
    full: '95vw',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 'var(--z-modal-backdrop)',
            }}
          />
          <div style={{
            position: 'fixed', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 'var(--z-modal)',
            padding: '1rem',
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-2xl)',
                boxShadow: 'var(--shadow-2xl)',
                width: '100%',
                maxWidth: sizes[size],
                maxHeight: '90vh',
                overflowY: 'auto',
                border: '1px solid var(--color-border)',
              }}
            >
              {/* Modal Header */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '1.5rem 2rem',
                borderBottom: '1px solid var(--color-border)',
                position: 'sticky', top: 0,
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-2xl) var(--radius-2xl) 0 0',
                zIndex: 1,
              }}>
                <h3 style={{ fontSize: '1.125rem', color: danger ? 'var(--color-danger)' : 'var(--color-text-main)' }}>
                  {title}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  style={{
                    padding: '0.4rem', borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-muted)', transition: 'background var(--transition-fast)',
                    background: 'transparent',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '2rem' }}>
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', danger = false, loading = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm" danger={danger}>
      <p style={{ color: 'var(--color-text-body)', lineHeight: 1.6, marginBottom: '1.5rem' }}>{message}</p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button
          onClick={onClose}
          style={{
            padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)', background: 'var(--color-surface)',
            color: 'var(--color-text-body)', fontWeight: '500', transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-bg-2)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-surface)'; }}
        >
          Cancel
        </button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onConfirm}
          disabled={loading}
          style={{
            padding: '0.625rem 1.5rem', borderRadius: 'var(--radius-md)',
            background: danger ? 'var(--color-danger)' : 'var(--gradient-primary)',
            color: 'white', fontWeight: '600',
            opacity: loading ? 0.7 : 1,
            transition: 'opacity var(--transition-fast)',
          }}
        >
          {loading ? 'Processing...' : confirmText}
        </motion.button>
      </div>
    </Modal>
  );
}
