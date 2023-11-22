const {prettyJoin} = require("../../Utils")



class MainMenu {
    constructor(){
        this.banner = `
        ================

        ╔═╗╔═╗╔╗╔╔╦╗╔═╗═╗ ╦╔╦╗╔═╗╔═╗╔╦╗
        ║  ║ ║║║║ ║ ║╣ ╔╩╦╝ ║ ║ ╦╠═╝ ║ 
        ╚═╝╚═╝╝╚╝ ╩ ╚═╝╩ ╚═ ╩ ╚═╝╩   ╩ 

        Main Menu

        v - View task steps
        l - View a list of actions you have attempted
        n - View Notes
        
        h - View this menu

        What would you like to do?

        ================\n\n> `
    }
    run(input){
        var validAnswers = ['v', 'l', 'n', 'h']
        if(!input){
            return this.banner
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
            case 'h':
                return this.banner;
                break;
            default:
                break;
        }
    }
}

module.exports = {MainMenu}