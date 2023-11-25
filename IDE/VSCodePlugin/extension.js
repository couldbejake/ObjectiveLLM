
const vscode = require('vscode');
const{ IDEAPI } = require('./api');
var WebSocket = require('ws');


function activate(context) {

	new IDEAPI(vscode)


	let disposable = vscode.commands.registerCommand('contextgpt-code.helloWorld', function () { vscode.window.showInformationMessage('Hello World from ContextGPT Code!'); });
	context.subscriptions.push(disposable);

}

function deactivate() {

}

module.exports = {
	activate,
	deactivate
}
