# Design System Quick Reference

Quick reference guide for using the Gym Social Calendar design system.

---

## 🎨 **Color Palette**

### Usage in CSS
```css
.my-element {
  color: var(--color-primary);
  background: var(--color-black);
  border: 1px solid var(--color-border);
}
```

### Usage in TypeScript
```typescript
import { theme } from '@/lib/design-system'

const color = theme.colors.primary // '#F59E0B'
```

### Available Colors
- `--color-primary` - Amber accent (#F59E0B)
- `--color-black` - Main background (#080808)
- `--color-steel` - Section background (#111111)
- `--color-panel` - Card background (#161616)
- `--color-border` - Dividers (#282828)
- `--color-white` - Primary text (#F5F0E8)
- `--color-muted` - Secondary text (#666)

---

## 📝 **Typography**

### Font Families
```css
font-family: var(--font-display);  /* Bebas Neue - Headlines */
font-family: var(--font-heading);  /* Oswald - Subheadings */
font-family: var(--font-body);     /* DM Sans - Body text */
```

### Common Patterns
```tsx
// Large display headline
<h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(48px, 8vw, 100px)' }}>
  HEADLINE
</h1>

// Section title
<h2 className="section-title">SECTION TITLE</h2>

// Body text
<p style={{ fontFamily: 'var(--font-body)', fontSize: '14px' }}>
  Body text content
</p>
```

---

## 📏 **Spacing**

### CSS Variables
```css
padding: var(--spacing-md);        /* 24px */
margin-bottom: var(--spacing-xl);  /* 48px */
gap: var(--spacing-sm);           /* 16px */
```

### Available Sizes
- `--spacing-xs` - 8px
- `--spacing-sm` - 16px
- `--spacing-md` - 24px
- `--spacing-lg` - 32px
- `--spacing-xl` - 48px
- `--spacing-2xl` - 64px
- `--spacing-3xl` - 80px
- `--spacing-4xl` - 120px

---

## 🧩 **Reusable Components**

### Import Components
```tsx
import {
  SectionEyebrow,
  SectionTitle,
  SectionSubtitle,
  PrimaryButton,
  SecondaryButton,
  FeatureCard,
  StepCard,
  StatItem,
  Divider,
  Spacer,
  FadeUp,
} from '@/components/design-system'
```

### Section Header Pattern
```tsx
<SectionEyebrow>Core Features</SectionEyebrow>
<SectionTitle>
  YOUR MAIN<br />HEADLINE
</SectionTitle>
<SectionSubtitle>
  Supporting text that explains the section.
</SectionSubtitle>
```

### Button Pattern
```tsx
import { ArrowRight } from 'lucide-react'

<PrimaryButton href="/login" icon={<ArrowRight size={16} />}>
  Get Started
</PrimaryButton>

<SecondaryButton href="#features">
  Learn More
</SecondaryButton>
```

### Feature Card Pattern
```tsx
import { Calendar } from 'lucide-react'

<FeatureCard
  number="01"
  icon={<Calendar size={22} color="#F59E0B" />}
  title="Daily Calendar"
  description="See who's training today."
/>
```

---

## 🎬 **Animations**

### Fade Up Animation
```tsx
<FadeUp delay={0.2}>
  <div>Content appears with fade-up effect</div>
</FadeUp>
```

### Hover Effects
```css
.my-button {
  transition: all 0.2s;
}

.my-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(245, 158, 11, 0.35);
}
```

### Available Keyframes
- `@keyframes heroFadeUp` - Fade up entrance
- `@keyframes pulse` - Gentle pulsing
- `@keyframes blink` - Blinking dot
- `@keyframes marquee` - Infinite scroll
- `@keyframes gridPan` - Moving grid

---

## 📐 **Layout Patterns**

### Full-Width Section
```tsx
<section className="gym-features">
  <div className="features-inner">
    {/* Content */}
  </div>
</section>
```

### Centered Content
```tsx
<div style={{ 
  maxWidth: '1200px', 
  margin: '0 auto', 
  padding: '0 24px' 
}}>
  {/* Content */}
</div>
```

### Grid Layout
```tsx
<div className="features-grid">
  {features.map(feature => (
    <FeatureCard key={feature.id} {...feature} />
  ))}
</div>
```

---

## 🎨 **Common Patterns**

### Angled Clip Path (Buttons)
```css
.my-button {
  clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);
}
```

### Gradient Overlay
```css
.my-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
}
```

### Border Accent (Top)
```css
.my-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-primary);
}
```

---

## 🎯 **Common Use Cases**

### Creating a New Section
```tsx
export function MySection() {
  return (
    <section style={{ padding: 'var(--spacing-4xl) 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <SectionEyebrow>Section Label</SectionEyebrow>
        <SectionTitle>SECTION TITLE</SectionTitle>
        <SectionSubtitle>Description text</SectionSubtitle>
        
        {/* Your content */}
      </div>
    </section>
  )
}
```

### Creating a Card Grid
```tsx
<div className="features-grid">
  {items.map((item, index) => (
    <div key={index} className="feature-card">
      <h3 className="feature-title">{item.title}</h3>
      <p className="feature-desc">{item.description}</p>
    </div>
  ))}
</div>
```

### Adding Stats
```tsx
const stats = [
  { number: '12K+', label: 'Active Users' },
  { number: '840+', label: 'Gyms' },
  { number: '96%', label: 'Success Rate' },
]

<div className="hero-stats">
  {stats.map((stat, i) => (
    <StatItem key={i} {...stat} />
  ))}
</div>
```

---

## 🔧 **Customization**

### Changing Theme
```typescript
// In lib/design-system.ts
export const ACTIVE_THEME = 'darkAmber' // Change this to switch themes
```

### Adding Custom Colors
```css
/* In your component's CSS */
:root {
  --my-custom-color: #FF0000;
}

.my-element {
  color: var(--my-custom-color);
}
```

### Overriding Styles
```tsx
<PrimaryButton 
  href="/login"
  style={{ fontSize: '18px', padding: '20px 50px' }}
>
  Custom Sized Button
</PrimaryButton>
```

---

## 📱 **Responsive Utilities**

### Breakpoint
```css
@media (max-width: 768px) {
  .my-grid {
    grid-template-columns: 1fr;
  }
}
```

### Fluid Typography
```css
.my-headline {
  font-size: clamp(32px, 5vw, 64px);
}
```

### Mobile Spacing
```css
.my-section {
  padding: var(--spacing-2xl) 0;
}

@media (max-width: 768px) {
  .my-section {
    padding: var(--spacing-xl) 0;
  }
}
```

---

## ✅ **Checklist for New Pages**

- [ ] Import `landing.css` or create similar styles
- [ ] Use semantic HTML (`<section>`, `<article>`, etc.)
- [ ] Apply consistent spacing (`var(--spacing-*)`)
- [ ] Use design system components
- [ ] Add hover states to interactive elements
- [ ] Test on mobile (< 768px)
- [ ] Check accessibility (keyboard nav, ARIA labels)
- [ ] Use appropriate font families
- [ ] Follow color palette
- [ ] Add subtle animations

---

## 🐛 **Common Mistakes to Avoid**

❌ **DON'T:**
```tsx
// Arbitrary colors
<div style={{ color: '#FF0000' }}>

// Arbitrary spacing
<div style={{ padding: '17px' }}>

// Missing semantic HTML
<div onClick={...}>Click me</div>
```

✅ **DO:**
```tsx
// Use design tokens
<div style={{ color: 'var(--color-primary)' }}>

// Use spacing scale
<div style={{ padding: 'var(--spacing-md)' }}>

// Use semantic HTML
<button onClick={...}>Click me</button>
```

---

## 📚 **Resources**

- **Full Documentation**: `DESIGN_SYSTEM.md`
- **Theme Config**: `lib/design-system.ts`
- **Styles**: `app/landing.css`
- **Components**: `components/design-system/index.tsx`
- **Example**: `app/page.tsx`

---

## 💡 **Pro Tips**

1. **Reuse existing patterns** before creating new ones
2. **Use CSS variables** for easy theming
3. **Keep animations subtle** and purposeful
4. **Test on real devices** for mobile experience
5. **Follow the established grid** (1200px max-width)
6. **Use clamp()** for responsive text sizing
7. **Add aria-hidden="true"** to decorative elements
8. **Maintain high contrast** for readability

---

**Need Help?** Check `DESIGN_SYSTEM.md` for detailed documentation!
