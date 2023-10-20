import React from 'react';
import { Link } from 'react-router-dom';



const Chat = () => {
  
  
  return (
    <div className="container">
      <div className="logo-section">
        <img
          id="logoImage"
          className="logo"
          src="/icons/logo-full.svg"
          alt="Logo"
        />
        <div className="line"></div>
        <div className="text-box">
          <span className="about-text">Ask Legal Aid</span><br />
          About Landlord and Tenant Board - Tribunals Ontario
        </div>

      
       <div>
       <Link to="/landlordForms" className="forms-button">
          Landlord Forms
        </Link>
        <Link to="/tenantForms" className="forms-button">
          Tenant Forms
        </Link>
       </div>
       
   

       

      </div>
      
      
      {/* The rest of your code remains the same */}
      
      <div className="chat-container">
        <div className="outer-box">
          <div className="inner-box">
            <div className="chat-content" id="chatContent"></div>
          </div>
        </div>
      </div>
      
      <div className="new-box">
        <img
          id="image1"
          className="svg-image"
          src="/icons/dc-logos-2020-bars.svg"
          alt="SVG Image"
        />
       
        <div className="inner-content">
          <select className="dropdown-box" name="topics" id="topicList"></select>
          <textarea
            className="textarea-box"
            placeholder="Type your question and enter to send Or click on the Talk button and speak. Click the talk button again to send the question."
          ></textarea>
          <div className="icons-box">
            <img
              className="tick-icon"
              src="/icons/chatbot-branding-submit.svg"
              alt="Tick Icon"
            />
           
            <img
              className="microphone-icon"
              id="microphoneIcon"
              src="/icons/chatbot-branding-dictate.svg"
              alt="Microphone Icon"
            />
  
            <img
              className="mute-button"
              id="muteButton"
              src="/icons/chatbot-branding-mute.svg"
              alt="Volume Mute Icon"
            />
          </div>
        </div>
      </div>
      
      {/* Footer Section */}
      <footer className="footer">
        <p className="productText">
          &copy; 
          <a href="http://www.spimelab.com" target="_blank" rel="noopener noreferrer">Spimelab Inc.</a> 2023 All Rights Reserved
        </p>
      </footer>
    </div>
  );
};

export default Chat;
