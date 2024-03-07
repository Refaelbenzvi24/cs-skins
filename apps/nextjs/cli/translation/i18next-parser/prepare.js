/** @type {import('fs')}  */
const fs = require('fs');

const vueTemplateCompilerIndex = fs.readFileSync(
  '../../node_modules/vue-template-compiler/index.js',
  'utf-8',
);

// replace with some fake package
const fixedVueTemplateCompilerIndex = vueTemplateCompilerIndex.replace(
  "require('vue').version",
  "require('vue2').version",
);

if (fixedVueTemplateCompilerIndex === vueTemplateCompilerIndex) {
  return process.exit(0);
}

fs.writeFileSync('../../node_modules/vue-template-compiler/index.js', fixedVueTemplateCompilerIndex, {
  flag: 'w',
});
