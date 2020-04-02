import * as vscode from "vscode";
import * as PKG from "./consts";
import * as utils from "./utils";
import { log } from "./log";
import { getTemplate } from "./read";

const identifiers = utils.parseINI(vscode.workspace.getConfiguration(PKG.name).get());

export async function insertHeader(e: vscode.TextDocument) {
	log.newRunId()

	// sanity checks
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		log.appendLine(`${PKG.name} requires an active document.`);
		return -1230026;
	}

	// get config
	const config = vscode.workspace.getConfiguration(PKG.name);

	// language allowed check
	const { languageId } = editor.document;
	const allow = config.get(PKG.languageAllow);
	const langAllow = eval(identifiers.get(languageId));
	log.appendLine(`language allow ${allow}, ${languageId} permission determined ${langAllow}`);
	switch (allow) {
		case PKG.allowAll:
			if (langAllow != undefined && langAllow == false) {
				log.appendLine("blacklisted");
				return -1956672;
			}
			break;
		case PKG.allowNone:
			if (langAllow != undefined && langAllow == true) {
				log.appendLine("whitelisted");
			} else {
				return -1740105;
			}
			break;
		default:
			log.appendLine(`${allow} is not a valid case for language.allow`);
			return -1517709;
	}

	// get template
	const template = await getTemplate(config.get(PKG.template));
	log.appendLine(template);

	// interpolate

	// insert

	/*log.appendLine("_1585253077	" + tdoc.languageId);

	if (tdoc.languageId === "c") {
		out.appendLine("is c file");
		let x = tdoc.lineAt(0);
		out.appendLine("line 0 is " + x.text);
	}

	(snippet = new vscode.SnippetString("$0hallo ficker dick\n${CURRENT_SECONDS_UNIX}")), editor.insertSnippet(snippet, editor.selection.active);*/
}
