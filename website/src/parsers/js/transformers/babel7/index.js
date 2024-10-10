import compileModule from '../../../utils/compileModule';
import pkg from 'babel7/package.json';
const ID = 'babelv7';

function checkForTypescript(data) {
  if (data.includes("typescript")) {
      return true;
  }
  for (let item of data) {
      if (Array.isArray(item)) {
          if (checkForTypescript(item)) {
              return true;
          }
      }
  }
  return false;
}
export default {
  id: ID,
  displayName: ID,
  version: pkg.version,
  homepage: pkg.homepage,

  defaultParserID: 'babylon7',

  loadTransformer(callback) {
    require([
      '../../../transpilers/babel',
      '../../../transpilers/typescript',
      'babel7',
      'recast',
      '../../babylon7.js',
    ], (transpile, transpileTs, babel, recast, babylon7) => callback({ transpile: transpile.default, transpileTs: transpileTs.default, babel, recast, babylon7 }));
  },

  transform({ transpile, transpileTs, babel, recast, babylon7 }, transformCode, code) {
    transformCode = checkForTypescript(babylon7.parserOptions) ? transpileTs(transformCode, babylon7.parserOptions) : transpile(transformCode, babylon7.parserOptions);
    let transform = compileModule( // eslint-disable-line no-shadow
      transformCode,
    );
    return babel.transformAsync(code, {
      parserOpts: {
        parser: recast.parse,
        plugins: babylon7.parserOptions,
      },
      retainLines: false,
      generatorOpts: {
        generator: recast.print,
      },
      plugins: [(transform.default || transform)(babel)],
      sourceMaps: true,
    });
  },
};
