const {MainMenu} = require('./context/MainMenu')
const {TaskSteps} = require("./context/Task/TaskSteps")


class VirtualTerminal {
    constructor(){
        this.tasks = [{
            title: "[COMPLETE] Prerequistites"
        },
        {
            title: "[COMPLETE] Do something"
        },
        {
            title: "[COMPLETE] Do something else"
        },
        {
            title: "[COMPLETE] Do something else else"
        },
        {
            title: "[COMPLETE] Great, let's get started"
        },
        {
            title: "[COMPLETE] What do you think of this terminal"
        },
        {
            title: "[COMPLETE] This is an example, good job for reading the second page"
        }
    ]
        this.currentMenu = new MainMenu(this);
    }
    run(lastInput){
        return "\n".repeat(2) + this.currentMenu.run(lastInput ? lastInput : null).split('\n').map(line => line.trimStart()).join('\n')
    }
    switchTo(menuName){
        switch (menuName) {
            case 'mainmenu':
                this.currentMenu = new MainMenu(this);
                break;
            case 'tasksteps':
                this.currentMenu = new TaskSteps(this);
                break;
            default:
                return "Unknown menu"
                break;
        }
        return this.currentMenu.run()
    }
}

module.exports = VirtualTerminal







///////////////////////////

if(true){
            const terminal = new VirtualTerminal()



            const readline = require('readline');
            
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            
            async function userTest(){
            
                var lastInput;
            
                while(true){
                    const print = terminal.run(lastInput)
                    await new Promise((resolve, reject) => {
                        rl.question(print, (input) => {
                            lastInput = input;
                            resolve()
                        });
                    })
                }
            }
            
            userTest()
}



///////////////////////////
