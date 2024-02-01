const productionKeys = {
	domain: 'noteable',
	publicKey: 'chjs_fgn4y5tb28s42k8vjnb45vf7',
};

const developmentKeys = {
	domain: 'noteable-dev',
	publicKey: 'chjs_mjcchv5jqkxq6gnvz4wsytyw',
};

const isProduction = window.location.hostname === 'noteable.co';
const activeKeys = isProduction ? productionKeys : developmentKeys;

export default activeKeys;
