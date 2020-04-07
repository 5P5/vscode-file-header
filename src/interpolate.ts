import log from './logger';

export default function interpolate(text: string, variables:Map<string, string>) {
	variables.forEach((v, k) => {
		log.debug(`replace ´${k}´ with ´${v}´. Only the first occurrence will be replaced.`);
		text = text.replace(k, eval(v));
	});
	return text;
}
