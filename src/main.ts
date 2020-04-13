/*
					 ,___ ,__  , .  . ,  __  ,  __  .  .
					 |__  |__) | \  / | /__` | /  \ |\ |
					 |___ |    |  \/  | .__/ | \__/ | \|

https://github.com/EPIVISION/vscode-file-header

main.ts (c) 2020

Desc: here is where all the magic happens

Created:  2020-03-27T12:29:59.308Z
Modified: !date!

Creative Commons Attribution-NonCommercial-ShareAlike 4.0
International Public License
*/

import * as vscode from 'vscode';
import * as PKG from './consts';
import * as utils from './utils';
import log from './logger';
import getTemplate from './read';
import interpolate from './interpolate';
import update from './update';

export default async function insertHeader(e: any) {
	log.newRunId();
	log.debug('--- called ---');

	let editor; // needs initial wait to work more stable on newly opened editors
	let time = 0;
	const max = 1500, tick = 500;
	while (!editor && time < max) {
		log.debug('activeTextEditor wait tick');
		time += tick;
		await new Promise((resolve) => setTimeout(resolve, tick)); // some hack to get the active editor after a new doc is created
		editor = vscode.window.activeTextEditor;
	}

	log.info('sanity checks');
	if (!editor) {
		log.warn(`${PKG.name} requires an active document`);
		return -1230026;
	}

	log.info('get config');
	const { languageId } = editor.document; // I need an activeTextEditor here!
	const config = vscode.workspace.getConfiguration(PKG.name, { uri: editor.document.uri, languageId });

	log.info('determin called from');
	switch (this) {
	case '1db631':
		log.debug('onWillSaveTextDocument');
		log.info('check updateEnable');
		if (config.get(PKG.updateEnable) !== PKG.updateEnableSave) return -1696462;
		// fallthrough

	case 'acb777':
		log.debug('registerCommand');
		log.info('check updateEnable');
		if (config.get(PKG.updateEnable) !== PKG.updateEnableDisable) {
			log.info('check document has content');
			if (editor.document.getText().length > 0) {
				log.info('do update header');
				update(editor, config);
				return 0;
			}
		} else {
			log.info('insert new header');
		}
		break;

	case '3c8a55':
		log.debug('onDidOpenTextDocument');
		log.info('check autoInsertEnable');
		if (!config.get(PKG.autoInsertEnable)) return -1552185;
		log.info('check document is virgin');
		if (editor.document.getText().length > 0) return -1429067;

		log.info('language allowed check');
		const Allow = config.get(PKG.autoInsertAllow);
		const Languages = config.get(PKG.autoInsertLanguages);

		log.debug(`autoInsertAllow is ´${Allow}´, language is ´${languageId}´`);
		switch (Allow) {
		case PKG.autoInsertAllowAll:
			if (Languages.includes(languageId)) {
				log.info(`´${languageId}´ is blacklisted`);
				return -1956672;
			}
			break;

		case PKG.autoInsertAllowNone:
			if (Languages.includes(languageId)) {
				log.info(`´${languageId}´ is whitelisted`);
			} else {
				return -1740105;
			}
			break;

		case PKG.autoInsertAllowAlways:
			log.debug('autoInsertAllowAlways');
			break;

		default:
			log.warn(`invalid case ´${Allow}´ for ${PKG.autoInsertAllow}`);
			return -1517709;
		}
		break;

	default:
		log.warn(`caller ´${this.toString()}´ is unknown`);
		return -1294217;
	}

	// compile a new header from here on:
	log.info(`get ${PKG.variables}`);
	const variables = utils.parseINI(config.get(PKG.variables));

	log.info(`get ${PKG.template}`);
	const template = await getTemplate(config.get(PKG.template), variables);

	log.info('interpolate variables');
	const header = interpolate(template, variables);

	log.info(`get ${PKG.commentMode}`);
	const commentMode = config.get(PKG.commentMode);

	log.debug(`${PKG.commentMode} is ´${commentMode}´`);
	let snippet = '\n<header placeholder>\n';
	switch (commentMode) {
	case PKG.commentModeBlock:
		snippet = '${BLOCK_COMMENT_START}' + header.replace(/\\n/g, '\n') + '${BLOCK_COMMENT_END}'; // fix escapes from settings.json
		break;

	case PKG.commentModeLine:
		snippet = '${LINE_COMMENT} ' + header.replace(/\\n|\n/g, '\n${LINE_COMMENT} ');
		break;

	case PKG.commentModeRaw:
	default:
		snippet = header;
	}

	log.info('touching up snippet 😄');
	snippet += '\n'.repeat(config.get(PKG.newLines));

	log.info('insert snippet');
	editor.insertSnippet(new vscode.SnippetString(snippet), editor.selection.active);

	return 0;
}
