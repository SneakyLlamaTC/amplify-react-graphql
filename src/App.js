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
      const apiStringRead = {
        "operation": "read",
        "payload": {
          "Key": {
            "id": `${idValue}`
          }
        }
      };

      const currentDate = new Date();
      const isoString = currentDate.toISOString();
      //const isoString = currentDate.toUTCString();
      
      const apiStringPut = {
        "operation": "create",
        "payload": {
          "Item": {
            "id": `${idValue}`,
            "dt": `${isoString}`,
            "quantity": 1
          }
        }
      };
      
      const response = await fetch('https://w75zszy1n7.execute-api.us-east-2.amazonaws.com/test/dynamodbmanager', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(apiStringPut)
      }); 

      // const response = await fetch('https://w75zszy1n7.execute-api.us-east-2.amazonaws.com/test/dynamodbmanager', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
        
      //   body: JSON.stringify(apiStringRead)
      // });

      // const jsonData = await response.json();
      // if (jsonData.hasOwnProperty('Item')) {
      //   setJsonData(jsonData);
      //   console.log(jsonData.Item.number)
      //   const apiStringUpdate = {
      //     "operation": "update",
      //     "payload": {
      //       "Key": {
      //         "id": `${idValue}`
      //       },
      //       "AttributeUpdates": {
      //         "number": {
      //           "Value": jsonData.Item.number + 1
      //         }
      //       }
      //     }
      //   };

        // const response = await fetch('https://w75zszy1n7.execute-api.us-east-2.amazonaws.com/test/dynamodbmanager', {
        // method: 'POST',
        // headers: {
        //   'Content-Type': 'application/json'
        // },

        // body: JSON.stringify(apiStringUpdate)
        // }); 
      // }
      // else {
      //   const noUserData = { 
      //     "Item": {
      //       "id": "User not found",
      //       "number": 0
      //   }
      //    };
      //   setJsonData(noUserData);
      // }
      
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
    
    
    <div className="background-container">
      <div className="container">
        <div className="translucent-frame">
          <div className="title-content">
            <link rel="shortcut icon" type="image/x-icon" href="udralogo.png" />
            <h1>Udra</h1>
            <div className="circle-image">
              <img src="udralogo.png" alt="Udra Logo" width="256" height="256"></img>
            </div>
            <br />
            <br />
            <div className="content">
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
                <button type="submit">Refill Bottle</button>
              </form>
              <div>
                {jsonDisplay ? (
                  <div>
                    <h2>{jsonDisplay.Item.id}</h2>
                    <p>Bottles Consumed: {jsonDisplay.Item.number + 1}</p>
                  </div>
                ) : (
                  <p></p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
}

export default MyComponent;

