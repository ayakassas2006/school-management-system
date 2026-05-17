import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import { CheckCircle, Award, Target, ChevronRight } from 'lucide-react';

export default function About() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', padding: '4rem 5% 8rem' }}>
      
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '6rem', maxWidth: '800px', margin: '0 auto 6rem', padding: '4rem 0' }}>
         <motion.h4 initial="hidden" animate="show" variants={fadeInUp} style={{ color: 'var(--color-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>Our Story</motion.h4>
         <motion.h1 initial="hidden" animate="show" variants={fadeInUp} style={{ fontSize: '4rem', marginBottom: '2rem', lineHeight: '1.2' }}>Shaping the Future of Education</motion.h1>
         <motion.p initial="hidden" animate="show" variants={fadeInUp} style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
           Since our founding, we have been committed to empowering students to reach their full potential. We blend traditional values with cutting-edge technology.
         </motion.p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center', marginBottom: '8rem' }}>
        <div style={{ position: 'relative' }}>
          <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop" style={{ borderRadius: 'var(--radius-2xl)', width: '100%', boxShadow: 'var(--shadow-xl)' }} alt="Campus Life" />
          <div style={{ position: 'absolute', bottom: '-2rem', right: '-2rem', background: 'var(--color-primary)', color: 'white', padding: '2.5rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ fontSize: '3.5rem', margin: 0, lineHeight: 1 }}>25+</h3>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, marginTop: '0.5rem' }}>Years of Excellence</p>
          </div>
        </div>
        <div>
          <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--color-text-main)' }}>Our Mission & Vision</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '2rem' }}>
            We believe in nurturing individual potential through a carefully crafted curriculum and state-of-the-art facilities. Our mission is to prepare students to thrive in a rapidly changing world by instilling critical thinking and ethical values.
          </p>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {[
              'Global Standard Core Curriculum',
              'Advanced Digital Classrooms and Labs',
              'Comprehensive Extracurricular & Sports',
              'Focus on Emotional and Social Growth'
            ].map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-text-main)', fontWeight: '500', fontSize: '1.1rem' }}>
                <CheckCircle color="var(--color-success)" size={24} /> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Timeline Section */}
      <div style={{ background: '#F8FAFC', padding: '6rem \n5%', borderRadius: 'var(--radius-2xl)', marginBottom: '8rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '3rem' }}>Our History</h2>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '24px', left: '0', width: '100%', height: '4px', background: 'var(--color-border)', zIndex: 0 }}></div>
            {[
                { year: '1998', title: 'Foundation', desc: 'Started with just 50 students in a small building.' },
                { year: '2005', title: 'Campus Expansion', desc: 'Moved to our current 120-acre campus.' },
                { year: '2015', title: 'Digital Transition', desc: 'Implemented 1:1 device programs.' },
                { year: '2026', title: 'Global Recognition', desc: 'Awarded #1 Innovation School globally.' },
            ].map((item, i) => (
                <div key={i} style={{ position: 'relative', zIndex: 1, width: '22%', background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: 'var(--shadow-md)', borderTop: '4px solid var(--color-primary)' }}>
                    <div style={{ width: '16px', height: '16px', background: 'var(--color-primary)', borderRadius: '50%', position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)' }}></div>
                    <h3 style={{ color: 'var(--color-primary)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.year}</h3>
                    <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', fontSize: '1.1rem' }}>{item.title}</h4>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>{item.desc}</p>
                </div>
            ))}
        </div>
      </div>
      
    </div>
  );
}
