import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandlordForms from './landlordForms';
import TenantForms from './tenantForms';
import './App.css'; // Import the App.css for global styles

function Forms() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/landlordForms" element={<LandlordForms />} />
          <Route path="/tenantForms" element={<TenantForms />} />
          <Route path="/forms-auto-filling" element={<FormComponent />} />
          <Route
            path="/"
            element={
              <div className="top-content">
                <h1><i class="fa-solid fa-gavel"></i> LBT Forms</h1>
                <Link to="/landlordForms">
  <div className="button-container">
    <button className="button">Landlord Forms</button>
  </div>
</Link>
<Link to="/tenantForms">
  <div className="button-container">
    <button className="button">Tenant Forms</button>
  </div>
</Link>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default Forms;
