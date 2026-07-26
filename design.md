# UI/UX Design System — Complete Analysis

> Source: [amplitux.webflow.io](https://amplitux.webflow.io/) — SaaS Analytics / Tech Startup Template

---

## 1. 🎨 Color Palette

### Brand Colors (CSS Custom Properties)

| Token Name                 | Hex Value                  | Usage                                   |
| -------------------------- | -------------------------- | --------------------------------------- |
| `--brand--white`           | `#FFFFFF`                  | Backgrounds, button text, logo area     |
| `--brand--black-light`     | `~#00000005` (shadow)      | Very subtle shadows                     |
| `--brand--aqua`            | `#2CAF9E`                  | Primary accent / CTA color              |
| `--brand--aqua-50`         | `~#2CAF9E80` (50% opacity) | Gradient tops, badges                   |
| `--brand--aqua-30`         | `~#2CAF9E4D` (30% opacity) | Hero gradient (secondary)               |
| `--brand--aqua-20`         | `~#2CAF9E33` (20% opacity) | Hero gradient (primary start)           |
| `--brand--neutral-dark`    | `~#1D1D1D`                 | Dark button borders, dark mode elements |
| `--brand--neutral-lighter` | `~#F7F7F8`                 | Light backgrounds, section fillers      |
| `--brand--gray-light`      | `~#EBEBEB`                 | Badge borders, card borders             |

### Background Colors

| Token Name                 | Description                                                |
| -------------------------- | ---------------------------------------------------------- |
| `--bg-color--bg-primary`   | Main page background = **White `#FFFFFF`**                 |
| `--bg-color--bg-secondary` | Card backgrounds = **Very light gray `#F7F7F8`**           |
| `--bg-color--bg-tertiary`  | Navbar pill + primary button bg = **Near-black `#131313`** |
| `--bg-color--bg-alternate` | Icon circle backgrounds = **Muted dark**                   |
| `--bg-color--bg-aqua`      | Icon container fill = **Teal/Aqua `#2CAF9E`**              |

### Text Colors

| Token Name                     | Description                                       |
| ------------------------------ | ------------------------------------------------- |
| `--text-color--text-primary`   | Headings, body default = `#131313` (near-black)   |
| `--text-color--text-secondary` | Body copy, descriptions = `#6B6B6B` (medium gray) |
| `--text-color--text-tertiary`  | Muted/alternate text                              |
| `--text-color--text-white`     | On-dark surfaces (nav links) = `#FFFFFF`          |
| `--text-color--text-aqua`      | Accent text, handles = `#2CAF9E` / `#3E9C90`      |

### Border Colors

| Token Name                         | Description                                 |
| ---------------------------------- | ------------------------------------------- |
| `--border-color--border-primary`   | Dividers = `#0000001A` (black 10% opacity)  |
| `--border-color--border-secondary` | Form input focus border                     |
| Direct values used                 | Cards: `#12376914` (teal-tinted 8% opacity) |

### Hero Gradient

```css
background-image: linear-gradient(
  244deg,
  var(--brand--aqua-30),
  /* teal 30% */ var(--brand--aqua-20) 99.26% /* teal 20% */
);
```

The hero section has a full-bleed **soft teal gradient** background with floating decorative circle SVGs on the four corners.

---

## 2. ✍️ Typography

### Font Family

- **Primary Font**: `Inter` (Google Fonts) — weights: 300, 400, 500, 600, 700
- **Fallback**: `sans-serif`
- Body font explicitly set: `font-family: Inter, sans-serif;` _(Note: CSS also references `Geist` in one base class, but Inter is the primary loaded font)_

### Font Scale (Utility Classes)

| Class        | Font Size         | Weight  | Line Height | Letter Spacing |
| ------------ | ----------------- | ------- | ----------- | -------------- |
| `.text-xs`   | `0.75rem` (12px)  | 400     | —           | —              |
| `.text-sm`   | `0.875rem` (14px) | 400     | —           | —              |
| `.text-base` | `1rem` (16px)     | 400     | 1.5         | —              |
| `.text-lg`   | `1.125rem` (18px) | 400     | —           | —              |
| `.text-xl`   | `1.25rem` (20px)  | 400     | 1.4         | `-0.003em`     |
| `.text-2xl`  | `1.5rem` (24px)   | 400     | 1.33        | —              |
| `.text-3xl`  | `1.875rem` (30px) | 400     | 1.2         | `-0.04em`      |
| `.text-4xl`  | `2.25rem` (36px)  | **500** | 1.11        | `-0.045em`     |
| `.text-5xl`  | `3rem` (48px)     | **500** | 1.0         | `-0.04em`      |
| `.text-6xl`  | `3.75rem` (60px)  | **500** | 1.2         | `-0.045em`     |
| `.text-7xl`  | `4.5rem` (72px)   | **500** | 1.11        | `-0.045em`     |
| `.text-8xl`  | `6rem` (96px)     | 400     | —           | —              |

### Key Observations

- **Tight negative letter-spacing** (`-0.04em` to `-0.045em`) on all large display headings → gives a premium, modern compressed feel
- **Medium weight (500)** used on headings, NOT bold — subtle, elegant
- Body copy is `1rem / 0.88rem` with `line-height: 1.4–1.5`
- **ALL CAPS + letter-spacing 0.2em** used for badge labels (`.text-style-allcaps`)

### Heading Roles

- **H1** → `.text-7xl` = 4.5rem — Hero headline
- **H2** → `.text-4xl` or `.text-7xl` — Section titles
- **H3** → `.text-5xl` — Feature card titles
- **Body** → `.text-base` with `.text-color-secondary`
- **Badge/Label** → `.text-sm` or `.text-style-allcaps` with letter-spacing 0.2em

---

## 3. 🔲 Layout & Spacing System

### Container Widths

| Class               | Max-Width          | Usage                    |
| ------------------- | ------------------ | ------------------------ |
| `.container-small`  | `58rem` (928px)    | Navbar content           |
| `.container-medium` | `70.5rem` (1128px) | Most content sections    |
| `.container-large`  | `87rem` (1392px)   | Full hero, wide sections |

### Section Padding

| Class                     | Padding Top/Bottom |
| ------------------------- | ------------------ |
| `.padding-section-small`  | `3rem` (48px)      |
| `.padding-section-medium` | `5rem` (80px)      |
| `.padding-section-large`  | `8rem` (128px)     |

### Spacing Scale

| Class            | Value      |
| ---------------- | ---------- |
| `.spacer-tiny`   | `0.125rem` |
| `.spacer-xsmall` | `0.5rem`   |
| `.spacer-small`  | `1rem`     |
| `.spacer-medium` | `2rem`     |
| `.spacer-large`  | `3rem`     |
| `.spacer-xlarge` | `4rem`     |
| `.spacer-huge`   | `6rem`     |
| `.spacer-xhuge`  | `8rem`     |

### Padding Box (Standard Inner Padding)

`.padding-box` → `1.5rem` all sides (used as the main page-level inset)

---

## 4. 🟦 Cards

### Feature Cards (`.features_box`)

```
Background:  var(--bg-color--bg-secondary)  ← #F7F7F8 light gray
Border-radius: 2rem  (32px) — very rounded, pill-like
Padding: 1rem outer, 1.5rem inner content
Gap: 0.62rem between sections
Layout: Flexbox row (text on left, visual on right)
Shadow: None on card itself; image inside has soft shadow
```

**Image Shadow on inner cards:**

```css
box-shadow:
  0 4px 9px #00000008,
  0 17px 17px #00000008,
  0 38px 23px #00000005,
  0 67px 27px #00000003;
```

→ Very subtle multi-layer diffused shadow

### Pricing Cards (`.pricing_card`)

```
Background:  var(--bg-color--bg-secondary)  ← #F7F7F8
Border-radius: 2rem (32px)
Padding: 2rem
Gap: 2rem between internal elements
Layout: Flex column
```

**Middle / Featured Card:**

```
Background: transparent (bg-color: #fff0)
Has an absolute gradient overlay background (teal gradient)
Has a floating label badge at top-right:
  background-image: linear-gradient(180deg, var(--brand--aqua-50), var(--brand--aqua))
  color: white
  border-radius: 0.75rem top corners
  padding: 0.5rem 1rem
  letter-spacing: 0.14em (ALL CAPS style)
```

### Testimonial Cards (`.testimonials_card`)

```
Background:  var(--bg-color--bg-secondary)  ← #F7F7F8
Border: 1px solid #12376914  ← teal-tinted 8% opacity
Border-radius: 2rem (32px)
Padding: 1.5rem
Gap: 1.5rem
Layout: Flex column
Margin top/bottom: 0.75rem (for stagger grid effect)
```

**Card avatar**: `border-radius: 99rem` — full circle, 4rem × 4rem
**Twitter/handle accent**: `color: #2CAF9E` (teal), `font-weight: 500`

### Products Card (`.products_card`)

```
Background: semi-transparent white #fff6
Border-radius: 2rem
Padding: 2rem
Grid: 3-column layout
Icon circle background: var(--bg-color--bg-alternate) with box-shadow: 0 0 0 1px #12376914
```

---

## 5. 🔘 Buttons

### Primary Button (`.button`)

```
Background:   var(--bg-color--bg-tertiary) = #131313 (near-black)
Color:        var(--brand--white) = #FFFFFF
Height:       3.5rem (56px)
Padding:      0 1.5rem
Border-radius: 999rem  ← fully pill-shaped
Font-size:    1rem
Font-weight:  400
Box-shadow:   0 0 0 1px #12376914, 0 2px 3px #2a3b5126
Transition:   transform 0.3s, color 0.3s, background-color 0.3s
Hover:        transform: scale(0.95)  ← gentle shrink on hover
```

**Special hover trick**: The button text duplicates into two layers (`.is-button-text-one` and `.is-button-text-two`) that slide in/out for an animated text reveal effect on hover.

### Secondary Button (`.button.is-secondary`)

```
Background:   var(--brand--white) = #FFFFFF
Color:        var(--text-color--text-primary) = #131313
Same sizing as primary
Has an animated circle ripple effect (`.background-circle`) that expands on hover
Overflow: clip (clips the circle reveal animation)
```

### Tertiary Button (`.button.is-tertiary`)

```
Background:   var(--brand--white)
Color:        var(--text-color--text-primary)
Gap:          0.5rem (for icon + text)
Hover:        background-color changes to bg-tertiary (#131313), color to white
```

### Black Button (`.button.is-black`)

```
Background:   #131313
Color:        #FCFEEF (off-white cream)
Border:       1px solid var(--brand--neutral-dark)
Hover:        background-color: #131313d9 (slight transparency)
```

### Submit / Form Button (`.button.is-form-submit`)

```
Border-radius: 0.75rem (12px) — NOT pill, more rectangular
Height:       2.725rem
Width:        100%
Font-weight:  600
Transition:   background-color 0.2s
Hover:        background-color: #353539
```

---

## 6. 🧭 Navigation (Navbar)

### Structure

```
Full-width transparent navbar
Inner pill container: .navbar_content
  Background: var(--bg-color--bg-tertiary) = #131313 (dark pill)
  Border-radius: 90rem (fully pill)
  Padding: 0.5rem 0.5rem 0.5rem 1.5rem
  Layout: space-between flex row
```

### Nav Links

```
Color: var(--text-color--text-white) = #FFFFFF (white on dark pill)
Opacity: 0.7 (dimmed by default)
Hover opacity: 1.0 (full brightness)
Active: opacity 1.0, font-weight 500
Font-size: 0.875rem
Padding: 0.75rem
Transition: opacity 0.3s
```

### Login Button

- Uses `.button.is-secondary` style (white pill button)
- Has animated circle ripple on hover

### Mobile Menu Button

```
Background: #8F00FF (purple — accent for menu toggle)
Border-radius: 4px
Size: 4rem × 4rem
Has 3 animated lines (.nav-button_line)
```

---

## 7. 🏷️ Badges / Pills / Labels

### Header Section Badge (`.header_badge-wrap`)

```
Border: 1px solid var(--brand--gray-light) = #EBEBEB
Background: var(--brand--white) = #FFFFFF
Border-radius: 2.5rem (full pill)
Padding: 0.5rem 1rem
Font-size: 0.875rem
Letter-spacing: 0.2em
Text-transform: UPPERCASE
```

### Pricing Featured Label (`.price-card-label`)

```
Background: linear-gradient(180deg, aqua-50, aqua)
Color: white
Letter-spacing: 0.14em (UPPERCASE)
Border: 1px solid #f7f7f733
Border-radius: 0.75rem (top corners only)
Padding: 0.5rem 1rem
Positioned: absolute at top-right of card
```

### Card Price Badge (`.card-price-badge`)

```
Border: 1px solid var(--brand--gray-light)
Background: var(--bg-color--bg-alternate)
Border-radius: 9rem (full pill)
Padding: 0.5rem 1rem
```

---

## 8. 🖼️ Icon Containers

### Feature Icon Circle (`.icon-content`)

```
Background: var(--bg-color--bg-aqua) = teal #2CAF9E
Color (icon tint): var(--brand--white) = white
Border-radius: 99rem (full circle)
Padding: 1rem
```

### Product Section Icon (`.logo-secondary-content`)

```
Background: var(--bg-color--bg-alternate) = muted dark
Color: var(--brand--white)
Border-radius: 99rem
Padding: 1rem
Box-shadow: 0 0 0 1px #12376914
```

### Icon Size Utilities

| Class                 | Size            |
| --------------------- | --------------- |
| `.icon-1x1-small`     | 1rem × 1rem     |
| `.icon-1x1-base`      | 1.5rem × 1.5rem |
| `.icon-1x1-medium`    | 2rem × 2rem     |
| `.icon-1x1-large`     | 2.5rem × 2.5rem |
| `.icon-height-small`  | height: 1rem    |
| `.icon-height-medium` | height: 2rem    |
| `.icon-height-large`  | height: 3rem    |

---

## 9. 📝 Forms / Inputs

### Input Field (`.form_input`)

```
Background: var(--brand--white)
Min-height: 4rem
Color: var(--text-color--text-primary)
Border: 1px solid #EBEBEB
Border-radius: 2rem (full pill — very rounded)
Padding: 1rem 2rem
Font-size: 0.88rem
Line-height: 1.4
Box-shadow: inset 0 -2px 5px #ffffff14, inset 0 2px 5px #ffffff14  ← inner glow
Placeholder color: #8C8C9A
Focus border-color: var(--border-color--border-secondary)
```

---

## 10. 🌊 Animations & Interactions

### Page Load Animations

All sections use **Webflow scroll animations** with:

```css
opacity: 0;
transform: translate3d(0, 15%, 0); /* starts 15% below */
```

→ Elements **fade up** into position on scroll

### Button Hover — Scale Shrink

```css
.button:hover {
  transform: scale(0.95);
}
```

### Button Hover — Sliding Text

Primary "Get Started" button uses **two text layers** that vertically slide through each other — a premium hover micro-animation.

### Secondary Button — Circle Ripple

A `.background-circle` div starts at `scale3d(0, 0, 1)` and expands to fill the button on hover, creating a **circular reveal/fill animation**.

### Logo Ticker (`.logos_scroll-grid`)

```
A CSS scroll animation: two grids of brand logos that auto-scroll horizontally
Left and right shadow fades created with linear gradients for a fade-in/out effect
```

### Testimonials — Infinite Scroll Grid

```
Three columns of testimonial cards that auto-scroll vertically
Uses CSS transforms: translate(0, -37%) and translate(0, -10%) on different columns
```

### Nav Links — Opacity Fade

```css
.nav_links {
  opacity: 0.7;
  transition: opacity 0.3s;
}
.nav_links:hover {
  opacity: 1;
}
```

---

## 11. 🏗️ Page Section Structure

1. **Hero** — Full-bleed teal gradient, floating circle decorations, large H1 + CTA button + dashboard screenshot
2. **Logos Bar** — "Trusted by" section with infinite scrolling brand logos
3. **Features** — Large feature cards (text left + image right alternating) with circle decoration backgrounds
4. **Products** — Dark or gradient background section, 3-column icon + text cards
5. **Pricing** — 3-column pricing cards, middle card highlighted with teal gradient and "MOST POPULAR" badge
6. **Integrations** — Section with scrolling integration logos (two rows, opposite scroll directions)
7. **Testimonials** — 3-column masonry-style auto-scrolling testimonial cards
8. **CTA / Footer** — Final conversion CTA with secondary gradient background

---

## 12. 📱 Responsive Design Notes

### Breakpoints

```css
@media (max-width: 1440px) /* Desktop large */ @media (max-width: 991px) /* Tablet */ @media (max-width: 767px) /* Mobile landscape */ @media (max-width: 479px); /* Mobile portrait */
```

### Key Responsive Behavior

- Navbar collapses to hamburger menu at tablet
- Hero circles (`is-desktop` / `is-mobile`) swap at mobile
- Feature boxes stack vertically on mobile
- Pricing grid collapses from 3-col to 1-col
- Testimonials grid reduces columns

---

## 13. 🎯 Design Philosophy Summary

| Principle                   | Implementation                                               |
| --------------------------- | ------------------------------------------------------------ |
| **Light & Airy**            | White/light-gray backgrounds dominate, max whitespace        |
| **Soft & Rounded**          | `2rem` card radii, `999rem` pill buttons/badges everywhere   |
| **Teal Accent**             | `#2CAF9E` used sparingly for accent icons, CTAs, handles     |
| **Near-Black Primary**      | `#131313` for primary buttons and navbar — NOT pure black    |
| **Negative Letter-Spacing** | `-0.04em` to `-0.045em` on all display headings              |
| **Medium Weight (500)**     | Headings are medium — NOT bold, feels modern and refined     |
| **Micro-animations**        | Scale on hover, fade-up on scroll, circle ripple, text slide |
| **Layered Shadows**         | 4-layer progressive shadow for floating images/cards         |
| **Glassmorphism**           | `#fff6` (translucent white) for some card backgrounds        |

---

## 14. 💻 CSS Variables Quick Reference for Your Agent

```css
:root {
  /* Brand Colors */
  --brand--white: #ffffff;
  --brand--aqua: #2caf9e;
  --brand--aqua-50: rgba(44, 175, 158, 0.5);
  --brand--aqua-30: rgba(44, 175, 158, 0.3);
  --brand--aqua-20: rgba(44, 175, 158, 0.2);
  --brand--neutral-dark: #1d1d1d;
  --brand--neutral-lighter: #f7f7f8;
  --brand--gray-light: #ebebeb;

  /* Background Colors */
  --bg-color--bg-primary: #ffffff;
  --bg-color--bg-secondary: #f7f7f8;
  --bg-color--bg-tertiary: #131313;
  --bg-color--bg-alternate: #1a2433;
  --bg-color--bg-aqua: #2caf9e;

  /* Text Colors */
  --text-color--text-primary: #131313;
  --text-color--text-secondary: #6b6b6b;
  --text-color--text-tertiary: #9b9b9b;
  --text-color--text-white: #ffffff;
  --text-color--text-aqua: #2caf9e;

  /* Border Colors */
  --border-color--border-primary: rgba(0, 0, 0, 0.1);
  --border-color--border-secondary: #2caf9e;

  /* Font */
  font-family: "Inter", sans-serif;
}
```
