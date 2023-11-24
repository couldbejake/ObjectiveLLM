
// RUNGPT
// PASSGPT?

// features:
    // to add, internet access and help.
    // allow attaching of debugger
    // have separate user terminal and allow them to view bot in real time, or view summary
    // change help functionality, show list of commands

// maybe increase temperature if program repetedly fails
// give GPT option to change it's own temperature

// I spoke to XYZ, and told him ABC. (when GPT speaks to another model)

const GPT = require('./GPT/gpt');
const VirtualTerminal = require('./VirtualTerminal/Terminal');


var shouldRun = true;

var gpt = new GPT();

var convo = gpt.newConversation();


async function main() {


    var currentTask = "Give feedback on the implemented parts of the terminal"


    const terminal = new VirtualTerminal(this, currentTask)


    convo.addUser(`

        ================

        You are a programmer, you have access to a virtual terminal.
        In this terminal, you can navigate menus to solve a given task.

        In order to achieve this goal, you have been given access to a virtual terminal.
        
        The task has been split up into steps and sub steps. You will focus on one sub step at a time to achieve the final goal.
        
        The final goal: ${currentTask}

        In order to avoid context window size limitations, you will attempt to achieve a smaller goal with each sub step.
        
        The virtual terminal allows you to log what you have attempted, make notes and edit code.
        
        GPT (you) have been provided this terminal to achieve a final goal

        The virtual terminal features the following:

        1) Steps - Each step is a smaller subtask towards a final goal.
        2) Diary - The diary contains a list of each item you have already attempted (within other conversations). 
        3) Notes - You are encouraged to write notes for yourself. This should include comments, suggestions, views and useful advice for your future self.
        4) Code - Provides a sub menu that allows you to run/edit/execute code from the virtual terminal.
        
        You should revisit the terminal to refresh your knowledge to ensure the best outcome.

        You will navigate this terminal to achieve an outcome, do not attempt the same thing repeatedly, attempt a new decision.

        Each reply should contain:

        - A command in square brackets
        - A explicit description of what you are deciding to do, and reasoning why in surrounded by asterisks. Where possible, please supply at least 2 reasons behind your decision.

        
        ================

    `) 

    var terminalOutput = terminal.run()
    console.log(terminalOutput)
    convo.addUser(terminalOutput)


    while(shouldRun){
        await new Promise((done) => {
            convo.compute().then(async (answer) => {

                var asteriskCount = (answer.match(/\*/g) || []).length;
    
                console.log(answer)

                convo.addSystem(answer)
    
                if(asteriskCount >= 2){
                    var thought = answer.match(/\*(.*?)\*/)[1];
                    var action = answer.match(/\[(.*?)\]/)[1];
        
                    console.log("\n".repeat(100))
                    console.log('\x1b[32m' + "GPT Thought: " + thought + '\x1b[0m');
                    console.log("\n".repeat(1))
                    console.log("GPT Terminal Command: ");
                    console.log("> \x1b[33m" + action + "\x1b[0m")
                    console.log("\n".repeat(1))
        
        
                    terminalOutput = terminal.run(action)

                    console.log(terminalOutput)

        
                    convo.addUser(terminalOutput)
                } else {
                    convo.addUser(`
                    ================
        
                    Your response did not contain asterisks. Please use these to explain what you are attempting to do.#

                    Each reply should contain:

                    - A command in square brackets
                    - A description of what you are deciding to do, and reasoning why in surrounded by asterisks.

                    An example

                    [help]
                    *I will use the "help" command to see the available options in the main menu. This will give me a better understanding of the commands I can use.* 
                    
                    ================\n\n `)

                    console.log("GPT ERROR RESPONSE: " + answer)

                    console.log(`<GPT DID NOT USE asterisks, asking to repeat message>`)
    
                }
    
                done()
            })
        })
        await new Promise(r => setTimeout(r, 6000));

    }

}

async function questions(){
    const readline = require('readline');
            
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    while(true){
        await new Promise((done) => {
            rl.question(">", (input) => {
                shouldRun = false;
                convo.addUser(input)
                convo.compute().then(async (answer) => {
                    convo.addSystem(answer)
                    console.log(answer)  
                    done()
                })
            });
        });
        await new Promise(r => setTimeout(r, 100));
    }
}




main();
questions();