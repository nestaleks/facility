# Content Mapping to Semantic HTML Structure

## Existing Structure → Modern Semantic HTML Mapping

### Header Section
**Original**: `<div class="kdm_header">` with logo and navigation
**Modern**: `<header class="site-header">` with `<nav class="main-navigation" aria-label="Hauptnavigation">`
- Logo: Decktum Deutschland SVG
- Navigation: About Decktum, Facility-Management, Mietflächenausbau, Office Management, Kontakt
- Mobile menu toggle with hamburger icon

### Hero Section  
**Original**: `<div class="kdm_page-header-image">` with video
**Modern**: `<section class="hero" aria-label="Willkommen">`
- Desktop video: Decktum_banner_animation.mp4
- Mobile video: Decktum_banner_animation_mobile.mp4
- Play/pause controls with SVG icons
- Background image overlay: 02_banner_definition

### About Section
**Original**: `<div class="kdm_about">` 
**Modern**: `<section class="about" id="about" aria-labelledby="about-heading">`
- Heading: "ABOUT Decktum, ABOUT US"
- Subheading: "Ganz offensichtlich anders."
- Grid layout with text and image
- Portrait images: 03_portraits series

### Facility Management Section
**Original**: `<div class="kdm_section facility">`
**Modern**: `<section class="services facility-management" id="facility" aria-labelledby="facility-heading">`
- Main heading: "FACILITY MANAGEMENT"
- Subheading: "Facility Management neu gedacht und einfach anders."
- Two subsections:
  1. **Infrastrukturelles Facility Management** with 6 service items
  2. **Technisches Facility Management** with 6 service items
- Images: 04_facility_management_01, 05_facility_management_02 series
- Each service item has icon and description

### Mietflächenausbau Section
**Original**: Various div elements
**Modern**: `<section class="services mietflaechen" id="flaechen" aria-labelledby="flaechen-heading">`
- Images: 08_Banner_Hand, 09_Banner_mietflaechenausbau series
- Service descriptions and features

### Office Management Section
**Original**: Office-related content
**Modern**: `<section class="services office-management" id="office" aria-labelledby="office-heading">`
- Images: 10_banner_clean, 11_Banner_bueroflaechenreinigung, 12_banner_bevorratung, 13_banner_catering, 15_banner_windowcleaner series
- Multiple service categories with descriptions

### Decktum Difference Section
**Original**: `<div class="kdm_section Decktum">`
**Modern**: `<section class="Decktum-difference" aria-labelledby="Decktum-heading">`
- Heading: "Was macht uns anders, was macht uns zu Decktum?"
- Subheading: "Wir denken über den Betrieb hinaus – wir gestalten Arbeitsqualität."
- Descriptive text about company philosophy

### Contact CTA Section
**Original**: `<div class="kdm_cta">`
**Modern**: `<section class="contact-cta" aria-labelledby="contact-heading">`
- Team member CTAs with photos: 06_CTA_Philipe, 07_CTA_Sherbo
- Contact information and phone numbers
- Grid layout for contact cards

### Footer Section
**Original**: Footer elements
**Modern**: `<footer class="site-footer" id="footer">`
- Contact information
- Legal links: Impressum, Datenschutz
- Background pattern: 16_pattern_footer

### Legal Pages Structure
**Impressum**: `<main class="legal-page impressum">`
**Datenschutz**: `<main class="legal-page privacy">`

## Accessibility Improvements
- Proper heading hierarchy (h1 → h2 → h3 → h4)
- ARIA labels and landmarks
- Alt text for all images
- Keyboard navigation support
- Focus management for modals/menus
- Screen reader friendly content structure

## Content Sections Priority
1. **Critical**: Header, Hero, About, Contact
2. **Important**: Facility Management, Office Management  
3. **Secondary**: Mietflächenausbau, Legal pages
4. **Enhancement**: Animations, hover effects, advanced interactions

## Media Assets to Optimize
- Videos: Decktum_banner_animation.mp4 (both versions)
- Images: All .webp files (already optimized format)
- Icons: Convert inline SVGs to reusable components
- Fonts: AtypDisplay font family (check for modern loading)

## JavaScript Functionality Mapping
1. **Mobile menu toggle** → Modern event listeners
2. **Video controls** → Native HTML5 video API
3. **Smooth scrolling** → CSS scroll-behavior + JS fallback
4. **Hover effects** → CSS-only where possible
5. **Lazy loading** → Intersection Observer API

## SEO & Performance Considerations
- Proper meta tags and OpenGraph
- Structured data for business information
- Image lazy loading with proper srcset
- Critical CSS inlining
- Font display optimization
- Preload critical resources
