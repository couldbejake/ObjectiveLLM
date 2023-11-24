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
        ===== [Main Menu] ===== 
                                                                      
         ______  _____  _____  _____  _____  __ __  _____  _____  _____  _____ 
        |     ||     ||   | ||_   _||   __||  |  ||_   _||   __||  _  ||_   _|
        |   --||  |  || | | |  | |  |   __||-   -|  | |  |  |  ||   __|  | |  
        |_____||_____||_|___|  |_|  |_____||__|__|  |_|  |_____||__|     |_|  
                                                                              

        Main Menu

        tasks - View tasks
        help - Shows this menu
        human - Allows you to make a report of a bug in the menu.

        pruned = Allows you to view pruned messages

        What would you like to do?

        ================\n\n `
    }

    run(input){

        var validAnswers = [
            { command: 'tasks', usage: 'tasks' },
            { command: 'diary', usage: 'diary' },
            { command: 'notes', usage: 'notes' },
            { command: 'help', usage: 'help' },
            { command: 'report', usage: 'report [message]' },
            { command: 'human', usage: 'report [message]' },
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
        switch (commandArguments[0]) {
            case 'tasks':
                return this.terminal.switchTo('tasksteps')
                break;
            case 'help':
                return `
                tasks - View tasks
                help - Shows this menu
                human - Allows you to make a report of a bug in the menu.
                `
                break;
            case 'report':

                if(commandArguments.length < 3){
                    return `
                    ================
        
                    Please choose a report message
                    report [message]
        
                    ================\n\n `
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
        return "NOT IMPLEMENTED"

    }
}

module.exports = {MainMenu}