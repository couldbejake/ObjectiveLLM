// python linting requires python extension to be installed, automate this...

const { getNestedFilesAndDirs } = require("./utils")
var WebSocket = require('ws');
const fs = require('fs');


class IDEAPI {
    constructor(vscode){
        this.vscode = vscode;
        this.ws = new WebSocket('ws://localhost:10241');
        this.ws.onopen = () => {this.onConnected()}
        this.ws.onmessage = (payload) => {this.onCommand(JSON.parse(payload.data))}
    }
    sendWS(payload){
        this.ws.send(JSON.stringify(payload))
    }
    onConnected(){
        this.sendWS({
            "Connected": "Connected"
        })
    }

    onCommand(payload){
        const workSpacePath = this.vscode.workspace.workspaceFolders[0].uri.path.slice(1)
        var returnData = {}
        var returnSuccess = false;

        switch (payload.command) {
            case 'tree':
                returnData = {
                    workSpacePath: workSpacePath,
                    files: getNestedFilesAndDirs(workSpacePath)
                }
                returnSuccess = true;
                break;
            case 'view':
                try {
                    var filePath = (workSpacePath) +  "/" + (payload.local_path)
                    returnData = fs.readFileSync(filePath, 'utf8');
                    returnSuccess = true;
                } catch (err) {
                    returnData.error = err
                    returnSuccess = false;
                }
                break;
            case 'overwrite':
                try {
                    var filePath = (workSpacePath) +  "/" + (payload.local_path)
                    fs.writeFileSync(filePath, payload.data);
                    returnSuccess = true;
                } catch (err) {
                    returnData.error = err
                    returnSuccess = false;
                }
                break;
            case 'linting':

                console.error("---------")
                try {
                    const filePath = (workSpacePath) +  "/" + (payload.local_path)
                    const fileUri = this.vscode.Uri.file(filePath);
                
                    returnData = this.vscode.languages.getDiagnostics(fileUri);
                    returnSuccess = true;

                } catch (err) {
                    returnData.error = err
                    returnSuccess = false;
                }
                
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