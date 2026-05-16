import React from 'react';

function SkeletonBox({ width = '100%', height = '1rem', borderRadius = 'var(--radius-md)', style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius, flexShrink: 0, ...style }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card-base" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SkeletonBox width="140px" height="0.875rem" />
        <SkeletonBox width="44px" height="44px" borderRadius="var(--radius-lg)" />
      </div>
      <SkeletonBox width="80px" height="2.25rem" />
      <SkeletonBox width="120px" height="0.75rem" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: '1rem',
        padding: '1rem 1.5rem',
        borderBottom: '2px solid var(--color-border)'
      }}>
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonBox key={i} width={i === 0 ? '80px' : '60px'} height="0.75rem" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: '1rem',
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          {Array.from({ length: cols }).map((_, colIdx) => (
            <div key={colIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {colIdx === 0 && <SkeletonBox width="36px" height="36px" borderRadius="50%" style={{ flexShrink: 0 }} />}
              <SkeletonBox width={colIdx === 0 ? '120px' : '80px'} height="0.875rem" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonText({ lines = 3, lastLineWidth = '60%' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBox
          key={i}
          width={i === lines - 1 ? lastLineWidth : '100%'}
          height="0.875rem"
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 48 }) {
  return <SkeletonBox width={`${size}px`} height={`${size}px`} borderRadius="50%" />;
}

export function SkeletonPageHeader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
      <div>
        <SkeletonBox width="200px" height="2rem" style={{ marginBottom: '0.5rem' }} />
        <SkeletonBox width="300px" height="0.875rem" />
      </div>
      <SkeletonBox width="140px" height="42px" borderRadius="var(--radius-lg)" />
    </div>
  );
}

export default SkeletonBox;
