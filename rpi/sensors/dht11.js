const sensor = require("node-dht-sensor")

async function getTemperatureAndHumidity(){
    try {
        const res = await sensor.read(11, 4);
        return res;
    } catch(err){
        return err;
    }
}

module.exports = {getTemperatureAndHumidity};