import { expect, it } from '@jest/globals'
import { Stringify } from '../../../src/common/stuff/Stringify'


describe('Stringify', () => {
  it('should convert blank', () => {
    expect(Stringify(null)).toBe('')
  })
})
