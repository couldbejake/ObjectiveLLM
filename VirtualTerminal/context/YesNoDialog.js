const { Task } = require("../../Task");
const { prettyJoin, isNumeric } = require("../../Utils");

/*
    return this.terminal.switchTo('yesnodialog', {
        title: "Would you like to add a subtask for this task?",
        confirm_text: "yes",
        confirm_description: "Saves task and creates new sub task under same task.",
        deny_text: "no",
        deny_description: "Saves task and returns to menu.",
        on_confirm: () => {
            console.log("CONFIRMED")
        },
        on_deny: () => {
            return this.terminal.switchTo('tasksteps')
        }
    })
*/

class YesNoDialog {
    constructor(terminal, context){
        this.terminal = terminal; if(!terminal) {console.log("Terminal wasn't given")}
        this.context = context;

        this.title = "Yes No Dialog"

    }
    getBanner(){

        return `
        =============== 

        ${this.context.title}

        ${this.context.confirm_text} - ${this.context.confirm_description}
        ${this.context.deny_text} - ${this.context.deny_description}

        ================\n\n `
    }
    run(input){
        var validAnswers = [
            { command: 'yes', usage: 'yes' },
            { command: 'no', usage: 'no' },
            { command: 'help', usage: 'help' }
        ]
        if(!input){
            return this.getBanner()
        } else {
            input = input.trim().toLowerCase()
        }

        const commandArguments = input.split(" ").map((item) => {return item.trim()})


        if(!validAnswers.map(cmd => {return(cmd.command)}).includes(commandArguments[0])){
            return(
            `
            ================

            Please reply with an action such as ${prettyJoin(validAnswers.map(cmd => {return(cmd.usage)}))}

            ================\n\n `)
        }

        switch ( commandArguments[0] ) {
            case 'yes':
                return this.context.on_confirm()
                break;
            case 'no':
                return this.context.on_deny()
                break;
            case '..':
            case 'help':
                return this.getBanner()
                break;
            default:
                break;
            }
        return "NOT IMPLEMENTED"
    }
}

module.exports = {YesNoDialog}


// TODO: add ability to add task after a specific task
// ask if gpt wants to add a subtask for task