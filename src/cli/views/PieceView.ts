import promptSync from 'prompt-sync'
import { Piece } from '../../puzzle/Piece'
import { VisibleThingsMap } from '../../puzzle/VisibleThingsMap'
import { ShowUnderlinedTitle } from '../ShowUnderlinedTitle'
const prompt = promptSync({ sigint: true })

export function PieceView (
  piece: Piece, visibleThings: VisibleThingsMap, titlePath: string[]
): void {
  titlePath.push('Piece')
  for (; ;) {
    ShowUnderlinedTitle(titlePath)

    const id = piece.id
    console.warn(`id: ${id}`)
    console.warn(`output: ${piece.output}`)
    console.warn(`type: ${piece.type}`)
    const targets = new Array<Piece | null>()
    for (let i = 0; i < piece.inputs.length; i++) {
      targets.push(piece.inputs[i])
      const inputSpiel: string = piece.inputSpiels[i]
      console.warn(`input: ${i + 1}. ${inputSpiel}`)
    }

    // allow user to choose item
    const input = prompt(
      'Choose an input to climb up on or (s)tarting things, (b)ack: '
    ).toLowerCase()
    if (input === null || input === 'b') {
      return
    } else if (input === 's') {
      for (const item of visibleThings.GetIterableIterator()) {
        console.warn(`${item[0]}`)
      }
    } else {
      // show map entry for chosen item
      const theNumber = Number(input)
      if (theNumber > 0 && theNumber <= targets.length) {
        const result = targets[theNumber - 1]
        if (result != null) {
          PieceView(result, visibleThings, [...titlePath])
        } else {
          prompt('THAT WAS NULL. Hit any key to continue: ')
        }
      } else {
        prompt('OUT OF RANGE. Hit any key to continue: ')
      }
    }
  }
}
