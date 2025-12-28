import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

function FeatureCard({ title, description, icon }) {
  return (
    <div className={clsx('col col--4', styles.featureCard)}>
      <div className={styles.featureCardInner}>
        <div className={styles.featureIcon}>{icon}</div>
        <h3 className={styles.featureTitle}>{title}</h3>
        <p className={styles.featureDescription}>{description}</p>
      </div>
    </div>
  );
}

function StepCard({ number, title, description }) {
  return (
    <div className={clsx('col col--4', styles.stepCard)}>
      <div className={styles.stepNumber}>{number}</div>
      <h3 className={styles.stepTitle}>{title}</h3>
      <p className={styles.stepDescription}>{description}</p>
    </div>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <main>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className="container">
            <div className="row">
              <div className="col col--12">
                <div className={styles.heroContent}>
                  <h1 className={styles.heroTitle}>
                    Technical Book
                  </h1>
                  <p className={styles.heroSubtitle}>
                    A comprehensive technical book with structured chapters, AI-powered assistance, and fast navigation.
                    Learn complex topics with the help of our intelligent chatbot.
                  </p>
                  <div className={styles.heroButtons}>
                    <Link className={styles.primaryButton} to="/docs/intro">
                      Start Reading
                    </Link>
                    <Link className={styles.secondaryButton} to="/docs/intro">
                      Ask AI
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.featuresSection}>
          <div className="container">
            <div className="row">
              <div className="col col--12">
                <h2 className={styles.sectionTitle}>Key Features</h2>
                <p className={styles.sectionSubtitle}>Everything you need for comprehensive learning</p>
              </div>
            </div>
            <div className="row">
              <FeatureCard
                title="Structured Chapters"
                description="Well-organized content with clear progression from basic to advanced concepts"
                icon="📚"
              />
              <FeatureCard
                title="AI-Powered Chatbot"
                description="Ask questions and get instant answers based on the book content"
                icon="🤖"
              />
              <FeatureCard
                title="Fast Navigation"
                description="Quick search and intuitive navigation to find what you need"
                icon="🔍"
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className={styles.howItWorksSection}>
          <div className="container">
            <div className="row">
              <div className="col col--12">
                <h2 className={styles.sectionTitle}>How It Works</h2>
                <p className={styles.sectionSubtitle}>Simple and effective learning process</p>
              </div>
            </div>
            <div className="row">
              <StepCard
                number="1"
                title="Browse Content"
                description="Explore structured chapters and topics at your own pace"
              />
              <StepCard
                number="2"
                title="Ask Questions"
                description="Use our AI chatbot to get instant answers from the documentation"
              />
              <StepCard
                number="3"
                title="Learn Efficiently"
                description="Combine reading with interactive assistance for better understanding"
              />
            </div>
          </div>
        </section>

        {/* AI Chatbot Highlight */}
        <section className={styles.chatbotSection}>
          <div className="container">
            <div className="row">
              <div className="col col--12">
                <h2 className={styles.sectionTitle}>AI-Powered Assistance</h2>
                <p className={styles.sectionSubtitle}>Get instant answers to your questions</p>
              </div>
            </div>
            <div className="row">
              <div className="col col--12">
                <div className={styles.chatbotMockup}>
                  <div className={styles.chatHeader}>
                    <h3>Documentation Assistant</h3>
                  </div>
                  <div className={styles.chatMessages}>
                    <div className={styles.botMessage}>
                      Hello! I'm your documentation assistant. How can I help you today?
                    </div>
                    <div className={styles.userMessage}>
                      What are the key concepts in Chapter 1?
                    </div>
                    <div className={styles.botMessage}>
                      Chapter 1 covers fundamental concepts including AI basics, machine learning fundamentals, and core principles...
                    </div>
                  </div>
                  <div className={styles.chatInput}>
                    <input type="text" placeholder="Ask a question about the book..." />
                    <button>Send</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className="container">
            <div className="row">
              <div className="col col--12">
                <h2 className={styles.ctaTitle}>Start Learning Now</h2>
                <p className={styles.ctaSubtitle}>Join thousands of learners who use our documentation platform</p>
                <Link className={styles.primaryButton} to="/docs/intro">
                  Begin Your Journey
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}