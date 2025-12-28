# Implementation Plan: UI Theme - Dark with Gold Accents

**Branch**: `005-ui-theme-dark-gold` | **Date**: 2025-12-28 | **Spec**: [link](../005-ui-theme-dark-gold/spec.md)
**Input**: Feature specification from `/specs/005-ui-theme-dark-gold/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of a modern dark theme with gold accents for Docusaurus documentation website and embedded React chatbot widget. The solution uses CSS custom properties for consistent theming across both systems, following the specified color palette (background: #0F111A, text: #E0DACC, accent: #FFD700). The approach includes comprehensive styling for all UI components (Navbar, Sidebar, Footer, code blocks, chat bubbles) with responsive design and WCAG 2.1 AA accessibility compliance. The theme will be implemented through Docusaurus configuration and React components using a modular CSS architecture.

## Technical Context

**Language/Version**: CSS3, HTML5, JavaScript ES6+, React 18+
**Primary Dependencies**: Docusaurus 3.x, React for chatbot widget, CSS custom properties (variables)
**Storage**: N/A (UI styling only, no data storage required)
**Testing**: Manual visual testing, cross-browser compatibility testing, accessibility testing (a11y)
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge), responsive across desktop, tablet, and mobile devices
**Project Type**: web (documentation website with embedded chatbot)
**Performance Goals**: <50ms UI interaction response, <100KB CSS bundle size, 100% WCAG 2.1 AA compliance
**Constraints**: Must maintain accessibility standards, responsive design, cross-browser compatibility, no performance degradation
**Scale/Scope**: Single documentation site with integrated chatbot, reusable theme components for future projects

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Accuracy: Verified Technical Content
- ✅ CSS styling follows established design system principles
- ✅ Color contrast ratios will be verified against WCAG 2.1 AA standards
- ✅ Typography choices will be validated for readability

### Clarity: Professional, Readable Style (Flesch-Kincaid 10-12)
- N/A (UI styling project, not content writing)

### Spec-driven: Follow Spec-Kit Plus Structure Strictly
- ✅ Implementation follows from existing specification
- ✅ All styling decisions documented in plan and research
- ✅ Changes tracked through Spec-Kit Plus methodology

### Reproducibility: Code and Chatbot Fully Functional
- ✅ CSS implementations will be tested across browsers
- ✅ Theme components will be reusable and documented
- ✅ Implementation will be Docusaurus-compatible

### Interactivity: RAG Chatbot Answers from Selected Book Content Only
- N/A (UI styling project, not chatbot functionality)

### Source Verification: ≥50% Official Documentation Sources
- ✅ Docusaurus theming documentation will be referenced
- ✅ CSS best practices from MDN and official sources
- ✅ Accessibility guidelines from W3C/WCAG

### Content Quality Standards
- ✅ All CSS will follow best practices for performance
- ✅ Code will be maintainable and well-documented
- ✅ Accessibility will be prioritized in design

### Deployment Standards
- ✅ Theme will be compatible with Docusaurus build process
- ✅ No conflicts with existing documentation structure
- ✅ Responsive design will work in production deployment

### Content Constraints
- N/A (UI styling project, not content writing)

### Technical Constraints
- ✅ All styling will be executable and reproducible
- ✅ Theme will be compatible with Docusaurus 3.x
- ✅ Implementation will work with GitHub Pages deployment

## Project Structure

### Documentation (this feature)

```text
specs/005-ui-theme-dark-gold/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

docasaurus/
├── src/
│   ├── css/
│   │   ├── custom.css           # Main theme CSS with custom variables
│   │   ├── theme-variables.css  # CSS custom properties for the design system
│   │   └── components/          # Component-specific styles
│   │       ├── navbar.css
│   │       ├── sidebar.css
│   │       ├── footer.css
│   │       ├── code-blocks.css
│   │       └── chatbot.css
│   ├── components/
│   │   └── Chatbot/             # React chatbot widget components
│   │       ├── Chatbot.jsx
│   │       ├── ChatWindow.jsx
│   │       ├── MessageBubble.jsx
│   │       └── FloatingButton.jsx
│   └── theme/
│       └── *                   # Docusaurus theme override components
├── static/
│   └── img/                    # Theme-related images and icons
├── docusaurus.config.js        # Docusaurus configuration with theme settings
├── package.json               # Dependencies including Docusaurus and React
└── babel.config.js            # Babel configuration for React components
```

**Structure Decision**: Web application structure selected for documentation website with embedded chatbot. The theme implementation will be integrated into the existing Docusaurus setup with custom CSS and React components for the chatbot widget.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
