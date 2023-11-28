  // import React, { useState } from 'react';
  // import { Link } from 'react-router-dom';
  // import axios from 'axios';
  
  // function TenantForms() {
  //   const [selectedForm, setSelectedForm] = useState('select a form');
  //   const [pdfContent, setPdfContent] = useState(null);
  
  //   const handleFormChange = async (event) => {
  //     const selectedOption = event.target.value;
  //     setSelectedForm(selectedOption);
  
  //     if (selectedOption !== 'select a form') {
  //       try {
  //         const response = await axios.get(`http://127.0.0.1:8000/get_tenant_form/${selectedOption}.pdf`);
  //         // Assuming the API response contains the PDF data
  //         setPdfContent(response.data);
  //       } catch (error) {
  //         console.error('Error fetching PDF:', error);
  //         // Handle the error or show an error message to the user
  //       }
  //     }
  //   };
  
  
  //   const tenantPdfForms = [
  //     "A2",
  //     "T3",
  //     "Request to Amend an Order",
  //     "T2",
  //     "Request for French Language Services",
  //     "A1",
  //     "T1",
  //     "SOP_for_Multi_Tenants",
  //     "A4",
  //     "T5",
  //     "T4",
  //     "Certificate Of Service",
  //     "T6",
  //     "Payment Agreement",
  //     "T7",
  //     "Request for Discontinuance Order",
  //     "N9",
  //     "Summons",
  //     "Request to Use Alternative Service",
  //     "Request to Withdraw an Application",
  //     "N15",
  //     "Request for Hearing Recording",
  //     "N15 - Tenant Statement",
  //     "Request to Extend or Shorten Time",
  //     "N11",
  //     "Issues a Tenant Intends to Raise at a Rent Arrears Hearing",
  //     "Tenant's Motion to Void an Eviction Order for Arrears of Rent",
  //     "Consent to Disclosure through TOP",
  //     "TO001E",
  //     "Request to Pay Rent to the Board on a Tenant Application About Maintenance",
  //     "Request to Reschedule a Hearing",
  //     "Request_for_the_Board_to_Issue_a_Summons",
  //     "Request to Review an Order",
  //     "Declaration",
  //     "Fee Waiver Request",
  //     "Credit Card Payment Form",
  //     "Request to Re-open an Application",
  //     "Affidavit",
  //     "Motion to Set Aside an Ex Parte Order Form S2",
  //     "Schedule of Parties",
  //     "Email Service Consent",
  //     "Request to be Litigation Guardian LTB"
  //   ];
  
    
  
  
  //   return (
  //     <div>
  //       <h1><i className="fa-solid fa-file-pdf"></i> Tenant Forms</h1>
  //       <h5>Forms are obtained from <a href="https://tribunalsontario.ca/ltb/forms/" target="_blank">Tribunals Ontario</a> official website</h5>
  //       <h5> <a href="#" onClick={() => window.location.reload()}>
  //       <i className="fa-solid fa-arrow-rotate-right" style={{ color: 'green' }}></i></a> Reload the page if form display issues arise.</h5>
      
  
  //       <select value={selectedForm} onChange={handleFormChange}>
  //         {tenantPdfForms.map((option, index) => (
  //           <option key={index} value={option}>
  //             {option}
  //           </option>
  //         ))}
  //       </select>
  //       {selectedForm !== 'select a form' && (
  //         <p>Complete the {selectedForm} form and save it</p>
  //       )}
  //       {pdfContent && (
  //         <div>
  //           <object data={`http://127.0.0.1:8000/get_tenant_form/${selectedForm}.pdf`} width="800" height="600"></object>
           
  //         </div>
  //       )}
        
  //       <Link to="/" className="forms-button">
  //              Back
  //       </Link>
  //     </div>
  //   );
  // }
  
  // export default TenantForms;
  
  
  import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function TenantForms() {
  const [selectedForm, setSelectedForm] = useState('select a form');
  const [pdfContent, setPdfContent] = useState(null);
  const [formOptions, setFormOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFormOptions = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/get_form_options?category=tenant');
        setFormOptions(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching form options:', error);
        // Handle the error or show an error message to the user
      }
    };

    fetchFormOptions();
  }, []);

  const handleFormChange = async (event) => {
    const selectedOption = event.target.value;
    setSelectedForm(selectedOption);

    if (selectedOption !== 'select a form') {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/get_tenant_form/${selectedOption}.pdf`);
        // Assuming the API response contains the PDF data
        setPdfContent(response.data);
      } catch (error) {
        console.error('Error fetching PDF:', error);
        // Handle the error or show an error message to the user
      }
    }
  };

  return (
    <div>
      <h1><i className="fa-solid fa-file-pdf"></i> Tenant Forms</h1>
      <h5>Forms are obtained from <a href="https://tribunalsontario.ca/ltb/forms/" target="_blank">Tribunals Ontario</a> official website</h5>
      <h5> <a href="#" onClick={() => window.location.reload()}>
        <i className="fa-solid fa-arrow-rotate-right" style={{ color: 'green' }}></i></a> Reload the page if form display issues arise.</h5>

      {loading ? (
        <p>Loading form options...</p>
      ) : (
        <select value={selectedForm} onChange={handleFormChange}>
          {formOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}

      {selectedForm !== 'select a form' && (
        <p>Complete the {selectedForm} form and save it</p>
      )}

      {pdfContent && (
        <div>
          <object data={`http://127.0.0.1:8000/get_tenant_form/${selectedForm}.pdf`} width="800" height="600"></object>
        </div>
      )}

      <Link to="/" className="forms-button">
        Back
      </Link>
    </div>
  );
}

export default TenantForms;

  



