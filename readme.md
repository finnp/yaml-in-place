# yml-in-place
[![Build Status](https://travis-ci.org/finnp/yaml-in-place.svg?branch=master)](https://travis-ci.org/finnp/yaml-in-place)
[![Coverage Status](https://coveralls.io/repos/finnp/yaml-in-place/badge.svg?branch=master&service=github)](https://coveralls.io/github/finnp/yaml-in-place?branch=master)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![NPM](https://nodei.co/npm/yaml-in-place.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/yaml-in-place/)

Currently only supports adding a value to a block sequence. But includes utilities
to fairly easily also add other features like setting or removing values from maps
or sequences.

## Usage

```js
const addToSequence = require('yaml-in-place').addToSequence

const yml = `
 language: node_js
 branches:
   only:
     - master
`

const newYml = addToSequence(yml, ['branches', 'only'], 'greenkeeper')
console.log(newYml)
// language: node_js
// branches:
//   only:
//     - master
//     - greenkeeper

```
