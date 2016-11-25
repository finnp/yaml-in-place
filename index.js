const escape = require('escape-string-regexp')
const jsyaml = require('js-yaml')
const _ = require('lodash')

function addToSequence (yml, path, newItem) {
  const parsed = jsyaml.safeLoad(yml, {schema: jsyaml.FAILSAFE_SCHEMA})
  const seq = _.get(parsed, path)
  if (!seq) return
  const item = seq[seq.length - 1]
  if (!item) return

  // modify parsed to the goal
  seq.push(newItem)

  const match = findByPath(yml, path)
  if (!match) return // fail hard
  const position = match.position
  const indent = match.indent

  const arrayItemResult = findSequenceItem(yml, item, indent, position)
  if (!arrayItemResult) return

  const thirdIdent = arrayItemResult[1]
  const spacesBefore = arrayItemResult[2]

  const separator = arrayItemResult.index + arrayItemResult[0].length + 1
  const ymlBefore = yml.slice(0, separator)
  const addNewline = !_.includes('\n\r', _.last(ymlBefore))

  const newYml = ymlBefore + (addNewline ? '\n' : '') +
    `${thirdIdent}-${spacesBefore}${newItem}` +
    yml.slice(separator - 1)

  const newParsed = jsyaml.safeLoad(newYml, {schema: jsyaml.FAILSAFE_SCHEMA})

  if (!_.isEqual(parsed, newParsed)) throw new Error('Unexpected result')

  return newYml
}

function findByPath (yml, path) {
  if (typeof path === 'string') path = path.split('.')

  var indent = -1
  var position = 0

  for (var i = 0; i < path.length; i++) {
    const key = path[i]
    const regex = new RegExp(String.raw`^( {${indent + 1},})${escape(key)} *: *$`, 'm')
    regex.lastMatch = position
    const match = regex.exec(yml)
    if (!match) return
    indent = match[1].length
    position = match.index + match[0].length
  }

  return {position, indent}
}

function findSequenceItem (yml, item, minIndent, fromPosition) {
  const arrayItemRegex = new RegExp(String.raw`^( {${minIndent},})-( +)${escape(item)} *$`, 'm')
  arrayItemRegex.lastIndex = fromPosition
  const arrayItemResult = arrayItemRegex.exec(yml)
  return arrayItemResult
}

module.exports = {
  findByPath,
  findSequenceItem,
  addToSequence
}
