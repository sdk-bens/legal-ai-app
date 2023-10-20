
import Chat from './chat';

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandlordForms from './landlordForms';
import TenantForms from './tenantForms';
import './App.css'; // Import the App.css for global styles




function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/landlordForms" element={<LandlordForms />} />
          <Route path="/tenantForms" element={<TenantForms />} />
         
        </Routes>
      </div>
    </Router>
  );
}

export default App;