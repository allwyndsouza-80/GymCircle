/**
 * Shared Design System Components
 * 
 * Reusable components following the Dark Amber design system.
 * Use these components across the app to maintain design consistency.
 */

import React from 'react'

/* ═══════════════════════════════════════════════════════════
   SECTION HEADER COMPONENTS
   ═══════════════════════════════════════════════════════════ */

interface SectionEyebrowProps {
  children: React.ReactNode
  centered?: boolean
}

export function SectionEyebrow({ children, centered = false }: SectionEyebrowProps) {
  return (
    <div 
      className="section-eyebrow" 
      style={centered ? { justifyContent: 'center' } : undefined}
    >
      <div className="eyebrow-line" aria-hidden="true" />
      <span className="eyebrow-text">{children}</span>
      {centered && <div className="eyebrow-line" aria-hidden="true" />}
    </div>
  )
}

interface SectionTitleProps {
  children: React.ReactNode
  className?: string
}

export function SectionTitle({ children, className = '' }: SectionTitleProps) {
  return (
    <h2 className={`section-title ${className}`.trim()}>
      {children}
    </h2>
  )
}

interface SectionSubtitleProps {
  children: React.ReactNode
  className?: string
}

export function SectionSubtitle({ children, className = '' }: SectionSubtitleProps) {
  return (
    <p className={`section-sub ${className}`.trim()}>
      {children}
    </p>
  )
}

/* ═══════════════════════════════════════════════════════════
   BUTTON COMPONENTS
   ═══════════════════════════════════════════════════════════ */

interface PrimaryButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
  icon?: React.ReactNode
  size?: 'default' | 'large'
}

export function PrimaryButton({ 
  href, 
  children, 
  icon, 
  size = 'default',
  className = '',
  ...props 
}: PrimaryButtonProps) {
  const padding = size === 'large' ? '18px 48px' : '16px 36px'
  const fontSize = size === 'large' ? '15px' : '14px'
  
  return (
    <a
      href={href}
      className={`cta-primary ${className}`.trim()}
      style={{ padding, fontSize }}
      {...props}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </a>
  )
}

interface SecondaryButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
  icon?: React.ReactNode
}

export function SecondaryButton({ 
  href, 
  children, 
  icon, 
  className = '',
  ...props 
}: SecondaryButtonProps) {
  return (
    <a
      href={href}
      className={`cta-secondary ${className}`.trim()}
      {...props}
    >
      {children}
      {icon && <span aria-hidden="true">{icon}</span>}
    </a>
  )
}

interface OutlineButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
  icon?: React.ReactNode
}

export function OutlineButton({ 
  href, 
  children, 
  icon, 
  className = '',
  ...props 
}: OutlineButtonProps) {
  return (
    <a
      href={href}
      className={`cta-google ${className}`.trim()}
      {...props}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </a>
  )
}

/* ═══════════════════════════════════════════════════════════
   CARD COMPONENTS
   ═══════════════════════════════════════════════════════════ */

interface FeatureCardProps {
  number: string
  icon: React.ReactNode
  title: string
  description: string
}

export function FeatureCard({ number, icon, title, description }: FeatureCardProps) {
  return (
    <article className="feature-card">
      <div className="feature-number" aria-hidden="true">
        {number}
      </div>
      <div className="feature-icon-wrap" aria-hidden="true">
        {icon}
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{description}</p>
    </article>
  )
}

interface StepCardProps {
  step: string
  title: string
  description: string
}

export function StepCard({ step, title, description }: StepCardProps) {
  return (
    <article className="how-step">
      <div className="how-step-num">STEP {step}</div>
      <h3 className="how-step-title">{title}</h3>
      <p className="how-step-desc">{description}</p>
    </article>
  )
}

/* ═══════════════════════════════════════════════════════════
   STAT COMPONENTS
   ═══════════════════════════════════════════════════════════ */

interface StatItemProps {
  number: string
  label: string
}

export function StatItem({ number, label }: StatItemProps) {
  return (
    <div className="stat-item">
      <div className="stat-number">{number}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

interface StatsStripProps {
  stats: Array<{ number: string; label: string }>
  className?: string
}

export function StatsStrip({ stats, className = '' }: StatsStripProps) {
  return (
    <div className={`hero-stats ${className}`.trim()}>
      {stats.map((stat, index) => (
        <StatItem key={index} number={stat.number} label={stat.label} />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   LAYOUT COMPONENTS
   ═══════════════════════════════════════════════════════════ */

interface SectionContainerProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export function SectionContainer({ children, className = '', id }: SectionContainerProps) {
  return (
    <section className={className} id={id}>
      <div className="features-inner">
        {children}
      </div>
    </section>
  )
}

interface ContentInnerProps {
  children: React.ReactNode
  maxWidth?: '1200px' | '800px' | '600px'
}

export function ContentInner({ children, maxWidth = '1200px' }: ContentInnerProps) {
  return (
    <div style={{ maxWidth, margin: '0 auto', padding: '0 24px' }}>
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   DIVIDER COMPONENTS
   ═══════════════════════════════════════════════════════════ */

interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export function Divider({ orientation = 'vertical', className = '' }: DividerProps) {
  if (orientation === 'horizontal') {
    return (
      <div 
        className={`${className}`.trim()}
        style={{ 
          width: '100%', 
          height: '1px', 
          background: 'var(--color-border)',
          margin: '24px 0'
        }}
        aria-hidden="true"
      />
    )
  }
  
  return (
    <div 
      className={`cta-divider ${className}`.trim()}
      aria-hidden="true"
    />
  )
}

/* ═══════════════════════════════════════════════════════════
   GRID COMPONENTS
   ═══════════════════════════════════════════════════════════ */

interface GridProps {
  children: React.ReactNode
  columns?: 2 | 3 | 4
  gap?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
}

export function Grid({ children, columns = 3, gap = 'md', className = '' }: GridProps) {
  const gapValue = {
    none: '1px',
    sm: '16px',
    md: '24px',
    lg: '32px',
  }[gap]
  
  return (
    <div 
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: gapValue,
      }}
    >
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   UTILITY COMPONENTS
   ═══════════════════════════════════════════════════════════ */

interface SpacerProps {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
}

export function Spacer({ size }: SpacerProps) {
  const sizeMap = {
    xs: '8px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px',
    '2xl': '64px',
    '3xl': '80px',
    '4xl': '120px',
  }
  
  return <div style={{ height: sizeMap[size] }} aria-hidden="true" />
}

/* ═══════════════════════════════════════════════════════════
   ANIMATION WRAPPER
   ═══════════════════════════════════════════════════════════ */

interface FadeUpProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function FadeUp({ children, delay = 0, className = '' }: FadeUpProps) {
  return (
    <div
      className={className}
      style={{
        animation: `heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s both`,
      }}
    >
      {children}
    </div>
  )
}
