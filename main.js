const GPT = require('./GPT/gpt')

async function main() {
    var gpt = new GPT();


    var currentTask = "Create a spotify to mp3 downloader"

    var convo = gpt.newConversation();

    // to add, internet access and help.
    convo.addSystem(`

        ================

        You are a programmer, you have access to a virtual terminal.
        In this terminal, you can navigate menus to solve a given task.

        In order to achieve this goal, you have been given access to a virtual terminal.
        
        The task has been split up into steps. You will focus on one step at a time to achieve the final goal.
        The final goal: ${currentTask}

        In order to avoid context window size limitations, you will attempt to achieve a smaller goal with each step.
        
        The virtual terminal allows you to log what you have attempted, and each smaller goal.
        
        GPT (you) have been provided this terminal to achieve a final goal

        The virtual terminal features the following:

        1) Steps - Each step is a smaller subtask towards a final goal.
        2) Diary - The diary contains a list of each item you have already attempted (within other conversations). 
        3) Notes - You are encouraged to write notes for yourself. This should include comments, suggestions, views and useful advice for your future self.
        4) Code - Provides a sub menu that allows you to run/edit/execute code from the virtual terminal.
        
        You should revisit the terminal to refresh your knowledge to ensure the best outcome.
        
        ================

    `) 

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

    convo.compute().then((answer) => {
        console.log(answer)
    })

}

main();