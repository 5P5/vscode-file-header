/*
					 ,___ ,__  , .  . ,  __  ,  __  .  .
					 |__  |__) | \  / | /__` | /  \ |\ |
					 |___ |    |  \/  | .__/ | \__/ | \|

https://github.com/EPIVISION/vscode-file-header

utils.ts (c) 2020

Desc: utility functions
parseINI: split ini format pair string into map entries

Created:  2020-04-01T05:01:52.633Z
Modified: !date!

Creative Commons Attribution-NonCommercial-ShareAlike 4.0
International Public License
*/

export function parseINI(strings: [string], options: { [k: string]: string | boolean } = {}) {
	const map = new Map<string, string>();

	if (!strings.length) return map;

	// merge options
	const opts = {
		...{
			Delimiter: '=',
			trimName:  false,
			trimValue: false,
		},
		...options,
	};

	strings.forEach((element) => {
		const posOfDelimiter = element.indexOf(opts.Delimiter);
		const name = element.slice(0, posOfDelimiter);
		const rawVal = element.slice(posOfDelimiter + 1);
		map.set(opts.trimName ? name.trim() : name, opts.trimValue ? rawVal.trim() : rawVal);
	});

	return map;
}

export default null;
