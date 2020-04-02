import * as vscode from "vscode";
import { name } from "./consts";

class Log {
	channel: vscode.OutputChannel;
	run: string = "12345678";

	constructor(parameters: string) {
		this.channel = vscode.window.createOutputChannel(parameters);
	}

	appendLine(msg: string) {
		this.channel.appendLine(`[${this.run}][${new Date().toLocaleTimeString()}] ${msg}`);
	}

	error(msg: string) {
		this.appendLine(msg);
		vscode.window.showErrorMessage(msg);
	}

	newRunId() {
		this.run = (Math.random() + 0.1).toString(16).slice(-8).toUpperCase();
	}
}

export const log = new Log(name);
