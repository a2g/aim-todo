import promptSync from 'prompt-sync'

import { ShowUnderlinedTitle } from '../ShowUnderlinedTitle'
import { AimFileHeader as AimFileHeader } from '../../puzzle/aim/AimFileHeader'
import { CommandsView } from './CommandsView'
import { PieceDeconstructionView } from './PieceDeconstructionView'
import { Validator } from '../../puzzle/aim/Validator'
import { Piece } from '../../puzzle/Piece'

const prompt = promptSync({ sigint: true })

export function ViewAimFileHeader (stub: AimFileHeader, validator: Validator, titlePath: string[]): void {
  titlePath.push('AimFileHeader')
  for (; ;) {
    ShowUnderlinedTitle(titlePath)
    const input = prompt(
      `The Root word of the aim file is ${stub.GetAimName()}. ` +
      `\nThe Piece of this stub is ${stub.GetTheAny() !== null ? 'non-null' : 'null'}` +
      '\nWhat to do with aim file header:' +
      '\çn(b)ack, (r)e-run, (s)tarters, (o)rdered-commands, (t)raverse '
    ).toLowerCase()
    if (input === null || input === 'b') {
      return
    } else if (input === 's') {
      console.warn(`Number of starters ${validator.GetVisibleThingsAtTheMoment().Size()}`)
      for (const item of validator.GetVisibleThingsAtTheMoment().GetIterableIterator()) {
        console.warn(`${item[0]}`)
      }
    }
    else if (input === 'r') {
      validator.DeconstructGivenStubAndRecordSteps(stub)
    } else if (input === 'o') {
      CommandsView(stub.GetOrderedCommands(), [...titlePath])
    } else if (input === 't') {
      const theAchievementPiece = stub.GetTheAny() as Piece
      if (theAchievementPiece != null) {
        PieceDeconstructionView(theAchievementPiece, validator, stub, validator.GetVisibleThingsAtTheMoment(), [...titlePath])
      } else {
        prompt(`${stub.GetAimName()} Achievement.piece WAS NULL. Hit any key to continue: `)
      }
    }
  }
}
