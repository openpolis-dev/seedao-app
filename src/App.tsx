import React from 'react';
import Web3Provider from './providers/web3Provider';
import AuthProvider from './providers/authProvider';
import './assets/styles/quill.css';
import './assets/styles/font.css';
import RouterLink from './router';

function App() {
  return (
    <AuthProvider>
      <Web3Provider>
        <RouterLink />
      </Web3Provider>
    </AuthProvider>
  );
}

export default App;
