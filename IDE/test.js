const {IDE} = require('./IDE.js')


var ide = new IDE();

ide.start().then(async () => {
    ide.overwrite_file("test123.py", `print("Test")`).then(() => {
        ide.execute_terminal_command("python atest123.py").then((out) => {
            console.log(out)
        })
    })
})
