export function parseINI(strings: [string] = [""]) {
	const map = new Map<string, string>();
	strings.forEach(element => {
		const posOfDelimiter = element.indexOf("=");
		const name = element.slice(0, posOfDelimiter).trim();
		const rawVal = element.slice(posOfDelimiter + 1);
		map.set(name, rawVal);
	});
	return map;
}
