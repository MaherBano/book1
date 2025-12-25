import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import '../css/custom.css';

export default function Home() {
  return (
    <Layout
      title="My Book"
      description="A modern guide to learn step by step"
    >
      {/* HERO SECTION */}
      <header className="heroSection">
        <div className="heroContent">
          <h1 className="heroTitle">Build Knowledge, Page by Page</h1>
          <p className="heroSubtitle">
  A modern, structured guide to learn step by step using Docusaurus and React.
</p>


          <div className="heroButtons">
            <Link className="button button--primary" to="/docs/intro">
              Start Reading
            </Link>
            <Link className="button button--outline" to="/docs/intro">
              View Chapters
            </Link>
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <main className="featuresSection">
        <div className="feature">
          <h3>📘 Easy to Read</h3>
          <p>Clean layout with focused typography for distraction-free learning.</p>
        </div>

        <div className="feature">
          <h3>⚡ Practical Examples</h3>
          <p>Every chapter includes real-world explanations and examples.</p>
        </div>

        <div className="feature">
          <h3>🌙 Dark Mode</h3>
          <p>Built-in dark mode for comfortable night reading.</p>
        </div>
      </main>

      {/* CTA */}
      <section className="ctaSection">
        <h2>Start Your Learning Journey</h2>
        <p>Read the book from the beginning and grow your skills.</p>
        <Link className="button button--primary" to="/docs/intro">
          Read Now →
        </Link>
      </section>
    </Layout>
  );
}
