const {prettyJoin, isNumeric} = require("../../../Utils");


class SubTaskStep {
    constructor(terminal, context){
        this.context = context;
        this.currentPage = 1;
        this.pageSize = 5;

        this.terminal = terminal; if(!terminal) {console.log("Terminal wasn't given")}
        this.title = "Sub Tasks"

    }
    getBanner(){
        return `
        ===== [Subtasks] ===== 

        Subtasks - (Main Menu > Tasks > Subtasks)

        Final Goal: "${this.terminal.globalTask}"
        

        ----

        Viewing Task ID #${this.context.task_id}

        ----

        ${this.getSubTasks()}

        list - list tasks
        edit [sub_task_id] - edit sub task

        back - go back to the task menu
        help - Shows this menu

        What would you like to do?

        ================\n\n `
    }

/*add [task_id] - add a new sub task to a task*/

    run(input){
       
        var validAnswers = [
            { command: 'list', usage: 'list' },
            { command: 'ls', usage: 'ls' },
            { command: 'edit', usage: 'edit [sub_task_id]' },
            { command: 'add', usage: 'add [task_id]' },
            { command: 'back', usage: 'back' },
            { command: '..', usage: '..'},
            { command: 'help', usage: 'help' },
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
            case 'list':
                return this.getBanner()
                break;
            case 'edit':
                var sub_task_id = commandArguments[1];

                if(!isNumeric(sub_task_id)){
                    return `
                    ================
            
                    Please supply a positive integer for a sub task to edit.

                    edit [sub_task_id] - Edits a sub task with id
                    help - Shows a help menu

                    What would you like to do?
            
                    ================\n\n `
                } else {
                    sub_task_id = parseInt(sub_task_id)
                }

                var subtask;

                this.terminal.tasks.map((task) => {return task.subtasks}).flat().forEach((this_subtask) => {
                    if(this_subtask.total_subtask_index == sub_task_id - 1){
                        subtask = this_subtask;
                    }
                })
                
                if(!subtask){
                    return `
                    ================
            
                    This subtask does not exist.

                    help - Shows a help menu

                    What would you like to do?
            
                    ================\n\n `
                }
                
                return this.terminal.switchTo('editsubtaskstep', {
                    task_id: subtask.task_id + 1,
                    subtask_id: subtask.subtask_id + 1
                })
                break;
            case '..':
            case 'back':
                return this.terminal.switchTo('tasksteps')
                break;
            case 'help':
                return `
                ================
        
                list - list tasks
                edit [sub_task_id] - edit sub task
                add [task_id] - add a new sub task to a task (not implemented, you may only add tasks for now)
        
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
            
            const prevTaskSubtasks = this.terminal.getSubTasks(this.context.task_id - 1)
            const taskSubtasks =     this.terminal.getSubTasks(this.context.task_id)
            const nextTaskSubtasks = this.terminal.getSubTasks(this.context.task_id + 1)

            if(this.terminal.getTask(this.context.task_id - 1) && (prevTaskSubtasks && prevTaskSubtasks.length > 0)){
                output += "----\n\n"
                
                output += "Previous Task Subtasks:\n\n"

                prevTaskSubtasks.forEach(subtask => {
                    output += "[" + (subtask.total_subtask_index + 1) + "] (" +subtask.getStatePretty() +  ") " + subtask.title + " - " + subtask.description + "\n"
                });
            
                output += "\n----\n\n"

            }

            if(this.terminal.getTask(this.context.task_id)){
                output += "----\n\n"

                output += "** Current Task - Task ID #" + (this.context.task_id) + " **" + "\n".repeat(2)
                output += `Task Title: ${this.terminal.getTask(this.context.task_id).getTitlePretty()}\n`
                output += `Task Description: ${this.terminal.getTask(this.context.task_id).getDescriptionPretty()}\n`
                
                output += "\n"
                output += "SubTasks:\n\n"

                if(taskSubtasks && taskSubtasks.length > 0){
                    taskSubtasks.forEach(subtask => {
                        output += "[" + (subtask.total_subtask_index + 1) + "] (" +subtask.getStatePretty() +  ") " + subtask.title + " - " + subtask.description + "\n"
                    });
                } else {
                    output += "... No Subtasks yet added ... " + "\n"
                }
    
                output += "\n----\n\n"
            }

            if(this.terminal.getTask(this.context.task_id + 1) && (nextTaskSubtasks && nextTaskSubtasks.length > 0)){
                output += "----\n\n"
                
                output += "Following Task Subtasks:\n\n"

                nextTaskSubtasks.forEach(subtask => {
                    output += "[" + (subtask.total_subtask_index + 1) + "] (" +subtask.getStatePretty() +  ") " + subtask.title + " - " + subtask.description + "\n"
                });
            
                output += "\n----\n\n"
            }

            output = output.replaceAll("----\n\n----\n\n", "----\n\n") // fix formatting

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