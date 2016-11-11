const escape = require('escape-string-regexp')
const {safeLoad, FAILSAFE_SCHEMA} = require('js-yaml')
const {get, isEqual, last, includes} = require('lodash')

function addToSequence (yml, path, newItem) {
  const parsed = safeLoad(yml, {schema: FAILSAFE_SCHEMA})
  const seq = get(parsed, path)
  if (!seq) return
  const item = seq[seq.length - 1]
  if (!item) return

  // modify parsed to the goal
  seq.push(newItem)

  const match = findByPath(yml, path)
  if (!match) return // fail hard
  const {position, indent} = match

  const arrayItemResult = findSequenceItem(yml, item, indent, position)
  if (!arrayItemResult) return

  const thirdIdent = arrayItemResult[1]
  const spacesBefore = arrayItemResult[2]

  const separator = arrayItemResult.index + arrayItemResult[0].length + 1
  const ymlBefore = yml.slice(0, separator)
  const addNewline = !includes('\n\r', last(ymlBefore))

  const newYml = ymlBefore + (addNewline ? '\n' : '') +
    `${thirdIdent}-${spacesBefore}${newItem}` +
    yml.slice(separator - 1)

  const newParsed = safeLoad(newYml, {schema: FAILSAFE_SCHEMA})

  if (!isEqual(parsed, newParsed)) throw new Error('Unexpected result')

  return newYml
}

function findByPath (yml, path) {
  if (typeof path === 'string') path = path.split('.')

  let indent = -1
  let position = 0

  for (let i = 0; i < path.length; i++) {
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
  const arrayItemRegex = new RegExp(String.raw`^( {${minIndent + 1},})-( +)${escape(item)} *$`, 'm')
  arrayItemRegex.lastIndex = fromPosition
  const arrayItemResult = arrayItemRegex.exec(yml)
  return arrayItemResult
}

module.exports = {
  findByPath,
  findSequenceItem,
  addToSequence
}
