import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function Contact() {
  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '6rem 5% 8rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '5rem', maxWidth: '700px', margin: '0 auto 5rem' }}>
        <h4 style={{ color: 'var(--color-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Get In Touch</h4>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>We'd Love To Hear From You</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.15rem', lineHeight: '1.8' }}>
          Whether you have questions about admissions, our programs, or want to schedule a campus tour, our team is ready to answer all your queries.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr', gap: '4rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Contact Info Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ background: 'white', padding: '2.5rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div style={{ background: 'var(--color-primary-light)', padding: '1rem', borderRadius: '50%', color: 'var(--color-primary)' }}>
              <MapPin size={28} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.3rem', marginBottom: '0.75rem', fontWeight: 'bold' }}>Our Campus</h4>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', fontSize: '1.05rem' }}>742 Evergreen Terrace<br/>Springfield, EduState 45890<br/>United States</p>
            </div>
          </div>

          <div style={{ background: 'white', padding: '2.5rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div style={{ background: 'var(--color-primary-light)', padding: '1rem', borderRadius: '50%', color: 'var(--color-primary)' }}>
              <Mail size={28} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.3rem', marginBottom: '0.75rem', fontWeight: 'bold' }}>Email Us</h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', marginBottom: '0.5rem' }}>admissions@edusaas.com</p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>support@edusaas.com</p>
            </div>
          </div>

          <div style={{ background: 'white', padding: '2.5rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div style={{ background: 'var(--color-primary-light)', padding: '1rem', borderRadius: '50%', color: 'var(--color-primary)' }}>
              <Phone size={28} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.3rem', marginBottom: '0.75rem', fontWeight: 'bold' }}>Call Us</h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', marginBottom: '0.5rem' }}>Main: +1 (555) 123-4567</p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>Admissions: +1 (555) 987-6543</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div style={{ background: 'white', padding: '4rem', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-xl)' }}>
          <h3 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 'bold' }}>Send a Message</h3>
          <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--color-text-main)' }}>First Name</label>
                <input type="text" placeholder="John" style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', outline: 'none', background: '#F8FAFC', fontSize: '1rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--color-text-main)' }}>Last Name</label>
                <input type="text" placeholder="Doe" style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', outline: 'none', background: '#F8FAFC', fontSize: '1rem' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--color-text-main)' }}>Email Address</label>
              <input type="email" placeholder="john.doe@example.com" style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', outline: 'none', background: '#F8FAFC', fontSize: '1rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--color-text-main)' }}>Subject</label>
              <select style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', outline: 'none', background: '#F8FAFC', fontSize: '1rem', cursor: 'pointer' }}>
                <option>General Inquiry</option>
                <option>Admissions</option>
                <option>Careers</option>
                <option>Technical Support</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--color-text-main)' }}>Message</label>
              <textarea rows="5" placeholder="How can we help you?" style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', outline: 'none', resize: 'vertical', background: '#F8FAFC', fontSize: '1rem' }}></textarea>
            </div>
            <Button variant="primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', marginTop: '1rem' }}>Send Message</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
