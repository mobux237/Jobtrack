import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = "https://jobtrack-256h.onrender.com/candidatures";

const statutColor = (statut) => {
  const colors = {
    'Envoyée': 'bg-blue-100 text-blue-800',
    'En attente': 'bg-yellow-100 text-yellow-800',
    'Entretien': 'bg-green-100 text-green-800',
    'Refus': 'bg-red-100 text-red-800'
  };
  return colors[statut] || 'bg-gray-100 text-gray-800';
};

function Candidatures() {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    entreprise: '', poste: '', type_contrat: 'Alternance', statut: 'Envoyée', date: '', notes: ''
  });

  useEffect(() => {
    fetchCandidatures();
  }, []);

  const fetchCandidatures = async () => {
    try {
      const res = await axios.get(API);
      setCandidatures(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API + "/", form);
      setForm({ entreprise: '', poste: '', type_contrat: 'Alternance', statut: 'Envoyée', date: '', notes: '' });
      fetchCandidatures();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette candidature ?")) return;
    await axios.delete(`${API}/${id}`);
    fetchCandidatures();
  };

  const handleStatut = async (id, statut) => {
    await axios.put(`${API}/${id}`, { statut });
    fetchCandidatures();
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Mes Candidatures</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Ajouter une candidature</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input required placeholder="Entreprise" value={form.entreprise}
            onChange={e => setForm({...form, entreprise: e.target.value})}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <input required placeholder="Poste visé" value={form.poste}
            onChange={e => setForm({...form, poste: e.target.value})}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <input type="date" required value={form.date}
            onChange={e => setForm({...form, date: e.target.value})}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <select value={form.type_contrat} onChange={e => setForm({...form, type_contrat: e.target.value})}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option>Alternance</option>
            <option>Stage</option>
            <option>CDI</option>
            <option>CDD</option>
          </select>
          <select value={form.statut} onChange={e => setForm({...form, statut: e.target.value})}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option>Envoyée</option>
            <option>En attente</option>
            <option>Entretien</option>
            <option>Refus</option>
          </select>
          <input placeholder="Notes (optionnel)" value={form.notes}
            onChange={e => setForm({...form, notes: e.target.value})}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <button type="submit"
          className="mt-4 bg-blue-600 text-white rounded-lg px-6 py-2 hover:bg-blue-700 transition font-semibold">
          Ajouter
        </button>
      </form>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <p className="text-center py-8 text-gray-400">Chargement...</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-600">Entreprise</th>
                <th className="px-6 py-3 text-left text-gray-600">Poste</th>
                <th className="px-6 py-3 text-left text-gray-600">Type</th>
                <th className="px-6 py-3 text-left text-gray-600">Date</th>
                <th className="px-6 py-3 text-left text-gray-600">Statut</th>
                <th className="px-6 py-3 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidatures.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                  Aucune candidature pour l'instant
                </td></tr>
              ) : (
                candidatures.map(c => (
                  <tr key={c.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold">{c.entreprise}</td>
                    <td className="px-6 py-4">{c.poste}</td>
                    <td className="px-6 py-4">{c.type_contrat}</td>
                    <td className="px-6 py-4">{c.date}</td>
                    <td className="px-6 py-4">
                      <select
                        value={c.statut}
                        onChange={e => handleStatut(c.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-sm font-medium border-0 cursor-pointer ${statutColor(c.statut)}`}
                      >
                        <option>Envoyée</option>
                        <option>En attente</option>
                        <option>Entretien</option>
                        <option>Refus</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDelete(c.id)}
                        className="text-red-500 hover:text-red-700 font-medium transition">
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Candidatures;