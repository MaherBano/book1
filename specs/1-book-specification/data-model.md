# Data Model: Docusaurus Book Project

## Core Entities

### Book Lesson
- **Description**: An individual content piece representing a single learning unit or topic within a chapter
- **Properties**:
  - ID (unique identifier)
  - Title (lesson title)
  - Content (markdown content)
  - ChapterID (reference to parent chapter)
  - LessonNumber (position within chapter, e.g. 1-4)
  - PrerequisiteLessons (list of lesson IDs)
  - EstimatedReadingTime (minutes)
  - LearningObjectives (list of objectives)
  - CreatedAt/UpdatedAt (timestamps)
- **Validations**:
  - Title and content are required
  - LessonNumber must be 1-4 within each chapter
  - EstimatedReadingTime > 0

### Book Chapter
- **Description**: A collection of 4 related lessons that form a complete learning unit
- **Properties**:
  - ID (unique identifier)
  - Title (chapter title)
  - Description (summary of chapter content)
  - ChapterNumber (position within book, e.g. 1-3)
  - Lessons (list of 4 lesson IDs)
  - PrerequisiteChapters (list of chapter IDs)
  - LearningObjectives (list of objectives for the chapter)
  - CreatedAt/UpdatedAt (timestamps)
- **Validations**:
  - Title and description are required
  - ChapterNumber must be 1-3
  - Must contain exactly 4 lessons
  - Lessons follow sequential numbering

### Book Section
- **Description**: Individual content pieces that form chapters or subsections of the book, containing text, code examples, and diagrams
- **Properties**:
  - ID (unique identifier)
  - Title (section title)
  - Content (markdown content)
  - ChapterID (reference to parent chapter)
  - LessonID (optional reference to parent lesson)
  - SectionNumber (position within parent)
  - Type (intro/main/conclusion/appendix)
  - CodeExamples (list of code example IDs)
  - Diagrams (list of diagram references)
  - CreatedAt/UpdatedAt (timestamps)
- **Validations**:
  - Title and content are required
  - Type must be one of: intro, main, conclusion, appendix
  - SectionNumber ≥ 1

### Code Example
- **Description**: Executable or sample code snippets embedded within book sections that demonstrate concepts
- **Properties**:
  - ID (unique identifier)
  - Code (the actual code snippet)
  - Language (programming language)
  - SectionID (reference to parent section)
  - Description (explanation of what the code does)
  - ExpectedOutput (expected result when running the code)
  - IsExecutable (boolean, indicates if code can be run in browser)
  - CreatedAt/UpdatedAt (timestamps)
- **Validations**:
  - Code, language, and section ID are required
  - Language must be supported by syntax highlighter
  - Expected output required if IsExecutable is true

### User
- **Description**: Reader of the technical book content, categorized as beginner or intermediate in AI/robotics/CS
- **Properties**:
  - UserID (unique identifier)
  - SkillLevel (beginner/intermediate)
  - Progress (map of chapter/lesson completion status)
  - Preferences (reading settings)
  - Bookmarks (list of saved section IDs)
  - CreatedAt/UpdatedAt (timestamps)
- **Validations**:
  - SkillLevel must be beginner or intermediate
  - Progress values must be valid completion percentages

### Content Creator
- **Description**: Author or editor who creates and updates book content using Claude Code
- **Properties**:
  - CreatorID (unique identifier)
  - Name (creator's name)
  - Role (author/editor/reviewer)
  - SectionsAuthored (list of section IDs)
  - Permissions (CRUD permissions)
  - CreatedAt/UpdatedAt (timestamps)
- **Validations**:
  - Name and role are required

## Relationships

- Chapter (1) → (4) Lessons (one chapter has four lessons)
- Chapter (1) → (many) Sections (one chapter contains many sections)
- Lesson (1) → (many) Sections (one lesson contains multiple sections)
- Section (1) → (many) Code Examples (one section can have multiple code examples)
- User (1) → (many) Bookmarks (one user can bookmark multiple sections)
- Content Creator (1) → (many) Sections (one creator can author multiple sections)

## State Transitions (where applicable)

### Book Lesson/Chapter/Section State
- Draft → Under Review → Approved → Published → Archived
- Valid transitions: Draft → Under Review → Approved → Published (→ Archived)
- Transitions require specific actor permissions and validation steps

## Validation Rules from Requirements

Based on the functional requirements from the spec:

1. FR-002 Compliance: All sections must support Docusaurus Markdown format
2. FR-004 Compliance: Code examples must specify language for syntax highlighting
3. FR-006 Compliance: Chapters/lessons must support navigation requirements
4. FR-009 Compliance: Sections must support bookmarking functionality
5. FR-011-012 Compliance: Chapters must support 3 chapters × 4 lessons structure