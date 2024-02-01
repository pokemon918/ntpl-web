let debug = false;

let indent = '\t';

let log = function (txt, target = null, debug = null) {
	msg = indent.repeat(log.level);

	msg += txt;

	if (null !== target) {
		if (typeof target !== 'string') {
			target = JSON.stringify(target);
		}
		msg += ': ' + target;
	} else {
		msg = '\n' + msg;
	}

	if (null != debug) {
		msg += indent + '(' + JSON.stringify(debug) + ')\n';
	}

	console.log(msg);
};

log.level = 0;

if (typeof it !== 'function') {
	it = function (step, cb) {
		return cb();
	};
}

log.it = function (step, cb) {
	return it(step, async () => {
		log(step);
		await cb();
	});
};

module.exports = log;
