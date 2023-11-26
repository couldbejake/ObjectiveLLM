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
                var workspace_files = await this.ide.workspace_ls()

                return this.getHelp() + `
                ===== [Actions] ===== 
        
                Tasks - (Main Menu > Actions)
        
                Listing Files

                ${
                    (workspace_files.files.length > 0) ? 
                        workspace_files.files.map((file, i) => {
                            return (i + 1) + ". " + " [" + file.type + "] " + file.local_path + "\n"
                        }).join("")
                    :
                        "No files in workspace"
                }
        
                ================\n\n `
                break;

            // TODO: implement view and overwrite
            case 'view':
                break;
            case 'diagnostic':
                var filePath = commandArguments[1];

                if(!filePath){
                    return `
                    ================
            
                    Please supply a filePath as your second argument

                    diagnostic [filePath] - Runs a diagnostic on a file to view linting, and syntax errors

                    What would you like to do?
            
                    ================\n\n `
                }

                var fileDiagnostics = await this.ide.diagnostics_file(filePath)

                if(Array.isArray(fileDiagnostics)){
                    return `
                    ================

                    Tasks - (Main Menu > Actions)
        
                    Running file diagnostic
            
                    File Path: ${filePath}

                    Diagnostics:

                    ${fileDiagnostics.map((diagnostic) => { 
                        return "- " + diagnostic.message + " (line: " + (diagnostic.range[0].line + 1) + " -> " + (diagnostic.range[1].line + 1) + " )" + "\n"
                    }).join("")}

                    What would you like to do?
            
                    ================\n\n `
                } else {
                    console.log("API did not return file diagnostics array")
                    console.log(fileDiagnostics)
                    process.exit()
                }
                break;
            case 'terminal':
                var filePath = commandArguments[1];

                if(!filePath){
                    return `
                    ================
            
                    Please supply a filePath as your second argument

                    diagnostic [filePath] - Runs diagnostics on a file

                    What would you like to do?
            
                    ================\n\n `
                }

                var terminalOutput = await this.ide.execute_terminal_command(filePath)

                console.log(terminalOutput)

                if(terminalOutput.output && terminalOutput.output instanceof String){
                    return `
                    ===== [Actions] ===== 

                    Run \`help\` for help

                    Ran Terminal Command
            
                    ${terminalOutput.output}
                    ================\n\n `
                } else {
                    if(!terminalOutput.output){
                        return `
                        ================
                
                        Terminal did not return output, please select human/report from the main menu.
                
                        ================\n\n `
                    }
                    if(Object.keys(terminalOutput.output).length){
                        return  `
                        ===== [Actions] ===== 
    
                        Run \`help\` for help
    
                        Ran Terminal Command

                        (The terminal returned strange output, it has been jsonified)
                
                        ${JSON.stringify(terminalOutput.output)}
                        
                        ================\n\n `
                    }
                }
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