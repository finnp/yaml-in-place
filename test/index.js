const tape = require('tape')
const fs = require('fs')
const path = require('path')

const addToSequence = require('../').addToSequence

const fixtures = fs.readdirSync(path.join(__dirname, 'fixtures'))

tape('test', (t) => {
  t.plan(fixtures.length)
  fixtures.forEach((file) => {
    const yml = fs.readFileSync(path.join(__dirname, 'fixtures', file), 'utf-8')
    const result = addToSequence(yml, ['branches', 'only'], '/^greenkeeper.*$/')
    t.ok(result, file)
  })
})
