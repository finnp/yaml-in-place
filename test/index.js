const tape = require('tape')
const fs = require('fs')
const {join} = require('path')

const {addToSequence} = require('../')

const fixtures = fs.readdirSync(join(__dirname, 'fixtures'))

tape('test', (t) => {
  t.plan(fixtures.length)
  fixtures.forEach((file) => {
    const yml = fs.readFileSync(join(__dirname, 'fixtures', file), 'utf-8')
    const result = addToSequence(yml, ['branches', 'only'], '/^greenkeeper.*$/')
    t.ok(result, file)
  })
})
