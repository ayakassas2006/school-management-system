import React from 'react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  BookOpen, Users, Calendar, Target, Award, ArrowRight,
  CheckCircle, MapPin, Mail, Phone, Star, Quote, ChevronRight, PlayCircle, ShieldCheck, Zap, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const glassCard1Style = { position: 'absolute', top: '15%', left: '-60px', padding: '1.25rem 2rem', display: 'flex', gap: '1.25rem', alignItems: 'center', background: 'var(--glass-bg-strong)' };
const glassCard2Style = { position: 'absolute', bottom: '10%', right: '-40px', padding: '1.5rem 2.5rem', display: 'flex', gap: '1.25rem', alignItems: 'center', background: 'var(--glass-bg-strong)' };

export default function Home() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const logos = [
    "Harvard University", "Stanford Research", "MIT Education", "Oxford Academy", "Yale Learning", "Cambridge Inst."
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', overflow: 'hidden' }}>
      
      {/* 1. ULTRA-PREMIUM HERO SECTION */}
      <section id="home" style={{ 
        minHeight: '100vh',
        padding: '8rem 5% 6rem',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        background: 'var(--gradient-hero)',
        zIndex: 1
      }}>
        {/* Animated Background Blobs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '10%', right: '5%', width: '600px', height: '600px', background: 'var(--color-primary)', opacity: 0.08, borderRadius: '50%', filter: 'blur(80px)', zIndex: -1 }} 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], x: [0, -60, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', bottom: '10%', left: '5%', width: '500px', height: '500px', background: 'var(--color-secondary)', opacity: 0.08, borderRadius: '50%', filter: 'blur(70px)', zIndex: -1 }} 
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '5rem', alignItems: 'center', width: '100%' }}>
          <motion.div initial="hidden" animate="show" variants={staggerContainer}>
            <motion.div variants={fadeInUp} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '0.6rem 1.25rem', borderRadius: '3rem', fontWeight: '800', marginBottom: '2rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
              <Zap size={16} fill="currentColor" /> Transforming Institutional Excellence
            </motion.div>
            
            <motion.h1 variants={fadeInUp} style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', marginBottom: '1.5rem', lineHeight: '1', fontWeight: '900', color: 'var(--color-text-main)', letterSpacing: '-0.02em' }}>
                Next-Gen <br />
                <span className="text-gradient" style={{ display: 'inline-block', position: 'relative' }}>
                    Education <span style={{ position: 'absolute', bottom: '15%', left: 0, width: '100%', height: '8px', background: 'var(--color-primary)', opacity: 0.1, zIndex: -1 }}></span>
                </span>
                <br />Management.
            </motion.h1>

            <motion.p variants={fadeInUp} style={{ fontSize: '1.35rem', color: 'var(--color-text-body)', marginBottom: '3rem', lineHeight: '1.6', maxWidth: '680px', fontWeight: '500' }}>
              The definitive operating system for modern schools. Syncing students, educators, and administrators in a single high-performance neural network.
            </motion.p>
            
            <motion.div variants={fadeInUp} style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <Button 
                variant="primary" 
                onClick={() => navigate('/role-selection')}
                style={{ padding: '1.1rem 3rem', fontSize: '1.1rem', borderRadius: '4rem', boxShadow: 'var(--shadow-glow)', transition: 'transform 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                Access Portal Now <ArrowRight size={20} style={{ marginLeft: 12 }} />
              </Button>
              <Button variant="outline" style={{ padding: '1.1rem 2.5rem', fontSize: '1.1rem', borderRadius: '4rem', border: '2px solid var(--color-border)', background: 'var(--color-surface)', fontWeight: '700' }}>
                <PlayCircle size={22} style={{ marginRight: 10, color: 'var(--color-primary)' }} /> Virtual Explainer
              </Button>
            </motion.div>
            
            <motion.div variants={fadeInUp} style={{ marginTop: '4rem', display: 'flex', gap: '3rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex' }}>
                    {[1,2,3,4].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i+20}`} style={{ width: '50px', height: '50px', borderRadius: '50%', border: '4px solid var(--color-surface)', marginLeft: i === 1 ? 0 : '-18px', boxShadow: 'var(--shadow-md)' }} alt="User" />
                    ))}
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '4px solid var(--color-surface)', marginLeft: '-18px', background: 'var(--gradient-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem', boxShadow: 'var(--shadow-md)' }}>+2k</div>
                </div>
                <div style={{ marginLeft: '1.5rem' }}>
                    <div style={{ display: 'flex', color: 'var(--color-warning)', gap: '0.1rem' }}>
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.3rem', fontWeight: '700' }}>5.0 Rating from Institutional Users</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'relative' }}
          >
            <div className="glass-panel" style={{ padding: '0.75rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-3xl)', boxShadow: 'var(--shadow-2xl)', border: '1px solid var(--glass-border)' }}>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop" 
                alt="Digital Education" 
                style={{ width: '100%', height: 'auto', borderRadius: '1.75rem', filter: 'contrast(1.05) brightness(1.05)' }} 
              />
            </div>
            
            {/* High-Fidelity Float Cards */}
            <motion.div 
              style={{ ...glassCard1Style, y: y1 }}
              className="glass-panel"
            >
              <div style={{ background: 'var(--gradient-primary)', padding: '0.8rem', borderRadius: '1rem', color: 'white', boxShadow: 'var(--shadow-glow)' }}>
                <ShieldCheck size={28} />
              </div>
              <div>
                <p style={{ fontWeight: '900', color: 'var(--color-text-main)', fontSize: '1.25rem', lineHeight: '1' }}>ISO Certified</p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: '700', marginTop: '4px' }}>Enterprise Grade Security</p>
              </div>
            </motion.div>

            <motion.div 
              style={{ ...glassCard2Style, y: y2 }}
              className="glass-panel"
            >
              <div style={{ background: 'var(--gradient-success)', padding: '0.8rem', borderRadius: '1rem', color: 'white', boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)' }}>
                <Activity size={28} />
              </div>
              <div>
                <p style={{ fontWeight: '900', color: 'var(--color-text-main)', fontSize: '1.35rem', lineHeight: '1' }}>Live Analytics</p>
                <p style={{ color: 'var(--color-success)', fontSize: '0.8rem', fontWeight: '800', marginTop: '4px', textTransform: 'uppercase' }}>99.9% Automation</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Infinite Trust Scroller */}
      <div style={{ background: 'var(--color-surface)', borderY: '1px solid var(--color-border)', padding: '3rem 0', overflow: 'hidden' }}>
        <h3 style={{ textAlign: 'center', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '4px', marginBottom: '2.5rem', fontWeight: '800' }}>Trusted by World-Class Institutions</h3>
        <div style={{ display: 'flex', gap: '4rem', width: '200%', animation: 'scrollInfinite 30s linear infinite' }}>
            {[...logos, ...logos].map((logo, i) => (
                <div key={i} style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--color-text-subtle)', opacity: 0.5, whiteSpace: 'nowrap' }}>{logo}</div>
            ))}
        </div>
      </div>

      {/* REFINED TESTIMONIALS SECTION */}
      <section id="testimonials" style={{ padding: '10rem 5%', background: '#0B1120', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '60vw', height: '100%', background: 'radial-gradient(circle at top right, rgba(79, 70, 229, 0.15), transparent 70%)' }}></div>
        
        <div style={{ textAlign: 'center', marginBottom: '6rem', position: 'relative', zIndex: 1 }}>
          <motion.h4 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ color: 'var(--color-secondary)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>The EduSaaS Impact</motion.h4>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: '900' }}>Proven Institutional Success</motion.h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem', position: 'relative', zIndex: 1 }}>
          {[
            { text: "EduSaaS completely transformed how I keep track of my children's progress. The parent portal is incredibly intuitive and detailed.", author: "Amanda Clarke", role: "Parent Association Head", img: "https://i.pravatar.cc/150?img=47" },
            { text: "The digital learning environment made complex Physics concepts actually engaging. I've never felt more connected to my coursework.", author: "Thomas Wright", role: "Student Council Member", img: "https://i.pravatar.cc/150?img=11" },
            { text: "As a teacher, the automated grading and smart attendance features have saved me over 15 hours a week. It's a game changer for faculty.", author: "Rebecca Lin", role: "Senior STEM Educator", img: "https://i.pravatar.cc/150?img=5" }
          ].map((testimonial, i) => (
            <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                style={{ background: 'rgba(255,255,255,0.03)', padding: '4rem 3rem', borderRadius: 'var(--radius-2xl)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
            >
              <Quote size={40} color="var(--color-primary)" style={{ opacity: 0.3, marginBottom: '2rem' }} />
              <p style={{ fontSize: '1.25rem', lineHeight: '1.8', marginBottom: '3rem', fontWeight: '500', color: '#CBD5E1' }}>"{testimonial.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
                <img src={testimonial.img} alt={testimonial.author} style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--color-primary)' }} />
                <div>
                  <h4 style={{ fontWeight: '900', fontSize: '1.25rem', margin: 0 }}>{testimonial.author}</h4>
                  <p style={{ color: 'var(--color-secondary)', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', marginTop: '4px' }}>{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HIGH-CONVERSION CTA */}
      <section style={{ padding: '10rem 5%', background: '#FFFFFF', position: 'relative' }}>
         <div style={{ maxWidth: '1000px', margin: '0 auto', background: 'var(--gradient-primary)', padding: '6rem 4rem', borderRadius: 'var(--radius-3xl)', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-2xl)' }}>
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', border: '40px solid rgba(255,255,255,0.05)', borderRadius: '50%' }} 
            />
            <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: '900', letterSpacing: '-0.03em', position: 'relative' }}>Join the Education Revolution.</h2>
            <p style={{ fontSize: '1.4rem', opacity: 0.9, marginBottom: '4rem', maxWidth: '700px', margin: '0 auto 4rem', fontWeight: '500', lineHeight: 1.6 }}>
                Experience the power of intelligent institutional management. Start your seamless digital transition today.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button onClick={() => navigate('/register')} style={{ background: 'white', color: 'var(--color-primary)', border: 'none', padding: '1.25rem 3.5rem', fontSize: '1.2rem', borderRadius: '4rem', fontWeight: '900', boxShadow: 'var(--shadow-lg)' }}>Reserve Your Demo</Button>
            <Button variant="outline" style={{ padding: '1.25rem 3.5rem', fontSize: '1.2rem', borderRadius: '4rem', borderColor: 'rgba(255,255,255,0.4)', color: 'white', fontWeight: '700' }}>Contact Sales</Button>
            </div>
         </div>
      </section>

      <style>{`
        @keyframes scrollInfinite {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
      `}</style>

    </div>
  );
}
