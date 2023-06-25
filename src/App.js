import React, { useState } from 'react';

function MyComponent() {
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('https://w75zszy1n7.execute-api.us-east-2.amazonaws.com/test/dynamodbmanager', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"operation": "read", "payload": {"Key": {"id": "1234ABCD"}}})
      });

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
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}

export default MyComponent;


