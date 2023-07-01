import React, { useState } from 'react';
import './App.css';
import logo from './logo.svg';
import Chart from 'chart.js/auto';
import { Line } from "react-chartjs-2";
import moment from 'moment'; // Import the date library
import 'chartjs-adapter-moment'; // Import the adapter for Moment.js


var idValue = '';
var isoString_from_date = '';
var isoString_now = '';

const waterQTY = 24;

const apiStringPut = {
  "operation": "create",
  "payload": {
    "Item": {
      "id": idValue,
      "dt": isoString_now,
      "quantity": waterQTY
    }
  }
};

const api_query_user_since_date = {
  "operation": "query",
  "payload": {
      "TableName": "udra-one",
      "KeyConditionExpression": "#partitionKey = :partitionValue AND #sortKey >= :sortValue",
      "ExpressionAttributeNames": {
          "#partitionKey": "id",
          "#sortKey": "dt"
      },
      "ExpressionAttributeValues": {
          ":partitionValue": `${idValue}`,
          ":sortValue": `${isoString_from_date}` 
      },
      "ConsistentRead": true
  }
};

const options = {
  scaleShowValues: false,
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'day', // Customize the display unit (e.g., 'day', 'week', 'month')
        displayFormats: {
          day: 'MM-DD' // Customize the date format
        }
      },
      ticks: {
        //maxRotation: 0, // Prevent label rotation if needed
        //autoSkip: false,
        //padding: 2
      }
    }
  }
};

function UnderConstructionView() {
  return (
    <div>
      <h1>This site is under construction.</h1>
    </div>
  )
}

function TrimName(nameString) {
  if (nameString.endsWith(" ")) {
    nameString = nameString.trim();
  }
  
  return nameString;
}

async function QueryOnUser(passedName, passedDate) {
  api_query_user_since_date.payload.ExpressionAttributeValues[":partitionValue"] = passedName;
  api_query_user_since_date.payload.ExpressionAttributeValues[":sortValue"] = passedDate;

  //Query all Entries from User since Time X
  var response = await fetch('https://w75zszy1n7.execute-api.us-east-2.amazonaws.com/test/dynamodbmanager', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(api_query_user_since_date)
    }); 

    const jsonData = await response.json();
    const itemCount = jsonData.Count;
    const jsonItems = jsonData.Items;

    const localDateElementsGraphed = [] //Doing this to avoid depreciation warning
    const localDateElements = [];
    const countElements = [];
    const currentDate = new Date();

    //Set X axis labels as the previous 7 days
    for (let i = 6; i >= 0; i--) {
      
      const newDateLocal = new Date();
      newDateLocal.setDate(currentDate.getDate());
      const localDate = new Date();
      localDate.setDate(localDate.getDate() - i);
      const localDateOnly = localDate.toLocaleDateString();
      
      localDateElements.push(localDateOnly);

      //Fix for depreciation warning on non-ISO date format
      const localDateFix = new Date(); // Assuming this is your local date object
      const timezoneOffsetMs = localDateFix.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
      const localDateWithOffset = new Date(localDate.getTime() - timezoneOffsetMs);
      const isoString = localDateWithOffset.toISOString();
      const isoStringDateOnly = isoString.split("T")[0];

      localDateElementsGraphed.push(isoStringDateOnly);
      
    }
    
    //Attribute each quanity entry to a date, matched to local timezone
    for (let i = 0; i < localDateElements.length; i++) {
      var consumeCount = 0;
      for (let j = 0; j < jsonItems.length; j++) {
        const jsonDate = jsonItems[j].dt;
        const localDate = new Date(jsonDate);
        const localDateOnly = localDate.toLocaleDateString();
        
        if (localDateOnly == localDateElements[i]) {
          consumeCount+=parseInt(jsonItems[j].quantity);  //Parse int is needed here for parsing the "string" quantities posted by the ESP32 modules
        }

      }
      countElements.push(consumeCount);
    }

    //Set Graph Components
    const graphData = {
      labels: localDateElementsGraphed,
      datasets: [
        {
          label: 'Water Consumption',
          data: countElements,
          fill: true,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    };

    return graphData;
}

function MyComponent() {


  // //Chart data
  // const dataTest = {
  //   labels: [],
  //   datasets: [
  //     {
  //       label: 'Water Consumption',
  //       data: [],
  //       fill: true,
  //       borderColor: 'rgb(75, 192, 192)',
  //       tension: 0.1
  //     }
  //   ]
  // };



  const [data, setGraphData] = useState(null);

  //const [formData, setFormData] = useState({ name: '', email: '' });
  const [formData, setFormData] = useState({ name: ''});

  const [jsonDisplay, setJsonData] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.name != '') {

      idValue = TrimName(formData.name);

      try {

        // const idValue = formData.name;
        const apiStringRead = {
          "operation": "read",
          "payload": {
            "Key": {
              "id": `${idValue}`
            }
          }
        };

        const currentDate = new Date();
        isoString_now = currentDate.toISOString();

        const fromDate = new Date();
        fromDate.setDate(currentDate.getDate() - 7);
        isoString_from_date = fromDate.toISOString();
        //console.log("From date: " + isoString_from_date);
        
        
        // const apiStringPut = {
        //   "operation": "create",
        //   "payload": {
        //     "Item": {
        //       "id": `${idValue}`,
        //       "dt": `${isoString_now}`,
        //       "quantity": 1
        //     }
        //   }
        // };

        // const api_query_user_since_date = {
        //   "operation": "query",
        //   "payload": {
        //       "TableName": "udra-one",
        //       "KeyConditionExpression": "#partitionKey = :partitionValue AND #sortKey >= :sortValue",
        //       "ExpressionAttributeNames": {
        //           "#partitionKey": "id",
        //           "#sortKey": "dt"
        //       },
        //       "ExpressionAttributeValues": {
        //           ":partitionValue": `${idValue}`,
        //           ":sortValue": `${isoString_from_date}` 
        //       },
        //       "ConsistentRead": true
        //   }
        // };

        

        //Update Attributes of API JSON
        apiStringPut.payload.Item['id'] = idValue;
        apiStringPut.payload.Item['dt'] = isoString_now;
        api_query_user_since_date.payload.ExpressionAttributeValues[":partitionValue"] = idValue;
        api_query_user_since_date.payload.ExpressionAttributeValues[":sortValue"] = isoString_from_date;


        //Create Entry
        var response = await fetch('https://w75zszy1n7.execute-api.us-east-2.amazonaws.com/test/dynamodbmanager', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiStringPut)
        }); 
        //console.log(apiStringPut);

        // //Query all Entries from User since Time X
        // response = await fetch('https://w75zszy1n7.execute-api.us-east-2.amazonaws.com/test/dynamodbmanager', {
        // method: 'POST',
        // headers: {
        //   'Content-Type': 'application/json'
        // },
        // body: JSON.stringify(api_query_user_since_date)
        // }); 

        // const jsonData = await response.json();
        // const itemCount = jsonData.Count;
        // const jsonItems = jsonData.Items;

        // // const dateArray = jsonItems.dt.map(item => {
        // //   const isoDate = new Date(item).toISOString();
        // //   const dateOnly = isoDate.split("T")[0];
        // //   return dateOnly;
        // // });

        // // console.log(dateArray);
        
        // const dateElements = [];
        // const countElements = [];
        // for (let i = 6; i >= 0; i--) {
        //   const newDate = new Date();
        //   newDate.setDate(currentDate.getDate() - i);
        //   const isoDate = new Date(newDate).toISOString();
        //   //TODO - Convert from Z to user's timezone
        //   const dateOnly = isoDate.split("T")[0].toString();
        //   dateElements.push(dateOnly);
        // }
        
        // for (let i = 0; i < dateElements.length; i++) {
        //   var consumeCount = 0;
        //   for (let j = 0; j < jsonItems.length; j++) {
        //     const jsonDate = jsonItems[j].dt;
        //     const newDate = new Date();
        //     const dateOnly = jsonDate.split("T")[0].toString();
        //     if (dateOnly == dateElements[i]) {
        //       consumeCount++;
        //     }
        //   }
        //   countElements.push(consumeCount);
        // }


        // //const stringTest = ['6-24', '6-25', '6-26', '6-27', '6-28', '6-29', '6-30'];
        // //Set Graph Components
        // const graphData = {
        //   labels: dateElements,
        //   datasets: [
        //     {
        //       label: 'Water Consumption',
        //       data: countElements,
        //       fill: true,
        //       borderColor: 'rgb(75, 192, 192)',
        //       tension: 0.1
        //     }
        //   ]
        // };

        const graphData = await QueryOnUser(idValue, isoString_from_date);
        setGraphData(graphData);

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
          //console.log(jsonData.Count);
          //console.log(jsonData.Items);
        } else {
          // Request was not successful
          console.log('POST request failed');
        }
      } catch (error) {
        console.error('Error making POST request:', error);
      }
    }

    
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleGraphUpdate = async (event) => {

    event.preventDefault();

    if (formData.name != '') {


      idValue = TrimName(formData.name);
      const currentDate = new Date();
      const fromDate = new Date();
      fromDate.setDate(currentDate.getDate() - 7);
      isoString_from_date = fromDate.toISOString();
      const response = await QueryOnUser(idValue, isoString_from_date);
      setGraphData(response);
    }
    

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
                <button type="submit">Refill Bottle (24 oz)</button>
              </form>
              <form onSubmit={handleGraphUpdate}>
                <button type="submit">View Graph</button>
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
              <div>
                {data ? (
                    <div className="graph-content">
                      <Line data={data} options={options} />
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
//export default UnderConstructionView;

