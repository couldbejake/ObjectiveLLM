// python linting requires python extension to be installed, automate this...

// TODO: Make a better API, this one is really bad

const { getNestedFilesAndDirs } = require("./utils")
var WebSocket = require('ws');
const fs = require('fs');
const { exec, execSync } = require('child_process');
const path = require('path');


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
        setTimeout(() => {
            this.sendWS({
                response: "Connected",
                returnSuccess: true,
                hasConnected: true,
            })
        }, 5000);
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
                    returnData = fs.readFileSync(filePath, 'utf8');
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
                    returnData = "Successfully overwrote file"
                    returnSuccess = true;
                } catch (err) {
                    returnData =  err
                    returnSuccess = false;
                }
                break;
            case 'diagnostics_file':
                try {
                    const filePath = (workSpacePath) +  "/" + (payload.local_path)
                    
                    returnData = fs.readFileSync(filePath, 'utf8');
                    
                    const fileUri = this.vscode.Uri.file(filePath);
                
                    
                    returnData = this.vscode.languages.getDiagnostics(fileUri);
                    returnSuccess = true;

                } catch (err) {
                    returnData.error = err
                    returnSuccess = false;
                }
                
                break;
            case 'execute_terminal_command':
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
                            console.log("Debug: terminal received error without stderr"); process.exit()
                            done()
                        } else {
                            returnData = {
                                output: stdout,
                                commandSuccess: true
                            };
                            done()
                        }
                    });
                });
                break;
            default:
                returnData = "No command found"
                break;
        }

        this.sendWS({
            request: payload,
            response: returnData,
            success: returnSuccess
        })
    }


}

module.exports = {IDEAPI}