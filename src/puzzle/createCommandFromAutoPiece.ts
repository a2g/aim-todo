import { Piece } from './Piece'
import { Raw } from './Raw'
import { RawObjectsAndVerb } from './RawObjectsAndVerb'

export function createCommandFromAutoPiece (piece: Piece): RawObjectsAndVerb {
  let text = 'auto using ('
  for (const inputName of piece.inputHints) {
    const inputName2: string = inputName
    text += `${inputName2} `
  }
  console.warn(text)

  const raw = new RawObjectsAndVerb()
  raw.mainSpiel = ""
  raw.objectA = piece.inputHints[0]
  raw.prerequisites = piece.getPrerequisites()
  raw.type = Raw.Auto
  raw.output = piece.output
  return raw
}
