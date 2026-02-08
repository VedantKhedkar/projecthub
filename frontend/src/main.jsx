import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext'; // Import this
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <SearchProvider> {/* Wrap everything here */}
        <App />
      </SearchProvider>
    </AuthProvider>
  </React.StrictMode>
);