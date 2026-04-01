import React, { useState } from 'react';
import axios from 'axios';

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
    description_offre: ''
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
      const res = await axios.post("http://localhost:8000/cv/generer", form);
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

  const btnOnglet = (nom) => {
    if (onglet === nom) {
      return "flex-1 py-2 rounded-md text-sm font-medium transition bg-white text-indigo-700 shadow";
    }
    return "flex-1 py-2 rounded-md text-sm font-medium transition text-gray-500 hover:text-gray-700";
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Generateur de CV</h2>
      <p className="text-gray-500 mb-6">Cree un CV adapte a l offre d emploi en quelques secondes</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">

          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button type="button" onClick={() => setOnglet('infos')} className={btnOnglet('infos')}>
              Mes informations
            </button>
            <button type="button" onClick={() => setOnglet('offre')} className={btnOnglet('offre')}>
              Offre d emploi
            </button>
          </div>

          {onglet === 'infos' && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Prenom</label>
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
                  <label className="block text-xs font-medium text-gray-600 mb-1">Telephone</label>
                  <input required value={form.telephone}
                    onChange={e => setForm({...form, telephone: e.target.value})}
                    placeholder="06 XX XX XX XX"
                    className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Poste vise</label>
                <input required placeholder="Ex: Charge(e) RH Alternance" value={form.poste}
                  onChange={e => setForm({...form, poste: e.target.value})}
                  className={inputClass} />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Entreprise ciblee</label>
                <input required placeholder="Ex: Societe Generale" value={form.entreprise}
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
                  <label className="block text-xs font-medium text-gray-600 mb-1">Annee diplome</label>
                  <input value={form.annee_diplome}
                    onChange={e => setForm({...form, annee_diplome: e.target.value})}
                    className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Experiences professionnelles
                  <span className="text-gray-400 font-normal ml-1">(optionnel)</span>
                </label>
                <textarea
                  placeholder="Ex: Alternance RH - Societe Generale (2024)"
                  value={form.experiences}
                  onChange={e => setForm({...form, experiences: e.target.value})}
                  rows={4}
                  className={inputClass + " resize-none"}
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

          {onglet === 'offre' && (
            <div className="flex flex-col gap-3">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-sm text-indigo-700">
                Astuce : Plus l offre est detaillee, plus le CV sera personnalise.
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Description complete de l offre
                </label>
                <textarea
                  placeholder="Copiez-collez ici l offre d emploi complete..."
                  value={form.description_offre}
                  onChange={e => setForm({...form, description_offre: e.target.value})}
                  rows={12}
                  className={inputClass + " resize-none bg-white border-2 border-indigo-200"}
                />
              </div>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="bg-indigo-600 text-white rounded-lg px-6 py-3 hover:bg-indigo-700 transition font-semibold disabled:opacity-50 mt-2">
            {loading ? "Generation en cours..." : "Generer mon CV adapte"}
          </button>
        </form>

        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Ton CV personnalise</h3>
            {cv && (
              <button onClick={handleCopier}
                className={copie
                  ? "px-4 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-700"
                  : "px-4 py-2 rounded-lg text-sm font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                }>
                {copie ? 'Copie !' : 'Copier'}
              </button>
            )}
          </div>

          {competences.length > 0 && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs font-semibold text-green-700 mb-2">
                {competences.length} competence(s) adaptee(s) a l offre :
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
                <p className="font-medium">Ton CV adapte apparaitra ici</p>
                <p className="text-sm mt-1">Remplis tes infos et colle l offre</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CV;