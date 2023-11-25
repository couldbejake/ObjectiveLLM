const { exec } = require('child_process');
const { WebSocketServer } = require('ws');
const path = require('path');

const wss = new WebSocketServer({ port: 10241 });


startVSCode('contextgpt', 'TestBeds')



const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  


//async function interactivePrompt(ws){
//    readline.question('> ', command => {
//        ws.send(command);
//        interactivePrompt(ws)
//    });
//}




wss.on('connection', function connection(ws) {

setTimeout(() => {
  ws.send(JSON.stringify({
    command: "linting",
    local_path: "test.py",
  }))
}, 4000);



  ws.on('message', function message(data) {
    //console.log('received: %s', data);
    console.log(JSON.stringify(JSON.parse(data), null, 6))
  });
});








/////////////////

// util functions


function startVSCode(profileName, folderPath){
    const extensionPath = path.resolve(__dirname, 'VSCodePlugin');
    
    const command = `code --user-data-dir ~/.vscode-${profileName} --extensions-dir ~/.vscode-${profileName}/extensions --extensionDevelopmentPath="${extensionPath}" "${folderPath}"`;
    
    exec(command, (err) => {
        if (err) {
            console.error(`exec error: ${err}`);
            return;
        }
        console.log(`VS Code launched with extension from ${extensionPath}`);
    });
    
}



