---
title: Adding New Chapters
sidebar_position: 3
description: Documentation on how to add new chapters to the book following the required structure
---

# Adding New Chapters

This document provides instructions for content creators on how to add new chapters to the book while maintaining consistency with the established structure.

## Prerequisites

Before adding a new chapter, ensure you have:

1. A local copy of the repository
2. Node.js and npm installed
3. Familiarity with Markdown and Docusaurus
4. A clear understanding of the book's content structure and progression

## Step 1: Plan Your Chapter

Before creating content, consider:

- The overall theme and learning objectives of the chapter
- How it fits into the book's progression
- The 4 individual lessons it will contain
- What prerequisite knowledge readers should have
- How it connects to other chapters in the book

## Step 2: Create Chapter Directory

1. In the `docs/` directory, create a new directory for your chapter
2. Follow the naming convention: `chapter-X` where X is the next sequential number
3. Example: If the last chapter is `chapter-3`, create `chapter-4`

## Step 3: Create Chapter Index File

In your new chapter directory, create an `index.md` file with the following structure:

```markdown
---
title: Chapter X - [Chapter Title]
sidebar_position: [X]
description: [Brief description of the chapter content]
---

# Chapter X: [Chapter Title]

Welcome to Chapter X of our journey into [chapter topic]. This chapter introduces [key concepts] and builds on the knowledge from previous chapters.

## Learning Objectives

By the end of this chapter, you will:
- Understand [concept 1]
- Be able to [skill 2]
- Recognize [aspect 3]

## Overview

[Brief overview of the chapter content and its importance]

## Chapter Structure

This chapter contains four lessons covering:
1. [Lesson 1 title and brief description]
2. [Lesson 2 title and brief description]
3. [Lesson 3 title and brief description]
4. [Lesson 4 title and brief description]
```

## Step 4: Create Chapter Category Configuration

Create a `_category_.json` file in your chapter directory:

```json
{
  "label": "Chapter X: [Chapter Title]",
  "position": [X],
  "link": {
    "type": "generated-index",
    "description": "[Brief description of the chapter]"
  }
}
```

## Step 5: Create Lesson Files

1. Within your chapter directory, create 4 lesson files:
   - `lesson-1.md`
   - `lesson-2.md`
   - `lesson-3.md`
   - `lesson-4.md`

2. Use the lesson template as a starting point:
   - Copy `docs/templates/lesson-template.md`
   - Modify according to your lesson's content

3. Ensure each lesson follows the proper structure:
   - Frontmatter with title, sidebar_position, and description
   - Learning objectives
   - Introduction
   - Content sections
   - Summary
   - Next lesson connection

## Step 6: Update Navigation

1. Add the new chapter to `sidebars.ts`:
   - Open `sidebars.ts`
   - Add a new category entry for your chapter
   - Include all 4 lessons in the items array

Example:
```typescript
{
  type: 'category',
  label: 'Chapter X: [Chapter Title]',
  items: [
    {type: 'doc', id: 'chapter-X/index'},
    {type: 'doc', id: 'chapter-X/lesson-1'},
    {type: 'doc', id: 'chapter-X/lesson-2'},
    {type: 'doc', id: 'chapter-X/lesson-3'},
    {type: 'doc', id: 'chapter-X/lesson-4'}
  ],
}
```

## Step 7: Validate Your Chapter

Before submitting:

1. Verify all lessons follow the [Content Guidelines](./content-guidelines)
2. Check that all code examples work as described
3. Ensure all links are valid
4. Run content validation: `npm run validate-content`
5. Check Markdown formatting: `npm run lint`
6. Test site build: `npm run build`

## Step 8: Cross-Reference Content

Ensure your chapter appropriately references:
- Concepts from previous chapters when building on them
- How it prepares readers for future chapters
- Any prerequisite knowledge needed
- Additional resources for deeper exploration

## Step 9: Submit Your Changes

1. Commit your changes with a descriptive message
2. Push your branch to the remote repository
3. Create a pull request with a clear description of your new chapter
4. Request reviews from other contributors

## Best Practices for Chapter Creation

- Maintain consistent tone and style with existing chapters
- Ensure 4 lessons that each take 10-15 minutes to read
- Use the progressive learning approach established in the book
- Include practical examples and applications
- Connect theory to practice through code examples
- Ensure each lesson has clear learning objectives
- Provide summaries and transitions between lessons

## Content Standards

- Use inclusive and accessible language
- Include a variety of examples to appeal to different learning styles
- Balance theory with practical application
- Incorporate visual aids (diagrams, images) where helpful
- Test all code examples in a real environment
- Verify information accuracy against authoritative sources

## Quality Assurance Checklist

- [ ] Chapter fits within the overall book progression
- [ ] Learning objectives are clear and specific
- [ ] Lessons build logically on each other
- [ ] Content is accurate and up-to-date
- [ ] Code examples work as described
- [ ] All links function correctly
- [ ] Images have descriptive alt text
- [ ] Content meets accessibility standards
- [ ] Navigation is properly configured
- [ ] All validation checks pass

## Example Chapter Structure

For reference, see the existing chapters to understand how content is organized and connected throughout the book.