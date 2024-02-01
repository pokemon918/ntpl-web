const fs = require('fs');
const glob = require('glob');
const {upload} = require('bugsnag-sourcemaps');

const buildInfo = require('../build/app/build.json');

// make sure to update src/config/bugsnag.js if you change this
const appVersion = buildInfo.version;
[buildInfo.tags, buildInfo.branch, buildInfo.commit, buildInfo.build ? 'b' + buildInfo.build : '']
	.filter(Boolean)
	.join('-');

const argv = require('minimist')(process.argv.slice(2));

/**
 * Find all of the map files in ./build
 */
function findSourceMaps(callback) {
	return glob('build/**/*/*.map', callback);
}

/**
 * Delete the .map files
 * We do this to protect our source
 * @param files - array of source map files
 */
function deleteFiles(files) {
	files.forEach((file) => {
		const path = `${__dirname}/../${file}`;
		fs.unlinkSync(path);
		//fs.writeFileSync(path,'')
	});
}

/**
 * Uploads the source map with accompanying sources
 * @param sourceMap - single .map file
 * @returns {Promise<string>} - upload to Bugsnag
 */
function uploadSourceMap(sourceMap) {
	// Remove .map from the file to get the js filename
	const minifiedFile = sourceMap.replace(/\.map$/, '');

	// Remove absolute path to the static assets folder
	const minifiedFileRelativePath = minifiedFile.split('build/')[1];

	let payload = {
		apiKey: '6ac91926d24d2a97b6e4d54d1cba9119',
		appVersion,
		overwrite: true,
		minifiedUrl: `*/${minifiedFileRelativePath}`,
		sourceMap: __dirname + '/../' + sourceMap,
		minifiedFile: __dirname + '/../' + minifiedFile,
		//projectRoot: __dirname,
		uploadSources: true,
	};
	console.log(`Uploading ${sourceMap} to bugsnag`);
	//console.log(payload);

	return upload(payload);
}

/**
 * Find, upload and delete Source Maps
 */
function processSourceMaps() {
	findSourceMaps((error, files) =>
		Promise.all(files.map(uploadSourceMap))
			.then(() => {
				if (argv.delete) deleteFiles(files);
			})
			.catch((e) => {
				console.log(e);
			})
	);
}

processSourceMaps();
