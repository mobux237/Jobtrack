import './theme.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
//import './index.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="554319267823-6onjp6rpmnjqkgbk0icmpf54tbq1jl8b.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);