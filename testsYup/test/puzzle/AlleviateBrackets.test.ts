import { expect, test } from '@jest/globals'
import { AlleviateBrackets } from '../../../src/common/stuff/AlleviateBrackets'
test('AddBrackets', () => {
  expect(AlleviateBrackets('(blah)')).toBe('blah')
})
