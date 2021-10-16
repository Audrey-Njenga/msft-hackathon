const Client = require('azure-iot-device').Client;
const Message = require('azure-iot-device').Message;
const Protocol = require('azure-iot-device-mqtt').Mqtt;
const { v4: uuidv4 } = require('uuid');

const dht11 = require('./dht11');
const mq2 = require('./MQ2');

const connectionString = "HostName=forest-guardTesting.azure-devices.net;DeviceId=pi;SharedAccessKey=MMHp+B159fgTTvr7RkBPyT+eSvX3qiFKb60z5j1oXc8="

let azureClient = Client.fromConnectionString(connectionString, Protocol);

// postTemperatureAndHumidityData=()=>{
//     dht11.getTemperatureAndHumidity().then(res =>{
//         if(res.isValid){
//             let json = JSON.stringify({
//                 messageId: uuidv4(),
//                 deviceId: 'RasPiTemp',
//                 temperature: res.temperature.toFixed(2),
//                 humidity: res.humidity.toFixed(1),
//                 time : new Date()
//             });
//             let message = new Message(json);

//             azureClient.sendEvent(message, (err)=>{
//                 if(err){
//                     console.error(err);
//                     return;
//                 }
//                 console.log("Sent message: ", message);   
//             });
//         }else{
//             console.log("Response is not valid");
//         }
//     }).catch(err => {
//         console.error(err);
//     });
// }

postTemperatureAndHumidityData=()=>{
    dht11.getTemperatureAndHumidity().then(res =>{
        if(res.isValid){
            let json = JSON.stringify({
                messageId: uuidv4(),
                deviceId: 'RasPiTemp',
                smokeSensor: 50,
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
        }else{
            console.log("Response is not valid");
        }
    }).catch(err => {
        console.error(err);
    });
}
postTemperatureAndHumidityData();

// console.log(mq2.getSmokeSensorValues());
