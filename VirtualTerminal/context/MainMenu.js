const {prettyJoin} = require("../../Utils")


class MainMenu {
    constructor(terminal){
        this.terminal = terminal; if(!terminal) {console.log("Terminal wasn't given")}
        this.title = "Main Menu"
    }

/*

        diary - View a list of actions you have attempted
        n - View Notes
        
        h - View this menu

        */
    getBanner(){
        return `
        ================

        ╔═╗╔═╗╔╗╔╔╦╗╔═╗═╗ ╦╔╦╗╔═╗╔═╗╔╦╗
        ║  ║ ║║║║ ║ ║╣ ╔╩╦╝ ║ ║ ╦╠═╝ ║ 
        ╚═╝╚═╝╝╚╝ ╩ ╚═╝╩ ╚═ ╩ ╚═╝╩   ╩ 

        Main Menu

        steps - View task steps
        help - Shows this menu
        ${/* report [message] - Allows you to make a report of a bug in the menu. */ () => {}}
        human - Ask for human interaction

        What would you like to do?

        ================\n\n> `
    }

    run(input){

        var validAnswers = [
            { command: 'steps', usage: 'steps' },
            { command: 'diary', usage: 'diary' },
            { command: 'notes', usage: 'notes' },
            { command: 'help', usage: 'help' },
            { command: 'report', usage: 'report [message]' },
            { command: 'human', usage: 'human'}
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

            ================\n\n> `)
        }
        switch (commandArguments[0]) {
            case 'steps':
                return this.terminal.switchTo('tasksteps')
                break;
            case 'help':
                return this.getBanner();
                break;
            case 'report':

                if(commandArguments.length < 3){
                    return `
                    ================
        
                    Please choose a report message
                    report [message]
        
                    ================\n\n> `
                }

                var report_message = commandArguments.slice(1, commandArguments.length).join(' ');

                console.log("GPT has reported")
                console.log(report_message)

                process.exit()
                return "Report has been sent"
            case 'human':
                return this.terminal.switchTo('human');
            default:
                break;
        }
        return "NO RESPONSE"

    }
}

module.exports = {MainMenu}