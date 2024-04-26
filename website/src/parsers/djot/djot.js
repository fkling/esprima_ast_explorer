import React from 'react';
import defaultParserInterface from '../utils/defaultParserInterface';

const ID = 'djot';

export default {
  ...defaultParserInterface,

  id: ID,
  displayName: ID,
  version: '0.3.1',
  homepage: 'https://djot.net/',
  locationProps: new Set(['pos']),

  loadParser(callback) {
    require(['@djot/djot'], callback);
  },

  parse(djot, code, options) {
    return djot.parse(code, { sourcePositions: true });
  },

  getNodeName(node) {
    return node.type;
  },

  nodeToRange({ pos }) {
    if (pos) {
      return [pos.start.offset, pos.end.offset];
    }
  },

  opensByDefault(node, key) {
    return key === 'children';
  },

  getDefaultOptions() {
    return {};
  },
};
