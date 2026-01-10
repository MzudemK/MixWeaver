import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { useEffect, useState, lazy, Suspense } from 'react';
import type { UserData } from './types';
import { LoadingSpinner } from './components/LoadingSpinner';

// Lazy load pages for performance optimization
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Features = lazy(() => import('./pages/Features').then(module => ({ default: module.Features })));
const Tools = lazy(() => import('./pages/Tools').then(module => ({ default: module.Tools })));
const Library = lazy(() => import('./pages/Library').then(module => ({ default: module.Library })));
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const Stats = lazy(() => import('./pages/Stats').then(module => ({ default: module.Stats })));

// Wrapper component to check auth status and pass to Navbar
const AppContent = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check auth status on mount and route change
    const checkAuth = async () => {
      try {
        // Using relative path for proxy
        const res = await fetch('/api/auth/me', {
            credentials: 'include'
        });
        const data = await res.json();
        if (data.is_logged_in) {
          setUserData(data);
        } else {
          setUserData(null);
        }
      } catch (err) {
        console.error("Failed to check auth status", err);
        setUserData(null);
      } finally {
        setInitialLoading(false);
      }
    };
    checkAuth();
  }, [location.pathname]);

  if (initialLoading) {
      return <LoadingSpinner fullScreen message="Connecting to MixWeaver..." />;
  }

  return (
    <div className='min-h-screen bg-obsidian selection:bg-amber-brand/30 selection:text-amber-glow'>
      <Navbar userData={userData} />
      <main>
        <Suspense fallback={<LoadingSpinner fullScreen message="Loading..." />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/features" element={<Features />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/library" element={<Library />} />
            <Route path="/about" element={<About />} />
            <Route path="/stats" element={<Stats />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
