import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Remove initial loading screen once React mounts
const removeLoader = () => {
  const loader = document.getElementById("initial-loader");
  if (loader) {
    loader.style.opacity = "0";
    loader.style.transition = "opacity 0.3s ease";
    setTimeout(() => loader.remove(), 300);
  }
};

// Error Boundary Component for catching render errors
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ZERO Error:", error, errorInfo);
    
    // Send to error monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error);
      // Or: fetch('/api/errors', { method: 'POST', body: JSON.stringify({ error, errorInfo }) });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0F1419',
          color: '#E8EAED',
          fontFamily: 'Poppins, sans-serif',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem',
              color: '#00D9FF' 
            }}>
              ⚠️
            </h1>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              حدث خطأ ما
            </h2>
            <p style={{ 
              color: '#A0AEC0', 
              marginBottom: '1.5rem',
              maxWidth: '400px' 
            }}>
              عذراً، حدث خطأ غير متوقع. يرجى تحديث الصفحة أو المحاولة مرة أخرى.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#00D9FF',
                color: '#0F1419',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              🔄 تحديث الصفحة
            </button>
            {this.state.error && (
              <details style={{ 
                marginTop: '2rem', 
                textAlign: 'left', 
                background: 'rgba(255,0,0,0.1)', 
                padding: '1rem', 
                borderRadius: '8px' 
              }}>
                <summary style={{ cursor: 'pointer', color: '#ff6b6b' }}>
                  تفاصيل الخطأ (للمطورين)
                </summary>
                <pre style={{ 
                  marginTop: '1rem', 
                  fontSize: '0.85rem', 
                  overflow: 'auto',
                  color: '#ff9999' 
                }}>
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Performance: Report Web Vitals
const reportWebVitals = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Log Core Web Vitals
    const vitals = ['FCP', 'LCP', 'CLS', 'FID', 'TTFB'];
    
    // Simple performance observer
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log(`[Performance] ${entry.name}: ${Math.round(entry.startTime)}ms`);
      }
    });
    
    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
    } catch (e) {
      // Performance API not fully supported
    }
  }
};

// Initialize app
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Check your index.html");
}

const root = createRoot(rootElement);

// Render with Error Boundary
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

// Post-mount cleanup
removeLoader();
reportWebVitals();

// Service Worker Registration (for PWA - optional)
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.log('SW registration failed:', err));
  });
}

// Enable PWA standalone mode detection
if (window.matchMedia('(display-mode: standalone)').matches) {
  document.documentElement.classList.add('pwa');
}
