import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


const FormComponent = () => {
  const [userResponses, setUserResponses] = useState({});
  const [category, setCategory] = useState('');
  const [formToFill, setFormToFill] = useState('');
  const [forms, setForms] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [savedFormData, setSavedFormData] = useState({});


  useEffect(() => {
    // Load saved form data when the component mounts
    const savedData = localStorage.getItem('savedFormData');
    if (savedData) {
      setSavedFormData(JSON.parse(savedData));
    }
  }, []);

  const tenantForms = {
    "tenant_form1": ["First Name", "Last Name", "Address", "Email", "Phone Number"],
    "tenant_form2": ["QuestionA", "QuestionB", "Address"]
  };

  const landlordForms = {
    "landlord_form1": ["First Name", "Last Name", "Address", "Email", "Phone Number"],
    "landlord_form2": ["QuestionA", "QuestionB", "QuestionC"]
  };

  const [showVerification, setShowVerification] = useState(false);
  const [editMode, setEditMode] = useState(false);

  

  const collectInformation = async () => {
    // Prompt the user for their email address
    const email = prompt('Enter your email address:');
    setUserEmail(email);

    const inputCategory = prompt("Are you a 'Tenant' or 'Landlord'?")?.toLowerCase();

    if (inputCategory === 'exit') {
      return;
    } else if (inputCategory === 'tenant' || inputCategory === 'landlord') {
      setCategory(inputCategory);

    

      // Check if there are saved responses for the user's email
      const savedResponses = savedFormData[email] || {};
      setUserResponses(savedResponses);

      const formList = inputCategory === 'tenant' ? Object.keys(tenantForms) : Object.keys(landlordForms);
      const selectedForm = selectForm(formList);

      if (selectedForm) {
        setFormToFill(selectedForm);
        const formQuestions = inputCategory === 'tenant' ? tenantForms[selectedForm] : landlordForms[selectedForm];
        const responses = await fillOutForm(formQuestions);

        // Display verification
        setShowVerification(true);

        // Update user responses and saved form data
        setUserResponses(responses);
        setSavedFormData((prevSavedData) => ({
          ...prevSavedData,
          [email]: responses,
        }));
        localStorage.setItem('savedFormData', JSON.stringify(savedFormData));
      } else {
        alert("Invalid form selection. Please try again.");
      }
    } else {
      alert("Invalid category. Please enter 'Tenant' or 'Landlord'.");
    }
  };

  const fetchForms = async (category) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/forms/${category}`);
      const data = await response.json();
      setForms(Object.keys(data));
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  const selectForm = (formList) => {
    console.log(`Select a ${category} form to fill:`);
    formList.forEach((form, index) => {
      console.log(`${form}`);
    });
  
    const selectedForm = prompt(`Enter the name of the form you want to fill:`);
  
    if (formList.includes(selectedForm)) {
      return selectedForm;
    } else {
      return null;
    }
  };

  // const fillOutForm = async (questions) => {
  //   const responses = {};
  //   questions.forEach((question) => {
  //     // Check if the user already entered a value for this field
  //     const defaultValue = userResponses[question] || '';
  
  //     // Prompt the user with the default value
  //     const userResponse = prompt(`${question}:`, defaultValue);
  
  //     // Store the user's response
  //     responses[question] = userResponse;
  //   });

  //   console.log("\nThank you! Here is the information you provided:");
  //   for (const [key, value] of Object.entries(responses)) {
  //     console.log(`${key}: ${value}`);
  //   }
  
  //   return responses;
  // };


  const fillOutForm = async (questions) => {
    const responses = {};
  
    questions.forEach((question) => {
      // Check if the user already entered a value for this field
      const defaultValue = userResponses[question] || '';
  
      // Prompt the user with the default value
      const userResponse = prompt(`${question}:`, defaultValue);
  
      // Store the user's response
      responses[question] = userResponse || defaultValue; // Use the existing value if user enters an empty string
    });
  
    console.log("\nThank you! Here is the information you provided:");
    for (const [key, value] of Object.entries(responses)) {
      console.log(`${key}: ${value}`);
    }
  
    return responses;
  };
  

  const sendToBackend = async (responses) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/submit-form/${userEmail}/${formToFill}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responses),
      });
  
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error sending data to backend:', error);
    }
  };
  

  const handleEdit = () => {
    // Enable edit mode
    setEditMode(true);
  };

  const handleFieldEdit = (field) => {
    // Allow the user to edit a specific field
    const newValue = prompt(`Edit ${field}:`, userResponses[field]);
    setUserResponses((prevResponses) => ({
      ...prevResponses,
      [field]: newValue,
    }));
  };

  const handleDoneEditing = () => {
    // Disable edit mode
    setEditMode(false);
  };

  const handleSubmit = () => {
    // Send the responses to the backend
    sendToBackend(userResponses);

    // Display a success message
    alert('Data submitted!');

    // Reset state
    setCategory('');
    setFormToFill('');
    setUserResponses({});
    setShowVerification(false);
    setEditMode(false);
  };


  

  return (
    <div>
      <h1>Automated Form Filling</h1>
      <button onClick={editMode ? handleDoneEditing : collectInformation} className="forms-button">
        {editMode ? 'Done' : 'Start Form'}
      </button>

      {showVerification && (
  <div>
    <h2>{editMode ? 'Edit Your Information:' : 'Verify Your Information:'}</h2>
    <div className="responses-container">
      <ul>
        {Object.entries(userResponses).map(([key, value]) => (
          <li key={key} className="response-item">
            {editMode ? (
              <button onClick={() => handleFieldEdit(key)}>{key}</button>
            ) : (
              <>
                <span className="response-key">{key}:</span> <span className="response-value">{value}</span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
    {!editMode && (
      <div>
        <button onClick={handleEdit} className="forms-button">
          Edit
        </button>
        <button onClick={handleSubmit} className="forms-button">
          Submit
        </button>
      </div>
    )}
  </div>
)}


      <Link to="/" className="forms-button">
             Back
      </Link>
    </div>
  );
};

export default FormComponent;