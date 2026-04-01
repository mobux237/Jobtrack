import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const location = useLocation();

  const liens = [
    { path: '/',             label: 'Dashboard'    },
    { path: '/candidatures', label: 'Candidatures' },
    { path: '/offres',       label: 'Offres'       },
    { path: '/lettres',      label: 'Lettres ✉️'   },
    { path: '/cv',           label: 'Mon CV 📄'    },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo + Nom */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <span className="text-lg">🎯</span>
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none">FindMyAlter</h1>
            <p className="text-xs text-blue-200 leading-none">by Thomas Mobe Bonny</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-1">
          {liens.map(lien => (
            <Link
              key={lien.path}
              to={lien.path}
              className={`px-3 py-2 rounded-lg text-sm transition ${
                location.pathname === lien.path
                  ? 'bg-white bg-opacity-20 font-semibold'
                  : 'text-blue-100 hover:bg-white hover:bg-opacity-10'
              }`}
            >
              {lien.label}
            </Link>
          ))}
        </div>

        {/* Profil utilisateur */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {user.photo && (
              <img
                src={user.photo}
                alt={user.nom}
                className="w-8 h-8 rounded-full border-2 border-white border-opacity-50"
              />
            )}
            <span className="text-sm font-medium hidden md:block">{user.nom}</span>
          </div>
          <button
            onClick={onLogout}
            className="text-xs bg-white bg-opacity-10 hover:bg-opacity-20 px-3 py-1.5 rounded-lg transition"
          >
            Déconnexion
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;