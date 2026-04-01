import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function Login({ onLogin }) {
  const [erreur, setErreur] = useState('');

  const handleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const user = { nom: decoded.name, email: decoded.email, photo: decoded.picture };
      localStorage.setItem('findmyalter_user', JSON.stringify(user));
      onLogin(user);
    } catch (e) {
      setErreur('Erreur lors de la connexion. Réessaie.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      backgroundAttachment: 'fixed',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem', position: 'relative', overflow: 'hidden',
    }}>

      <div style={{ position: 'fixed', top: '-15%', left: '-8%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-10%', right: '-5%', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(56,189,248,0.13) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '1.75rem',
        padding: '3rem 2.5rem',
        width: '100%', maxWidth: '420px',
        textAlign: 'center',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 60px rgba(167,139,250,0.12)',
        position: 'relative', zIndex: 1,
      }}>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            width: '72px', height: '72px',
            background: 'linear-gradient(135deg, #a78bfa, #38bdf8)',
            borderRadius: '1.25rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem', fontSize: '2rem',
            boxShadow: '0 8px 32px rgba(167,139,250,0.4)',
          }}>🎯</div>

          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontSize: '2rem', fontWeight: 800,
            margin: '0 0 0.4rem 0',
            background: 'linear-gradient(135deg, #ffffff, #a78bfa)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>FindMyAlter</h1>

          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Ton assistant de recherche d'alternance
          </p>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '1.75rem 0' }} />

        <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          Connecte-toi pour accéder à ton espace personnel et suivre tes candidatures
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => setErreur('Connexion refusée. Réessaie.')}
            text="signin_with"
            shape="rectangular"
            size="large"
            locale="fr"
          />
        </div>

        {erreur && (
          <p style={{ color: '#f87171', fontSize: '0.83rem', marginTop: '0.75rem' }}>{erreur}</p>
        )}

        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <p style={{ fontSize: '0.72rem', color: '#475569', margin: '0 0 0.2rem 0' }}>
            © 2026 Thomas Mobe Bonny — FindMyAlter
          </p>
          <p style={{ fontSize: '0.68rem', color: '#334155', margin: 0 }}>Tous droits réservés</p>
        </div>

      </div>
    </div>
  );
}

export default Login;