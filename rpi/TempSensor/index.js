const Client = require('azure-iot-device').Client;
const Message = require('azure-iot-device').Message;
const Protocol = require('azure-iot-device-mqtt').Mqtt;
const { v4: uuidv4 } = require('uuid');
require('dotenv').config()

const dht11 = require('./dht11');

const connectionString = process.env.CONNECTION_STRING_PROD

let azureClient = Client.fromConnectionString(connectionString, Protocol);

/**
 * This method is posts the temperature and Humidity data
 * to azure iot hub using the mqtt protocol
 */
postTemperatureAndHumidityData=()=>{
    dht11.getTemperatureAndHumidity().then(res =>{
        if(res.isValid){
            let json = JSON.stringify({
                messageId: uuidv4(),
                deviceId: 'RasPiTemp',
                temperature: res.temperature.toFixed(2),
                humidity: res.humidity.toFixed(1),
                time : new Date()
            });
            let message = new Message(json);

            azureClient.sendEvent(message, (err)=>{
                if(err){
                    console.error(err);
                    return;
                }
                console.log("Sent message: ", message);   
            });

            setTimeout(postTemperatureAndHumidityData, 5000)
        }else{
            console.log("Response is not valid");
        }
    }).catch(err => {
        console.error(err);
    });
}

postTemperatureAndHumidityData();