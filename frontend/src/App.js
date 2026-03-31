import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Candidatures from './pages/Candidatures';
import Offres from './pages/Offres';
import CV from './pages/CV';
import Lettres from './pages/Lettres';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/candidatures" element={<Candidatures />} />
            <Route path="/offres" element={<Offres />} />
            <Route path="/cv" element={<CV />} />
            <Route path="/lettres" element={<Lettres />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;