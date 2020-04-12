/*
					 ,___ ,__  , .  . ,  __  ,  __  .  .
					 |__  |__) | \  / | /__` | /  \ |\ |
					 |___ |    |  \/  | .__/ | \__/ | \|

https://github.com/EPIVISION/vscode-file-header

update.ts (c) 2020

Desc: regex replace in text to update header contents

Created:  2020-04-06T03:01:14.273Z
Modified: !date!

Creative Commons Attribution-NonCommercial-ShareAlike 4.0
International Public License
*/

import * as vscode from 'vscode';
import * as PKG from './consts';
import * as utils from './utils';
import log from './logger';

export default async function update(editor: vscode.TextEditor, config: vscode.WorkspaceConfiguration) {
	log.info(`get ${PKG.variables} and ${PKG.updateContent}`);
	const variables = utils.parseINI(config.get(PKG.variables));
	const content = Array.from(utils.parseINI(config.get(PKG.updateContent)));

	for (let i = 0; i < content.length; i++) { // fuck this async cb shit .forEach(), ye good olde for
		const k = content[i][0];
		log.debug(`text.match ´${k}´`);

		const b1 = k.indexOf('('), b2 = k.indexOf(')');
		if (b2 < b1 || b1 == b2) {
			log.warn(`no capturing groups in ´${k}´. did you forget ´( )´?`);
			continue;
		}

		const text = editor.document.getText();
		const res = text.match(new RegExp(k.replace(/\\\\/g, '\\'))); // fix escapes from settings.json
		if (!res) continue; // skip to next item

		let v = content[i][1];
		log.debug(`perform indirect lookup of ´${v}´ in variables names`);
		v = variables.get(v) || v;

		/* uff, okay, we need some magic here to
		figure out in what editor line the match occurred.
		all this shenanigans sadly need just because
		vscode Postition deals in line and char.
		in order to keep this whole thing somewhat optimized,
		we not gonna do the obvious and loop over all lines for each match !! wtf!
		we be clever and count the new line chars in the text ;-) already in memory
		also we have to keep track of the indexPrev for calculating
		the match offset with respect to the line the match occurred,
		not the text start.
		we can stop for-loop when on/behind the match in text -- yeah efficiency!
		inspiration ofc from https://stackoverflow.com/questions/881085/count-the-number-of-occurrences-of-a-character-in-a-string-in-javascript/10671743#10671743 */
		let count, index, indexPrev;
		for (
			count = -1, index = -2;
			index != -1 && index < res.index;
			indexPrev = index, count++, index = text.indexOf('\n', index + 1)
		);

		log.debug(`replace ´${res[1]}´ with ´${v}´. Only the first occurrence will be replaced.`);
		indexPrev = indexPrev == -2 ? 0 : indexPrev + 1; // fix edge case: match at pos 0,0
		const start = new vscode.Position(count, -indexPrev + res.index + res[0].indexOf(res[1])); // finally calculate that birch of a position
		const range = new vscode.Range(start, start.translate(0, res[1].length));
		await editor.edit((editBuilder) => editBuilder.replace(range, eval(v)));
	}
	// await editor.document.save();
	return 0;
}
