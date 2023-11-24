const {prettyJoin, isNumeric} = require("../../../Utils");


class SubTaskEditStep {
    constructor(terminal, context){
        this.terminal = terminal; if(!terminal) {console.log("Terminal wasn't given")}
        this.context = context;

        this.title = "Edit Sub Task"
    }
    getBanner(){
        var subtask = this.terminal.getSubTask(this.context.task_id, this.context.subtask_id)
        return `
        ===== [Edit Sub Task] ===== 
        
        (Main Menu > Tasks > Sub Tasks > Edit Sub Task)

        Goal: "${this.terminal.globalTask}"

        ----

        Editing Sub Task ${subtask.total_subtask_index + 1}

        ----

        Sub Task Name: ${subtask.title}
        Sub Task Description: ${subtask.description}
        State: ${subtask.getStatePretty()}

        ----

        rename [new title] - change the title
        description [new description] - change the description
        state [not-yet-attempted|in-progress|completed] - change the state of the sub task

        back - go back to the main menu
        help - Shows this menu

        What would you like to do?

        ================\n\n `
    }
    run(input){
        var validAnswers = [
            { command: 'rename', usage: 'rename [new title]' },
            { command: 'description', usage: 'description [new description]' },
            { command: 'state', usage: 'state [not-yet-attempted|in-progress|completed]' },
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

            ================\n\n `)
        }

        switch ( commandArguments[0] ) {
            case 'rename':
                if(commandArguments.length < 2){
                    return `
                    ================
        
                    Please choose a complete title for the sub task
                    rename [new title]
        
                    ================\n\n `
                }

                var new_title = commandArguments.slice(1, commandArguments.length).join(' ');

                if(new_title.length > 1048){
                    return `
                    ================
        
                    Your title is too long, the maximum length is 1048 characters, and should be brief.
                    rename [new title]
        
                    ================\n\n `
                }

                this.terminal.getSubTask(this.context.task_id, this.context.subtask_id).setTitle(new_title)

                return this.getBanner() + `
                ================
    
                Sub Task title has been changed successfully!
    
                ================\n\n `

                break;
            case 'description':
                if(commandArguments.length < 2){
                    return `
                    ================
        
                    Please choose a complete description for the sub task
                    description [new description]
        
                    ================\n\n `
                }

                var new_description = commandArguments.slice(1, commandArguments.length).join(' ');

                if(new_description.length > 1048){
                    return `
                    ================
        
                    Your description is too long, the maximum length is 1048 characters.
                    description [new description]
        
                    ================\n\n `
                }

                this.terminal.getSubTask(this.context.task_id, this.context.subtask_id).setDescription(new_description)

                return this.getBanner() + `
                ================
    
                Sub Task description has been changed successfully!
    
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


                this.terminal.getSubTask(this.context.task_id, this.context.subtask_id).setState(subCategory)

                return this.getBanner() + `
                ================
    
                Sub Task state has been changed successfully!
    
                ================\n\n `
                break;
            case '..':
            case 'back':
                return this.terminal.switchTo('subtasktaskstep', {
                    task_id: this.context.task_id
                })
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

module.exports = {SubTaskEditStep}