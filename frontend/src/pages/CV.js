import React, { useState, useRef } from 'react';
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
  fontSize: '0.72rem',
  fontWeight: 600,
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '0.4rem',
};

function CV() {
  const [mode, setMode] = useState('upload');
  const [fichier, setFichier] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [offre, setOffre] = useState('');
  const [cv, setCv] = useState('');
  const [competences, setCompetences] = useState([]);
  const [ameliorations, setAmeliorations] = useState([]);
  const [scoreAts, setScoreAts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copie, setCopie] = useState(false);
  const [erreur, setErreur] = useState('');
  const fileInputRef = useRef();

  const [form, setForm] = useState({
    prenom: 'Claude', nom: '', email: '', telephone: '',
    poste: '', entreprise: '', secteur: 'Ressources Humaines',
    annee_diplome: '2026', experiences: '',
    langues: 'Francais (natif), Anglais (intermediaire)',
    description_offre: '',
  });
  const [onglet, setOnglet] = useState('infos');

  const focusInput = (e) => { e.target.style.borderColor = '#a78bfa'; e.target.style.boxShadow = '0 0 0 3px rgba(167,139,250,0.15)'; };
  const blurInput  = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.boxShadow = 'none'; };

  const handleFile = (f) => {
    if (!f) return;
    if (!f.name.toLowerCase().endsWith('.pdf') && !f.name.toLowerCase().endsWith('.docx')) {
      setErreur('Format non supporté. Utilise un PDF ou un DOCX.'); return;
    }
    setErreur(''); setFichier(f);
  };

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); };

  const handleSubmitUpload = async (e) => {
    e.preventDefault();
    if (!fichier || !offre.trim()) { setErreur("Importe ton CV et colle l'offre d'emploi."); return; }
    setLoading(true); setErreur('');
    try {
      const formData = new FormData();
      formData.append('file', fichier);
      formData.append('description_offre', offre);
      const res = await axios.post('https://jobtrack-256h.onrender.com/cv/upload-ats', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCv(res.data.cv);
      setCompetences(res.data.competences_matchees || []);
      setAmeliorations(res.data.ameliorations || []);
      setScoreAts(res.data.score_ats || null);
    } catch (err) {
      setErreur('Erreur lors de la génération. Vérifie que le backend est actif.');
    } finally { setLoading(false); }
  };

  const handleSubmitManuel = async (e) => {
    e.preventDefault(); setLoading(true); setErreur('');
    try {
      const res = await axios.post('https://jobtrack-256h.onrender.com/cv/generer', form);
      setCv(res.data.cv); setCompetences(res.data.competences_detectees || []);
    } catch (err) { setErreur('Erreur lors de la génération.'); }
    finally { setLoading(false); }
  };

  const handleCopier = () => { navigator.clipboard.writeText(cv); setCopie(true); setTimeout(() => setCopie(false), 2000); };
  const scoreColor = scoreAts >= 80 ? '#34d399' : scoreAts >= 60 ? '#fbbf24' : '#f87171';

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>

      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(1.5rem,3vw,2.25rem)', fontWeight:700, background:'linear-gradient(135deg,#fff,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', margin:'0 0 0.4rem 0' }}>
          Générateur de CV ATS
        </h1>
        <p style={{ color:'#64748b', fontSize:'0.9rem', margin:0 }}>
          Importe ton CV et colle l'offre — l'IA l'adapte et l'optimise pour passer les filtres ATS
        </p>
      </div>

      {/* Toggle upload / manuel */}
      <div style={{ display:'flex', gap:'0.4rem', background:'rgba(255,255,255,0.05)', padding:'0.35rem', borderRadius:'0.75rem', marginBottom:'1.5rem', maxWidth:'420px' }}>
        {[['upload','📤 Importer mon CV'],['manuel','✏️ Saisir manuellement']].map(([val,label]) => (
          <button key={val} type="button" onClick={() => { setMode(val); setCv(''); setCompetences([]); setScoreAts(null); }}
            style={{ flex:1, padding:'0.55rem', borderRadius:'0.55rem', fontSize:'0.85rem', fontWeight:600, fontFamily:'Inter,sans-serif', cursor:'pointer', transition:'all 200ms ease', border:'none',
              background: mode===val ? 'linear-gradient(135deg,rgba(167,139,250,0.35),rgba(129,140,248,0.25))' : 'transparent',
              color: mode===val ? '#f8fafc' : '#64748b', boxShadow: mode===val ? '0 2px 8px rgba(167,139,250,0.2)' : 'none',
            }}>{label}</button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(420px,1fr))', gap:'1.5rem', alignItems:'start' }}>

        {/* MODE UPLOAD */}
        {mode === 'upload' && (
          <form onSubmit={handleSubmitUpload} style={{ ...glass, display:'flex', flexDirection:'column', gap:'1.25rem' }}>
            <div>
              <label style={labelStyle}>📄 Ton CV actuel (PDF ou DOCX)</label>
              <div
                onClick={() => fileInputRef.current.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                style={{ border:`2px dashed ${dragOver ? '#a78bfa' : fichier ? 'rgba(52,211,153,0.5)' : 'rgba(167,139,250,0.3)'}`, borderRadius:'1rem', padding:'2rem 1rem', textAlign:'center', cursor:'pointer',
                  background: dragOver ? 'rgba(167,139,250,0.08)' : fichier ? 'rgba(52,211,153,0.05)' : 'rgba(255,255,255,0.03)', transition:'all 200ms ease' }}
              >
                <input ref={fileInputRef} type="file" accept=".pdf,.docx" style={{ display:'none' }} onChange={e => handleFile(e.target.files[0])} />
                {fichier ? (
                  <div>
                    <p style={{ fontSize:'2rem', marginBottom:'0.5rem' }}>✅</p>
                    <p style={{ color:'#34d399', fontWeight:600, fontSize:'0.9rem' }}>{fichier.name}</p>
                    <p style={{ color:'#475569', fontSize:'0.75rem', marginTop:'0.25rem' }}>Clique pour changer de fichier</p>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize:'2.5rem', marginBottom:'0.5rem' }}>📂</p>
                    <p style={{ color:'#94a3b8', fontWeight:600, fontSize:'0.9rem' }}>Glisse ton CV ici ou clique pour importer</p>
                    <p style={{ color:'#475569', fontSize:'0.75rem', marginTop:'0.3rem' }}>PDF ou DOCX — max 5 MB</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label style={labelStyle}>📋 Offre d'emploi ciblée
                <span style={{ marginLeft:'0.5rem', color:'#a78bfa', textTransform:'none', letterSpacing:0, fontWeight:400, fontSize:'0.7rem' }}>Colle le texte complet</span>
              </label>
              <textarea required placeholder={"Copiez-collez ici l'offre d'emploi complète...\n\nPlus c'est détaillé, mieux le CV sera optimisé ✨"}
                value={offre} onChange={e => setOffre(e.target.value)} rows={10}
                style={{ ...inputStyle, resize:'none', background:'rgba(167,139,250,0.06)', borderColor:'rgba(167,139,250,0.25)' }}
                onFocus={focusInput} onBlur={blurInput} />
            </div>

            {erreur && <p style={{ color:'#f87171', fontSize:'0.83rem', background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:'0.6rem', padding:'0.6rem 0.9rem' }}>{erreur}</p>}

            <button type="submit" disabled={loading} style={{
              background: loading ? 'rgba(167,139,250,0.3)' : 'linear-gradient(135deg,#a78bfa,#818cf8)',
              color:'#fff', border:'none', borderRadius:'0.75rem', padding:'0.9rem 1.5rem',
              fontSize:'0.95rem', fontWeight:600, cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(167,139,250,0.35)', fontFamily:'Inter,sans-serif',
            }}>
              {loading ? '⏳ Optimisation ATS en cours...' : '🚀 Générer mon CV ATS adapté'}
            </button>
          </form>
        )}

        {/* MODE MANUEL */}
        {mode === 'manuel' && (
          <form onSubmit={handleSubmitManuel} style={{ ...glass, display:'flex', flexDirection:'column', gap:'1.1rem' }}>
            <div style={{ display:'flex', gap:'0.4rem', background:'rgba(255,255,255,0.05)', padding:'0.35rem', borderRadius:'0.75rem' }}>
              {['infos','offre'].map(nom => (
                <button key={nom} type="button" onClick={() => setOnglet(nom)}
                  style={{ flex:1, padding:'0.5rem', borderRadius:'0.55rem', fontSize:'0.85rem', fontWeight:600, fontFamily:'Inter,sans-serif', cursor:'pointer', transition:'all 200ms ease', border:'none',
                    background: onglet===nom ? 'linear-gradient(135deg,rgba(167,139,250,0.35),rgba(129,140,248,0.25))' : 'transparent',
                    color: onglet===nom ? '#f8fafc' : '#64748b',
                  }}>{nom === 'infos' ? 'Mes informations' : "Offre d'emploi"}</button>
              ))}
            </div>

            {onglet === 'infos' && (
              <div style={{ display:'flex', flexDirection:'column', gap:'0.9rem' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.9rem' }}>
                  <div><label style={labelStyle}>Prénom</label><input required value={form.prenom} onChange={e => setForm({...form,prenom:e.target.value})} style={inputStyle} onFocus={focusInput} onBlur={blurInput}/></div>
                  <div><label style={labelStyle}>Nom</label><input required value={form.nom} onChange={e => setForm({...form,nom:e.target.value})} style={inputStyle} onFocus={focusInput} onBlur={blurInput}/></div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.9rem' }}>
                  <div><label style={labelStyle}>Email</label><input required type="email" placeholder="ton@email.com" value={form.email} onChange={e => setForm({...form,email:e.target.value})} style={inputStyle} onFocus={focusInput} onBlur={blurInput}/></div>
                  <div><label style={labelStyle}>Téléphone</label><input required placeholder="06 XX XX XX XX" value={form.telephone} onChange={e => setForm({...form,telephone:e.target.value})} style={inputStyle} onFocus={focusInput} onBlur={blurInput}/></div>
                </div>
                <div><label style={labelStyle}>Poste visé</label><input required placeholder="Ex: Chargé(e) RH Alternance" value={form.poste} onChange={e => setForm({...form,poste:e.target.value})} style={inputStyle} onFocus={focusInput} onBlur={blurInput}/></div>
                <div><label style={labelStyle}>Entreprise ciblée</label><input required placeholder="Ex: Société Générale" value={form.entreprise} onChange={e => setForm({...form,entreprise:e.target.value})} style={inputStyle} onFocus={focusInput} onBlur={blurInput}/></div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.9rem' }}>
                  <div><label style={labelStyle}>Secteur</label>
                    <select value={form.secteur} onChange={e => setForm({...form,secteur:e.target.value})} style={inputStyle} onFocus={focusInput} onBlur={blurInput}>
                      <option>Ressources Humaines</option><option>QHSE</option><option>Management</option><option>Commerce</option>
                    </select>
                  </div>
                  <div><label style={labelStyle}>Année diplôme</label><input value={form.annee_diplome} onChange={e => setForm({...form,annee_diplome:e.target.value})} style={inputStyle} onFocus={focusInput} onBlur={blurInput}/></div>
                </div>
                <div><label style={labelStyle}>Expériences <span style={{ color:'#475569', textTransform:'none', fontWeight:400 }}>(optionnel)</span></label>
                  <textarea placeholder="Ex: Alternance RH - Société Générale (2024)" value={form.experiences} onChange={e => setForm({...form,experiences:e.target.value})} rows={3} style={{ ...inputStyle, resize:'none' }} onFocus={focusInput} onBlur={blurInput}/>
                </div>
                <div><label style={labelStyle}>Langues</label><input value={form.langues} onChange={e => setForm({...form,langues:e.target.value})} style={inputStyle} onFocus={focusInput} onBlur={blurInput}/></div>
              </div>
            )}

            {onglet === 'offre' && (
              <div style={{ display:'flex', flexDirection:'column', gap:'0.9rem' }}>
                <div style={{ background:'rgba(167,139,250,0.08)', border:'1px solid rgba(167,139,250,0.2)', borderRadius:'0.75rem', padding:'0.75rem 1rem', fontSize:'0.83rem', color:'#a78bfa' }}>
                  💡 Plus l'offre est détaillée, plus le CV sera personnalisé.
                </div>
                <div><label style={labelStyle}>Description complète de l'offre</label>
                  <textarea placeholder="Copiez-collez ici l'offre d'emploi complète..." value={form.description_offre} onChange={e => setForm({...form,description_offre:e.target.value})} rows={14}
                    style={{ ...inputStyle, resize:'none', background:'rgba(167,139,250,0.06)', borderColor:'rgba(167,139,250,0.25)' }} onFocus={focusInput} onBlur={blurInput}/>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              background: loading ? 'rgba(167,139,250,0.3)' : 'linear-gradient(135deg,#a78bfa,#818cf8)',
              color:'#fff', border:'none', borderRadius:'0.75rem', padding:'0.9rem 1.5rem',
              fontSize:'0.95rem', fontWeight:600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily:'Inter,sans-serif',
            }}>
              {loading ? '⏳ Génération en cours...' : '📄 Générer mon CV adapté'}
            </button>
          </form>
        )}

        {/* RÉSULTAT */}
        <div style={{ ...glass, display:'flex', flexDirection:'column', minHeight:'650px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
            <h2 style={{ fontWeight:600, fontSize:'1rem', color:'#e2e8f0', margin:0 }}>📄 Ton CV ATS optimisé</h2>
            {cv && (
              <button onClick={handleCopier} style={{
                padding:'0.45rem 1rem', borderRadius:'0.6rem', fontSize:'0.82rem', fontWeight:600, cursor:'pointer', fontFamily:'Inter,sans-serif',
                background: copie ? 'rgba(52,211,153,0.15)' : 'rgba(167,139,250,0.15)',
                color: copie ? '#34d399' : '#a78bfa',
                border: copie ? '1px solid rgba(52,211,153,0.3)' : '1px solid rgba(167,139,250,0.3)',
              }}>
                {copie ? '✅ Copié !' : '📋 Copier'}
              </button>
            )}
          </div>

          {scoreAts !== null && (
            <div style={{ marginBottom:'1rem', padding:'1rem', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'0.75rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.5rem' }}>
                <span style={{ fontSize:'0.75rem', fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em' }}>Score ATS estimé</span>
                <span style={{ fontSize:'1.5rem', fontWeight:800, color:scoreColor }}>{scoreAts}/100</span>
              </div>
              <div style={{ background:'rgba(255,255,255,0.06)', borderRadius:'9999px', height:'8px', overflow:'hidden' }}>
                <div style={{ background:`linear-gradient(90deg,${scoreColor},${scoreColor}99)`, height:'100%', width:`${scoreAts}%`, borderRadius:'9999px', transition:'width 700ms ease' }}/>
              </div>
            </div>
          )}

          {competences.length > 0 && (
            <div style={{ marginBottom:'1rem', padding:'0.75rem 1rem', background:'rgba(52,211,153,0.08)', border:'1px solid rgba(52,211,153,0.2)', borderRadius:'0.75rem' }}>
              <p style={{ fontSize:'0.72rem', fontWeight:700, color:'#34d399', marginBottom:'0.5rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>✅ {competences.length} mots-clés ATS intégrés</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
                {competences.map((c,i) => (
                  <span key={i} style={{ background:'rgba(56,189,248,0.15)', color:'#38bdf8', border:'1px solid rgba(56,189,248,0.25)', fontSize:'0.72rem', padding:'0.15rem 0.6rem', borderRadius:'9999px', fontWeight:600 }}>{c}</span>
                ))}
              </div>
            </div>
          )}

          {ameliorations.length > 0 && (
            <div style={{ marginBottom:'1rem', padding:'0.75rem 1rem', background:'rgba(251,191,36,0.06)', border:'1px solid rgba(251,191,36,0.18)', borderRadius:'0.75rem' }}>
              <p style={{ fontSize:'0.72rem', fontWeight:700, color:'#fbbf24', marginBottom:'0.5rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>💡 Améliorations apportées</p>
              <ul style={{ listStyle:'none', margin:0, padding:0, display:'flex', flexDirection:'column', gap:'0.3rem' }}>
                {ameliorations.map((a,i) => (<li key={i} style={{ fontSize:'0.78rem', color:'#94a3b8' }}>• {a}</li>))}
              </ul>
            </div>
          )}

          {cv ? (
            <textarea value={cv} onChange={e => setCv(e.target.value)}
              style={{ flex:1, minHeight:'350px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'0.75rem', padding:'1rem', fontSize:'0.83rem', color:'#e2e8f0', fontFamily:'monospace', lineHeight:1.75, resize:'none', outline:'none' }}/>
          ) : (
            <div style={{ flex:1, minHeight:'350px', display:'flex', alignItems:'center', justifyContent:'center', border:'2px dashed rgba(255,255,255,0.1)', borderRadius:'0.75rem' }}>
              <div style={{ textAlign:'center', color:'#475569' }}>
                <p style={{ fontSize:'3rem', marginBottom:'0.75rem' }}>🚀</p>
                <p style={{ fontWeight:600, color:'#64748b', fontSize:'0.9rem' }}>Ton CV ATS optimisé apparaîtra ici</p>
                <p style={{ fontSize:'0.78rem', marginTop:'0.3rem', color:'#475569' }}>Importe ton CV et colle l'offre pour commencer</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CV;