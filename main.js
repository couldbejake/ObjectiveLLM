
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


    var currentTask = `
    Create tasks and subtasks for writing a random word generator, then create it using the action menu. 
    You should update the tasks and subtasks as you complete them. 
    Create an initial maximum of 1 tasks and 1 subtasks.
    Please test and execute the code using iterative development.
    `

    //var currentTask = "Navigate to the action pane, and overwrite the file test.py with a simple word generator"


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
        4) Code - Provides a sub menu that allows you to run/edit/execute code from the virtual terminal.
        5) Actions - View, edit and execute files from the virtual terminal. 
            - Avoid commands that require multiple steps of interaction. 
            - If possible, always use the commands supplied in the virtual terminal, rather than the terminal [cmd] command, which gets the output of a real terminal.

        You should revisit the terminal to refresh your knowledge to ensure the best outcome.

        You will navigate this terminal to achieve an outcome, do not attempt the same command, or series of commands repeatedly, attempt a new decision.

        Each reply should contain:

        - A command surrounded by the pattern <contextgptcommand> and </contextgptcommand>. 
            An example would be:
             <contextgptcommand>
                help
             </contextgptcommand> 
             which would show a help menu
        - A explicit description of what you are deciding to do, 
            - An explicit description of what you are trying to do. Include reasoning as to why you are making the decision, problems you encounter, and what we should do to solve it. 
            - Where possible, please supply a minimum of 2 reasons behind your decision.
            - Surround your descrition with <contextgptdescription> and </contextgptdescription>. 
            An example would be:
            <contextgptdescription>
                I will use the "help" command to see the available options in the main menu. This will give me a better understanding of the commands I can use.
            </contextgptdescription>

        
        ================

    `, {dontPrune: true}) 

/*
    2) Diary - The diary contains a list of each item you have already attempted (within other conversations). 
    3) Notes - You are encouraged to write notes for yourself. This should include comments, suggestions, views and useful advice for your future self.
  */  

    var terminalOutput = await terminal.run()
    console.log(terminalOutput)
    convo.addUser(terminalOutput)

    while(shouldRun){
        if(!terminal.hasTerminalEnded()){

            await new Promise((done) => {
                convo.compute().then(async (answer) => {
    
                    console.log(answer)
                    convo.addSystem(answer)

                    var action = findTagContent(answer, 'contextgptcommand')
                    var thought = findTagContent(answer, 'contextgptdescription')
        
                    if(thought.trim() && action.trim()){
            
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
            
                        Your response did not contain the <contextgptcommand> and <contextgptdescription> tags.

                    - A command surrounded by the pattern <contextgptcommand> and </contextgptcommand>. 
                        An example would be:
                        <contextgptcommand>
                            help
                        </contextgptcommand> 
                        which would show a help menu
                    - A explicit description of what you are deciding to do, 
                        - An explicit description of what you are trying to do. Include reasoning as to why you are making the decision, problems you encounter, and what we should do to solve it. 
                        - Where possible, please supply a minimum of 2 reasons behind your decision.
                        - Surround your descrition with <contextgptdescription> and </contextgptdescription>. 
                        An example would be:
                        <contextgptdescription>
                            I will use the "help" command to see the available options in the main menu. This will give me a better understanding of the commands I can use.
                        </contextgptdescription>

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



function findTagContent(text, tag) {
    // Constructing the regex pattern to find the specified tag and its content
    const pattern = new RegExp(`<${tag}>(.*?)</${tag}>`, 'gs');
    
    // Using regex to find all occurrences of the pattern in the text
    const matches = [];
    let match;
    
    while ((match = pattern.exec(text)) !== null) {
        matches.push(match[1]);
    }

    if(matches.length == 0){
        return ""
    } else {
        return matches[0]
    }
}





/*


maybe give gpt the option to do it's own pruning - ADD TO DOC

    add diary to every sub menu

add observer which watches actions in menu, and makes suggestions in notes. this will prevent loops. if hasn't visited main menu in a while, then run code to check it




CHANGE MAIN GOAL

- 1. OUTLINE PROGRAM
- 2. WRITE PROGRAM... testing ...

get GPT to write psuedo code, then create functions that should call each other.


*/


// add objectives too.
// when a task is checked off, change objectives/goals
// GPT should be able to change CURRENT OBJECTIVE

// reset to main menu every 60 seconds in case of hard stuck state.
// gpt-4, we can reset whole conversation history without pruning to prevent hallucinations - which do exist.
// allow got to find alternative solution




// add ability for GPT to view complete pruned conversation history
// maybe allow gpt to talk to it's future self after pruning

/*
    terminal.switchTo('mainmenu')

    var terminalOutput = await terminal.run()

    console.log(terminalOutput)
    convo.addUser(terminalOutput)
*/







// INTERACTION



//Screen Readers: These are software programs that help the visually impaired by reading out loud the text that is displayed on the screen. For Windows, popular screen readers include Narrator (built into Windows) and third-party applications like JAWS (Job Access With Speech) and NVDA (NonVisual Desktop Access).
//Keyboard Shortcuts and Accessibility Features: Windows includes various keyboard shortcuts that make navigation easier without a mouse. Additionally, there are accessibility features like Sticky Keys, Filter Keys, and Toggle Keys that help users with limited dexterity.


// Use NVDA (NonVisual Desktop Access) for reading the screen, and returning data to AI.


// add thought to diary, or maybe just use thought as diary?





// maybe keep a cost of how many tokens have been used up, and how many will be used when making commits?




// gpt has suggested undo feature, search and filter of subtasks and tasks.
// more details help menu





// GOOD SOLUTION::

// observation, explination, solution


// terminal should show a list of files and their purposes...?


// change Final Goal to CURRENT TASK


// strategy for each global task.
// ex. rename every function
// change prompt, create tasks for each function


// maybe start program with human<->gpt interaction, and see what to create from there


Max tasks page
Objectives trigger changing of tasks
