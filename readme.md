# yml-in-place


```js
const {addToSequence} = require('yaml-in-place')

const yml = `
 language: node_js
 branches:
   only:
     - master
`

const newYml = addToSequence(yml, ['branches', 'only'], 'greenkeeper')

```
