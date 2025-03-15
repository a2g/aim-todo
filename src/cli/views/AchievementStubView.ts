import promptSync from 'prompt-sync'

import { ShowUnderlinedTitle } from '../ShowUnderlinedTitle'
import { AimStub } from '../../puzzle/aim/AimStub'
import { CommandsView } from './CommandsView'
import { VisibleThingsMap } from '../../puzzle/VisibleThingsMap'
import { PieceDeconstructionView } from './PieceDeconstructionView'
import { Validator } from '../../puzzle/aim/Validator'

const prompt = promptSync({ sigint: true })

export function AchievementStubView (stub: AimStub, validator: Validator, visibleThingsAtTheMoment: VisibleThingsMap, titlePath: string[]): void {
  titlePath.push('AchievementStub')
  for (; ;) {
    ShowUnderlinedTitle(titlePath)
    const input = prompt(
      `The Achievement Word of this stub is ${stub.GetTheAimWord()}. ` +
      `\nThe Piece of this stub is ${stub.GetTheAny() !== null ? 'non-null' : 'null'}` +
      '\nWhat to do with achievement stub: (b)ack, (o)rdered-commands, (t)raverse tree  '
    ).toLowerCase()
    if (input === null || input === 'b') {
      return
    } else if (input === 'o') {
      CommandsView(stub.GetOrderedCommands(), [...titlePath])
    } else if (input === 't') {
      const theAchievementPiece = stub.GetTheAny()
      if (theAchievementPiece != null) {
        PieceDeconstructionView(theAchievementPiece, validator, stub, visibleThingsAtTheMoment, [...titlePath])
      } else {
        prompt(`${stub.GetTheAimWord()} Achievement.piece WAS NULL. Hit any key to continue: `)
      }
    }
  }
}
