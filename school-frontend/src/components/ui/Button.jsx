import React from 'react';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-md)',
    fontWeight: '600',
    transition: 'all var(--transition-fast)',
    boxShadow: 'var(--shadow-sm)',
  };

  const sizes = {
    sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
    lg: { padding: '1rem 2rem', fontSize: '1.125rem' },
  };

  const variants = {
    primary: {
      background: 'var(--gradient-primary)',
      color: 'white',
      border: 'none',
      boxShadow: 'var(--shadow-md)',
    },
    secondary: {
      background: 'white',
      color: 'var(--color-primary)',
      border: '1px solid var(--color-border)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--color-primary)',
      border: '2px solid var(--color-primary)',
    },
    danger: {
      background: 'var(--color-danger)',
      color: 'white',
      border: 'none',
    }
  };

  const style = {
    ...baseStyle,
    ...sizes[size],
    ...variants[variant],
  };

  return (
    <button 
      style={style} 
      className={className}
      onMouseOver={(e) => {
        if(variant === 'primary') {
          e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        } else {
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseOut={(e) => {
        if(variant === 'primary') {
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          e.currentTarget.style.transform = 'translateY(0)';
        } else {
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}
