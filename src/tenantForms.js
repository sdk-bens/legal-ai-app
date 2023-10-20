

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function TenantForms() {
  const [selectedForm, setSelectedForm] = useState('select a form');
  const [showSubmitButton, setShowSubmitButton] = useState(false);

  const handleFormChange = (event) => {
    setSelectedForm(event.target.value);
    setShowSubmitButton(true);
  };



  return (
    <div>
      <h1><i className="fa-solid fa-file-pdf"></i> Tenant Forms</h1>
      <h5>Forms are obtained from <a href="https://tribunalsontario.ca/ltb/forms/" target="_blank">Tribunals Ontario</a> official website</h5>
      <h5><i class="fa-solid fa-arrow-rotate-right"></i> Reload the page if form display issues arise.</h5>
      
      <select value={selectedForm} onChange={handleFormChange}>
        <option value="select a form">Select a Form</option>
        <option value="form1">Form 1</option>
        <option value="form2">Form 2</option>
        <option value="form3">Form 3</option>
      </select>
      {selectedForm !== 'select a form' && (
        <p>Hey, you selected {selectedForm}</p>
      )}
      {showSubmitButton && (
        <button onClick={handleSubmit}>Submit</button>
      )}
      <Link to="/" className="forms-button">
      Back
      </Link>
    </div>
  );

  function handleSubmit() {
    // Add your submit logic here
    alert('Form submitted!');
  }
}

export default TenantForms;
