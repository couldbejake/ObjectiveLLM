
// RUNGPT
// PASSGPT?

// features:
    // to add, internet access and help.
    // allow attaching of debugger
    // have separate user terminal and allow them to view bot in real time, or view summary
    // change help functionality, show list of commands

// maybe increase temperature if program repetedly fails
// give GPT option to change it's own temperature

// allow GPT to edit terminal code?

// go back to the same step if pressing back

// I spoke to XYZ, and told him ABC. (when GPT speaks to another model)



// NOTE: We lookup by index, do we want to change this to lookup by id, so if an item is removed, we still refer to the same item.

// TODO: standardise IDS and indexes, 0 indexed or not, decide!

// var subtask = this.terminal.getSubTask(this.context.task_id, this.context.subtask_id)

// move canPrune outside message so openai can't view it


const conversation = require('./GPT/conversation');
const GPT = require('./GPT/gpt');
const VirtualTerminal = require('./VirtualTerminal/Terminal');

var gpt = new GPT();
var convo = gpt.newConversation();

async function main() {

    this.shouldRun = true;


    var currentTask = "Create 5 tasks detailing steps towards creating a random number generator in Python. After this is complete, run `human` in the main menu"


    const terminal = new VirtualTerminal(convo, currentTask)


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

        You will navigate this terminal to achieve an outcome, do not attempt the same command, or series of commands repeatedly, attempt a new decision.

        Each reply should contain:

        - A command in square brackets
        - A explicit description of what you are deciding to do, and reasoning why in surrounded by asterisks. Where possible, please supply at least 2 reasons behind your decision.

        example:

        [help]
        *I will use the "help" command to see the available options in the main menu. This will give me a better understanding of the commands I can use.* 
        
        ================

    `, {dontPrune: true}) 


    var terminalOutput = await terminal.run()
    console.log(terminalOutput)
    convo.addUser(terminalOutput)

    while(shouldRun){
        if(!terminal.hasTerminalEnded()){

            await new Promise((done) => {
                convo.compute().then(async (answer) => {
    
                    var asteriks = answer.match(/\*(.*?)\*/)
                    var brackets = answer.match(/\[(.*?)\]/)
        
                    console.log(answer)
    
                    convo.addSystem(answer)
        
                    if(asteriks && brackets){
                        try {
                            var thought = asteriks[1];
                            var action = brackets[1];
                        } catch (error) {
                            console.log("\n\n"); console.log(error)
                            console.log("error occured")
                            console.log(`${answer}`)
                            process.exit(0)                        
                        }
            
                        console.log("\n".repeat(5))
                        console.log("GPT Terminal Command: ");
                        console.log("> \x1b[33m" + action + "\x1b[0m")
                        console.log("\n".repeat(1))
                        console.log('\x1b[32m' + "GPT Thought: " + thought + '\x1b[0m');
                        console.log("\n".repeat(1))

                        terminalOutput = terminal.run(action).then((terminalOutput) => {
                            console.log(terminalOutput)
                            convo.addUser(terminalOutput)
                            done()
                        })
    
    
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
    
                        console.log(`\n<Error: GPT did not use asterisks, asking GPT to repeat message>\n`)
        
                        done()
    
                    }
                }).catch(async (err) => {
                    if(!err.gpt_error){
                        console.log(err)
                        process.exit()
                    }
                    
                    if(err.error_code == 'context_length_exceeded'){
                        console.log("\n".repeat(10))

                        convo.pruneConversation()

                        var pruneMessage = '\n'.repeat(10) + `
                        ! xxxxx ! ================ ! xxxxx !
            
                        The context window was exceeded, earlier messages were pruned. 
                        Use \`diary\` for actions attempted before pruning.
            
                        ! xxxxx ! ================ ! xxxxx !\n\n `.split('\n').map(line => line.trimStart()).join('\n')

                        console.log(pruneMessage)
                        convo.addUser(pruneMessage)
                        
                        done()
                    } else {
                        console.log("Unknown error in main.js, not resolving promise.")
                        console.log(err)
                    }

                })
            })
        }
        
        await new Promise(r => setTimeout(r, 2000));

    }

}


main();









/*


maybe give gpt the option to do it's own pruning - ADD TO DOC

    add diary to every sub menu

add observer which watches actions in menu, and makes suggestions in notes. this will prevent loops. if hasn't visited main menu in a while, then run code to check it




CHANGE MAIN GOAL

- 1. OUTLINE PROGRAM
- 2. WRITE PROGRAM... testing ...

get GPT to write psuedo code, then create functions that should call each other.


*/






// add ability for GPT to view complete pruned conversation history
// maybe allow gpt to talk to it's future self after pruning

/*
                        terminal.switchTo('mainmenu')

                        var terminalOutput = await terminal.run()

                        console.log(terminalOutput)
                        convo.addUser(terminalOutput)
                        */