const pythonShell = require("python-shell");

let pyShell = new pythonShell.PythonShell("test.py")

pyShell.on  ('message', message =>{
    console.log(message);
})

pyShell.end(err =>{
    if(err){
        throw err;
    }
    console.log("Done!");
})