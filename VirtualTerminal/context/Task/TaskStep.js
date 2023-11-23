const {prettyJoin, isNumeric} = require("../../../Utils");


class TaskStep {
    constructor(terminal){
        this.currentPage = 1;
        this.pageSize = 3;

        this.terminal = terminal; if(!terminal) {console.log("Terminal wasn't given")}
        this.title = "Task Steps"

    }
    getBanner(){
        return `
        ================

        Task Steps

        Global Task: "Create a spotify to mp3 downloader"

        ----

        ${this.getTasks()}

        ----

        [Page ${this.currentPage}/${this.getMaxPage()}]

        previous - go to previous page
        next - go to next page

        edit [id] - edit task title
        add - add a new task

        subtask - view sub task details for ID
        back - go back to the main menu
        help - Shows this menu

        What would you like to do?

        ================\n\n> `
    }
    run(input){
        var validAnswers = [
            { command: 'previous', usage: 'previous' },
            { command: 'next', usage: 'next' },
            { command: 'edit', usage: 'edit [id]' },
            { command: 'add', usage: 'add' },
            { command: 'subtask', usage: 'subtask [id]' },
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
            case 'previous':
                if(this.currentPage == 1){
                    return `
                    ================
            
                    There is no previous page (Page ${this.currentPage}/${this.getMaxPage()})

                    help - Shows a help menu

                    What would you like to do?
            
                    ================\n\n> `
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
            
                    ================\n\n> `
                } else {
                    this.currentPage += 1
                }
                return this.getNewPage()
                break;
            case 'edit':
                var task_id = commandArguments[1];

                if(!isNumeric(task_id)){
                    return `
                    ================
            
                    Please supply a positive integer for a task to edit.

                    edit [id] - Edits a task with id
                    help - Shows a help menu

                    What would you like to do?
            
                    ================\n\n> `
                } else {
                    task_id = parseInt(task_id)
                }

                if(this.terminal.tasks.length == 0){
                    return `
                    ================
            
                    This task does not exist. There are no tasks.

                    help - Shows a help menu

                    What would you like to do?
            
                    ================\n\n> `
                }

                if(this.terminal.tasks.length < task_id){
                    return `
                    ================
            
                    This task does not exist.

                    help - Shows a help menu

                    What would you like to do?
            
                    ================\n\n> `
                }

                return this.terminal.switchTo('edittaskstep', {
                    task_id: 1
                })
                break;
            case 'add':
                break;
            case 'subtask':
                break;
            case '..':
            case 'back':
                return this.terminal.switchTo('mainmenu')
                break;
            case 'help':
                return this.getBanner()
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
                    output += "[" + (startIndex + i) + "] (" + task.getStatePretty() +  ")" + task.title + "\n" + " - " + task.description
                } else {
                    output += "[" + (startIndex + i) + "] (" + task.getStatePretty()  + ")" + task.title + " - " + task.description
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