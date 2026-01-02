import { expect, it } from '@jest/globals'
import { SpecialTypes } from '../../../src/common/stuff/SpecialTypes'

describe('Special Types', () => {
  it('should convert blank', () => {
    expect(SpecialTypes.VerifiedLeaf).toBe('VerifiedLeaf')
  })
})
