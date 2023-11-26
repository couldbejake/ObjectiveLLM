const {IDE} = require('./IDE.js')


var ide = new IDE();

ide.start().then(() => {
    /*ide.view_file("test").then((output) => {
        console.log(output)
    }).catch((err) => {
        console.log(err)
    })*/
    ide.execute_terminal_command("ls").then((output) => {
        console.log(output)
    })
})
