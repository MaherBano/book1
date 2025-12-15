# Quickstart Guide: Docusaurus Book Project

## Prerequisites

- Node.js (version 18.0 or higher)
- npm or yarn package manager
- Git for version control
- GitHub account for deployment

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-book-repo.git
cd your-book-repo
```

### 2. Install Dependencies

```bash
cd website
npm install
```

Or if using yarn:

```bash
cd website
yarn install
```

### 3. Start Local Development Server

```bash
npm run start
```

Or with yarn:

```bash
yarn start
```

This will start a local development server and open the book in your default browser at `http://localhost:3000`.

### 4. Project Structure

Understanding the main directories:

```
website/
├── blog/                # Optional blog posts
├── docs/                # Book content organized by chapters and lessons
│   ├── intro.md         # Introduction to the book
│   ├── chapter-1/       # Content for Chapter 1
│   │   ├── lesson-1.md  # Lesson 1 of Chapter 1
│   │   ├── lesson-2.md  # Lesson 2 of Chapter 1
│   │   ├── lesson-3.md  # Lesson 3 of Chapter 1
│   │   └── lesson-4.md  # Lesson 4 of Chapter 1
│   └── ...              # More chapters
├── src/
│   ├── components/      # Custom React components
│   ├── css/             # Custom styles
│   └── pages/           # Additional custom pages
├── static/              # Static assets (images, documents, etc.)
├── docusaurus.config.js # Configuration for the Docusaurus site
├── package.json         # Project dependencies and scripts
├── sidebars.js          # Navigation sidebar configuration
└── README.md            # Project overview and instructions
```

## Creating Content

### 1. Adding a New Lesson

To add a new lesson, create a Markdown file in the appropriate chapter directory:

`website/docs/chapter-1/new-lesson.md`

```markdown
---
title: Title of New Lesson
sidebar_position: 5  # Position after lesson-4 if adding to chapter-1
description: Brief description of the lesson
---

# Title of New Lesson

This is the content of your lesson.

## Section Title

You can include code examples:

```python
def hello_world():
    print("Hello, World!")
```

And diagrams using mermaid:

```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```
```

### 2. Adding a New Chapter

1. Create a new directory in `website/docs/` (e.g., `chapter-4/`)
2. Add a category index file at `website/docs/chapter-4/_category_.json`:

```json
{
  "label": "Chapter 4: Title of New Chapter",
  "position": 4,
  "link": {
    "type": "generated-index",
    "description": "Brief description of the chapter."
  }
}
```

3. Add lessons as Markdown files in the new chapter directory

### 3. Code Examples

For executable code examples, Docusaurus supports syntax highlighting by default. For interactive examples, consider using CodeSandbox, Repl.it, or similar embedding:

```markdown
import BrowserWindow from '@site/src/components/BrowserWindow';

<BrowserWindow src="https://codesandbox.io/embed/...">
  [Code example preview]
</BrowserWindow>
```

### 4. Diagrams and Visuals

Place images in the `static/` directory and reference them:

```markdown
![Diagram Description](/img/diagram.png)
```

## Building and Deployment

### 1. Build Static Files

```bash
npm run build
```

This creates optimized static files in the `build/` directory.

### 2. Deploy to GitHub Pages

Deployment to GitHub Pages is typically handled via GitHub Actions. Ensure your `docusaurus.config.js` is correctly configured:

```js
module.exports = {
  // ...
  url: 'https://your-username.github.io',
  baseUrl: '/your-book-repo/',
  organizationName: 'your-username',
  projectName: 'your-book-repo',
  deploymentBranch: 'gh-pages',
  // ...
};
```

The GitHub Actions workflow will automatically build and deploy your site when you push changes to the main branch.

### 3. Local Testing of Build

To test the build locally:

```bash
npm run serve
```

This serves the built files on `http://localhost:3000` to preview how they will appear in production.

## Content Guidelines

### Writing Style
- Use clear, accessible language appropriate for beginner-to-intermediate learners
- Explain technical concepts with analogies and examples
- Define terms when first used
- Follow progressive learning structure (build on previous knowledge)

### Content Structure
- Organize content into 3 chapters with 4 lessons each as specified
- Each lesson should take approximately 10-15 minutes to read
- Include learning objectives at the beginning of each lesson
- Use consistent formatting and headings

### Validation
- Test all code examples to ensure they work as described
- Verify all links are valid
- Ensure content is responsive on mobile devices
- Run accessibility checks

## Content Creation Workflow

### 1. Setting Up Your Environment
1. Clone the repository: `git clone <repository-url>`
2. Navigate to the docasaurus directory: `cd docasaurus`
3. Install dependencies: `npm install`
4. Create a new branch for your work: `git checkout -b feature/chapter-X-lesson-Y`

### 2. Creating New Content
1. Use the lesson template at `docs/templates/lesson-template.md` as a starting point
2. Follow the content guidelines in `docs/contributing/content-guidelines.md`
3. Structure lessons with clear learning objectives, content sections, and summaries
4. Include relevant code examples and diagrams

### 3. Running Validations
1. Check Markdown formatting: `npm run lint`
2. Validate content compliance: `npm run validate-content`
3. Test site build: `npm run build`
4. Preview changes: `npm run start`

### 4. Submitting Your Work
1. Commit your changes with descriptive messages
2. Push your branch: `git push origin feature/chapter-X-lesson-Y`
3. Create a pull request with a clear description
4. Request reviews from other contributors