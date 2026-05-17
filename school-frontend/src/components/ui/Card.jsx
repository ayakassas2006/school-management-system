import React from 'react';

export default function Card({ children, className = '', hoverEffect = false, ...props }) {
  const style = {
    background: 'var(--color-surface)',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-md)',
    padding: '1.5rem',
    transition: 'all var(--transition-normal)',
    border: '1px solid var(--color-border)',
  };

  return (
    <div 
      style={style} 
      className={className}
      onMouseOver={(e) => {
        if(hoverEffect) {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
          e.currentTarget.style.borderColor = 'var(--color-primary-light)';
        }
      }}
      onMouseOut={(e) => {
        if(hoverEffect) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          e.currentTarget.style.borderColor = 'var(--color-border)';
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
}
