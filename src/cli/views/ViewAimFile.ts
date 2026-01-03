import promptSync from 'prompt-sync'

import { ShowUnderlinedTitle } from '../formatters/ShowUnderlinedTitle'
import { AimFile as AimFile } from '../../common/files/AimFile'
import { ViewCommands } from './ViewCommands'
import { ViewAimDeconstruction } from './ViewAimDeconstructionn'
import { Solution } from '../../common/solving/Solution'
import { ViewLeavesOfHeader } from './ViewLeavesOfHeader'



const prompt = promptSync({ sigint: true })

export function ViewAimFile (header: AimFile, validator: Solution, titlePath: string[]): void {
  titlePath.push('AimFileHeader')
  for (; ;) {
    ShowUnderlinedTitle(titlePath)
    const input = prompt(
      `The Root word of the aim file is ${header.GetAimName()}. ` +
      `\nThe Piece of this header is ${header.GetTheAny() !== null ? 'non-null' : 'null'}` +
      '\nWhat to do with aim file header:' +
      '\çn(b)ack, (r)e-run, (s)tarters, (o)rdered-commands, (t)raverse, (l)eaves '
    ).toLowerCase()
    if (input === null || input === 'b') {
      return
    } else if (input === 's') {
      console.warn(`Number of starters ${validator.GetVisibleThingsAtTheMoment().Size()}`)
      for (const item of validator.GetVisibleThingsAtTheMoment().GetIterableIterator()) {
        console.warn(`${item[0]}`)
      }
    } else if (input === 'l') {
      ViewLeavesOfHeader(header.GetLeaves(), titlePath)
    } else if (input === 'r') {
      validator.DeconstructGivenHeaderAndRecordSteps(header)
    } else if (input === 'o') {
      ViewCommands(header.GetOrderedCommands(), [...titlePath])
    } else if (input === 't') {
      const theAchievementPiece = header.GetTheAny()
      if (theAchievementPiece != null) {
        ViewAimDeconstruction(theAchievementPiece, validator, header, validator.GetVisibleThingsAtTheMoment(), [...titlePath])
      } else {
        prompt(`${header.GetAimName()} Achievement.piece WAS NULL. Hit any key to continue: `)
      }
    }
  }
}
