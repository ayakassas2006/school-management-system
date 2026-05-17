import React, { useState } from 'react';

export default function Gallery() {
  const [filter, setFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'campus', label: 'Campus' },
    { id: 'events', label: 'Events' },
    { id: 'students', label: 'Students Life' }
  ];

  const photos = [
    { id: 1, category: 'events', url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1000&auto=format&fit=crop', title: 'Annual Science Fair' },
    { id: 2, category: 'campus', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop', title: 'Modern Classrooms' },
    { id: 3, category: 'events', url: 'https://images.unsplash.com/photo-1511629091441-ee461463814a?q=80&w=600&auto=format&fit=crop', title: 'Graduation Ceremony' },
    { id: 4, category: 'campus', url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=800&auto=format&fit=crop', title: 'Library' },
    { id: 5, category: 'students', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop', title: 'Study Groups' },
    { id: 6, category: 'students', url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop', title: 'Art Class' },
  ];

  const filteredPhotos = filter === 'all' ? photos : photos.filter(p => p.category === filter);

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', padding: '6rem 5% 8rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>Photo Gallery</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.15rem' }}>Glimpses into our vibrant community, modern facilities, and student activities.</p>
      </div>
      
      {/* Filters */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '4rem', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '2rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              border: filter === cat.id ? 'none' : '1px solid var(--color-border)',
              background: filter === cat.id ? 'var(--gradient-primary)' : 'white',
              color: filter === cat.id ? 'white' : 'var(--color-text-main)',
              boxShadow: filter === cat.id ? 'var(--shadow-md)' : 'none'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {filteredPhotos.map((photo) => (
          <div key={photo.id} style={{ borderRadius: '1rem', overflow: 'hidden', position: 'relative', group: 'true', cursor: 'zoom-in', height: '300px' }}>
            <img src={photo.url} alt={photo.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} onMouseEnter={e => e.target.style.transform = 'scale(1.05)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '2rem 1.5rem 1.5rem', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', color: 'white', opacity: 0.9 }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{photo.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
