import defaultParserInterface from './utils/defaultESTreeParserInterface';
import pkg from 'babylon7/package.json';

const availablePlugins = [
  // Miscellaneous
  // https://babeljs.io/docs/en/babel-parser.html#miscellaneous
  'estree',

  // Language extensions
  // https://babeljs.io/docs/en/babel-parser.html#language-extensions
  'flow',
  'flowComments',
  'jsx',
  'typescript',
  'v8intrinsic',

  // ECMAScript Proposals
  // https://babeljs.io/docs/en/babel-parser.html#ecmascript-proposalshttpsgithubcombabelproposals
  'asyncDoExpressions',
  'decimal',
  'decorators',
  'decoratorAutoAccessors',
  'destructuringPrivate',
  'doExpressions',
  'exportDefaultFrom',
  'functionBind',
  'importAssertions',
  'moduleBlocks',
  'partialApplication',
  'pipelineOperator',
  'recordAndTuple',
  'regexpUnicodeSets',
  'throwExpressions',
];

const ID = 'babylon7';
export const defaultOptions = {
  sourceType: 'module',
  allowImportExportEverywhere: false,
  allowReturnOutsideFunction: false,
  createParenthesizedExpressions: false,
  ranges: false,
  tokens: false,
  plugins: [
    'decorators',
    'decoratorAutoAccessors',
    'doExpressions',
    'exportDefaultFrom',
    'flow',
    'functionBind',
    'importAssertions',
    'jsx',
    'regexpUnicodeSets',
  ],
  decoratorOptions: { version: "2022-03", decoratorsBeforeExport: false, allowCallParenthesized: true },
  pipelineOptions: { proposal: 'hack', hackTopicToken: '%' },
  typescriptOptions: { dts: false, disallowAmbiguousJSXLike: false },
};

export const parserSettingsConfiguration = {
  fields: [
    ['sourceType', ['module', 'script', 'unambiguous']],
    'allowReturnOutsideFunction',
    'allowImportExportEverywhere',
    'createParenthesizedExpressions',
    'errorRecovery',
    'ranges',
    'tokens',
    {
      key: 'plugins',
      title: 'Plugins',
      fields: availablePlugins,
      settings: settings => settings.plugins || defaultOptions.plugins,
      values: plugins => availablePlugins.reduce(
        (obj, name) => ((obj[name] = plugins.indexOf(name) > -1), obj),
        {},
      ),
    },
    {
      key: 'pipelineOptions',
      title: 'Pipeline Operator Options',
      fields: [
        ['proposal', ['minimal', 'smart', 'hack', 'fsharp']],
        ['hackTopicToken', ['%', '#', '^', '^^', '@@']],
      ],
      settings: settings => settings.pipelineOptions || defaultOptions.pipelineOptions,
    },
    {
      key: 'decoratorOptions',
      title: 'Decorator Options',
      fields: [
        "allowCallParenthesized",
        "decoratorsBeforeExport",
        ['version', ["2018-09", "2021-12", "2022-03"]],
      ],
      settings: settings => settings.decoratorOptions || defaultOptions.decoratorOptions,
    },
    {
      key: 'typescriptOptions',
      title: 'TypeScript Options',
      fields: [
        'dts',
        'disallowAmbiguousJSXLike'
      ],
      settings: settings => settings.typescriptOptions || defaultOptions.typescriptOptions,
    }
  ],
};
export let parserOptions = []
export default {
  ...defaultParserInterface,

  id: ID,
  displayName: '@babel/parser',
  version: pkg.version,
  homepage: pkg.homepage,
  locationProps: new Set(['range', 'loc', 'start', 'end']),

  loadParser(callback) {
    require(['babylon7'], callback);
  },

  parse(babylon, code, options) {
    options = {...options};
    // Older versions didn't have the pipelineOptions setting, but
    // only a pipelineProposal string option.
    const { pipelineOptions = {proposal: options.pipelineProposal}, decoratorOptions, typescriptOptions } = options;
    options.plugins = (options.plugins || []).map(plugin => {
      switch (plugin) {
        case 'decorators':
          return ['decorators', decoratorOptions];
        case 'pipelineOperator':
          return ['pipelineOperator', {
            proposal: pipelineOptions.proposal,
            topicToken: pipelineOptions.hackTopicToken,
          }];
        case 'typescript':
          return ['typescript', typescriptOptions];
        default:
          return plugin;
      }
    });
    parserOptions = options.plugins
    return babylon.parse(code, options);
  },

  getNodeName(node) {
    switch (typeof node.type) {
      case 'string':
        return node.type;
      case 'object': return `Token (${node.type.label})`;
    }
  },

  nodeToRange(node) {
    if (typeof node.start !== 'undefined') {
      return [node.start, node.end];
    }
  },

  getDefaultOptions() {
    return defaultOptions;
  },

  _getSettingsConfiguration() {
    return parserSettingsConfiguration;
  },
};
