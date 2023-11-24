
const { Task } = require("../../../Task");
const {prettyJoin, isNumeric} = require("../../../Utils");

class TaskAddStep {
    constructor(terminal, context){
        this.terminal = terminal; if(!terminal) {console.log("Terminal wasn't given")}
        this.context = context;

        this.title = "Add Task"

        this.titleToAdd = null;
        this.descriptionToAdd = null;
        this.stateToAdd =  "not-yet-attempted";

    }
    getBanner(){


        this.tempTask = new Task({
            title: this.titleToAdd,
            description: this.descriptionToAdd,
            state: this.stateToAdd
        })

        return `
        ===== [Add Task] ===== 
        
        (Main Menu > Tasks > Add Task)

        Final Goal: "${this.terminal.globalTask}"

        ----

        Task Name: ${this.titleToAdd ? this.titleToAdd : '[unset]'}
        Task Description: ${this.descriptionToAdd ? this.descriptionToAdd : '[unset]'}
        State: ${this.stateToAdd ? this.stateToAdd : '[unset]'}

        ----

        title [new title] - set the title
        description [new description] - set the description
        state [not-yet-attempted|in-progress|completed] - set the state of the task

        complete - adds the new task
        cancel - cancels adding a new task

        help - Shows this menu

        What would you like to do?

        ================\n\n `
    }
    run(input){
        var validAnswers = [
            { command: 'title', usage: 'title [new title]' },
            { command: 'description', usage: 'description [new description]' },
            { command: 'state', usage: 'state [not-yet-attempted|in-progress|completed]' },
            { command: 'complete', usage: 'complete' },
            { command: 'cancel', usage: 'cancel' },
            { command: 'help', usage: 'help' },
            { command: '..', usage: '..'}

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

        switch ( commandArguments[0] ) {
            case 'title':
                if(commandArguments.length < 2){
                    return `
                    ================
        
                    Please choose a complete title for the new task
                    title [title]
        
                    ================\n\n `
                }

                var new_title = commandArguments.slice(1, commandArguments.length).join(' ');

                if(new_title.length > 150){
                    return `
                    ================
        
                    Your title is too long, the maximum length is 150 characters, and should be brief.
                    title [title]
        
                    ================\n\n `
                }

                this.titleToAdd = new_title

                return this.getBanner() + `
                ================
    
                Task title has been set successfully!
    
                ================\n\n `

                break;
            case 'description':
                if(commandArguments.length < 2){
                    return `
                    ================
        
                    Please choose a complete description for the new task
                    description [description]
        
                    ================\n\n `
                }

                var new_description = commandArguments.slice(1, commandArguments.length).join(' ');

                if(new_description.length > 150){
                    return `
                    ================
        
                    Your description is too long, the maximum length is 150 characters.
                    description [description]
        
                    ================\n\n `
                }

                this.descriptionToAdd = new_description

                return this.getBanner() + `
                ================
    
                Task description has been set successfully!
    
                ================\n\n `
                break;
            case 'state':

                const possibleStates = ['not-yet-attempted', 'in-progress', 'completed']

                var subCategory = commandArguments[1];

                if(!possibleStates.includes(subCategory)){
                    return `
                    ================
        
                    Please choose a valid task state ${prettyJoin(possibleStates)}
                    state [not-yet-attempted|in-progress|completed]
        
                    ================\n\n `
                }


                this.stateToAdd = subCategory

                return this.getBanner() + `
                ================
    
                Task state has been set successfully!
    
                ================\n\n `
                break;
            case 'complete':
                if(!this.titleToAdd){
                    return `
                    ================
        
                    You have not specified a task title, either set a title, or cancel task creation.
                    title [title]
        
                    ================\n\n `
                }

                if(!this.descriptionToAdd){
                    return `
                    ================
        
                    You have not specified a task description, either set a description, or cancel task creation.
                    description [description]
        
                    ================\n\n `
                }
                var newTask = new Task({
                    title: this.titleToAdd,
                    description: this.descriptionToAdd,
                    state: this.stateToAdd
                })

                var new_task_id = this.terminal.addTaskEnd(newTask)

                return this.terminal.switchTo('yesnodialog', {
                    title: `
                        Task #${new_task_id} Added successfully!
                        Would you like to view the new task's subtasks?
                    `,
                    confirm_text: "yes",
                    confirm_description: "view new task subtasks",
                    deny_text: "no",
                    deny_description: "return to main menu",
                    on_confirm: () => {
                        return this.terminal.switchTo('subtasktaskstep', {
                            task_id: new_task_id,
                            added: true
                        })
                    },
                    on_deny: () => {
                        return this.terminal.switchTo('tasksteps')
                    }
                })
                break;
            case 'cancel':
                return this.terminal.switchTo('tasksteps')
                break;
            case '..':
            case 'help':
                return this.getBanner()
                break;
            default:
                break;
            }
        return "NOT IMPLEMENTED"
    }
}

module.exports = {TaskAddStep}


// TODO: add ability to add task after a specific task
// ask if gpt wants to add a subtask for task