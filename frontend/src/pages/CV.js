import React, { useState } from 'react';
import axios from 'axios';

function CV() {
  const [form, setForm] = useState({
    prenom: 'Claude',
    nom: '',
    email: '',
    telephone: '',
    adresse: 'Élancourt, Île-de-France',
    poste: '',
    entreprise: '',
    secteur: 'Ressources Humaines',
    formation: 'Master Gestion des Ressources Humaines',
    etablissement: 'UVSQ – Université de Versailles Saint-Quentin-en-Yvelines',
    annee_diplome: '2026',
    formation_precedente: 'Licence 3 Administration Économique et Sociale',
    experiences: '',
    langues: 'Français (natif), Anglais (intermédiaire)',
    description_offre: ''
  });

  const [cv, setCv] = useState('');
  const [competences, setCompetences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copie, setCopie] = useState(false);
  const [onglet, setOnglet] = useState('infos'); // 'infos' | 'offre'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/cv/generer", form);
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

  const inputClass = "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Générateur de CV</h2>
      <p className="text-gray-500 mb-6">Crée un CV adapté à l'offre d'emploi en quelques secondes</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Formulaire avec onglets */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">

          {/* Onglets */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button type="button"
              onClick={() => setOnglet('infos')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                onglet === 'infos'
                  ? 'bg-white text-indigo-700 shadow'
                  : 'text-gray-500 hover:text-gray-700'
              }`}>
              👤 Mes informations
            </button>
            <button type="button"
              onClick={() => setOnglet('offre')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                onglet === 'offre'
                  ? 'bg-white text-indigo-700 shadow'
                  : 'text-gray-500 hover:text-gray-700'
              }`}>
              📋 Offre d'emploi
            </button>
          </div>

          {/* Onglet Infos */}
          {onglet === 'infos' && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Prénom</label>
                  <input required value={form.prenom}
                    onChange={e => setForm({...form, prenom: e.target.value})}
                    className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Nom</label>
                  <input required value={form.nom}
                    onChange={e => setForm({...form, nom: e.target.value})}
                    className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                  <input required type="email" value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    placeholder="ton@email.com"
                    className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Téléphone</label>
                  <input required value={form.telephone}
                    onChange={e => setForm({...form, telephone: e.target.value})}
                    placeholder="06 XX XX XX XX"
                    className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Poste visé</label>
                <input required placeholder="Ex: Chargé(e) RH Alternance" value={form.poste}
                  onChange={e => setForm({...form, poste: e.target.value})}
                  className={inputClass} />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Entreprise ciblée</label>
                <input required placeholder="Ex: Société Générale" value={form.entreprise}
                  onChange={e => setForm({...form, entreprise: e.target.value})}
                  className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Secteur</label>
                  <select value={form.secteur}
                    onChange={e => setForm({...form, secteur: e.target.value})}
                    className={inputClass}>
                    <option>Ressources Humaines</option>
                    <option>QHSE</option>
                    <option>Management</option>
                    <option>Commerce</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Année diplôme</label>
                  <input value={form.annee_diplome}
                    onChange={e => setForm({...form, annee_diplome: e.target.value})}
                    className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Expériences professionnelles
                  <span className="text-gray-400 font-normal ml-1">(optionnel — généré automatiquement si vide)</span>
                </label>
                <textarea
                  placeholder={"Ex:\n• Alternance RH – Société Générale (2024)\n  - Suivi des recrutements\n  - Gestion administrative des contrats"}
                  value={form.experiences}
                  onChange={e => setForm({...form, experiences: e.target.value})}
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Langues</label>
                <input value={form.langues}
                  onChange={e => setForm({...form, langues: e.target.value})}
                  className={inputClass} />
              </div>
            </div>
          )}

          {/* Onglet Offre */}
          {onglet === 'offre' && (
            <div className="flex flex-col gap-3">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-sm text-indigo-700">
                💡 <strong>Astuce :</strong> Plus l'offre est détaillée, plus le CV sera personnalisé.
                Colle le texte complet de l'offre (missions, compétences, profil recherché).
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  📋 Description complète de l'offre d'emploi
                </label>
                <textarea
                  placeholder={"Copiez-collez ici l'offre d'emploi complète...\n\nExemple :\nMissions :\n- Participer au recrutement et à l'onboarding\n- Gérer les dossiers du personnel\n- Contribuer au reporting RH\n\nProfil :\n- Étudiant(e) en Master RH\n- Maîtrise d'Excel et SIRH\n- Connaissance du droit du travail"}
                  value={form.description_offre}
                  onChange={e => setForm({...form, description_offre: e.target.value})}
                  rows={12}
                  className={`${inputClass} resize-none bg-white border-2 border-indigo-200`}
                />
              </div>
              <p className="text-xs text-gray-400">
                Les compétences mentionnées dans l'offre seront automatiquement mises en avant dans ton CV ✨
              </p>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="bg-indigo-600 text-white rounded-lg px-6 py-3 hover:bg-indigo-700 transition font-semibold disabled:opacity-50 mt-2">
            {loading ? "Génération en cours..." : "✨ Générer mon CV adapté"}
          </button>
        </form>

        {/* Résultat */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Ton CV personnalisé</h3>
            {cv && (
              <button onClick={handleCopier}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  copie ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                }`}>
                {copie ? '✅ Copié !' : '📋 Copier'}
              </button>
            )}
          </div>

          {/* Compétences détectées */}
          {competences.length > 0 && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs font-semibold text-green-700 mb-2">
                ✅ {competences.length} compétence(s) adaptée(s) à l'offre :
              </p>
              <div className="flex flex-wrap gap-2">
                {competences.map((c, i) => (
                  <span key={i} className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {cv ? (
            <textarea
              value={cv}
              onChange={e => setCv(e.target.value)}
              className="flex-1 min-h-96 border rounded-lg p-4 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none font-mono leading-relaxed"
            />
          ) : (
            <div className="flex-1 min-h-96 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
              <div className="text-center">
                <p className="text-4xl mb-3">📄</p>
                <p className="font-medium">Ton CV adapté apparaîtra ici</p>
                <p className="text-sm mt-1">Remplis tes infos + colle l'offre pour un CV sur-mesure</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CV;