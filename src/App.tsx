import React from 'react';
import { HashRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
