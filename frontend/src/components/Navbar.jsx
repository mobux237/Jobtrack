import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navStyle = {
  position: 'sticky',
  top: 0,
  zIndex: 100,
  background: 'rgba(10, 8, 30, 0.8)',
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
  boxShadow: '0 4px 30px rgba(0,0,0,0.4)',
};

const liens = [
  { path: '/', label: 'Dashboard' },
  { path: '/candidatures', label: 'Candidatures' },
  { path: '/offres', label: 'Offres' },
  { path: '/lettres', label: 'Lettres' },
  { path: '/cv', label: 'Mon CV' },
];

function Navbar({ user, onLogout }) {
  const location = useLocation();
  const [hoveredPath, setHoveredPath] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <nav style={navStyle}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem',
          minHeight: '72px',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #a78bfa, #38bdf8)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              boxShadow: '0 0 18px rgba(167,139,250,0.35)',
            }}
          >
            🎯
          </div>

          <div>
            <p
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: '1.05rem',
                lineHeight: 1,
                margin: 0,
                background: 'linear-gradient(135deg, #ffffff, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              FindMyAlter
            </p>
            <p
              style={{
                fontSize: '0.68rem',
                color: '#64748b',
                margin: '0.2rem 0 0 0',
                lineHeight: 1,
              }}
            >
              by Thomas Mobe Bonny
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '0.35rem',
            justifyContent: 'center',
            flex: 1,
            flexWrap: 'wrap',
          }}
        >
          {liens.map((lien) => {
            const isActive = location.pathname === lien.path;
            const isHovered = hoveredPath === lien.path;

            return (
              <Link
                key={lien.path}
                to={lien.path}
                onMouseEnter={() => setHoveredPath(lien.path)}
                onMouseLeave={() => setHoveredPath(null)}
                style={{
                  padding: '0.5rem 0.9rem',
                  borderRadius: '0.7rem',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 600 : 500,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 200ms ease',
                  color: isActive ? '#f8fafc' : isHovered ? '#e2e8f0' : '#94a3b8',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(167,139,250,0.22), rgba(56,189,248,0.18))'
                    : isHovered
                    ? 'rgba(255,255,255,0.06)'
                    : 'transparent',
                  border: isActive
                    ? '1px solid rgba(167,139,250,0.32)'
                    : '1px solid transparent',
                }}
              >
                {lien.label}
              </Link>
            );
          })}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.35rem 0.55rem',
              borderRadius: '9999px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {user?.photo && (
              <img
                src={user.photo}
                alt={user.nom}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  border: '2px solid rgba(167,139,250,0.55)',
                  objectFit: 'cover',
                }}
              />
            )}

            {!isMobile && (
              <span
                style={{
                  fontSize: '0.84rem',
                  fontWeight: 500,
                  color: '#e2e8f0',
                  maxWidth: '150px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.nom}
              </span>
            )}
          </div>

          <button
            onClick={onLogout}
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              padding: '0.55rem 0.9rem',
              borderRadius: '0.7rem',
              background: 'rgba(248,113,113,0.10)',
              color: '#f87171',
              border: '1px solid rgba(248,113,113,0.22)',
              cursor: 'pointer',
              transition: 'all 200ms ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(248,113,113,0.18)';
              e.currentTarget.style.borderColor = 'rgba(248,113,113,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(248,113,113,0.10)';
              e.currentTarget.style.borderColor = 'rgba(248,113,113,0.22)';
            }}
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;