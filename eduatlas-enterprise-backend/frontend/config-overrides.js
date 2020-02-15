const { primaryColor } = require('./src/config.json');
const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');

module.exports = function override(config, env) {
	config = injectBabelPlugin(
		['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
		config,
	);
	config = injectBabelPlugin(
		['import', { libraryName: 'antd-mobile', libraryDirectory: 'es', style: true }, 'unique'],
		config,
	);
	config = rewireLess.withLoaderOptions({
		modifyVars: { '@primary-color': primaryColor, '@brand-primary': primaryColor },
		javascriptEnabled: true
	})(config, env);
	return config;
};
