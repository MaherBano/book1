---
title: Adding New Lessons
sidebar_position: 2
description: Documentation on how to add new lessons to the book following the required structure
---

# Adding New Lessons

This document provides instructions for content creators on how to add new lessons to the book while maintaining consistency with the established structure.

## Prerequisites

Before adding a new lesson, ensure you have:

1. A local copy of the repository
2. Node.js and npm installed
3. Familiarity with Markdown syntax
4. Understanding of the book's content structure (3 chapters × 4 lessons)

## Step 1: Plan Your Lesson

Before creating content, consider:

- Where your lesson fits in the learning progression
- How it connects to previous and subsequent lessons
- The learning objectives for the lesson
- What code examples or diagrams would enhance understanding

## Step 2: Create the Lesson File

1. Navigate to the appropriate chapter directory (`docs/chapter-X/`)
2. Create a new Markdown file with an appropriate name (`lesson-Y.md`)
3. Use the lesson template as a starting point: 
   - Copy `docs/templates/lesson-template.md`
   - Modify it according to your content needs

## Step 3: Add Frontmatter

Include the required metadata at the top of your lesson file:

```markdown
---
title: [Your Lesson Title]
sidebar_position: [X]  # Position relative to other lessons in the chapter
description: [Brief description of the lesson content]
---
```

## Step 4: Structure Your Content

Follow the standard lesson structure:

```markdown
# [Lesson Title]

## Learning Objectives

After completing this lesson, you will be able to:
- [Objective 1]
- [Objective 2]
- [Objective 3]

## Introduction

[Provide context and introduce the main topic of the lesson]

## [Main Section Title]

[Content for the first main section]

### Subsection

[Content for subsection if needed]

## [Additional Section Title]

[Content for additional sections]

## Summary

[Provide a brief summary of key concepts covered in the lesson]

## Next Lesson

[Brief description of the next lesson and how it connects to this one]
```

## Step 5: Add Content

When writing your lesson:

- Use clear, accessible language appropriate for beginner-to-intermediate learners
- Explain technical concepts with analogies and examples
- Define terms when first used
- Follow progressive learning structure (build on previous knowledge)
- Include relevant code examples with appropriate language identifiers
- Add diagrams using Mermaid syntax where helpful

## Step 6: Validate Your Content

Before submitting:

1. Check that your lesson follows the [Content Guidelines](./content-guidelines)
2. Verify that all code examples work as described
3. Ensure all links are valid
4. Run content validation: `npm run validate-content`
5. Check Markdown formatting: `npm run lint`
6. Test site build: `npm run build`

## Step 7: Update Navigation (if necessary)

If this is a new lesson that changes the chapter structure:

1. Update the sidebar configuration in `sidebars.ts` if needed
2. Ensure the `sidebar_position` values are sequential within the chapter
3. Test that navigation works correctly

## Step 8: Submit Your Changes

1. Commit your changes with a descriptive message
2. Push your branch to the remote repository
3. Create a pull request with a clear description of your changes
4. Request reviews from other contributors

## Best Practices

- Keep lessons to approximately 10-15 minutes reading time
- Use consistent formatting and headings
- Test all code examples in an actual environment
- Ensure content is accessible to different learning styles
- Include visual aids (diagrams, images) when helpful
- Connect new concepts to previously covered material

## Common Mistakes to Avoid

- Skipping the learning objectives section
- Creating lessons that are too long or too short
- Forgetting to update the sidebar if new organization is needed
- Not testing code examples
- Inconsistent terminology with other lessons
- Failing to validate content before submission

## Example Lesson Structure

For reference, examine existing lessons in other chapters to see how content is structured and formatted.