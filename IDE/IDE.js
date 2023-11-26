// TODO: python linting requires python extension to be installed, automate this...

const { exec } = require('child_process');
const { WebSocketServer } = require('ws');
const path = require('path');
const fs = require('fs');
const { 
  v4: uuidv4,
} = require('uuid');


class IDE {
  constructor(){
    this.connectResolve;
    this.wss;
    this.ws;
    this.requests = {};
  }
  start(){
    return new Promise((done) => {
      var ide = this;
      this.connectResolve = done;
      this.currentPort = this._getRandomPort()
      this.wss = new WebSocketServer({ port: this.currentPort });
      this.wss.on('connection', function connection(ws) {
        ide.ws = ws;
        ws.on('message', (data) => { ide._new_ws_message(JSON.parse(data)) });
      });
      console.log("Starting VSCode, this will take 5 seconds.")
      this._startVSCode('contextgpt', 'TestBeds', this.currentPort)
    });
  }
  startSync(){
    var done = false;
    var out;
    this.start().then((result) => {
      done = true;
      out = result;
    })
    while(!done){}
    return out;
  }
  workspace_ls(){
    return this._new_ws_command({
      command: "workspace_ls"
    })
  }
  view_file(filePath){
    return this._new_ws_command({
      command: "view_file",
      local_path: filePath,
    })
  }
  overwrite_file(filePath, data){
    return this._new_ws_command({
      command: "overwrite_file",
      local_path: filePath,
      data: data
    })
  }
  diagnostics_file(filePath){
    return this._new_ws_command({
      command: "diagnostics_file",
      local_path: filePath,
    })
  }
  execute_terminal_command(terminal_comamnd){
    return this._new_ws_command({
      command: "execute_terminal_command",
      terminal_command: terminal_comamnd,
    })
  }
  _new_ws_message(payload){
    if(this.connectResolve){this.connectResolve(); this.connectResolve = null;}
    if(!payload.request){
      console.log("No request tag: ", payload)
      return;
    }
    var requestID = payload.request.requestID
    if(requestID in this.requests){
      this.requests[requestID].resolve(payload.response)
      this.requests.requestID = null;
    }
  }
  _new_ws_command(payload){
    return new Promise((resolve, reject) => {
        var requestID = uuidv4()
        payload.requestID = requestID
        this.ws.send(JSON.stringify(payload))
        this.requests[requestID] = {resolve, reject}
        setTimeout(() => {
          this.requests[requestID].reject("Error: WS Command took too long, cancelling")
          this.requests.requestID = null;
        }, 10_000);
    })
  }
  _getRandomPort() {
    var min = 10000
    var max = 30000
    return Math.floor(Math.random() * (max - min) + min);
  }
  _startVSCode(profileName, folderPath, portNumber){
    const extensionPath = path.resolve(__dirname, 'VSCodePlugin');
    const contextGPTConfigPath = path.resolve(__dirname, 'VSCodePlugin/contextGPTConfig.json');
    const command = `code --user-data-dir ~/.vscode-${profileName} --extensions-dir ~/.vscode-${profileName}/extensions --extensionDevelopmentPath="${extensionPath}" "${folderPath}"`;
    
    fs.writeFileSync(contextGPTConfigPath + "", JSON.stringify({ address: 'ws://localhost:' + portNumber }));

    exec(command, (err) => {
        if (err) {
            console.error(`startVSCode exec error: ${err}`);
            process.exit(0)
        }
        console.log(`VS Code launched with extension from ${extensionPath}`);
    });
  }
}


module.exports = {IDE}




