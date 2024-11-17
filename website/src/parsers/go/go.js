import defaultParserInterface from '../utils/defaultParserInterface'

const ID = 'go'

export default {
  ...defaultParserInterface,

  id: ID,
  displayName: ID,
  version: '1.23.3',
  homepage: 'https://golang.org/pkg/go/',
  _ignoredProperties: new Set(['_type']),
  locationProps: new Set(['Loc']),

  async loadParser(callback) {
    require(['astexplorer-go'], async parser => {
      await parser.init()
      callback(parser)
    })
  },

  parse(parser, code) {
    return parser.parseFile(code)
  },

  getNodeName(node) {
    return node._type
  },

  nodeToRange(node) {
    if (node.Loc) {
      return [node.Loc.Start, node.Loc.End].map(({ Offset }) => Offset)
    }
  },
}
