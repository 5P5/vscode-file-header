import * as vscode from "vscode";
import * as PKG from "./consts";
import * as utils from "./utils";
import log from "./logger";
import getTemplate from "./read";
import interpolate from "./interpolate";

export default async function insertHeader(e: vscode.TextDocument) {
	log.newRunId();
	log.debug("--- called ---");

	/*log.info("sanity checks");
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		log.warn(`${PKG.name} requires an active document.`);
		return -1230026;
	}*/
	let editor
	log.debug(editor.document.uri)

	log.info("getting config");
	const config = vscode.workspace.getConfiguration(PKG.name);

	log.info("determin called from");
	switch (this) {
		case "acb777":
			log.debug("registerCommand");
			break;

		case "3c8a55":
			log.debug("onDidOpenTextDocument");
			 editor = vscode.window.activeTextEditor;
			while (!editor) {
				log.debug("lol wait")
				await new Promise(resolve => setTimeout(resolve, 1000));
			}

			log.info(`check ${PKG.autoInsert} is on`);
			if (!config.get(PKG.autoInsert)) return -1552185;

			log.info("check document is still virgin");
			if (editor.document.getText().length > 0) return -1429067;
			break;

		default:
			log.debug(this.toString());
	}

	log.info("language allowed check");
	const { languageId } = editor.document;
	const allow = config.get(PKG.languageAllow);

	log.info(`get ${PKG.languageIdentifiers}`);
	const identifiers = utils.parseINI(config.get(PKG.languageIdentifiers), { trimName: true, trimValue: true });
	const langAllow = eval(identifiers.get(languageId));

	log.debug(`language allow ´${allow}´ and ´${languageId}´ permission determined ´${langAllow}´`);
	switch (allow) {
		case PKG.allowAll:
			if (langAllow != undefined && langAllow == false) {
				log.info("blacklisted");
				return -1956672;
			}
			break;

		case PKG.allowNone:
			if (langAllow != undefined && langAllow == true) {
				log.info("whitelisted");
			} else {
				return -1740105;
			}
			break;

		default:
			log.warn(`´${allow}´ is not a valid case for ${PKG.languageAllow}`);
			return -1517709;
	}

	log.info(`get ${PKG.variables}`);
	const variables = utils.parseINI(config.get(PKG.variables));

	log.info(`get ${PKG.template}`);
	const template = await getTemplate(config.get(PKG.template), variables);

	log.info("interpolate");
	const header = interpolate(template, variables);

	log.info(`get ${PKG.commentMode}`);
	const commentMode = config.get(PKG.commentMode);
	log.debug(`${PKG.commentMode} is ´${commentMode}´`);
	// header.split("\n")

	switch (commentMode) {
		case PKG.commentBlock:
			break;

		case PKG.commentLine:
			break;

		default:
	}
	let asfsdf="12\n34\r56\n\r78\r\n90"

	log.info("insert");
	const snippet = new vscode.SnippetString(asfsdf);
	const start = editor.selection.active;
	editor.insertSnippet(snippet, start);

	return 0;
}
