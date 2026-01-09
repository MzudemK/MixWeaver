import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Features } from './pages/Features'; // Keep for public view if needed, or redirect
import { Tools } from './pages/Tools';
import { Library } from './pages/Library';
import { About } from './pages/About';
import { Stats } from './pages/Stats';
import { useEffect, useState } from 'react';
import type { UserData } from './types';

import { LoadingSpinner } from './components/LoadingSpinner';

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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/features" element={<Features />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/library" element={<Library />} />
          <Route path="/about" element={<About />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
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
