import React, { useEffect, useState } from 'react';
import axios from 'axios';

const glass = {
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '1.25rem',
  padding: '1.5rem',
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  color: '#f1f5f9',
};

const accentColors = {
  blue:   { glow: 'rgba(56,189,248,0.25)',  bar: 'linear-gradient(90deg,#38bdf8,#818cf8)' },
  green:  { glow: 'rgba(52,211,153,0.25)',  bar: 'linear-gradient(90deg,#34d399,#38bdf8)' },
  yellow: { glow: 'rgba(251,191,36,0.25)',  bar: 'linear-gradient(90deg,#fbbf24,#f97316)' },
  purple: { glow: 'rgba(167,139,250,0.25)', bar: 'linear-gradient(90deg,#a78bfa,#818cf8)' },
};

function StatCard({ titre, valeur, soustitre, couleur, icone, extra }) {
  const accent = accentColors[couleur] || accentColors.blue;

  return (
    <div
      style={{
        ...glass,
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 30px ${accent.glow}`,
        transition: 'transform 200ms ease, box-shadow 200ms ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
            {titre}
          </p>
          <p
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              lineHeight: 1,
              background: 'linear-gradient(135deg,#fff,#a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {valeur}
          </p>
          {soustitre && <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.4rem' }}>{soustitre}</p>}
          {extra}
        </div>
        <span style={{ fontSize: '2rem', opacity: 0.85 }}>{icone}</span>
      </div>
    </div>
  );
}

function TauxReponseCard({ taux, avec_reponse, sans_reponse, total }) {
  const couleur = taux >= 50 ? '#34d399' : taux >= 25 ? '#fbbf24' : '#f87171';
  const barColor =
    taux >= 50
      ? 'linear-gradient(90deg,#34d399,#38bdf8)'
      : taux >= 25
      ? 'linear-gradient(90deg,#fbbf24,#f97316)'
      : 'linear-gradient(90deg,#f87171,#f43f5e)';

  return (
    <div style={{ ...glass, boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 30px rgba(129,140,248,0.2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
            Taux de réponse
          </p>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, color: couleur, lineHeight: 1 }}>{taux}%</p>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.4rem' }}>
            {avec_reponse} réponse{avec_reponse > 1 ? 's' : ''} sur {total} candidature{total > 1 ? 's' : ''}
          </p>
        </div>
        <span style={{ fontSize: '2rem' }}>📬</span>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
        <div
          style={{
            background: barColor,
            height: '100%',
            width: `${taux}%`,
            borderRadius: '9999px',
            transition: 'width 700ms ease',
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.78rem', color: '#64748b' }}>
        <span>✅ Avec réponse : <strong style={{ color: '#34d399' }}>{avec_reponse}</strong></span>
        <span>⏳ Sans réponse : <strong style={{ color: '#94a3b8' }}>{sans_reponse}</strong></span>
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [taux, setTaux] = useState(null);

  const fetchStats = async () => {
    try {
      const [resStats, resTaux] = await Promise.all([
        axios.get('https://jobtrack-256h.onrender.com/candidatures/stats'),
        axios.get('https://jobtrack-256h.onrender.com/candidatures/taux-reponse'),
      ]);
      setStats(resStats.data);
      setTaux(resTaux.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!stats || !taux) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '16rem', flexDirection: 'column', gap: '1rem', color: '#64748b' }}>
        <p style={{ fontSize: '2.5rem' }}>⚠️</p>
        <p style={{ fontWeight: 500 }}>Impossible de charger les données</p>
        <p style={{ fontSize: '0.8rem' }}>Vérifie que le serveur backend est bien lancé</p>
      </div>
    );
  }

  const statuts = [
    { label: 'En attente', key: 'En attente', color: '#94a3b8', bar: 'linear-gradient(90deg,#94a3b8,#64748b)' },
    { label: 'Relancé', key: 'Relance', color: '#fbbf24', bar: 'linear-gradient(90deg,#fbbf24,#f97316)' },
    { label: 'Entretien', key: 'Entretien', color: '#38bdf8', bar: 'linear-gradient(90deg,#38bdf8,#818cf8)' },
    { label: 'Refus', key: 'Refus', color: '#f87171', bar: 'linear-gradient(90deg,#f87171,#f43f5e)' },
  ];

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontFamily: "'Syne',sans-serif",
            fontSize: 'clamp(1.5rem,3vw,2.25rem)',
            fontWeight: 700,
            background: 'linear-gradient(135deg,#fff,#a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.4rem',
          }}
        >
          Tableau de bord
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Suivi en temps réel de tes candidatures</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(min(220px,100%),1fr))',
          gap: '1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        <StatCard titre="Total candidatures" valeur={stats.total} soustitre="depuis le début" couleur="blue" icone="📁" />
        <StatCard
          titre="Entretiens obtenus"
          valeur={stats.par_statut?.['Entretien'] || 0}
          soustitre="objectif : 5 entretiens"
          couleur="green"
          icone="🎯"
          extra={
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', height: '6px', marginTop: '0.6rem', overflow: 'hidden' }}>
              <div
                style={{
                  background: 'linear-gradient(90deg,#34d399,#38bdf8)',
                  height: '100%',
                  width: `${Math.min(((stats.par_statut?.['Entretien'] || 0) / 5) * 100, 100)}%`,
                  borderRadius: '9999px',
                  transition: 'width 700ms ease',
                }}
              />
            </div>
          }
        />
        <StatCard
          titre="En attente de réponse"
          valeur={stats.par_statut?.['En attente'] || 0}
          soustitre="candidatures envoyées"
          couleur="yellow"
          icone="⏳"
        />
        <StatCard titre="Cette semaine" valeur={stats.cette_semaine || 0} soustitre="nouvelles candidatures" couleur="purple" icone="📅" />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <TauxReponseCard
          taux={taux.taux}
          avec_reponse={taux.avec_reponse}
          sans_reponse={taux.sans_reponse}
          total={taux.total}
        />
      </div>

      <div style={glass}>
        <h2 style={{ fontWeight: 600, marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.8rem', color: '#94a3b8' }}>
          Répartition par statut
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {statuts.map((s) => {
            const count = stats.par_statut?.[s.key] || 0;
            const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;

            return (
              <div key={s.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: s.color,
                      background: `${s.color}18`,
                      border: `1px solid ${s.color}40`,
                      padding: '0.15rem 0.6rem',
                      borderRadius: '9999px',
                    }}
                  >
                    {s.label}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {count} <span style={{ color: '#475569' }}>({pct}%)</span>
                  </span>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '9999px', height: '6px', overflow: 'hidden' }}>
                  <div
                    style={{
                      background: s.bar,
                      height: '100%',
                      width: `${pct}%`,
                      borderRadius: '9999px',
                      transition: 'width 700ms ease',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;