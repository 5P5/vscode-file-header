// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "helloworld" is now active!');

	const main = await import("./main");
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand("${npm_package_name}.insert", main.default ,"acb777") /*() => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage("Hello234324324234 World!");
	});*/

	let open = vscode.workspace.onDidOpenTextDocument(main.default, "3c8a55");
	let save = vscode.workspace.onWillSaveTextDocument(main.default, "1db631")
	vscode.window.showInformationMessage("myfuck is activeaed now");

	context.subscriptions.push(disposable, open, save);
}

// this method is called when your extension is deactivated
export function deactivate() {}
