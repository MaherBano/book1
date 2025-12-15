import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Manual sidebar to organize the book content following 3 chapters × 4 lessons structure
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Chapter 1: Introduction to AI Concepts',
      items: [
        {type: 'doc', id: 'chapter-1/index'},
        {type: 'doc', id: 'chapter-1/lesson-1'},
        {type: 'doc', id: 'chapter-1/lesson-2'},
        {type: 'doc', id: 'chapter-1/lesson-3'},
        {type: 'doc', id: 'chapter-1/lesson-4'}
      ],
    },
    {
      type: 'category',
      label: 'Chapter 2: Fundamentals of Robotics',
      items: [
        {type: 'doc', id: 'chapter-2/index'},
        {type: 'doc', id: 'chapter-2/lesson-1'},
        {type: 'doc', id: 'chapter-2/lesson-2'},
        {type: 'doc', id: 'chapter-2/lesson-3'},
        {type: 'doc', id: 'chapter-2/lesson-4'}
      ],
    },
    {
      type: 'category',
      label: 'Chapter 3: Computer Science Essentials',
      items: [
        {type: 'doc', id: 'chapter-3/index'},
        {type: 'doc', id: 'chapter-3/lesson-1'},
        {type: 'doc', id: 'chapter-3/lesson-2'},
        {type: 'doc', id: 'chapter-3/lesson-3'},
        {type: 'doc', id: 'chapter-3/lesson-4'}
      ],
    },
  ],
};

export default sidebars;
