---
name: Civic Precision
colors:
  surface: '#FFFFFF'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434655'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#006329'
  on-tertiary: '#ffffff'
  tertiary-container: '#007f36'
  on-tertiary-container: '#c7ffca'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#7ffc97'
  tertiary-fixed-dim: '#62df7d'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005320'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  success: '#16A34A'
  warning: '#F59E0B'
  danger: '#DC2626'
  border: '#E2E8F0'
  ink-subtle: '#64748B'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
The design system is engineered for high-stakes administrative environments where clarity, legal compliance, and trust are paramount. It adopts a **Corporate Modern** aesthetic, prioritizing functional density and visual stability over decorative flair.

The system serves government officials, legal teams, and land surveyors. The emotional response is one of institutional reliability and efficiency. By utilizing a "Clean & Grounded" approach, the interface minimizes cognitive load during complex data entry and land record verification. Key characteristics include heavy use of white space, a disciplined card-based architecture, and a strict adherence to hierarchical order.

## Colors
The palette is rooted in "Government Blue," a color associated with authority and stability. 

- **Primary (#2563EB):** Reserved for primary actions, active states, and critical navigation markers.
- **Secondary (#0F172A):** Used for sidebar navigation and high-level headings to provide a strong visual anchor.
- **Functional Colors:** Success, Warning, and Danger colors are calibrated for high legibility against white surfaces, ensuring compliance with WCAG 2.1 AA standards for meaningful UI elements.
- **Neutral Stack:** The background uses a cool-toned slate white (#F8FAFC) to reduce screen glare during long working hours, while surfaces remain pure white to create clear elevation.

## Typography
The system utilizes **Inter** for its exceptional legibility in data-heavy environments. 

The type scale is generous, favoring readability over compactness. Headings use a tighter letter-spacing and heavier weights to establish a clear content structure. Body text is optimized for long-form reading of legal documents, using a standard 16px base. Labels are frequently used for metadata and status badges, often employing a slightly heavier weight to distinguish them from standard body copy.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid** model. While the sidebar and margins are fixed, the central content area fluidly expands to accommodate large data tables and maps.

- **Desktop (1440px+):** 12-column grid with 24px gutters. A 280px collapsible sidebar sits on the left.
- **Tablet (768px - 1023px):** 8-column grid. Sidebar collapses into an icon-only rail or a hamburger menu.
- **Mobile (<767px):** 4-column grid. All cards become full-width with 16px side margins.

Vertical rhythm is maintained through an 8px base grid, ensuring that form fields and buttons align perfectly across complex multi-column layouts.

## Elevation & Depth
Depth is conveyed through a combination of **Tonal Layering** and **Ambient Shadows**. 

1.  **Level 0 (Background):** #F8FAFC - The canvas.
2.  **Level 1 (Cards/Surfaces):** #FFFFFF - Primary content containers. These use a very soft, diffused shadow (0px 4px 6px -1px rgba(0, 0, 0, 0.1)) and a subtle 1px border (#E2E8F0) to ensure definition on all monitors.
3.  **Level 2 (Dropdowns/Modals):** High elevation. These use a more pronounced shadow to create a clear physical separation from the underlying content.

No glassmorphism or heavy blurs are permitted. Surfaces must remain opaque to maintain text contrast and a professional "paper-like" quality.

## Shapes
The design system uses a **Rounded** (8px - 12px) shape language. This softens the formal nature of the government blue and slate palette, making the software feel modern and approachable without losing its professional edge.

- **Standard Elements:** Buttons, Input fields, and small Chips use 8px (0.5rem).
- **Containers:** Large content cards and modals use 12px (0.75rem) to provide a distinct structural frame.
- **Interactive States:** Focus rings should follow the border radius of the parent element with a 2px offset.

## Components
### Buttons
Primary buttons are solid #2563EB with white text. Secondary buttons use a ghost style with a #E2E8F0 border and #0F172A text. Height is set to a minimum of 44px for touch-friendliness.

### Form Fields
Inputs use a white background, 1px border (#E2E8F0), and 16px internal padding. Active states are indicated by a 2px solid primary blue border. Labels are always visible above the field (never just placeholders).

### Cards
The primary vehicle for land data. Every card must have a 1px border and a Level 1 shadow. Cards should group related information (e.g., "Owner Details", "Geospatial Data") with a clear `headline-sm` title.

### Sidebar & Navigation
- **Sidebar:** Deep Slate (#0F172A) with high-contrast white text for active states. 
- **Sticky Top Bar:** Pure white surface with Breadcrumbs to orient the user within deep land-record hierarchies.
- **Chips/Status Badges:** Use subtle background tints of Success/Warning/Danger colors with high-contrast text for immediate recognizability.

### Specialized Components
- **Data Tables:** Zebra-striped rows with #F8FAFC for readability in large land registers.
- **Document Previewers:** Contained within Level 2 modals with clear download/print primary actions.