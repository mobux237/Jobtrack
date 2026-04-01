import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function Login({ onLogin }) {
  const [erreur, setErreur] = useState('');

  const handleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const user = {
        nom: decoded.name,
        email: decoded.email,
        photo: decoded.picture,
      };
      localStorage.setItem('findmyalter_user', JSON.stringify(user));
      onLogin(user);
    } catch (e) {
      setErreur('Erreur lors de la connexion. Réessaie.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md text-center">

        {/* Logo */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl">🎯</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">FindMyAlter</h1>
          <p className="text-gray-500 mt-2">Ton assistant de recherche d'alternance</p>
        </div>

        {/* Séparateur */}
        <div className="border-t border-gray-100 my-6"></div>

        {/* Connexion Google */}
        <p className="text-gray-600 mb-6 text-sm">
          Connecte-toi pour accéder à ton espace personnel et suivre tes candidatures
        </p>

        <div className="flex justify-center mb-4">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => setErreur('Connexion refusée. Réessaie.')}
            text="signin_with"
            shape="rectangular"
            size="large"
            locale="fr"
          />
        </div>

        {erreur && (
          <p className="text-red-500 text-sm mt-3">{erreur}</p>
        )}

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400">© 2026 Thomas Mobe Bonny — FindMyAlter</p>
          <p className="text-xs text-gray-300 mt-1">Tous droits réservés</p>
        </div>
      </div>
    </div>
  );
}

export default Login;