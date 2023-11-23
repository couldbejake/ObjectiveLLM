const {MainMenu} = require('./context/MainMenu')
const {TaskStep} = require("./context/Task/TaskStep")
const {TaskStepEdit} = require("./context/Task/TaskStepEdit")
const { Task } = require('../Task')

class VirtualTerminal {
    constructor(main){
        this.main = main;
        this.tasks = [
            /*
            {
                title: "(Complete) Startup Terminal",
                description: "Startup the ContextGPT terminal and view options",
                state: 'completed'
            },
            {
                title: "(In-progress) Prerequistites",
                description: "Find prerequisites, and decide upon framework",
                state: 'in-progress'
            }*/
            new Task(" Startup Terminal", "Test the working parts of the menu, and give your feedback on what should be added",'completed')
        ]
        this.currentMenu = new MainMenu(this);
    }
    run(lastInput){
        return "\n".repeat(2) + this.currentMenu.run(lastInput ? lastInput : null).split('\n').map(line => line.trimStart()).join('\n')
    }
    switchTo(menuName, context){
        switch (menuName) {
            case 'mainmenu':
                this.currentMenu = new MainMenu(this, context);
                break;
            case 'tasksteps':
                this.currentMenu = new TaskStep(this, context);
                break;
            case 'edittaskstep':
                this.currentMenu = new TaskStepEdit(this, context);
                break;
            case 'human':
                this.main.shouldRun = false;
                break;
            default:
                return "NOT IMPLEMENTED"
                break;
        }
        return this.currentMenu.run()
    }
    getTask(task_id) {
        return this.tasks[task_id - 1]
    }
}

module.exports = VirtualTerminal







///////////////////////////

if(false){
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
