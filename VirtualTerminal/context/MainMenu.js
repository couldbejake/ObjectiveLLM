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
        report [message] - Allows you to make a report of a bug in the menu.


        What would you like to do?

        ================\n\n> `
    }

    run(input){
        var validAnswers = ['steps', 'diary', 'notes', 'help', 'report']
        if(!input){
            return this.getBanner()
        } else {
            input = input.trim().toLowerCase()
        }

        if(!validAnswers.includes(input)){
            return(
            `
            ================

            Please reply with ${prettyJoin(validAnswers)}

            ================\n\n> `)
        }
        switch (input) {
            case 'steps':
                return this.terminal.switchTo('tasksteps')
                break;
            case 'help':
                return this.getBanner();
                break;
            case 'report':
                console.log(input)
                process.exit()
                console.log("GPT has reporterd")
                return "Report has been sent"
            default:
                break;
        }
        return "NO RESPONSE"

    }
}

module.exports = {MainMenu}