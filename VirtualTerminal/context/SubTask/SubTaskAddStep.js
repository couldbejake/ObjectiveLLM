
const { SubTask } = require("../../../Types/SubTask");
const {prettyJoin, isNumeric} = require("../../../Utils");

class SubTaskAddStep {
    constructor(terminal, context){
        
        this.terminal = terminal; if(!terminal) {console.log("Terminal wasn't given")}
        this.context = context;

        this.title = "Add Sub Task"

        this.titleToAdd = null;
        this.descriptionToAdd = null;
        this.stateToAdd =  "not-yet-attempted";

    }
    getBanner(){


        this.tempTask = new SubTask({
            title: this.titleToAdd,
            description: this.descriptionToAdd,
            state: this.stateToAdd
        })

        return `
        ===== [Add Sub Task to Task #${this.context.task_id}] ===== 
        
        (Main Menu > Tasks > Task #${this.context.task_id} > Add Sub Task)

        Final Goal: "${this.terminal.globalTask}"

        ----

        Please set each of theses items before attempting to complete this menu.

        Sub Task Name: ${this.titleToAdd ? this.titleToAdd : '[unset]'}
        Sub Task Description: ${this.descriptionToAdd ? this.descriptionToAdd : '[unset]'}
        Sub Task State: ${this.stateToAdd ? this.stateToAdd : '[unset]'}

        ----

        title [new title] - set the title
        description [new description] - set the description
        state [not-yet-attempted|in-progress|completed] - set the state of the sub task

        complete - adds the new sub task
        cancel - cancels adding a new sub task

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
        
                    Please choose a complete title for the new sub task
                    title [title]
        
                    ================\n\n `
                }

                var new_title = commandArguments.slice(1, commandArguments.length).join(' ');

                if(new_title.length > 1048){
                    return `
                    ================
        
                    Your title is too long, the maximum length is 1048 characters, and should be brief.
                    title [title]
        
                    ================\n\n `
                }

                this.titleToAdd = new_title

                return this.getBanner() + `
                ================
    
                Sub Task title has been set successfully!
    
                ================\n\n `

                break;
            case 'description':
                if(commandArguments.length < 2){
                    return `
                    ================
        
                    Please choose a complete description for the new sub task
                    description [description]
        
                    ================\n\n `
                }

                var new_description = commandArguments.slice(1, commandArguments.length).join(' ');

                if(new_description.length > 1048){
                    return `
                    ================
        
                    Your description is too long, the maximum length is 1048 characters.
                    description [description]
        
                    ================\n\n `
                }

                this.descriptionToAdd = new_description

                return this.getBanner() + `
                ================
    
                Sub Task description has been set successfully!
    
                ================\n\n `
                break;
            case 'state':

                const possibleStates = ['not-yet-attempted', 'in-progress', 'completed']

                var subCategory = commandArguments[1];

                if(!possibleStates.includes(subCategory)){
                    return `
                    ================
        
                    Please choose a valid sub task state ${prettyJoin(possibleStates)}
                    state [not-yet-attempted|in-progress|completed]
        
                    ================\n\n `
                }


                this.stateToAdd = subCategory

                return this.getBanner() + `
                ================
    
                Sub Task state has been set successfully!
    
                ================\n\n `
                break;
            case 'complete':
                if(!this.titleToAdd){
                    return `
                    ================
        
                    You have not specified a sub task title, either set a title, or cancel sub task creation.
                    title [title]
        
                    ================\n\n `
                }

                if(!this.descriptionToAdd){
                    return `
                    ================
        
                    You have not specified a sub task description, either set a description, or cancel sub task creation.
                    description [description]
        
                    ================\n\n `
                }
                var newTask = new SubTask({
                    title: this.titleToAdd,
                    description: this.descriptionToAdd,
                    state: this.stateToAdd
                })

                var new_task_id = this.terminal.addSubTaskToEnd(this.context.task_id, newTask)

                return this.terminal.switchTo('subtasktaskstep', {
                    task_id: this.context.task_id,
                })
                break;
            case 'cancel':
                return this.terminal.switchTo('subtasktaskstep', {
                    task_id: this.context.task_id,
                })
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

module.exports = { SubTaskAddStep }


// TODO: add ability to add task after a specific task
// ask if gpt wants to add a subtask for task