const {prettyJoin, isNumeric} = require("../../../Utils");


class SubTaskStep {
    constructor(terminal, context){
        this.context = context;
        this.currentPage = 1;
        this.pageSize = 5;

        this.terminal = terminal; if(!terminal) {console.log("Terminal wasn't given")}
        this.title = "Sub Task Steps"

    }
    getBanner(){
        return `
        ================

        Sub Task Steps

        Global Task: "${this.terminal.globalTask}"

        Viewing Task ID #${this.context.task_id}


        ${this.getSubTasks()}

        list - list tasks
        edit [sub_task_id] - edit sub task
        add - add a new sub task

        back - go back to the task menu
        help - Shows this menu

        What would you like to do?

        ================\n\n `
    }
    run(input){
       
        var validAnswers = [
            { command: 'previous', usage: 'previous' },
            { command: 'next', usage: 'next' },
            { command: 'list', usage: 'list' },
            { command: 'ls', usage: 'ls' },
            { command: 'edit', usage: 'edit [sub_task_id]' },
            { command: 'add', usage: 'add' },
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
             /*
            case 'edit':
                var task_id = commandArguments[1];

                if(!isNumeric(task_id)){
                    return `
                    ================
            
                    Please supply a positive integer for a task to edit.

                    edit [task_id] - Edits a task with id
                    help - Shows a help menu

                    What would you like to do?
            
                    ================\n\n `
                } else {
                    task_id = parseInt(task_id)
                }

                if(this.terminal.tasks.length == 0){
                    return `
                    ================
            
                    This task does not exist. There are no tasks.

                    help - Shows a help menu

                    What would you like to do?
            
                    ================\n\n `
                }

                if(this.terminal.tasks.length < task_id){
                    return `
                    ================
            
                    This task does not exist.

                    help - Shows a help menu

                    What would you like to do?
            
                    ================\n\n `
                }

                return this.terminal.switchTo('edittaskstep', {
                    task_id: task_id
                })
                break;
            case 'add':
                break;
            */
            case '..':
            case 'back':
                return this.terminal.switchTo('tasksteps')
                break;
            case 'help':
                return `
                ================
        
                edit [sub_task_id] - edit sub task
                add - add a new sub task
        
                back - go back to the task menu
                help - Shows this menu
        
                ================\n\n `
                break;
            default:
                break;


            }
            return "NOT IMPLEMENTED"
        }
    getSubTasks(){
        if(!this.terminal.tasks){
            return "1. Complete prerequisites"
        } else {

            var output = ""
            
            const prevTask = this.terminal.getSubTasks(this.context.task_id - 1)
            const task =     this.terminal.getSubTasks(this.context.task_id)
            const nextTask = this.terminal.getSubTasks(this.context.task_id + 1)
            

            if(prevTask){
                output += "~~~~~~~\n\n"

                output += "Previous Task - Task ID #" +  "\n".repeat(2)
                output += "SubTasks:\n\n"
                prevTask.forEach(subtask => {
                    output += "[" + (subtask.total_subtask_index) + "] (" +subtask.getStatePretty() +  ") " + subtask.title + "\n"
                });

                output += "\n~~~~~~~\n\n"
            }
            
/////////////////

            output += "~~~~~~~\n\n"

            output += "** Current Task - Task ID #" + (this.context.task_id) + " **" + "\n".repeat(2)
            output += "SubTasks:\n\n"
            output += `Task Title: ${this.terminal.getTask(this.context.task_id).getTitlePretty()}\n`
            output += `Task Description: ${this.terminal.getTask(this.context.task_id).getDescriptionPretty()}\n`

            output += "\n"

            task.forEach(subtask => {
                output += "[" + (subtask.total_subtask_index) + "] (" +subtask.getStatePretty() +  ") " + subtask.title + " - " + subtask.description + "\n"
            });

            output += "\n~~~~~~~\n\n"

/////////////////


            if(nextTask){
                output += "~~~~~~~\n\n"

                output += "Next Task - Task ID #" + (this.context.task_id + 1) + "\n".repeat(2)
                output += "SubTasks:\n\n"
                
                nextTask.forEach(subtask => {
                    output += "[" + (subtask.total_subtask_index) + "] (" +subtask.getStatePretty() +  ") " + subtask.title + "\n"
                });
                output += "\n~~~~~~~\n\n"

            }

            return output
        }
    }
    getMaxPage(){
        return Math.ceil(this.terminal.tasks.length / this.pageSize);
    }
    paginate(array, page_size, page_number) {
        return array.slice((page_number - 1) * page_size, page_number * page_size);
    }
    getNewPage(){
        return this.getBanner()
    }
}

module.exports = {SubTaskStep}