const {addToSequence, findByPath} = require('./')

const travis =
`# branches to build
branches:
  # whitelist
  only:
    - __fake`

findByPath(travis, ['branches', 'only'])

console.log(addToSequence(travis, ['branches', 'only'], '/greenkeeper.*/'))
