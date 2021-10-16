const sensor = require("node-dht-sensor")
/**
 * This method fetches the temperature and humidity values
 * from the dht11 sensor
 * @returns Temperature & Humidity values
 */
async function getTemperatureAndHumidity(){
    try {
        const res = await sensor.read(11, 4);
        return res;
    } catch(err){
        return err;
    }
}

module.exports = {getTemperatureAndHumidity};