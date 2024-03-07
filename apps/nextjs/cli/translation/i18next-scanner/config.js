const fs = require('fs');
const chalk = require('chalk');

module.exports = {
	input: [
		'src/**/*.{js,jsx,ts,tsx}'
	],
	// output: './',
	options: {
		compatibilityJSON: 'v3',
		func: {
			list: ['i18next.t', 'i18n.t'],
			extensions: ['.js', '.jsx', 'ts', 'tsx']
		},
		trans: {
			component: 't',
			i18nKey: 'i18nKey',
			defaultsKey: 'defaults',
			extensions: ['.js', '.jsx'],
			fallbackKey: function(ns, value) {
				return value;
			},
			acorn: {
				ecmaVersion: 2020,
				sourceType: 'module', // defaults to 'module'
				// Check out https://github.com/acornjs/acorn/tree/master/acorn#interface for additional options
			}
		},
		lngs: ['en', 'he'],
		ns: [
			'admin',
			'common'
		],
		defaultLng: 'en',
		defaultNs: 'common',
		defaultValue: '__STRING_NOT_TRANSLATED__',
		resource: {
			loadPath: '{{lng}}/{{ns}}.yaml',
			savePath: 'temp/{{lng}}/{{ns}}.yaml',
			jsonIndent: 2,
			lineEnding: '\n'
		},
		nsSeparator: ':', // namespace separator
		keySeparator: '.', // key separator
		interpolation: {
			prefix: '{{',
			suffix: '}}'
		}
	},
	transform: function customTransform(file, enc, done) {
		"use strict";
		const parser = this.parser;
		const content = fs.readFileSync(file.path, enc);
		let count = 0;

		parser.parseFuncFromString(content, { list: ['i18next.t'] }, (key, options) => {
			console.log({
				key,
				options
			})
			parser.set(key, Object.assign({}, options, {
				nsSeparator: ':',
				keySeparator: '.'
			}));
			++count;
		});

		if (count > 0) {
			console.log(`i18next-scanner: count=${chalk.cyan(count)}, file=${chalk.yellow(JSON.stringify(file.relative))}`);
		}

		done();
	}
};
