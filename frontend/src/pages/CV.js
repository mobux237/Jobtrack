import React, { useState } from 'react';
import axios from 'axios';

const glass = {
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '1.25rem',
  padding: '1.75rem',
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  color: '#f1f5f9',
};

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '0.75rem',
  color: '#f1f5f9',
  padding: '0.6rem 1rem',
  fontSize: '0.88rem',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  transition: 'border-color 200ms ease, box-shadow 200ms ease',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.72rem',
  fontWeight: 600,
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '0.35rem',
};

function CV() {
  const [form, setForm] = useState({
    prenom: 'Claude',
    nom: '',
    email: '',
    telephone: '',
    adresse: 'Elancourt, Ile-de-France',
    poste: '',
    entreprise: '',
    secteur: 'Ressources Humaines',
    formation: 'Master Gestion des Ressources Humaines',
    etablissement: 'UVSQ - Universite de Versailles Saint-Quentin-en-Yvelines',
    annee_diplome: '2026',
    formation_precedente: 'Licence 3 Administration Economique et Sociale',
    experiences: '',
    langues: 'Francais (natif), Anglais (intermediaire)',
    description_offre: '',
  });

  const [cv, setCv] = useState('');
  const [competences, setCompetences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copie, setCopie] = useState(false);
  const [onglet, setOnglet] = useState('infos');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('https://jobtrack-256h.onrender.com/cv/generer', form);
      setCv(res.data.cv);
      setCompetences(res.data.competences_detectees || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopier = () => {
    navigator.clipboard.writeText(cv);
    setCopie(true);
    setTimeout(() => setCopie(false), 2000);
  };

  const focusInput = (e) => {
    e.target.style.borderColor = '#a78bfa';
    e.target.style.boxShadow = '0 0 0 3px rgba(167,139,250,0.15)';
  };

  const blurInput = (e) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.15)';
    e.target.style.boxShadow = 'none';
  };

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
            margin: '0 0 0.4rem 0',
          }}
        >
          Générateur de CV
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
          Crée un CV adapté à l'offre d'emploi en quelques secondes
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        <form onSubmit={handleSubmit} style={{ ...glass, display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div
            style={{
              display: 'flex',
              gap: '0.4rem',
              background: 'rgba(255,255,255,0.05)',
              padding: '0.35rem',
              borderRadius: '0.75rem',
            }}
          >
            {['infos', 'offre'].map((nom) => (
              <button
                key={nom}
                type="button"
                onClick={() => setOnglet(nom)}
                style={{
                  flex: 1,
                  padding: '0.55rem',
                  borderRadius: '0.55rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  border: 'none',
                  background:
                    onglet === nom
                      ? 'linear-gradient(135deg,rgba(167,139,250,0.35),rgba(129,140,248,0.25))'
                      : 'transparent',
                  color: onglet === nom ? '#f8fafc' : '#64748b',
                  boxShadow: onglet === nom ? '0 2px 8px rgba(167,139,250,0.2)' : 'none',
                }}
              >
                {nom === 'infos' ? 'Mes informations' : "Offre d'emploi"}
              </button>
            ))}
          </div>

          {onglet === 'infos' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }}>
                <div>
                  <label style={labelStyle}>Prénom</label>
                  <input
                    required
                    value={form.prenom}
                    onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                    style={inputStyle}
                    onFocus={focusInput}
                    onBlur={blurInput}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Nom</label>
                  <input
                    required
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    style={inputStyle}
                    onFocus={focusInput}
                    onBlur={blurInput}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }}>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    required
                    type="email"
                    placeholder="ton@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={inputStyle}
                    onFocus={focusInput}
                    onBlur={blurInput}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Téléphone</label>
                  <input
                    required
                    placeholder="06 XX XX XX XX"
                    value={form.telephone}
                    onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                    style={inputStyle}
                    onFocus={focusInput}
                    onBlur={blurInput}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Poste visé</label>
                <input
                  required
                  placeholder="Ex: Chargé(e) RH Alternance"
                  value={form.poste}
                  onChange={(e) => setForm({ ...form, poste: e.target.value })}
                  style={inputStyle}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>

              <div>
                <label style={labelStyle}>Entreprise ciblée</label>
                <input
                  required
                  placeholder="Ex: Société Générale"
                  value={form.entreprise}
                  onChange={(e) => setForm({ ...form, entreprise: e.target.value })}
                  style={inputStyle}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }}>
                <div>
                  <label style={labelStyle}>Secteur</label>
                  <select
                    value={form.secteur}
                    onChange={(e) => setForm({ ...form, secteur: e.target.value })}
                    style={inputStyle}
                    onFocus={focusInput}
                    onBlur={blurInput}
                  >
                    <option>Ressources Humaines</option>
                    <option>QHSE</option>
                    <option>Management</option>
                    <option>Commerce</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Année diplôme</label>
                  <input
                    value={form.annee_diplome}
                    onChange={(e) => setForm({ ...form, annee_diplome: e.target.value })}
                    style={inputStyle}
                    onFocus={focusInput}
                    onBlur={blurInput}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>
                  Expériences professionnelles
                  <span style={{ color: '#475569', textTransform: 'none', fontWeight: 400, marginLeft: '0.4rem' }}>
                    (optionnel)
                  </span>
                </label>
                <textarea
                  placeholder="Ex: Alternance RH - Société Générale (2024)"
                  value={form.experiences}
                  onChange={(e) => setForm({ ...form, experiences: e.target.value })}
                  rows={4}
                  style={{ ...inputStyle, resize: 'none' }}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>

              <div>
                <label style={labelStyle}>Langues</label>
                <input
                  value={form.langues}
                  onChange={(e) => setForm({ ...form, langues: e.target.value })}
                  style={inputStyle}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>
            </div>
          )}

          {onglet === 'offre' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div
                style={{
                  background: 'rgba(167,139,250,0.08)',
                  border: '1px solid rgba(167,139,250,0.2)',
                  borderRadius: '0.75rem',
                  padding: '0.75rem 1rem',
                  fontSize: '0.83rem',
                  color: '#a78bfa',
                }}
              >
                💡 Astuce : Plus l'offre est détaillée, plus le CV sera personnalisé.
              </div>

              <div>
                <label style={labelStyle}>Description complète de l'offre</label>
                <textarea
                  placeholder="Copiez-collez ici l'offre d'emploi complète..."
                  value={form.description_offre}
                  onChange={(e) => setForm({ ...form, description_offre: e.target.value })}
                  rows={14}
                  style={{
                    ...inputStyle,
                    resize: 'none',
                    background: 'rgba(167,139,250,0.06)',
                    borderColor: 'rgba(167,139,250,0.25)',
                  }}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? 'rgba(167,139,250,0.3)' : 'linear-gradient(135deg,#a78bfa,#818cf8)',
              color: '#fff',
              border: 'none',
              borderRadius: '0.75rem',
              padding: '0.9rem 1.5rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(167,139,250,0.35)',
            }}
          >
            {loading ? '⏳ Génération en cours...' : '📄 Générer mon CV adapté'}
          </button>
        </form>

        <div style={{ ...glass, display: 'flex', flexDirection: 'column', minHeight: '650px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontWeight: 600, fontSize: '1rem', color: '#e2e8f0', margin: 0 }}>
              📄 Ton CV personnalisé
            </h2>

            {cv && (
              <button
                onClick={handleCopier}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '0.6rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: copie ? 'rgba(52,211,153,0.15)' : 'rgba(167,139,250,0.15)',
                  color: copie ? '#34d399' : '#a78bfa',
                  border: copie ? '1px solid rgba(52,211,153,0.3)' : '1px solid rgba(167,139,250,0.3)',
                }}
              >
                {copie ? '✅ Copié !' : '📋 Copier'}
              </button>
            )}
          </div>

          {competences.length > 0 && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '0.75rem 1rem',
                background: 'rgba(52,211,153,0.08)',
                border: '1px solid rgba(52,211,153,0.2)',
                borderRadius: '0.75rem',
              }}
            >
              <p
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#34d399',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                ✅ {competences.length} compétence(s) adaptée(s) à l'offre
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {competences.map((c, i) => (
                  <span
                    key={i}
                    style={{
                      background: 'rgba(56,189,248,0.15)',
                      color: '#38bdf8',
                      border: '1px solid rgba(56,189,248,0.25)',
                      fontSize: '0.72rem',
                      padding: '0.15rem 0.6rem',
                      borderRadius: '9999px',
                      fontWeight: 600,
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {cv ? (
            <textarea
              value={cv}
              onChange={(e) => setCv(e.target.value)}
              style={{
                flex: 1,
                minHeight: '420px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.75rem',
                padding: '1rem',
                fontSize: '0.82rem',
                color: '#e2e8f0',
                fontFamily: 'monospace',
                lineHeight: 1.75,
                resize: 'none',
                outline: 'none',
              }}
            />
          ) : (
            <div
              style={{
                flex: 1,
                minHeight: '420px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed rgba(255,255,255,0.1)',
                borderRadius: '0.75rem',
              }}
            >
              <div style={{ textAlign: 'center', color: '#475569' }}>
                <p style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📄</p>
                <p style={{ fontWeight: 600, color: '#64748b', fontSize: '0.9rem' }}>Ton CV adapté apparaîtra ici</p>
                <p style={{ fontSize: '0.78rem', marginTop: '0.3rem', color: '#475569' }}>
                  Remplis tes infos et colle l'offre
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CV;