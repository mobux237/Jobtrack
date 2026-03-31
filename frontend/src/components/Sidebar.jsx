import React from 'react';
import { NavLink } from 'react-router-dom';

const liens = [
  { path: '/',             label: 'Tableau de bord', icon: '📊' },
  { path: '/candidatures', label: 'Candidatures',    icon: '📁' },
  { path: '/offres',       label: 'Offres',           icon: '🔍' },
  { path: '/lettres',      label: 'Lettres',          icon: '✉️'  },
  { path: '/cv',           label: 'Mon CV',           icon: '📄' },
];

function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-blue-600">💼 JobTrack</h1>
        <p className="text-xs text-gray-400 mt-1">Suivi de candidatures</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {liens.map(lien => (
          <NavLink
            key={lien.path}
            to={lien.path}
            end={lien.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <span>{lien.icon}</span>
            <span>{lien.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">JobTrack v1.0</p>
      </div>
    </aside>
  );
}

export default Sidebar;