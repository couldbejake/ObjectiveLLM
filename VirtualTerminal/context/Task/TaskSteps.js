const {prettyJoin} = require("../../../Utils");


class TaskSteps {
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

        edit - edit task title
        add - add a new task

        subtask - view sub task details for ID
        back - go back to the main menu
        help - Shows this menu

        What would you like to do?

        ================\n\n> `
    }
    run(input){
        var validAnswers = ['previous', 'next', 'edit', 'add', 'subtask', 'help' , 'back']
        if(!input){
            return this.getBanner()
        } else {
            input = input.trim().toLowerCase()
        }

        if(!validAnswers.includes(input)){
            return(
            `
            ================

            Please reply with ${prettyJoin(validAnswers)}

            ================\n\n> `)
        }
        switch (input) {
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
                break;
            case 'add':
                break;
            case 'subtask':
                break;
            case 'back':
                return this.terminal.switchTo('mainmenu')
                break;
            case 'help':
                return this.getBanner()
                break;
            default:
                break;
        }
        return "NO RESPONSE"
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
                    output += (startIndex + i) + ". " + task.title + "\n"
                } else {
                    output += (startIndex + i) + ". " + task.title
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

module.exports = {TaskSteps}