const { prettyJoin, isNumeric } = require("../../Utils")

const {IDE} = require("../../IDE/IDE")

class ActionsStep {
    constructor(terminal, context){
        this.context = context;
        this.terminal = terminal; if(!terminal) {console.log("Terminal wasn't given")}
        this.title = "Actions"
        this.ide = new IDE();
        this.ide.start()
    }
    getBanner(){
        return `
        ===== [Actions] ===== 

        Actions - (Main Menu > Actions)

        Final Goal: "${this.terminal.globalTask}"

        ----

        list - list all workspace files

        view [filePath] - views a workspace file 
        overwrite [filePath] [fileData] - overwrites a file in the workspace
        diagnostic [filePath] - find errors and issues in a file

        terminal [command] - executes a terminal command

        back - go back to the main menu
        help - Shows this menu

        What would you like to do?

        ================\n\n `
    }
    getHelp(){
        return `
        ================

        list - list all workspace files

        view [filePath] - views a workspace file 
        overwrite [filePath] [fileData] - overwrites a file in the workspace
        diagnostic [filePath] - find errors and issues in a file

        terminal [command] - executes a terminal command

        back - go back to the main menu
        help - Shows this menu

        What would you like to do?

        ================\n\n `
    }
    async run(input){
        var validAnswers = [
            { command: 'list', usage: 'list' },
            { command: 'view', usage: 'view [filePath]' },
            { command: 'overwrite', usage: 'overwrite [filePath] [fileData]' },
            { command: 'diagnostic', usage: 'diagnostic [filePath]' },
            { command: 'terminal', usage: 'terminal [command]' },
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
            case 'list':
            case 'ls':
                var command_output = ""
                var workspace_files = await this.ide.workspace_ls()

                return this.getHelp() + `
                ===== [Actions] ===== 
        
                Tasks - (Main Menu > Actions)
        
                Listing Files

                ${
                    workspace_files.files.map((file, i) => {
                        return (i + 1) + ". " + " [" + file.type + "] " + file.local_path + "\n"
                    }).join("")
                }
        
                ================\n\n `
                break;
            case 'overwrite':
                return this.terminal.switchTo('addtaskstep');
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

                if(this.terminal.tasks.length < task_id || task_id == 0){
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
                return this.getHelp()
                break;
            default:
                break;


            }
            return "NOT IMPLEMENTED"
        }
    getTasks(){
        if(!this.terminal.tasks || this.terminal.tasks.length == 0){
            return "... No Tasks yet added ..."
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

module.exports = {ActionsStep}