import React, { useState } from 'react';
import './App.css';
import logo from './logo.svg';

function MyComponent() {
  //const [formData, setFormData] = useState({ name: '', email: '' });
  const [formData, setFormData] = useState({ name: ''});

  const [jsonDisplay, setJsonData] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {

      const idValue = formData.name;
      const apiString = {
        "operation": "read",
        "payload": {
          "Key": {
            "id": `${idValue}`
          }
        }
      };


      const response = await fetch('https://w75zszy1n7.execute-api.us-east-2.amazonaws.com/test/dynamodbmanager', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        
        body: JSON.stringify(apiString)
      });

      const jsonData = await response.json();
      if (jsonData.hasOwnProperty('Item')) {
        setJsonData(jsonData);
      }
      else {
        const noUserData = { 
          "Item": {
            "id": "User not found",
            "number": 0
        }
         };
        setJsonData(noUserData);
      }
      
      // Handle the response as needed
      if (response.ok) {
        // Request was successful
        console.log('POST request succeeded');
      } else {
        // Request was not successful
        console.log('POST request failed');
      }
    } catch (error) {
      console.error('Error making POST request:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  return (
    
    
    <div className="App-header">
      <link rel="shortcut icon" type="image/x-icon" href="https://cdn.discordapp.com/attachments/1121243216184872970/1122586567580586015/logo.png" />
      <h1>Udra</h1>
      <img src="https://cdn.discordapp.com/attachments/1121243216184872970/1122586567580586015/logo.png" alt="Udra Logo" width="256" height="256"></img>
      <br />
      <br />
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <br />
        <br />
        <button type="submit">Submit</button>
      </form>
      <div>
        {jsonDisplay ? (
          <div>
            <h2>Name: {jsonDisplay.Item.id}</h2>
            <p>Number: {jsonDisplay.Item.number}</p>
          </div>
        ) : (
          <p>Enter a user to retrieve their details</p>
        )}
    </div>
    </div>
    
  );
}

export default MyComponent;

