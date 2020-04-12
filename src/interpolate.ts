/*
					 ,___ ,__  , .  . ,  __  ,  __  .  .
					 |__  |__) | \  / | /__` | /  \ |\ |
					 |___ |    |  \/  | .__/ | \__/ | \|

https://github.com/EPIVISION/vscode-file-header

interpolate.ts (c) 2020

Desc: interate over map and replace key in text with value

Created:  2020-04-01T14:28:35.049Z
Modified: !date!

Creative Commons Attribution-NonCommercial-ShareAlike 4.0
International Public License
*/

import log from './logger';

export default function interpolate(text: string, variables:Map<string, string>) {
	variables.forEach((v, k) => {
		log.debug(`replace ´${k}´ with ´${v}´. Only the first occurrence will be replaced.`);
		text = text.replace(k, eval(v));
	});
	return text;
}
