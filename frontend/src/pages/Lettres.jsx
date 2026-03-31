import React, { useState } from 'react';
import axios from 'axios';

function Lettres() {
  const [form, setForm] = useState({
    prenom: 'Claude',
    nom: '',
    entreprise: '',
    poste: '',
    type_contrat: 'alternance',
    secteur: 'Ressources Humaines',
    motivation: '',
    description_offre: ''
  });
  const [lettre, setLettre] = useState('');
  const [tags, setTags] = useState({ competences: [], valeurs: [] });
  const [loading, setLoading] = useState(false);
  const [copie, setCopie] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/lettres/generer", form);
      setLettre(res.data.lettre);
      setTags({
        competences: res.data.competences_detectees || [],
        valeurs: res.data.valeurs_detectees || []
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

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Générateur de lettres</h2>
      <p className="text-gray-500 mb-8">Colle l'offre d'emploi pour obtenir une lettre parfaitement adaptée</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
          <h3 className="text-xl font-semibold">Tes informations</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input required value={form.prenom}
                onChange={e => setForm({...form, prenom: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input required value={form.nom}
                onChange={e => setForm({...form, nom: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise ciblée</label>
            <input required placeholder="Ex: Société Générale" value={form.entreprise}
              onChange={e => setForm({...form, entreprise: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Poste visé</label>
            <input required placeholder="Ex: Chargé RH" value={form.poste}
              onChange={e => setForm({...form, poste: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de contrat</label>
              <select value={form.type_contrat}
                onChange={e => setForm({...form, type_contrat: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="alternance">Alternance</option>
                <option value="stage">Stage</option>
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secteur</label>
              <select value={form.secteur}
                onChange={e => setForm({...form, secteur: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option>Ressources Humaines</option>
                <option>QHSE</option>
                <option>Management</option>
                <option>Commerce</option>
              </select>
            </div>
          </div>

          {/* Champ offre d'emploi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📋 Description de l'offre d'emploi
              <span className="ml-2 text-xs text-blue-500 font-normal">Colle ici le texte de l'offre</span>
            </label>
            <textarea
              placeholder="Copiez-collez ici la description complète de l'offre (missions, compétences requises, valeurs de l'entreprise...)&#10;&#10;Plus l'offre est détaillée, plus la lettre sera personnalisée ✨"
              value={form.description_offre}
              onChange={e => setForm({...form, description_offre: e.target.value})}
              rows={5}
              className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-sm bg-blue-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivation spécifique <span className="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <textarea
              placeholder="Ex: je suis particulièrement attiré(e) par votre politique RSE..."
              value={form.motivation}
              onChange={e => setForm({...form, motivation: e.target.value})}
              rows={2}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-sm"
            />
          </div>

          <button type="submit" disabled={loading}
            className="bg-blue-600 text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition font-semibold disabled:opacity-50">
            {loading ? "Génération en cours..." : "✨ Générer la lettre adaptée"}
          </button>
        </form>

        {/* Résultat */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Ta lettre de motivation</h3>
            {lettre && (
              <button onClick={handleCopier}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  copie ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}>
                {copie ? '✅ Copié !' : '📋 Copier'}
              </button>
            )}
          </div>

          {/* Tags détectés */}
          {(tags.competences.length > 0 || tags.valeurs.length > 0) && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs font-semibold text-green-700 mb-2">✅ Éléments détectés dans l'offre :</p>
              <div className="flex flex-wrap gap-2">
                {tags.competences.map((c, i) => (
                  <span key={i} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{c}</span>
                ))}
                {tags.valeurs.map((v, i) => (
                  <span key={i} className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">{v}</span>
                ))}
              </div>
            </div>
          )}

          {lettre ? (
            <textarea
              value={lettre}
              onChange={e => setLettre(e.target.value)}
              className="flex-1 min-h-96 border rounded-lg p-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none font-mono leading-relaxed"
            />
          ) : (
            <div className="flex-1 min-h-96 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
              <div className="text-center">
                <p className="text-4xl mb-3">✉️</p>
                <p className="font-medium">Ta lettre adaptée apparaîtra ici</p>
                <p className="text-sm mt-1">Colle une offre d'emploi pour une lettre personnalisée</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Lettres;