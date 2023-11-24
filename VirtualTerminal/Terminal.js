const {MainMenu} = require('./context/MainMenu')
const {TaskStep} = require("./context/Task/TaskStep")
const {TaskStepEdit} = require("./context/Task/TaskEditStep")
const { SubTaskStep } = require('./context/SubTask/SubTaskStep')
const { Task } = require('../Task')
const { SubTask } = require('../SubTask')

class VirtualTerminal {
    constructor(convo, globalTask){
        this.convo = convo
        this.globalTask = globalTask
        this.tasks = [
            new Task({
                title: "Check environment", 
                description: "Check the current system's environment (os, version)",
                state: "not-yet-attempted",
                subtasks: [
                    new SubTask({
                        title: "Check OS version",
                        description: "Check the OS version using the Virtual Terminal",
                        state: "not-yet-attempted"
                    }),
                    new SubTask({
                        title: "Check other version numbers",
                        description: "Check other version numbers using the Virtual Terminal",
                        state: "not-yet-attempted"
                    }),
                    new SubTask({
                        title: "Think about other requirements",
                        description: "Check other version numbers using the Virtual Terminal",
                        state: "not-yet-attempted"
                    }),
                ]
            }),
            new Task({
                title: "Create new tasks", 
                description: "Add to the task list",
                state: "not-yet-attempted",
                subtasks: [
                    new SubTask({
                        title: "Complete your first sub task",
                        description: "Create a new sub task and set it up with a description",
                        state: "not-yet-attempted"
                    })
                ]
            }),
            new Task({
                title: "Create new tasks", 
                description: "Add to the task list",
                state: "not-yet-attempted",
                subtasks: [
                    new SubTask({
                        title: "Complete your first sub task",
                        description: "Create a new sub task and set it up with a description",
                        state: "not-yet-attempted"
                    })
                ]
            }),
        ]
        this.currentMenu = new MainMenu(this);
        //this.currentMenu = new SubTaskStep(this, {
        //    task_id: 2
        //})

        this.hasEnded = false;
    }
    async run(lastInput){
        // TODO: reorder task list indexes
        this.reIndexTasksAndSubtasks()
        var output = "\n".repeat(24) + this.currentMenu.run(lastInput ? lastInput : null).split('\n').map(line => line.trimStart()).join('\n')
        return output;
    }
    switchTo(menuName, context){
        if(!context) {context = {}}
        context.globalTask = this.globalTask
        switch (menuName) {
            case 'mainmenu':
                this.currentMenu = new MainMenu(this, context);
                break;
            case 'tasksteps':
                this.currentMenu = new TaskStep(this, context);
                break;
            case 'edittaskstep':
                this.currentMenu = new TaskStepEdit(this, context);
                break;
            case 'subtasktaskstep':
                this.currentMenu = new SubTaskStep(this, context)
                break;
            case 'human':

                const readline = require('readline');
            
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });

                setTimeout(async () => {
                    this.hasEnded = true;
                    this.convo.addSystem("The terminal has switched to a user conversation. I should now give my feedback to the developer. Keep messages fairly short")
                    console.log("Switched to GPT-human conversation.")
                    while(true){
                        await new Promise((done) => {
                            console.log("\n".repeat("5"))
                            rl.question("> ", (input) => {
                                this.convo.addUser(input)
                                this.convo.compute().then(async (answer) => {
                                    this.convo.addSystem(answer)
                                    console.log("\n\nGPT: " + answer + "\n\n") 
                                    console.log("\n".repeat("5"))
                                    done()
                                })
                            });
                        })
                    }
                }, 1000);


                return "Switched to GPT-Human interaction. Exited Terminal";
                break;
            default:
                return "NOT IMPLEMENTED"
                break;
        }
        return this.currentMenu.run()
    }
    getTask(task_id) {
        return this.tasks[task_id - 1]
    }
    getSubTasks(task_id){
        var task = this.tasks[task_id - 1]
        return (task) ? task.getSubTasks() : null;
    }
    reIndexTasksAndSubtasks(){
        var total_subtask_counter = 0;
        for (let task_id_counter = 0; task_id_counter < this.tasks.length; task_id_counter++) {
            const task = this.tasks[task_id_counter];
            this.tasks[task_id_counter].task_id = task_id_counter
            for (let subtask_id_counter = 0; subtask_id_counter < task.getSubTasks().length; subtask_id_counter++) {
                const subtask = task.getSubTasks()[subtask_id_counter];
                this.tasks[task_id_counter].subtasks[subtask_id_counter].subtask_id = subtask_id_counter;
                this.tasks[task_id_counter].subtasks[subtask_id_counter].task_id = task_id_counter;
                this.tasks[task_id_counter].subtasks[subtask_id_counter].total_subtask_index = total_subtask_counter
                total_subtask_counter++;
            }
        }
    }
    hasTerminalEnded(){
        return this.hasEnded;
    }
}

module.exports = VirtualTerminal





///////////////////////////

if (require.main === module) {
    const terminal = new VirtualTerminal(null, "Testing, fake virtual terminal")

    const readline = require('readline');
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    async function userTest(){
    
        var lastInput;
    
        while(true){
            await new Promise((resolve, reject) => {
                terminal.run(lastInput).then(async (print) => {
                    rl.question(print, (input) => {
                        lastInput = input;
                        resolve()
                    });
                })
            })
        }
    }
    
    userTest()
}



///////////////////////////
