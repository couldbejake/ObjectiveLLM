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
        // keep this temporarily incase changes are needed for help vs banner
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
    async run(input){

        console.log("\n\n\n\n\nINPUT:\n\n")
        console.log(input)
        console.log("\n\n\n\n\n")


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
            input = input.trim()
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

                Actions - (Main Menu > Actions)

                Final Goal: "${this.terminal.globalTask}"
        
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
                var filePath = commandArguments.slice(1).join(" ")

                if(!filePath){
                    return `
                    ================
            
                    Please supply a filePath as your first argument

                    view [filePath] - views a file in the terminal

                    What would you like to do?
            
                    ================\n\n `
                }

                var fileData = await this.ide.view_file(filePath)

                if(fileData.text){
                    return `
                    ================

                    Tasks - (Main Menu > Actions)
        
                    Viewing file
            
                    File Path: ${filePath}

                    \`${fileData.text}\`

                    What would you like to do?
            
                    ================\n\n `
                }

                if(fileData.error){
                    return `
                    ===== [Actions] ===== 

                    Run \`help\` for help

                    Viewing file

                    (The terminal returned an error, it has been jsonified)
            
                    ${JSON.stringify(fileData.error)}

                    ================\n\n `
                }
                break;
            case 'overwrite':
                var filePath = commandArguments[1]

                var fileData = getTextAfterParameter(input, 2).replace("\n", "\n")

                

                if(!filePath){
                    return `
                    ================
            
                    Please supply a filePath as your first argument

                    overwrite [filePath] [fileData] - overwrites a file in the workspace

                    example: 
                    
                    overwrite test.py
                    message = "Hello World"
                    print(message)

                    Do not use new line characters, instead write on a new line

                    What would you like to do?
            
                    ================\n\n `
                }

                if(commandArguments.length < 3){
                    return `
                    ================
            
                    Please supply a filePath as your first argument

                    overwrite [filePath] [fileData] - overwrites a file in the workspace

                    example: 
                    
                    overwrite test.py
                    message = "Hello World"
                    print(message)

                    Do not use new line characters, instead write on a new line

                    What would you like to do?
            
                    ================\n\n `
                }

                var result = await this.ide.overwrite_file(filePath, fileData)

                return `
                ================
        
                ${result}
        
                ================\n\n `
                break;
            case 'diagnostic':
                var filePath = commandArguments[1];

                if(!filePath){
                    return `
                    ================
            
                    Please supply a filePath as your first argument

                    diagnostic [filePath] - runs a diagnostic on a file to view linting, and syntax errors

                    What would you like to do?
            
                    ================\n\n `
                }

                var fileData = await this.ide.diagnostics_file(filePath)

                if(Array.isArray(fileData)){
                    return `
                    ================

                    Tasks - (Main Menu > Actions)
        
                    Running file diagnostic
            
                    File Path: ${filePath}

                    Diagnostics:

                    ${fileData.map((diagnostic) => { 
                        return "- " + diagnostic.message + " (line: " + (diagnostic.range[0].line + 1) + " -> " + (diagnostic.range[1].line + 1) + " )" + "\n"
                    }).join("")}

                    What would you like to do?
            
                    ================\n\n `
                } else {
                    console.log("API did not return file diagnostics array")
                    console.log(fileData)
                    process.exit()
                }
                break;
            case 'terminal':
                var filePath = commandArguments.slice(1).join(" ")

                if(!filePath){
                    return `
                    ================
            
                    Please use the format

                    terminal [command] - runs a terminal command

                    example: terminal echo "Hello world"

                    What would you like to do?
            
                    ================\n\n `
                }

                var terminalOutput = await this.ide.execute_terminal_command(filePath)
                
                if(terminalOutput.output && (typeof terminalOutput.output === 'string')){
                    return `
                    ===== [Actions] ===== 

                    Run \`help\` for help

                    Ran Terminal Command

                    Output:
            
                    \`${terminalOutput.output}\`

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
            return "NOT IMPLEMENTED / No matching case"
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


function getTextAfterParameter(text, parameterNum){
    text = text.trimStart()
    var tokens = ["\n", " "]
    var tokenCount = 0
    var fromIndex = 0;

    for (let i = 0; i < text.length; i++) {
        if(tokens.includes(text[i])){
            tokenCount += 1
        }
        if(tokenCount > parameterNum){
            fromIndex = i + 1;
            found = true;
            break;
        }
    }

    return (text.slice(fromIndex, text.length))
}