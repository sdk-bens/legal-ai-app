import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function LandlordForms() {
  const [selectedForm, setSelectedForm] = useState('select a form');
  const [pdfContent, setPdfContent] = useState(null);

  const handleFormChange = async (event) => {
    const selectedOption = event.target.value;
    setSelectedForm(selectedOption);

    if (selectedOption !== 'select a form') {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/get_form/${selectedOption}.pdf`);
        // Assuming the API response contains the PDF data
        setPdfContent(response.data);
      } catch (error) {
        console.error('Error fetching PDF:', error);
        // Handle the error or show an error message to the user
      }
    }
  };


  const landlordPdfForms = [
    "Select a Form",
    "L5",
    "Request to Amend an Order",
    "L4",
    "Request for French Language Services",
    "L6",
    "L7",
    "L3",
    "Landlord Notice to a New Tenant About an Order prohibiting a Rent Increase",
    "A4_Application_to_Vary_the_Amount_of_a_Rent_Reduction",
    "Certificate Of Service - L10",
    "Certificate Of Service",
    "N8",
    "A2_Application_about_a_Sublet_or_an_Assignment",
    "Payment Agreement",
    "Request for Discontinuance Order",
    "Summons",
    "Request to Use Alternative Service",
    "Information to Prospective Tenant About Suite Meters or Meters",
    "Tenant Agreement to Pay Directly for Electricity Costs",
    "Landlord's Motion to Set Aside an Order to Void Form S3",
    "L1_Application_to_Evict_a_Tenant_for_Non-payment_of_Rent_and_to_Collect_Rent_the_Tenant_Owes",
    "Request to Withdraw an Application",
    "Request for Hearing Recording",
    "Request to Extend or Shorten Time",
    "N11",
    "L10",
    "Bulk Application Info Sheet",
    "N12",
    "Information from your Landlord about Utility Costs",
    "N13",
    "Consent to Disclosure through TOP",
    "N14 - Landlord's Notice to the Spouse of the Tenant who Vacated the Rental Unit",
    "Information from your Landlord about Utility Cost_One or More",
    "TO001E",
    "Request to Reschedule a Hearing",
    "Request_for_the_Board_to_Issue_a_Summons",
    "Request to Review an Order",
    "Declaration",
    "N4",
    "L2-Application_to_End_a_Tenancy_and_Evict_a_Tenant_or_Collect_Money",
    "N5",
    "Fee Waiver Request",
    "N7",
    "Credit Card Payment Form",
    "Request to Re-open an Application",
    "N6",
    "Affidavit",
    "Schedule of Parties",
    "A1_Application_about_Whether_the_Act_Applies",
    "Landlord's Notice to Terminate Obligation to Suppy Electricity",
    "L9",
    "Email Service Consent",
    "L8",
    "Request to be Litigation Guardian LTB"
  ];

  

    

  return (
    <div>
      <h1><i className="fa-solid fa-file-pdf"></i> Landlord Forms</h1>
      <h5>Forms are obtained from <a href="https://tribunalsontario.ca/ltb/forms/" target="_blank">Tribunals Ontario</a> official website</h5>
      <h5> <a href="#" onClick={() => window.location.reload()}>
      <i className="fa-solid fa-arrow-rotate-right" style={{ color: 'green' }}></i></a> Reload the page if form display issues arise.</h5>
    

      <select value={selectedForm} onChange={handleFormChange}>
        {landlordPdfForms.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      {selectedForm !== 'select a form' && (
        <p>Complete the {selectedForm} form and save it</p>
      )}
      {pdfContent && (
        <div>
          <object data={`http://127.0.0.1:8000/get_form/${selectedForm}.pdf`} width="800" height="600"></object>
         
        </div>
      )}
      
      <Link to="/" className="forms-button">
             Back
      </Link>
    </div>
  );
}

export default LandlordForms;



