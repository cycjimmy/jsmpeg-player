/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint no-console: 0 */
import path from 'path';
import fs from 'fs-extra';

const { copySync } = fs;

copySync(
  path.resolve('dist'),
  path.resolve('.release', 'dist'),
);
copySync(
  path.resolve('README.md'),
  path.resolve('.release', 'README.md'),
);
copySync(
  path.resolve('LICENSE'),
  path.resolve('.release', 'LICENSE'),
);

console.log('copyFiles success!');
