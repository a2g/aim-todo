import { expect, it } from '@jest/globals'
import { Evolutions } from '../../../src/puzzle/Evolutions'

describe('SolverViaRootPiece', () => {
  it('should convert blank', () => {
    const s = new Evolutions('./practice-world', '03_inside_icehouse.jsonc')
    expect(s).toBeDefined()
  })
})
