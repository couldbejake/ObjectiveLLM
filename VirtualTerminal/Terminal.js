const {MainMenu} = require('./context/MainMenu')

class VirtualTerminal {
    constructor(){
        this.currentMenu = new MainMenu();
    }
    run(input){
        return this.currentMenu.run(input)
    }
    switchTo(){
        
    }
}

module.exports = VirtualTerminal







///////////////////////////

const terminal = new VirtualTerminal()



const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function userTest(){

    var lastInput;

    while(true){
        const print = terminal.run(lastInput ? lastInput : null).split('\n').map(line => line.trimStart()).join('\n')
        await new Promise((resolve, reject) => {
            rl.question(print, (input) => {
                lastInput = input;
                resolve()
            });
        })
    }
}

userTest()

///////////////////////////




/*



    convo.addSystem() 

    convo.addUser(`

    ================
    
    ╔═╗╔═╗╔╗╔╔╦╗╔═╗═╗ ╦╔╦╗╔═╗╔═╗╔╦╗
    ║  ║ ║║║║ ║ ║╣ ╔╩╦╝ ║ ║ ╦╠═╝ ║ 
    ╚═╝╚═╝╝╚╝ ╩ ╚═╝╩ ╚═ ╩ ╚═╝╩   ╩ 

    Main Menu

    v - View task steps
    d - View a list of actions you have attempted
    n - View Notes

    What would you like to do?

    ================
    
    `)


    */