const pythonShell = require("python-shell");

let pyShell = new pythonShell.PythonShell("./py_scripts/mq2.py")

/**
 * This method fetches the smoke sensor values 
 * from the MQ2 sensor
 * @returns smoke sensor value 
 */
function getSmokeSensorValues() {
    pyShell.on('message', message =>{
        console.log(message);
        // return message
    })

    pyShell.end(err =>{
        if(err){
            return err;
        }
    })
}
getSmokeSensorValues();
// console.log(getSmokeSensorValues());
module.exports = {getSmokeSensorValues};