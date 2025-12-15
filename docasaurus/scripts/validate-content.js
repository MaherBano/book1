const fs = require('fs');
const path = require('path');

/**
 * Content Validator for Docusaurus Book Project
 *
 * This script validates content for compliance with project guidelines
 */

// Define validation rules for lessons
const lessonValidationRules = {
  hasTitle: (content) => /title: ['"][^'"]+['"]/.test(content),
  hasSidebarPosition: (content) => /sidebar_position: \d+/.test(content),
  hasDescription: (content) => /description: ['"][^'"]+['"]/.test(content),
  hasLearningObjectives: (content) => /## Learning Objectives/.test(content),
  hasProperHeadings: (content) => {
    // Check for proper heading hierarchy
    const h2Matches = content.match(/^##\s.+/gm);
    const h3Matches = content.match(/^###\s.+/gm);
    return (h2Matches || []).length >= 1; // Should have at least one H2
  },
  hasSummary: (content) => /## Summary/.test(content),
  hasNextLesson: (content) => /## Next Lesson/.test(content) || /## Next Steps/.test(content),
  noExcessiveLength: (content) => content.length < 10000, // Roughly 15 min reading time at 200 wpm
  hasCodeExamples: (content) => /```[\s\S]*?```/.test(content) // Check if there are code blocks
};

// Define validation rules for chapters
const chapterValidationRules = {
  hasTitle: (content) => /title: ['"][^'"]+['"]/.test(content),
  hasSidebarPosition: (content) => /sidebar_position: \d+/.test(content),
  hasDescription: (content) => /description: ['"][^'"]+['"]/.test(content),
  hasLearningObjectives: (content) => /## Learning Objectives/.test(content),
  hasOverview: (content) => /## Overview/.test(content),
  hasChapterStructure: (content) => /## Chapter Structure/.test(content),
  hasSummary: (content) => /## Summary/.test(content),
  hasNextChapter: (content) => /## Next Chapter/.test(content),
  hasLessonsList: (content) => /## Lessons in This Chapter/.test(content),
  hasPrerequisites: (content) => /## Prerequisites/.test(content),
  noExcessiveLength: (content) => content.length < 15000, // Chapter pages can be longer than lessons
};

// Define validation rules for other content
const generalValidationRules = {
  hasTitle: (content) => /title: ['"][^'"]+['"]/.test(content),
  hasSidebarPosition: (content) => /sidebar_position: \d+/.test(content),
  hasDescription: (content) => /description: ['"][^'"]+['"]/.test(content),
};

// Determine which validation rules to use based on file path
function getValidationRulesForFile(filePath) {
  if (filePath.includes('chapter') && !filePath.includes('lesson')) {
    // This is a chapter index file
    return chapterValidationRules;
  } else if (filePath.includes('lesson')) {
    // This is a lesson file
    return lessonValidationRules;
  } else {
    // This is some other documentation file
    return generalValidationRules;
  }
}

// Validate a markdown file
function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const validationRules = getValidationRulesForFile(filePath);
  const results = {};

  // Run each validation rule
  for (const [ruleName, ruleFunction] of Object.entries(validationRules)) {
    results[ruleName] = ruleFunction(content);
  }

  // Calculate compliance percentage
  const passedRules = Object.values(results).filter(result => result).length;
  const totalRules = Object.keys(results).length;
  results.compliancePercentage = Math.round((passedRules / totalRules) * 100);

  return results;
}

// Validate all markdown files in a directory
function validateDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  const results = {};

  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Recursively validate subdirectories
      results[item] = validateDirectory(fullPath);
    } else if (item.endsWith('.md')) {
      // Validate markdown files
      results[item] = validateFile(fullPath);
    }
  });

  return results;
}

// Structure validation function
function validateStructure() {
  const docsDir = path.join(__dirname, '../docs');
  const expectedChapters = ['chapter-1', 'chapter-2', 'chapter-3'];
  const expectedLessonsPerChapter = 4;
  const issues = [];

  // Check if required chapters exist
  for (const chapter of expectedChapters) {
    const chapterPath = path.join(docsDir, chapter);
    if (!fs.existsSync(chapterPath)) {
      issues.push(`Missing chapter directory: ${chapter}`);
      continue;
    }

    // Check if chapter has _category_.json
    const categoryPath = path.join(chapterPath, '_category_.json');
    if (!fs.existsSync(categoryPath)) {
      issues.push(`Missing category file: ${categoryPath}`);
    }

    // Check if chapter has index.md
    const indexPath = path.join(chapterPath, 'index.md');
    if (!fs.existsSync(indexPath)) {
      issues.push(`Missing index file: ${indexPath}`);
    }

    // Check for required lessons
    for (let i = 1; i <= expectedLessonsPerChapter; i++) {
      const lessonPath = path.join(chapterPath, `lesson-${i}.md`);
      if (!fs.existsSync(lessonPath)) {
        issues.push(`Missing lesson: ${lessonPath}`);
      }
    }
  }

  // Check if intro.md exists
  const introPath = path.join(docsDir, 'intro.md');
  if (!fs.existsSync(introPath)) {
    issues.push(`Missing introduction file: ${introPath}`);
  }

  return issues;
}

// Main function
function main() {
  const docsDir = path.join(__dirname, '../docs');
  const validationResults = validateDirectory(docsDir);
  const structureIssues = validateStructure();

  // Print structure validation results
  console.log('Structure Validation Results:');
  console.log('==============================');
  if (structureIssues.length === 0) {
    console.log('✅ All structural requirements met');
  } else {
    console.log('❌ Structure issues found:');
    structureIssues.forEach(issue => console.log(`  - ${issue}`));
  }

  // Print content validation summary
  console.log('\nContent Validation Summary:');
  console.log('===========================');

  for (const [fileName, results] of Object.entries(validationResults)) {
    if (typeof results === 'object' && !results.compliancePercentage) {
      // This is a subdirectory
      console.log(`\nDirectory: ${fileName}`);
      for (const [subFileName, subResults] of Object.entries(results)) {
        if (typeof subResults === 'object' && subResults.compliancePercentage !== undefined) {
          console.log(`  ${subFileName}: ${subResults.compliancePercentage}% compliance`);
        }
      }
    } else if (typeof results === 'object' && results.compliancePercentage !== undefined) {
      // This is a file with validation results
      console.log(`${fileName}: ${results.compliancePercentage}% compliance`);

      // Print detailed results for files with low compliance
      if (results.compliancePercentage < 80) {
        console.log('  Issues:');
        for (const [ruleName, result] of Object.entries(results)) {
          if (ruleName !== 'compliancePercentage' && !result) {
            console.log(`    - ${ruleName}: FAILED`);
          }
        }
      }
    }
  }
}

// Run the validator
main();