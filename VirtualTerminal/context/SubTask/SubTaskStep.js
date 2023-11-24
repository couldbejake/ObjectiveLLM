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
        ================

        Global Task: "${this.terminal.globalTask}"

        Subtasks - (Main Menu > Tasks > Subtasks)

        ----

        Viewing Task ID #${this.context.task_id}

        ----

        ${this.getSubTasks()}

        list - list tasks
        edit [sub_task_id] - edit sub task
        add [task_id] - add a new sub task to a task

        back - go back to the task menu
        help - Shows this menu

        What would you like to do?

        ================\n\n `
    }
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

                var totalSubTasks = this.terminal.tasks.map((task) => {return task.subtasks})
                
                if(totalSubTasks.length < sub_task_id || sub_task_id <= 0){
                    return `
                    ================
            
                    This subtask does not exist.

                    help - Shows a help menu

                    What would you like to do?
            
                    ================\n\n `
                }




                console.log("SUCCESS")

                //return this.terminal.switchTo('edittaskstep', {
                //    task_id: task_id
                //})
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
                add [task_id] - add a new sub task to a task
        
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
                    output += "[" + (subtask.total_subtask_index) + "] (" +subtask.getStatePretty() +  ") " + subtask.title + " - " + subtask.description + "\n"
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
                        output += "[" + (subtask.total_subtask_index) + "] (" +subtask.getStatePretty() +  ") " + subtask.title + " - " + subtask.description + "\n"
                    });
                } else {
                    output += "... No Subtasks ... " + "\n"
                }
    
                output += "\n----\n\n"
            }

            if(this.terminal.getTask(this.context.task_id + 1) && (nextTaskSubtasks && nextTaskSubtasks.length > 0)){
                output += "----\n\n"
                
                output += "Following Task Subtasks:\n\n"

                nextTaskSubtasks.forEach(subtask => {
                    output += "[" + (subtask.total_subtask_index) + "] (" +subtask.getStatePretty() +  ") " + subtask.title + " - " + subtask.description + "\n"
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