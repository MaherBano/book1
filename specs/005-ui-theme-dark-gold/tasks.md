# Tasks: UI Theme - Dark with Gold Accents

**Feature**: UI Theme - Dark with Gold Accents
**Feature Directory**: C:/new/Book/specs/005-ui-theme-dark-gold
**Branch**: 005-ui-theme-dark-gold
**Generated**: 2025-12-28

## Dependencies

- User Story 1 (P1) must be completed before User Story 2
- User Story 3 (P2) depends on foundational theme setup from User Story 1
- User Story 4 (P2) depends on responsive design implementation from User Story 1

## Parallel Execution Examples

- **User Story 1**: T006-T010 (CSS for Navbar, Sidebar, Footer) can be done in parallel
- **User Story 2**: T015-T017 (Chatbot components) can be done in parallel
- **User Story 3**: T021-T023 (Component styling) can be done in parallel

## Implementation Strategy

- **MVP Scope**: User Story 1 (Documentation with dark theme) - provides a complete, testable product
- **Incremental Delivery**: Add chatbot (US2), then navigation components (US3), then responsive features (US4)
- **Each phase delivers independently testable functionality**

---

## Phase 1: Setup Tasks

- [x] T001 Set up project structure per implementation plan in docasaurus/src/css/
- [x] T002 Install required dependencies (Docusaurus 3.x, React 18+) if not already present
- [x] T003 Create directory structure: docasaurus/src/css/components/, docasaurus/src/components/Chatbot/

---

## Phase 2: Foundational Tasks

- [x] T004 Define CSS custom properties for theme variables in docasaurus/src/css/theme-variables.css
- [x] T005 Update docusaurus.config.js to include custom CSS files
- [x] T006 Implement base theme styles in docasaurus/src/css/custom.css
- [x] T007 Set up basic accessibility compliance (contrast ratios, focus indicators)

---

## Phase 3: [US1] Access Documentation with Dark Theme

**Story Goal**: Documentation website with modern dark theme applied consistently across all pages with proper contrast ratios and readable typography.

**Independent Test Criteria**: The documentation website can be viewed with the dark theme applied consistently across all pages, with proper contrast ratios and readable typography.

**Acceptance Tests**:
- [x] T008 [US1] Verify background color #0F111A applied across all documentation pages
- [x] T009 [US1] Verify text color #E0DACC for primary content with good readability
- [x] T010 [US1] Verify code blocks styled with dark theme and syntax highlighting

**Implementation Tasks**:
- [x] T011 [P] [US1] Style body element with theme variables in docasaurus/src/css/custom.css
- [x] T012 [P] [US1] Style headings with gold accent color and proper typography
- [x] T013 [P] [US1] Style links with gold accent color and hover states
- [x] T014 [P] [US1] Style buttons with gold background and appropriate contrast
- [x] T015 [P] [US1] Style code blocks with dark background and gold accents

---

## Phase 4: [US2] Interact with Chatbot Interface

**Story Goal**: Chatbot interface with properly styled chat bubbles, clear visual distinction between user and bot messages, and responsive layout.

**Independent Test Criteria**: The chatbot interface can be used with properly styled chat bubbles, clear visual distinction between user and bot messages, and responsive layout.

**Acceptance Tests**:
- [x] T016 [US2] Verify user messages appear in dark bubbles with rounded corners and subtle shadows
- [x] T017 [US2] Verify bot responses appear in gold-highlighted bubbles with matching typography
- [x] T018 [US2] Verify chatbot interface responsive and readable on mobile devices

**Implementation Tasks**:
- [x] T019 [P] [US2] Create Chatbot component in docasaurus/src/components/Chatbot/Chatbot.jsx
- [x] T020 [P] [US2] Create chatbot styling in docasaurus/src/css/components/chatbot.css
- [x] T021 [P] [US2] Implement floating chat button with gold border and dark fill
- [x] T022 [P] [US2] Implement chat window with dark glass-like card appearance
- [x] T023 [P] [US2] Implement user message bubbles with dark styling
- [x] T024 [P] [US2] Implement bot message bubbles with gold accent styling
- [x] T025 [P] [US2] Add smooth open/close animations for chat interface
- [x] T026 [P] [US2] Implement input box with dark background and gold focus ring

---

## Phase 5: [US3] Navigate Website Components

**Story Goal**: All navigation and layout components viewed and used with consistent dark theme styling applied.

**Independent Test Criteria**: All navigation and layout components can be viewed and used with consistent dark theme styling applied.

**Acceptance Tests**:
- [x] T027 [US3] Verify Navbar follows dark theme with gold accents
- [x] T028 [US3] Verify Footer follows dark theme with gold accents
- [x] T029 [US3] Verify Sidebar follows dark theme with gold accents

**Implementation Tasks**:
- [x] T030 [P] [US3] Style Navbar with dark background and gold accent elements in docasaurus/src/css/components/navbar.css
- [x] T031 [P] [US3] Style Sidebar with dark background and gold accent elements in docasaurus/src/css/components/sidebar.css
- [x] T032 [P] [US3] Style Footer with dark background and appropriate text colors in docasaurus/src/css/components/footer.css
- [x] T033 [P] [US3] Implement active item highlighting in gold for Sidebar

---

## Phase 6: [US4] Experience Responsive Design

**Story Goal**: Theme viewed and used effectively on various screen sizes while maintaining readability and visual appeal.

**Independent Test Criteria**: The theme can be viewed and used effectively on various screen sizes while maintaining readability and visual appeal.

**Acceptance Tests**:
- [x] T034 [US4] Verify theme elements properly sized and spaced on desktop
- [x] T035 [US4] Verify theme elements adapt to smaller screens while maintaining readability on mobile
- [x] T036 [US4] Verify all components remain responsive and maintain visual consistency

**Implementation Tasks**:
- [x] T037 [P] [US4] Add responsive media queries for Navbar in docasaurus/src/css/components/navbar.css
- [x] T038 [P] [US4] Add responsive media queries for Sidebar in docasaurus/src/css/components/sidebar.css
- [x] T039 [P] [US4] Add responsive media queries for Footer in docasaurus/src/css/components/footer.css
- [x] T040 [P] [US4] Add responsive media queries for chatbot component in docasaurus/src/css/components/chatbot.css
- [x] T041 [P] [US4] Test responsive behavior across different screen sizes (mobile, tablet, desktop)

---

## Final Phase: Polish & Cross-Cutting Concerns

- [x] T042 Validate all UI elements meet WCAG 2.1 AA contrast ratio requirements
- [ ] T043 Test theme in different browsers (Chrome, Firefox, Safari, Edge)
- [ ] T044 Verify responsive design works on all targeted devices
- [x] T045 Add performance optimization to minimize CSS bundle size
- [x] T046 Document theme variables and styling patterns for future maintenance
- [ ] T047 Run accessibility tests with tools like axe-core or Lighthouse
- [x] T048 Verify all specified components have corresponding CSS styles implementing the dark theme with gold accents