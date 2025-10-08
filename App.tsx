
import React from 'react';
import Sidebar from './components/Sidebar';
import FeatureManagementPage from './components/FeatureManagementPage';

const App: React.FC = () => {
  return (
    <div className="flex h-screen bg-q-dark">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <FeatureManagementPage />
      </main>
    </div>
  );
};

export default App;
