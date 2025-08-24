import { expect, test } from '@jest/globals'
import { AddBrackets } from '../../../src/common/puzzle/AddBrackets'

test('AddBrackets', () => {
  expect(AddBrackets('blah', true)).toBe('(blah)')
})
