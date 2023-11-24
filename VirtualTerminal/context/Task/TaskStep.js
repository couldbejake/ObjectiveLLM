const {prettyJoin, isNumeric} = require("../../../Utils");


class TaskStep {
    constructor(terminal, context){
        this.context = context;
        this.currentPage = 1;
        this.pageSize = 3;

        this.terminal = terminal; if(!terminal) {console.log("Terminal wasn't given")}
        this.title = "Task Steps"

    }
    getBanner(){
        return `
        ================

        Task Steps

        Global Task: "${this.terminal.globalTask}"

        ----

        ${this.getTasks()}

        ----

        [Page ${this.currentPage}/${this.getMaxPage()}]

        previous - go to previous page
        next - go to next page

        list - list tasks
        edit [task_id] - edit task
        add - add a new task

        subtask [task_id] - view sub task details for task id
        back - go back to the main menu
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
            { command: 'edit', usage: 'edit [task_id]' },
            { command: 'add', usage: 'add' },
            { command: 'subtask', usage: 'subtask [task_id]' },
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
            case 'previous':
                if(this.currentPage == 1){
                    return `
                    ================
            
                    There is no previous page (Page ${this.currentPage}/${this.getMaxPage()})

                    help - Shows a help menu

                    What would you like to do?
            
                    ================\n\n `
                } else {
                    this.currentPage -= 1
                }
                return this.getNewPage()
                break;
            case 'next':
                if(this.currentPage == this.getMaxPage()){
                    return `
                    ================
            
                    There is no next page (Page ${this.currentPage}/${this.getMaxPage()})

                    help - Shows a help menu

                    What would you like to do?
            
                    ================\n\n `
                } else {
                    this.currentPage += 1
                }
                return this.getNewPage()
                break;
            case 'list':
            case 'ls':
                return this.getBanner()
                break;
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
            case 'subtask':
                var task_id = commandArguments[1];

                if(!isNumeric(task_id)){
                    return `
                    ================
            
                    Please supply a positive integer for a subtask to view

                    subtask [task_id] - View a sub task for a given task id
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


                    subtask [task_id] - View a sub task for a given task id
                    help - Shows a help menu

                    What would you like to do?
            
                    ================\n\n `
                }

                if(this.terminal.tasks.length < task_id){
                    return `
                    ================
            
                    This task does not exist.

                    subtask [task_id] - View a sub task for a given task id
                    help - Shows a help menu

                    What would you like to do?
            
                    ================\n\n `
                }

                return this.terminal.switchTo('subtasktaskstep', {
                    task_id: task_id
                })
                break;
            case '..':
            case 'back':
                return this.terminal.switchTo('mainmenu')
                break;
            case 'help':
                return `
                ================
        
                previous - go to previous page
                next - go to next page
        
                list - list tasks
                edit [task_id] - edit task
                add - add a new task
        
                subtask [task_id] - view sub task details for task id
                back - go back to the main menu
                help - Shows this menu
        
                ================\n\n `
                break;
            default:
                break;


            }
            return "NOT IMPLEMENTED"
        }
    getTasks(){
        if(!this.terminal.tasks){
            return "1. Complete prerequisites"
        } else {
            var startIndex = ((this.currentPage -1) * this.pageSize) + 1
            var items = this.paginate(this.terminal.tasks, this.pageSize, this.currentPage)
            var output = ""

            for (let i = 0; i < items.length; i++) {
                const task = items[i];
                if(i != items.length - 1){
                    output += "[" + (startIndex + i) + "] (" + task.getStatePretty() +  ") " + task.title + " - " + task.description + "\n"
                } else {
                    output += "[" + (startIndex + i) + "] (" + task.getStatePretty()  + ") " + task.title + " - " + task.description
                }
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

module.exports = {TaskStep}