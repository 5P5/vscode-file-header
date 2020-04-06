import * as vscode from 'vscode';
import * as PKG from './consts';
import * as utils from './utils';
import log from './logger';
import getTemplate from './read';
import interpolate from './interpolate';

export default async function insertHeader(e: vscode.TextDocument) {
	log.newRunId();
	log.debug('--- called ---');

	/* log.info('get config');
	const config = vscode.workspace.getConfiguration(PKG.name,"workspaceFolderLanguageValue"); */

	let editor = vscode.window.activeTextEditor;
	log.info('determin called from');
	switch (this) {
	case 'acb777':
		log.debug('registerCommand');
		break;

	case '3c8a55':
		log.debug('onDidOpenTextDocument');

		/* log.info(`check ${PKG.autoInsert}`);
		if (!config.get(PKG.autoInsert)) return -1552185;//disabled in favor of later config read */

		while (!editor) {
			log.debug('wait tick');
			await new Promise((resolve) => setTimeout(resolve, 500));
			editor = vscode.window.activeTextEditor;
		}

		log.info('check document is still virgin');
		if (editor.document.getText().length > 0) return -1429067;
		break;

	default: log.debug(this.toString());
	}

	log.info('sanity checks');
	if (!editor) {
		log.warn(`${PKG.name} requires an active document.`);
		return -1230026;
	}

	log.info('get config');
	const { languageId } = editor.document;
	const config = vscode.workspace.getConfiguration(PKG.name, { languageId });

	log.info('language allowed check');
	const Allow = config.get(PKG.autoInsertAllow);
	const Languages = config.get(PKG.autoInsertLanguages);

	log.debug(`language allow ´${Allow}´`);
	switch (Allow) {
	case PKG.AllowAll:
		if (Languages.includes(languageId)) {
			log.info(`${languageId} is blacklisted`);
			return -1956672;
		}
		break;

	case PKG.AllowNone:
		if (Languages.includes(languageId)) {
			log.info(`${languageId} is whitelisted`);
		} else {
			return -1740105;
		}
		break;

	default:
		log.warn(`´${Allow}´ is not a valid case for ${PKG.autoInsertAllow}`);
		return -1517709;
	}

	log.info(`get ${PKG.variables}`);
	const variables = utils.parseINI(config.get(PKG.variables));

	log.info(`get ${PKG.template}`);
	const template = await getTemplate(config.get(PKG.template), variables);

	log.info('interpolate variables');
	const header = interpolate(template, variables);

	log.info(`get ${PKG.commentMode}`);
	const commentMode = config.get(PKG.commentMode);

	log.debug(`${PKG.commentMode} is ´${commentMode}´`);
	let snippet = '\n<header>\n';
	switch (commentMode) {
	case PKG.ModeBlock:
		snippet = `\${BLOCK_COMMENT_START}${header}\${BLOCK_COMMENT_END}`;
		break;
// line / block gibts nicht für alle langs, user soll selber overwrite machen. final $0 am ende wird verschoben? new lines option + $0 dann replace ans ende

	case PKG.ModeLine:
		snippet = `\${LINE_COMMENT} ${header.replace(/\\?\n/ig, '\n${LINE_COMMENT} ')}`;
		// header.split("\n")
		break;

	case PKG.ModeRaw:
	default:
		snippet = header;
	}

	log.info('insert snippet');
	editor.insertSnippet(new vscode.SnippetString(snippet), editor.selection.active);

	return 0;
}
