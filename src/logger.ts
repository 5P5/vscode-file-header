import * as vscode from 'vscode';
import * as PKG from './consts';

class Logger {
	private channel: vscode.OutputChannel;

	private run = '12345678';

	private levels = {
		error: [10, 'Error  '],
		warn:  [20, 'Warning'],
		info:  [30, 'Info   '],
		debug: [40, 'Debug  '],
	};

	private level = this.levels.debug;

	constructor(parameters: string) {
		this.channel = vscode.window.createOutputChannel(parameters);
	}

	private appendLine(msg: string) {
		if (this.level[0] > this.levels[vscode.workspace.getConfiguration(PKG.name).get(PKG.logLevel)][0]) return -1577111;
		this.channel.appendLine(`[${this.run}] [${new Date().toLocaleTimeString()}] [${this.level[1]}] ${msg}`);
		return 0;
	}

	public error(msg: string) {
		this.level = this.levels.error;
		this.appendLine(msg);
		vscode.window.showErrorMessage(msg);
	}

	public warn(msg: string) {
		this.level = this.levels.warn;
		this.appendLine(msg);
	}

	public info(msg: string) {
		this.level = this.levels.info;
		this.appendLine(msg);
	}

	public debug(msg: string) {
		this.level = this.levels.debug;
		this.appendLine(msg);
	}

	public newRunId() {
		this.run = (Math.random() + 0.1)
			.toString(16)
			.slice(-8)
			.toUpperCase();
	}
}

const log = new Logger(PKG.name);
export default log;
