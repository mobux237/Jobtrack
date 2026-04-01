import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Candidatures from './pages/Candidatures';
import Offres from './pages/Offres';
import CV from './pages/CV';
import Lettres from './pages/Lettres';
import Login from './pages/Login';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('findmyalter_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogin  = (userData) => { setUser(userData); };
  const handleLogout = () => { localStorage.removeItem('findmyalter_user'); setUser(null); };

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <Router>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        backgroundAttachment: 'fixed',
        position: 'relative',
      }}>

        <div style={{
          position: 'fixed', top: '-15%', left: '-8%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(167,139,250,0.13) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        }} />

        <div style={{
          position: 'fixed', bottom: '-10%', right: '-5%',
          width: '450px', height: '450px',
          background: 'radial-gradient(circle, rgba(56,189,248,0.10) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        }} />

        <Navbar user={user} onLogout={handleLogout} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Routes>
            <Route path="/"             element={<Dashboard />}    />
            <Route path="/candidatures" element={<Candidatures />} />
            <Route path="/offres"       element={<Offres />}       />
            <Route path="/cv"           element={<CV />}           />
            <Route path="/lettres"      element={<Lettres />}      />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;