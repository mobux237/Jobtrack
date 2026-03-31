import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StatCard({ titre, valeur, soustitre, couleur, icone, extra }) {
  return (
    <div className={`bg-white rounded-xl shadow p-6 border-l-4 ${couleur}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 font-medium">{titre}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{valeur}</p>
          {soustitre && <p className="text-xs text-gray-400 mt-1">{soustitre}</p>}
          {extra}
        </div>
        <span className="text-3xl">{icone}</span>
      </div>
    </div>
  );
}

function TauxReponseCard({ taux, avec_reponse, sans_reponse, total }) {
  const couleur =
    taux >= 50 ? 'text-green-600' :
    taux >= 25 ? 'text-yellow-500' :
    'text-red-500';

  const bgBarre =
    taux >= 50 ? 'bg-green-500' :
    taux >= 25 ? 'bg-yellow-400' :
    'bg-red-400';

  return (
    <div className="bg-white rounded-xl shadow p-6 border-l-4 border-indigo-500">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-sm text-gray-500 font-medium">Taux de réponse</p>
          <p className={`text-3xl font-bold mt-1 ${couleur}`}>{taux}%</p>
          <p className="text-xs text-gray-400 mt-1">
            {avec_reponse} réponse{avec_reponse > 1 ? 's' : ''} sur {total} candidature{total > 1 ? 's' : ''}
          </p>
        </div>
        <span className="text-3xl">📬</span>
      </div>

      {/* Barre de progression */}
      <div className="w-full bg-gray-100 rounded-full h-3 mt-2">
        <div
          className={`${bgBarre} h-3 rounded-full transition-all duration-700`}
          style={{ width: `${taux}%` }}
        />
      </div>

      {/* Détail */}
      <div className="flex justify-between mt-3 text-xs text-gray-500">
        <span>✅ Avec réponse : <strong>{avec_reponse}</strong></span>
        <span>⏳ Sans réponse : <strong>{sans_reponse}</strong></span>
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
        axios.get("http://localhost:8000/candidatures/stats"),
        axios.get("http://localhost:8000/candidatures/taux-reponse")
      ]);
      setStats(resStats.data);
      setTaux(resTaux.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
    // Mise à jour automatique toutes les 10 secondes
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!stats || !taux) {
  return (
    <div className="flex items-center justify-center h-64 text-gray-400 flex-col gap-3">
      <p className="text-4xl">⚠️</p>
      <p>Impossible de charger les données</p>
      <p className="text-sm">Vérifie que le serveur backend est bien lancé</p>
    </div>
  );
}

  const statuts = [
    { label: 'En attente', key: 'En attente', color: 'bg-gray-200 text-gray-700' },
    { label: 'Relance', key: 'Relance', color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Entretien', key: 'Entretien', color: 'bg-blue-100 text-blue-700' },
    { label: 'Refus', key: 'Refus', color: 'bg-red-100 text-red-700' },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Tableau de bord</h2>
      <p className="text-gray-500 mb-8">Suivi en temps réel de tes candidatures</p>

      {/* Grille de stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          titre="Total candidatures"
          valeur={stats.total}
          soustitre="depuis le début"
          couleur="border-blue-500"
          icone="📁"
        />
        <StatCard
          titre="Entretiens obtenus"
          valeur={stats.par_statut?.['Entretien'] || 0}
          soustitre="objectif : 5 entretiens"
          couleur="border-green-500"
          icone="🎯"
          extra={
            <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
              <div
                className="bg-green-400 h-2 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(((stats.par_statut?.['Entretien'] || 0) / 5) * 100, 100)}%` }}
              />
            </div>
          }
        />
        <StatCard
          titre="En attente de réponse"
          valeur={stats.par_statut?.['En attente'] || 0}
          soustitre="candidatures envoyées"
          couleur="border-yellow-400"
          icone="⏳"
        />
        <StatCard
          titre="Cette semaine"
          valeur={stats.cette_semaine || 0}
          soustitre="nouvelles candidatures"
          couleur="border-purple-500"
          icone="📅"
        />
      </div>

      {/* Taux de réponse — pleine largeur */}
      <div className="mb-8">
        <TauxReponseCard
          taux={taux.taux}
          avec_reponse={taux.avec_reponse}
          sans_reponse={taux.sans_reponse}
          total={taux.total}
        />
      </div>

      {/* Répartition par statut */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Répartition par statut</h3>
        <div className="flex flex-col gap-3">
          {statuts.map(s => {
            const count = stats.par_statut?.[s.key] || 0;
            const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
            return (
              <div key={s.key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.color}`}>{s.label}</span>
                  <span className="text-gray-500">{count} ({pct}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-400 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
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