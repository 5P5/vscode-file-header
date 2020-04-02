import * as vscode from "vscode";
import { URL } from "url";
import { log } from "./log";

export async function getTemplate(text: string) {
	// fix tehis lkdsfljkas double insert shit
	if (text.indexOf("$") != -1) {
		// interpolate a snippet
		const e = vscode.window.activeTextEditor;
		if (!e) return;
		const snippet = new vscode.SnippetString(text);
		snippet.appendVariable("hallo","123");
		const start = e.selection.active;
		await e.insertSnippet(snippet, start, { undoStopBefore: false, undoStopAfter: false });
		const end = e.selection.active;
		const range = new vscode.Range(start, end);
		text = e.document.getText(range);
		// const te=new vscode.TextEdit (range)
		await e.edit(
			editBuilder => {
				editBuilder.delete(range);
			},
			{ undoStopBefore: false, undoStopAfter: false }
		);
	}

	let url;
	try {
		url = new URL(text);
	} catch (error) {
		log.appendLine(`´${error.message}´, must be template text`);
		return text;
	}

	try {
		switch (url.protocol) {
			case "file:":
				return file(url);
			case "http:":
			case "https:":
				return remote(url);
			default:
				log.appendLine(`unrecognized protocol ´${url.protocol}´, guess this is template text`)
				return text;
		}
	} catch (error) {
		log.error(error);
		return error.message;
	}
}

async function file(url: URL) {
	const { readFileSync } = await import("fs"); // defer import for performance reasons
	return readFileSync(url, "utf8");
}

// partially from https://stackoverflow.com/questions/6968448/where-is-body-in-a-nodejs-http-get-response/50244236#50244236
async function remote(url: URL) {
	const { get } = await import(url.protocol.slice(-1));

	return new Promise((resolve, reject) => {
		get(url, res => {
			let data = "";

			// A chunk of data has been recieved.
			res.on("data", chunk => {
				data += chunk;
			});

			// The whole response has been received. Print out the result.
			res.on("end", () => {
				resolve(data);
			});
		}).on("error", err => {
			reject(err);
		});
	});
}
