---
title: Content Guidelines
sidebar_position: 1
description: Guidelines for creating and formatting book content in Docusaurus
---

# Content Guidelines

## Purpose

This document provides guidelines for creating and formatting book content for the Docusaurus Book Project. These guidelines ensure consistency, accessibility, and maintainability across all content.

## Writing Style

### General Principles
- Use clear, accessible language appropriate for beginner-to-intermediate learners
- Explain technical concepts with analogies and examples
- Define terms when first used
- Follow progressive learning structure (build on previous knowledge)
- Be concise but thorough - avoid unnecessary jargon

### Voice and Tone
- Use active voice where possible
- Maintain a friendly, informative, and encouraging tone
- Address the reader directly using "you" and "your"
- Be inclusive and avoid gendered language

## Content Structure

### Learning Objectives
Each lesson should begin with clearly defined learning objectives:
- Format as a bulleted list using `- [ ]` (uncheck the box)
- Limit to 3-5 specific, measurable objectives
- Use action verbs (define, identify, understand, apply, etc.)

Example:
```
## Learning Objectives

After completing this lesson, you will be able to:
- Define Artificial Intelligence in clear terms
- Identify examples of AI in everyday life
- Distinguish between different types of AI systems
```

### Content Sections
- Use a maximum of 3 heading levels per document (##, ###, ####)
- Each section should focus on a single concept or idea
- Break complex topics into digestible sections
- Use transition sentences to connect sections

### Lesson Length
- Keep lessons to approximately 10-15 minutes reading time
- If content exceeds this, consider splitting into multiple lessons
- Use internal cross-references to connect related content

## Technical Formatting

### Code Blocks
- Use appropriate language identifiers (```python, ```javascript, etc.)
- Keep code examples concise and relevant
- Include comments explaining complex code
- Use example domains for URLs (example.com, example.org)

### Mathematical Notations
- Use standard mathematical notation
- Define all variables and symbols
- For complex notation, provide verbal explanations

### Links and Cross-References
- Use descriptive link text instead of URLs
- Link to other lessons within the same chapter when relevant
- Use relative links for internal references: `[link text](./other-page.md)`
- Use absolute links for external references: `[link text](https://example.com)`

### Images and Diagrams
- Place image files in the `static/img/` directory
- Reference images using the `/img/` path: `![Alt text](/img/image-name.png)`
- Always include descriptive alt text for accessibility
- Include captions when necessary to explain the image's relevance

## Content Quality Standards

### Accuracy
- Verify all technical claims and code samples
- Test all code examples to ensure reproducibility
- Cite sources for statistics and research findings
- Update content when technologies evolve

### Accessibility
- Write alt text for all images
- Use semantic headings correctly
- Maintain good color contrast for text
- Use readable fonts and appropriate sizes

### Inclusivity
- Use inclusive language
- Include diverse examples where applicable
- Avoid cultural assumptions
- Consider global audience

## Docusaurus-Specific Guidelines

### Markdown Headers
- Use proper heading hierarchy (don't skip levels)
- Frontmatter: Include title, sidebar_position, and description
- Follow Docusaurus Markdown syntax for additional features

### Component Usage
- Use Docusaurus components when appropriate (e.g., `<Note>`, `<Tip>`)
- Leverage admonitions for important information
- Use tabs for showing multiple code examples or approaches

### Navigation
- Ensure proper sidebar positioning for correct ordering
- Use consistent naming between file names and titles
- Link related content appropriately

## Review and Validation

### Self-Review Checklist
- [ ] Content matches learning objectives
- [ ] Technical information is accurate
- [ ] Code examples work as expected
- [ ] Content follows progressive learning structure
- [ ] Writing is clear and concise
- [ ] All links function correctly
- [ ] Images have proper alt text
- [ ] Content meets accessibility standards

### Submission Process
1. Complete the self-review checklist
2. Submit content as a pull request
3. Wait for peer review and approval
4. Make suggested revisions if needed
5. Merge after approval

## Version Control Best Practices

### Git Commit Messages
- Use present tense: "Add" not "Added"
- Be specific and descriptive
- Prefix with content type when relevant (e.g., "Lesson: Add intro to ML")

### Branch Names
- Use descriptive branch names
- Include chapter/lesson reference (e.g., `feature/chapter-1-lesson-2`)

### Pull Requests
- Include a clear description of changes
- Reference related issues or tasks
- Request reviews from other contributors

## Maintaining Content

### Updates and Corrections
- Make corrections promptly when errors are identified
- Update content to reflect technological changes
- Keep examples relevant and up-to-date
- Monitor for broken links or outdated information

### Expansion
- Follow established formatting and style when adding new content
- Ensure new content integrates well with existing structure
- Maintain consistency with learning objectives and progression

## Deployment Procedures

### For Maintainers

The site is automatically deployed to GitHub Pages when changes are merged into the `main` branch.

#### GitHub Actions Deployment Workflow
- The workflow is defined in `.github/workflows/deploy.yml`
- It runs on every push to the `main` branch
- Pull requests trigger a build test but not deployment
- The site is built and deployed to the `gh-pages` branch

#### Deployment Process
1. Ensure your changes are merged to `main`
2. The GitHub Action will automatically build and deploy the site
3. Monitor the Actions tab for deployment status
4. The site is typically updated within a few minutes of merging

#### Troubleshooting Deployments
- Check the GitHub Actions logs for any errors during build
- Verify that all links are valid and content is properly formatted
- Run `npm run build` locally before merging to catch issues
- If deployment fails, check for broken links or build errors