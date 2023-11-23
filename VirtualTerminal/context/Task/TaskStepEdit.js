const {prettyJoin, isNumeric} = require("../../../Utils");


class TaskStepEdit {
    constructor(terminal, context){
        this.terminal = terminal; if(!terminal) {console.log("Terminal wasn't given")}
        this.context = context;

        this.title = "Edit Task Step"

    }
    getBanner(){
        return `
        ================

        Editing Task ${this.context.task_id}

        Global Task: "Create a spotify to mp3 downloader"

        ----

        Task Name: ${this.terminal.getTask(this.context.task_id).title}
        Task Description: ${this.terminal.getTask(this.context.task_id).description}
        State: ${this.terminal.getTask(this.context.task_id).getStatePretty()}

        ----

        rename [new title] - change the title
        description [new description] - change the description
        state [not-attempted|in-progress|completed] - change the state of the task

        back - go back to the main menu
        help - Shows this menu

        What would you like to do?

        ================\n\n> `
    }
    run(input){
        var validAnswers = [
            { command: 'rename', usage: 'rename [new title]' },
            { command: 'description', usage: 'description [new description]' },
            { command: 'state', usage: 'state [not-attempted|in-progress|completed]' },
            { command: 'back', usage: 'back' },
            { command: 'help', usage: 'help' },
            { command: 'back', usage: 'back' },
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

            ================\n\n> `)
        }

        switch ( commandArguments[0] ) {
            case 'rename':
                if(commandArguments.length < 3){
                    return `
                    ================
        
                    Please choose a complete title for the task
                    rename [new title]
        
                    ================\n\n> `
                }

                var new_title = commandArguments.slice(1, commandArguments.length).join(' ');

                if(new_title.length > 50){
                    return `
                    ================
        
                    Your title is too long, the maximum length is 50 characters, and should be brief.
                    rename [new title]
        
                    ================\n\n> `
                }

                this.terminal.getTask(this.context.task_id).setTitle(new_title)

                return this.getBanner() + `
                ================
    
                Task title has been changed successfully!
    
                ================\n\n> `

                break;
            case 'description':
                if(commandArguments.length < 3){
                    return `
                    ================
        
                    Please choose a complete description for the task
                    description [new description]
        
                    ================\n\n> `
                }

                var new_description = commandArguments.slice(1, commandArguments.length).join(' ');

                if(new_description.length > 50){
                    return `
                    ================
        
                    Your description is too long, the maximum length is 50 characters.
                    description [new description]
        
                    ================\n\n> `
                }

                this.terminal.getTask(this.context.task_id).setDescription(new_description)

                return this.getBanner() + `
                ================
    
                Task description has been changed successfully!
    
                ================\n\n> `
                break;
            case 'state':

                const possibleStates = ['not-attempted', 'in-progress', 'completed']

                var subCategory = commandArguments[1];

                if(!possibleStates.includes(subCategory)){
                    return `
                    ================
        
                    Please choose a valid task state ${prettyJoin(possibleStates)}
                    state [not-attempted|in-progress|completed]
        
                    ================\n\n> `
                }


                this.terminal.getTask(this.context.task_id).setState(subCategory)

                return this.getBanner() + `
                ================
    
                Task state has been changed successfully!
    
                ================\n\n> `
                break;
            case '..':
            case 'back':
                return this.terminal.switchTo('tasksteps')
                break;
            case 'help':
                return this.getBanner()
                break;
            default:
                break;
            }
        return "NOT IMPLEMENTED"
    }
}

module.exports = {TaskStepEdit}