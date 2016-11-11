const {addToSequence} = require('./')

const travis =
`# .travis.yml
 language: node_js
 node_js:
   - '5.4'
   - '4.4'
 notifications:
   email: false
 script: npm run travis
 branches:
   only:
    - master
    - develop
    - /^v[0-9]/
   except:
    - what
`

console.log(addToSequence(travis, ['branches', 'only'], '/greenkeeper.*/'))
