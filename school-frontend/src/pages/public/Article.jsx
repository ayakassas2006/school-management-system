import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';

export default function Article() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', padding: '6rem 5% 8rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <button 
            onClick={() => navigate('/news')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontWeight: '500', marginBottom: '2rem', cursor: 'pointer', background: 'none', border: 'none' }}
          >
            <ArrowLeft size={20} /> Back to News
          </button>

          <span style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '0.4rem 1rem', borderRadius: '2rem', fontWeight: 'bold', fontSize: '0.85rem' }}>Academic</span>
          
          <h1 style={{ fontSize: '3.5rem', margin: '1.5rem 0', lineHeight: '1.2' }}>School Board Approves New Digital Arts Curriculum</h1>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '2rem', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', gap: '2rem', color: 'var(--color-text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={18} /> April 10, 2026
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={18} /> Communications Team
                    </div>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-main)', fontWeight: '600', cursor: 'pointer', background: 'none', border: 'none' }}>
                    <Share2 size={18} /> Share
                </button>
          </div>

          <img 
            src="https://images.unsplash.com/photo-1542744094-24638ea0b3b5?q=80&w=1200&auto=format&fit=crop" 
            alt="Article header" 
            style={{ width: '100%', height: '450px', objectFit: 'cover', borderRadius: 'var(--radius-xl)', marginBottom: '3rem' }} 
          />

          <div style={{ fontSize: '1.2rem', color: 'var(--color-text-main)', lineHeight: '1.8' }}>
              <p style={{ marginBottom: '2rem' }}>
                  Starting this fall, students will have access to state-of-the-art 3D modeling and digital animation courses. The school board enthusiastically approved the proposed budget to completely revamp the third-floor art wing, transforming it into a high-tech creative lab.
              </p>
              <h3 style={{ fontSize: '1.8rem', marginTop: '3rem', marginBottom: '1.5rem' }}>Bridging Art and Technology</h3>
              <p style={{ marginBottom: '2rem' }}>
                  "We recognized that the intersection of technology and creativity is where the most profound innovations of the 21st century are happening," said Principal Hernandez during the announcement. "Our students need to be fluent in the tools that will define their future careers, whether they go into filmmaking, game design, architecture, or engineering."
              </p>
              <blockquote style={{ borderLeft: '4px solid var(--color-primary)', paddingLeft: '1.5rem', fontStyle: 'italic', color: 'var(--color-text-muted)', fontSize: '1.4rem', margin: '3rem 0' }}>
                  "The new curriculum is designed not just to teach software, but to teach students how to think spatially and solve complex visual problems."
              </blockquote>
              <p style={{ marginBottom: '2rem' }}>
                  The upgrade will include 30 new high-performance workstations, professional-grade drawing tablets for every student, and access to industry-standard software suites. Furthermore, the school has partnered with local tech companies to offer mentorship programs and summer internships to excelling juniors and seniors.
              </p>
          </div>
      </div>
    </div>
  );
}
