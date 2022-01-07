let baseLanguage = 'en';

function matchDataRecursive(dest, src) {
	if (typeof dest !== 'object' || typeof src !== 'object') {
		return;
	}

	for (const key in dest) {
		if (src[key]) {
			// console.log("copy", key);
			const data = dest[key];
			if (typeof data === 'object') {
				matchDataRecursive(dest[key], src[key]);
			} else if (typeof data === 'string' || typeof data === 'number') {
				// console.log("match string", key);
				dest[key] = src[key];
			} else {
				console.log('Unknown type:', typeof data, 'in key', key);
			}
		} else {
			console.log('Src is missing: ' + key);
		}
	}
}
// require('./languages/nl.json');
module.exports = { baseLanguage, matchDataRecursive, languages: ['en', 'nl'] };
