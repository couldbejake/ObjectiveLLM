// python linting requires python extension to be installed, automate this...

// TODO: Make a better API, this one is really bad

//
//
//
// IMPORTANT: ESLINT PYTHON WITH CONFIG (.pylintrc in folder) MUST BE INSTALLED SO THAT TRAINING LINES PICKS UP LONG LINES AS DIAGNOSTIC
//
//
//


const { getNestedFilesAndDirs } = require("./utils")
var WebSocket = require('ws');
const fs = require('fs');
const { exec, execSync } = require('child_process');
const path = require('path');

var TRAILING_LINE_COMMENTS = {
    python: "\n\n# [TRAINING_LINES-70647bf1-db0e-40db-aabe-5eb4d7109655] IGNORE THIS: this line is added to the end of the document to ensure that vscode pylint detects problems properly before attempting to return them. The length of this line means that this item will show up under the problems tag. It's not a great solution, but it does the job.\n\n"
}

class IDEAPI {
    constructor(vscode){
        this.vscode = vscode;
        this.contextGPTConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'contextGPTConfig.json'), 'utf8'));
        this.ws = new WebSocket(this.contextGPTConfig.address);
        this.ws.onopen = () => {this.onConnected()}
        this.ws.onmessage = (payload) => {this.onCommand(JSON.parse(payload.data))}
    }
    sendWS(payload){
        this.ws.send(JSON.stringify(payload))
    }
    onConnected(){
        // TODO: Write a better solution for waiting until VSCode is ready to show problems
        console.log("Waiting until VSCode is fully ready")
        this.sendWS({
            response: "Connected",
            returnSuccess: true,
            hasConnected: true,
        })
    }

    async onCommand(payload){
        const workSpacePath = this.vscode.workspace.workspaceFolders[0].uri.path.slice(1)
        var returnData = {error: "Return data wasn't set"}
        var returnSuccess = false;

        switch (payload.command) {
            case 'workspace_ls':
                returnData = {
                    workSpacePath: workSpacePath,
                    files: getNestedFilesAndDirs(workSpacePath)
                }
                returnSuccess = true;
                break;
            case 'view_file':
                try {
                    var filePath = (workSpacePath) +  "/" + (payload.local_path)
                    var fileData = fs.readFileSync(filePath, 'utf8')
                    returnData.text = (fileData == "" ? "<Empty File>" : fileData)
                    returnSuccess = true;
                } catch (err) {
                    returnData.error = err
                    returnSuccess = false;
                }
                break;
            case 'overwrite_file':
                try {

                    var filePath = (workSpacePath) +  "/" + (payload.local_path)
                    fs.writeFileSync(filePath, payload.data);

                    await this.vscode.window.showTextDocument(this.vscode.Uri.file(filePath), { preserveFocus: false });

                    returnData = "Successfully overwrote file"
                    returnSuccess = true;
                } catch (err) {
                    returnData =  err
                    returnSuccess = false;
                }
                break;
            case 'diagnostics_file':
                try {
                    const originalFilePath = (workSpacePath) +  "/" + (payload.local_path)
                    fs.readFileSync(originalFilePath, 'utf8'); // check whether file exists

                    // we need to wait for vscode UI to enable and for problems to show.
                    // to solve this, we copy the file, add a test problem, and loop until problems are showing.

                    const problemTestPath = workSpacePath + "/" + "contextgpt-diagnostic-test-" + path.basename(payload.local_path);
                    fs.copyFileSync(originalFilePath, problemTestPath);

                    const fileExtension = path.extname(originalFilePath).toLowerCase();
                    switch (fileExtension) {
                        case ".py":
                            fs.appendFileSync(problemTestPath, TRAILING_LINE_COMMENTS.python);
                            break;
                        default:
                            break;
                    }

                    const fileUri = this.vscode.Uri.file(problemTestPath);

                    var problemsFound = false;
                    var problemCheckCount = 0;

                    while(!problemsFound && problemCheckCount < 10){
                        problemCheckCount++;
                        await this.vscode.window.showTextDocument(fileUri, { preserveFocus: false });
                        await new Promise(resolve => setTimeout(resolve, 500));
                        returnData = this.vscode.languages.getDiagnostics(fileUri);

                        if(returnData.length != 0){
                            problemsFound = true;
                            console.log(returnData)
                            returnData = returnData.filter(item => item.severity != this.vscode.DiagnosticSeverity.Information);
                        }
                    }

                    if(problemCheckCount >= 10){
                        returnData = {
                            error: "Attempted to check for problems 10 times, but failed to find test problem. Check whether es lint is installed, and whether test problem is being added."
                        }
                    }

                    fs.unlinkSync(problemTestPath);

                    await this.vscode.window.showTextDocument(this.vscode.Uri.file(originalFilePath), { preserveFocus: false });
                    
                    returnSuccess = true;

                } catch (err) {
                    returnData.error = err
                    returnSuccess = false;
                }
                
                break;
            case 'execute_terminal_command':
                console.log("executing terminal command")
                await new Promise((done) => {
                    const options = {
                        cwd: workSpacePath
                    };  

                    exec(payload.terminal_command, options, (error, stdout, stderr) => {
                        if (stderr) {
                            returnData = {
                                output: stderr,
                                commandSuccess: false
                            };
                            done()
                        } else if (error) {
                            returnData = {
                                output: error,
                                commandSuccess: false
                            };
                            done()
                        } else {
                            returnData = {
                                output: (stdout.trim() == "" ? "Command was successful" : stdout),
                                commandSuccess: true
                            };
                            done()
                        }
                        console.log(error)
                        console.log(stdout)
                        console.log(stderr)
                    });
                });
                break;
            default:
                returnData = "No command found"
                break;
        }

        setTimeout(() => {
            this.sendWS({
                request: payload,
                response: returnData,
                success: returnSuccess
            }) 
        }, 500);
    }


}

module.exports = {IDEAPI}