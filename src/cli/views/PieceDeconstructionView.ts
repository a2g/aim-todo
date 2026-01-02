import promptSync from 'prompt-sync'

import { AimFile } from '../../common/files/AimFile'
import { ShowUnderlinedTitle } from '../formatters/ShowUnderlinedTitle'
import { Solution } from '../../common/solving/Solution'
import { VisibleThingsMap } from '../../common/stuff/VisibleThingsMap'

const prompt = promptSync({ sigint: true })

export function PieceDeconstructionView (
  piece: any,
  validator: Solution,
  header: AimFile, visibleThings: VisibleThingsMap, titlePath: string[]
): void {
  titlePath.push('Piece(Deconstruct)')
  for (; ;) {
    ShowUnderlinedTitle(titlePath)
    // const output: string = (piece.spielOutput.length > piece.output.length) ? piece.spielOutput : piece.output
    const targets = new Array<any | null>()

    let i = 0;
    for (const [key, value] of Object.entries(piece)) {
      i++;
      console.log(`${i} ${key}: ${value}`);
      targets.push(value)
    }

    // allow user to choose item
    const input = prompt(
      'Choose an input to dig into or (s)tarting things, (b)ack, (r)e-run: '
    ).toLowerCase()
    if (input === null || input === 'b') {
      return
    } else if (input === 'r') {
      validator.DeconstructGivenHeaderAndRecordSteps(header)
    } else if (input === 's') {
      for (const item of visibleThings.GetIterableIterator()) {
        console.warn(`${item[0]}`)
      }
    } else {
      // show map entry for chosen item
      const theNumber = Number(input)
      if (theNumber > 0 && theNumber <= targets.length) {
        const piece = targets[theNumber - 1]
        if (piece != null) {
          PieceDeconstructionView(piece, validator, header, visibleThings, [...titlePath])
        } else {
          prompt('THAT WAS NULL. Hit any key to continue: ')
        }
      } else {
        prompt('OUT OF RANGE. Hit any key to continue: ')
      }
    }
  }
}

