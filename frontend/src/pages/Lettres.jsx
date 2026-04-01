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
  padding: '0.65rem 1rem',
  fontSize: '0.9rem',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  transition: 'border-color 200ms ease, box-shadow 200ms ease',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '0.4rem',
};

function Lettres() {
  const [form, setForm] = useState({
    prenom: 'Claude',
    nom: '',
    entreprise: '',
    poste: '',
    type_contrat: 'alternance',
    secteur: 'Ressources Humaines',
    motivation: '',
    description_offre: '',
  });

  const [lettre, setLettre] = useState('');
  const [tags, setTags] = useState({ competences: [], valeurs: [] });
  const [loading, setLoading] = useState(false);
  const [copie, setCopie] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('https://jobtrack-256h.onrender.com/lettres/generer', form);
      setLettre(res.data.lettre);
      setTags({
        competences: res.data.competences_detectees || [],
        valeurs: res.data.valeurs_detectees || [],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopier = () => {
    navigator.clipboard.writeText(lettre);
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
          Générateur de lettres
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
          Colle l'offre d'emploi pour obtenir une lettre parfaitement adaptée
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
          <h2 style={{ fontWeight: 600, fontSize: '1rem', color: '#e2e8f0', margin: 0 }}>Tes informations</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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

          <div>
            <label style={labelStyle}>Poste visé</label>
            <input
              required
              placeholder="Ex: Chargé RH"
              value={form.poste}
              onChange={(e) => setForm({ ...form, poste: e.target.value })}
              style={inputStyle}
              onFocus={focusInput}
              onBlur={blurInput}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Type de contrat</label>
              <select
                value={form.type_contrat}
                onChange={(e) => setForm({ ...form, type_contrat: e.target.value })}
                style={inputStyle}
                onFocus={focusInput}
                onBlur={blurInput}
              >
                <option value="alternance">Alternance</option>
                <option value="stage">Stage</option>
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
              </select>
            </div>

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
          </div>

          <div>
            <label style={labelStyle}>
              📋 Description de l'offre d'emploi
              <span
                style={{
                  marginLeft: '0.5rem',
                  fontSize: '0.7rem',
                  color: '#a78bfa',
                  textTransform: 'none',
                  letterSpacing: 0,
                  fontWeight: 400,
                }}
              >
                Colle ici le texte de l'offre
              </span>
            </label>

            <textarea
              placeholder={"Copiez-collez ici la description complète de l'offre...\n\nPlus l'offre est détaillée, plus la lettre sera personnalisée ✨"}
              value={form.description_offre}
              onChange={(e) => setForm({ ...form, description_offre: e.target.value })}
              rows={6}
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

          <div>
            <label style={labelStyle}>
              Motivation spécifique <span style={{ color: '#475569', textTransform: 'none', fontWeight: 400 }}>(optionnel)</span>
            </label>
            <textarea
              placeholder="Ex: je suis particulièrement attiré(e) par votre politique RSE..."
              value={form.motivation}
              onChange={(e) => setForm({ ...form, motivation: e.target.value })}
              rows={3}
              style={{ ...inputStyle, resize: 'none' }}
              onFocus={focusInput}
              onBlur={blurInput}
            />
          </div>

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
            {loading ? '⏳ Génération en cours...' : '✨ Générer la lettre adaptée'}
          </button>
        </form>

        <div style={{ ...glass, display: 'flex', flexDirection: 'column', minHeight: '650px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontWeight: 600, fontSize: '1rem', color: '#e2e8f0', margin: 0 }}>Ta lettre de motivation</h2>
            {lettre && (
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

          {(tags.competences.length > 0 || tags.valeurs.length > 0) && (
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
                ✅ Éléments détectés dans l'offre
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {tags.competences.map((c, i) => (
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

                {tags.valeurs.map((v, i) => (
                  <span
                    key={i}
                    style={{
                      background: 'rgba(167,139,250,0.15)',
                      color: '#a78bfa',
                      border: '1px solid rgba(167,139,250,0.25)',
                      fontSize: '0.72rem',
                      padding: '0.15rem 0.6rem',
                      borderRadius: '9999px',
                      fontWeight: 600,
                    }}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          )}

          {lettre ? (
            <textarea
              value={lettre}
              onChange={(e) => setLettre(e.target.value)}
              style={{
                flex: 1,
                minHeight: '420px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.75rem',
                padding: '1rem',
                fontSize: '0.92rem',
                color: '#e2e8f0',
                fontFamily: 'Georgia, serif',
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
                <p style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>✉️</p>
                <p style={{ fontWeight: 600, color: '#64748b', fontSize: '0.9rem' }}>Ta lettre adaptée apparaîtra ici</p>
                <p style={{ fontSize: '0.78rem', marginTop: '0.3rem', color: '#475569' }}>
                  Colle une offre d'emploi pour une lettre personnalisée
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Lettres;