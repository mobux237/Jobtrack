import React, { useState } from 'react';

const REGIONS = {
  "Île-de-France": { lat: 48.8566, lon: 2.3522 },
  "Auvergne-Rhône-Alpes": { lat: 45.7640, lon: 4.8357 },
  "Provence-Alpes-Côte d'Azur": { lat: 43.2965, lon: 5.3698 },
  "Occitanie": { lat: 43.6047, lon: 1.4442 },
  "Nouvelle-Aquitaine": { lat: 44.8378, lon: -0.5792 },
  "Bretagne": { lat: 48.1173, lon: -1.6778 },
  "Normandie": { lat: 49.1829, lon: -0.3707 },
  "Hauts-de-France": { lat: 50.6292, lon: 3.0573 },
  "Grand-Est": { lat: 48.5734, lon: 7.7521 },
  "Pays-de-la-Loire": { lat: 47.2184, lon: -1.5536 },
};

const METIERS = {
  "Ressources Humaines (GRH)": "M1502",
  "QHSE / Prévention": "H1302",
  "Management / Organisation": "M1402",
  "Commerce / Vente": "D1402",
  "Comptabilité / Finance": "M1203",
  "Marketing / Communication": "M1705",
};

function Offres() {
  const [region, setRegion] = useState("Île-de-France");
  const [metier, setMetier] = useState("Ressources Humaines (GRH)");
  const [rayon, setRayon] = useState(30);
  const [recherche, setRecherche] = useState(false);

  const coords = REGIONS[region];
  const rome = METIERS[metier];

  const widgetUrl = `https://labonnealternance.apprentissage.beta.gouv.fr/recherche-emploi?radius=${rayon}&romes=${rome}&scope=all&lat=${coords.lat}&lon=${coords.lon}&caller=JobTrack`;

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">🔍 Recherche d'offres</h2>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Tes critères de recherche</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Métier</label>
            <select
              value={metier}
              onChange={e => { setMetier(e.target.value); setRecherche(false); }}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {Object.keys(METIERS).map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Région</label>
            <select
              value={region}
              onChange={e => { setRegion(e.target.value); setRecherche(false); }}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {Object.keys(REGIONS).map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rayon (km)</label>
            <select
              value={rayon}
              onChange={e => { setRayon(e.target.value); setRecherche(false); }}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value={10}>10 km</option>
              <option value={30}>30 km</option>
              <option value={60}>60 km</option>
              <option value={100}>100 km</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setRecherche(true)}
          className="mt-4 bg-blue-600 text-white rounded-lg px-6 py-2 hover:bg-blue-700 transition font-semibold"
        >
          🔍 Rechercher des offres
        </button>
      </div>

      {recherche && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-4 bg-blue-50 border-b">
            <p className="text-blue-700 font-medium">
              📍 {metier} — {region} ({rayon} km) — via La Bonne Alternance
            </p>
          </div>
          <iframe
            src={widgetUrl}
            style={{ width: '100%', height: '700px', border: 'none' }}
            title="Offres d'alternance"
          />
        </div>
      )}
    </div>
  );
}

export default Offres;