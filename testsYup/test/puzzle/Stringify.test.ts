import { expect, it } from '@jest/globals'
import { Stringify } from '../../../src/common/puzzle/Stringify'


describe('Stringify', () => {
  it('should convert blank', () => {
    expect(Stringify(null)).toBe('')
  })
})
