import { expect, test } from '@jest/globals'
import { AddBrackets } from '../../../src/common/stuff/AddBrackets'

test('AddBrackets', () => {
  expect(AddBrackets('blah', true)).toBe('(blah)')
})
