import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const liens = [
    { path: '/',             label: 'Dashboard'     },
    { path: '/candidatures', label: 'Candidatures'  },
    { path: '/offres',       label: 'Offres'        },
    { path: '/lettres',      label: 'Lettres ✉️'    },
    { path: '/cv',           label: 'Mon CV 📄'     },
  ];

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">🎯 JobTrack</h1>
        <div className="flex gap-6">
          {liens.map(lien => (
            <Link
              key={lien.path}
              to={lien.path}
              className={`transition ${
                location.pathname === lien.path
                  ? 'text-white font-semibold underline underline-offset-4'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              {lien.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;