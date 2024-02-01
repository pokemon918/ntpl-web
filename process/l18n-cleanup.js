#!/usr/bin/env node

const {execSync} = require('child_process');

//process.chdir('../');
//const l18n = require('../src/assets/json/l18n/en');

const l18nPath = 'src/assets/json/l18n/flex';

const files =
	"git ls-tree --full-tree --name-only -r HEAD | grep -E '\\.(scss|css|js|ts|vue|php|json)$' | xargs ";

let keys = execSync(`grep -r : ${l18nPath}`)
	.toString()
	.split('\n')
	.filter(Boolean)
	.map((e) => e.replace(/(^[^"]+")|(".+$)/g, ''));

let unused = [];

//keys.slice(0, 5).forEach((k) => {
keys.forEach((k) => {
	console.log('Looking at', k);

	const cmd = `${files} grep ${k} | grep -v ${l18nPath} || echo`;

	//console.log(cmd);

	let matches = execSync(cmd).toString().split('\n').filter(Boolean);
	if (matches.length < 1) {
		unused.push(k);
		console.log('Gave ', unused);
	}
});

console.log(`Found ${unused.length} unused keys`);

console.log(JSON.stringify(unused, null, 2));

unused.forEach((k) => {
	console.log('Removing', k);

	const cmd = `npx rexreplace "^.*${k}.*\\n" '' "${l18nPath}/**"`;

	//console.log(cmd);

	execSync(cmd);
});

console.log('Cleaning up');

execSync('yarn fmt');

console.log(
	'All good. Dont forget to commit the changes - and ship the new l18n files to crowdid!'
);
