import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import { translate } from '@docusaurus/Translate';
import styles from './Breadcrumbs.module.css';

// Define the breadcrumb structure
type Breadcrumb = {
  label: string;
  href?: string;
};

// Breadcrumbs component
export default function Breadcrumbs(): JSX.Element | null {
  const location = useLocation();
  
  // Define breadcrumbs based on the current path
  const breadcrumbs: Breadcrumb[] = [];
  
  // Add home link
  breadcrumbs.push({
    label: translate({ message: 'Home' }),
    href: '/',
  });
  
  // Add chapter/lesson specific breadcrumbs
  if (location.pathname.includes('/docs/chapter-1')) {
    breadcrumbs.push({
      label: translate({ message: 'Chapter 1: Introduction to AI Concepts' }),
      href: '/docs/chapter-1',
    });
    
    if (location.pathname.includes('/lesson-1')) {
      breadcrumbs.push({
        label: translate({ message: 'Lesson 1: What is Artificial Intelligence?' }),
      });
    } else if (location.pathname.includes('/lesson-2')) {
      breadcrumbs.push({
        label: translate({ message: 'Lesson 2: Machine Learning Fundamentals' }),
      });
    } else if (location.pathname.includes('/lesson-3')) {
      breadcrumbs.push({
        label: translate({ message: 'Lesson 3: Neural Networks and Deep Learning' }),
      });
    } else if (location.pathname.includes('/lesson-4')) {
      breadcrumbs.push({
        label: translate({ message: 'Lesson 4: Applications of AI in the Real World' }),
      });
    }
  } else if (location.pathname.includes('/docs/chapter-2')) {
    breadcrumbs.push({
      label: translate({ message: 'Chapter 2: Fundamentals of Robotics' }),
      href: '/docs/chapter-2',
    });
    
    if (location.pathname.includes('/lesson-1')) {
      breadcrumbs.push({
        label: translate({ message: 'Lesson 1: Introduction to Robotics and Robot Components' }),
      });
    } else if (location.pathname.includes('/lesson-2')) {
      breadcrumbs.push({
        label: translate({ message: 'Lesson 2: Sensors and Actuators in Robotics' }),
      });
    } else if (location.pathname.includes('/lesson-3')) {
      breadcrumbs.push({
        label: translate({ message: 'Lesson 3: Robot Control Systems' }),
      });
    } else if (location.pathname.includes('/lesson-4')) {
      breadcrumbs.push({
        label: translate({ message: 'Lesson 4: Applications of Robotics in Various Fields' }),
      });
    }
  } else if (location.pathname.includes('/docs/chapter-3')) {
    breadcrumbs.push({
      label: translate({ message: 'Chapter 3: Computer Science Essentials' }),
      href: '/docs/chapter-3',
    });
    
    if (location.pathname.includes('/lesson-1')) {
      breadcrumbs.push({
        label: translate({ message: 'Lesson 1: Algorithms and Computational Thinking' }),
      });
    } else if (location.pathname.includes('/lesson-2')) {
      breadcrumbs.push({
        label: translate({ message: 'Lesson 2: Data Structures and Organization' }),
      });
    } else if (location.pathname.includes('/lesson-3')) {
      breadcrumbs.push({
        label: translate({ message: 'Lesson 3: Computational Complexity and Efficiency' }),
      });
    } else if (location.pathname.includes('/lesson-4')) {
      breadcrumbs.push({
        label: translate({ message: 'Lesson 4: Software Engineering for Intelligent Systems' }),
      });
    }
  } else if (location.pathname.includes('/docs/intro')) {
    breadcrumbs.push({
      label: translate({ message: 'Introduction' }),
    });
  }
  
  // Don't show breadcrumbs on the home page or if only home breadcrumb exists
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className={clsx(styles.breadcrumbsContainer)} aria-label={translate({ message: 'Breadcrumbs' })}>
      <ul className={styles.breadcrumbsList}>
        {breadcrumbs.map((crumb, index) => (
          <li key={index} className={styles.breadcrumbItem}>
            {index > 0 && <span className={styles.breadcrumbSeparator}>»</span>}
            {crumb.href ? (
              <Link
                to={crumb.href}
                className={clsx(styles.breadcrumbLink, {
                  [styles.breadcrumbLinkActive]: index === breadcrumbs.length - 1,
                })}
              >
                {crumb.label}
              </Link>
            ) : (
              <span className={styles.breadcrumbCurrent}>{crumb.label}</span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}