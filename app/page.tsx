import Link from 'next/link'
import { ArrowRight, Dumbbell, Users, Calendar, Target, Zap, ChevronRight } from 'lucide-react'
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants'
import './landing.css'

/**
 * Landing Page Component
 * 
 * Homepage with hero section, features, how-it-works, and CTA.
 * Styles are externalized to landing.css for better organization.
 * Design tokens are defined in lib/design-system.ts for theme management.
 */

// Marquee content data
const marqueeItems = [
  'DAILY CALENDAR',
  'WORKOUT PARTNERS',
  'STAY ACCOUNTABLE',
  'TRACK PROGRESS',
  'GYM COMMUNITY',
  'NEVER MISS A SESSION',
]

// Hero stats data
const heroStats = [
  { number: '12K+', label: 'Active Athletes' },
  { number: '840+', label: 'Gyms Connected' },
  { number: '96%', label: 'Show-Up Rate' },
]

// Features data
const features = [
  {
    number: '01',
    icon: Calendar,
    title: 'Daily Workout Calendar',
    description: 'See exactly who\'s training today, what they\'re working on, and when they\'ll be there. Real-time visibility into your gym community.',
  },
  {
    number: '02',
    icon: Users,
    title: 'Find Training Partners',
    description: 'Send workout invitations, match with athletes who share your schedule, and build consistent training relationships that stick.',
  },
  {
    number: '03',
    icon: Target,
    title: 'Stay Accountable',
    description: 'Commit publicly to your sessions. When your gym community can see your plan, you show up. Accountability drives consistency.',
  },
]

// How it works steps
const howItWorksSteps = [
  {
    step: '01',
    title: 'Join Your Gym',
    description: 'Create or join your gym with a simple invite code. Your entire gym community in one place, instantly.',
  },
  {
    step: '02',
    title: 'Post Your Sessions',
    description: 'Mark when you\'re training. Choose the workout type, time, and who you want to train with. Visible to your whole gym.',
  },
  {
    step: '03',
    title: 'Connect & Crush It',
    description: 'See who else is going, send invites, lock in partners, and walk in ready. No more training alone.',
  },
]

export default function HomePage() {
  // Split app name for logo styling
  const [firstName, ...restName] = APP_NAME.split(' ')
  const restOfName = restName.join(' ')

  return (
    <div className="gym-page">
      {/* ══════════════════════════════════════════════════════════════
          HEADER
          ══════════════════════════════════════════════════════════════ */}
      <header className="gym-header">
        <div className="gym-header-inner">
          <Link href="/" className="gym-logo" aria-label="Home">
            <div className="gym-logo-icon" aria-hidden="true">
              <Dumbbell size={18} color="#000" strokeWidth={2.5} />
            </div>
            <span className="gym-logo-text">
              {firstName}
              {restOfName && <span>{restOfName}</span>}
            </span>
          </Link>
          <Link href="/login" className="gym-nav-btn">
            Sign In <ChevronRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION
          ══════════════════════════════════════════════════════════════ */}
      <section className="gym-hero">
        {/* Background effects */}
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-slash" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />

        <div className="gym-hero-inner">
          {/* Live ticker */}
          <div className="hero-ticker" role="status" aria-live="polite">
            <div className="ticker-dot" aria-hidden="true" />
            <div className="ticker-text">
              LIVE NOW — 247 ATHLETES TRAINING &nbsp;&nbsp;&nbsp; 
              FIND YOUR PARTNER &nbsp;&nbsp;&nbsp; 
              NEVER TRAIN ALONE &nbsp;&nbsp;&nbsp; 
              LIVE NOW — 247 ATHLETES TRAINING
            </div>
          </div>

          {/* Main headline */}
          <h1 className="hero-headline">
            <span className="hero-headline-line1">FIND YOUR</span>
            <span className="hero-headline-line2">PERFECT</span>
            <span className="hero-headline-line3">PARTNER</span>
          </h1>

          <p className="hero-sub">
            {APP_DESCRIPTION}. See who's hitting the gym today, sync schedules, and never train alone again.
          </p>

          {/* CTA buttons */}
          <div className="hero-cta-group">
            <Link href="/login" className="cta-primary">
              Start For Free <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link href="#features" className="cta-secondary">
              See How It Works <ChevronRight size={14} aria-hidden="true" />
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            {heroStats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator" aria-hidden="true">
          <div className="scroll-line" />
          <span className="scroll-text">Scroll</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          MARQUEE
          ══════════════════════════════════════════════════════════════ */}
      <div className="gym-marquee" aria-hidden="true">
        <div className="marquee-track">
          {/* Duplicate marquee items for seamless loop */}
          {[0, 1].map((iteration) =>
            marqueeItems.map((item, index) => (
              <div className="marquee-item" key={`${iteration}-${index}`}>
                {item} <span className="marquee-sep">✦</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          FEATURES SECTION
          ══════════════════════════════════════════════════════════════ */}
      <section className="gym-features" id="features">
        <div className="features-inner">
          <div className="section-eyebrow">
            <div className="eyebrow-line" aria-hidden="true" />
            <span className="eyebrow-text">Core Features</span>
          </div>
          
          <h2 className="section-title">
            BUILT FOR SERIOUS
            <br />
            ATHLETES
          </h2>
          
          <p className="section-sub">
            Everything your gym community needs to stay in sync, stay motivated, and show up harder.
          </p>

          <div className="features-grid">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <article key={feature.number} className="feature-card">
                  <div className="feature-number" aria-hidden="true">
                    {feature.number}
                  </div>
                  <div className="feature-icon-wrap" aria-hidden="true">
                    <Icon size={22} color="#F59E0B" />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-desc">{feature.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          HOW IT WORKS SECTION
          ══════════════════════════════════════════════════════════════ */}
      <section className="gym-how">
        <div className="how-inner">
          <div className="section-eyebrow">
            <div className="eyebrow-line" aria-hidden="true" />
            <span className="eyebrow-text">How It Works</span>
          </div>
          
          <h2 className="section-title">
            THREE STEPS.
            <br />
            ZERO EXCUSES.
          </h2>

          <div className="how-steps">
            {howItWorksSteps.map((step) => (
              <article key={step.step} className="how-step">
                <div className="how-step-num">STEP {step.step}</div>
                <h3 className="how-step-title">{step.title}</h3>
                <p className="how-step-desc">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CTA SECTION
          ══════════════════════════════════════════════════════════════ */}
      <section className="gym-cta">
        <div className="cta-inner">
          <div className="section-eyebrow" style={{ justifyContent: 'center' }}>
            <div className="eyebrow-line" aria-hidden="true" />
            <span className="eyebrow-text">Get Started</span>
            <div className="eyebrow-line" aria-hidden="true" />
          </div>

          <h2 className="cta-headline">
            READY TO
            <br />
            <em>TRANSFORM</em>
            <br />
            YOUR GYM?
          </h2>

          <p className="cta-sub">
            Join thousands of gym members who coordinate, commit, and crush workouts together.
          </p>

          <Link 
            href="/login" 
            className="cta-primary" 
            style={{ fontSize: '15px', padding: '18px 48px' }}
          >
            <Zap size={16} aria-hidden="true" />
            Sign In with Google
          </Link>

          <div className="cta-divider" aria-hidden="true" />
          
          <Link href="/login" className="cta-google">
            Already have an account? Sign In
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════════════════════ */}
      <footer className="gym-footer">
        <div className="footer-inner">
          <span className="footer-copy">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </span>
          <span className="footer-tagline">
            BUILT FOR THOSE WHO <span>SHOW UP.</span>
          </span>
        </div>
      </footer>
    </div>
  )
}
