import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import Card from '../../components/ui/Card';

export default function News() {
  const navigate = useNavigate();

  const newsList = [
    { id: '1', title: "Annual Science Fair 2026: Innovations for Tomorrow", date: "April 15, 2026", category: "Event", desc: "Join us for a spectacular display of student ingenuity ranging from renewable energy models to robotics.", img: "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?q=80&w=600&auto=format&fit=crop" },
    { id: '2', title: "School Board Approves New Digital Arts Curriculum", date: "April 10, 2026", category: "Academic", desc: "Starting this fall, students will have access to state-of-the-art 3D modeling and digital animation courses.", img: "https://images.unsplash.com/photo-1542744094-24638ea0b3b5?q=80&w=600&auto=format&fit=crop" },
    { id: '3', title: "Varsity Basketball Team Secures Regional Championship", date: "April 02, 2026", category: "Sports", desc: "A thrilling final quarter secured our school's first regional title in over a decade.", img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=600&auto=format&fit=crop" },
    { id: '4', title: "Alumni Spotlight: Sarah Chen '18 Lands Mars Mission", date: "March 28, 2026", category: "Alumni", desc: "Former valedictorian Sarah Chen has been selected as a mission specialist for the upcoming expedition.", img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=600&auto=format&fit=crop" },
    { id: '5', title: "New Campus Sustainability Initiative Launched", date: "March 15, 2026", category: "Campus", desc: "Our objective is to reach net-zero carbon emissions by 2030 through solar panels and waste reduction.", img: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=600&auto=format&fit=crop" },
    { id: '6', title: "Guest Lecture Series: The Future of AI in Healthcare", date: "March 05, 2026", category: "Event", desc: "Dr. Robert Smith discusses how artificial intelligence is democratizing access to preventative medicine.", img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=600&auto=format&fit=crop" }
  ];

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '6rem 5% 8rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '5rem', maxWidth: '800px', margin: '0 auto 5rem' }}>
        <h4 style={{ color: 'var(--color-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Stay Updated</h4>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>Latest News & Announcements</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.15rem' }}>
          Discover the latest stories from our campus, celebrating academic and extracurricular achievements.
        </p>
      </div>

      {/* Featured Article */}
      <div 
        style={{ marginBottom: '4rem', background: 'white', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', display: 'grid', gridTemplateColumns: '1.5fr 1fr', cursor: 'pointer' }}
        onClick={() => navigate(`/news/${newsList[0].id}`)}
      >
          <img src={newsList[0].img} alt={newsList[0].title} style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '400px' }} />
          <div style={{ padding: '4rem 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '0.4rem 1rem', borderRadius: '2rem', fontWeight: 'bold', fontSize: '0.85rem', width: 'max-content', marginBottom: '1rem' }}>Featured {newsList[0].category}</span>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: '1.2' }}>{newsList[0].title}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                <Calendar size={16} /> {newsList[0].date}
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '2rem' }}>{newsList[0].desc}</p>
            <div style={{ color: 'var(--color-primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Read Full Article <ArrowRight size={20} />
            </div>
          </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
        {newsList.slice(1).map((news) => (
          <Card 
            key={news.id} 
            hoverEffect={true} 
            style={{ overflow: 'hidden', padding: 0, cursor: 'pointer', border: '1px solid var(--color-border)' }}
            onClick={() => navigate(`/news/${news.id}`)}
          >
            <img src={news.img} alt={news.title} style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
            <div style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>
                <span>{news.date}</span>
                <span style={{ color: 'var(--color-primary)' }}>{news.category}</span>
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', lineHeight: '1.4' }}>{news.title}</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>{news.desc}</p>
              <div style={{ color: 'var(--color-primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  Read More <ArrowRight size={16} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
