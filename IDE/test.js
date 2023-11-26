const {IDE} = require('./IDE.js')


var ide = new IDE();

ide.start().then(async () => {
    ide.overwrite_file("test123.py", `print("Test")`).then(() => {
        console.log("WROTE")
        ide.execute_terminal_command("python test123.py").then((out) => {
            console.log("RAN")
            console.log(out)
        })
    })
})
