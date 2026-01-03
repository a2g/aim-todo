import promptSync from 'prompt-sync'

import { ShowUnderlinedTitle } from '../formatters/ShowUnderlinedTitle'
import { AimFile as AimFile } from '../../common/files/AimFile'
import { ViewCommands } from './ViewCommands'
import { ViewAimDeconstruction } from './ViewAimDeconstructionn'
import { Solution } from '../../common/solving/Solution'
import { ViewLeavesOfAimFile } from './ViewLeavesOfAimFile'



const prompt = promptSync({ sigint: true })

export function ViewAimFile (aimFile: AimFile, validator: Solution, titlePath: string[]): void {
  titlePath.push('AimFile')
  for (; ;) {
    ShowUnderlinedTitle(titlePath)
    const input = prompt(
      `What to do with aim file ${aimFile.GetAimName()}. ` +
      '\n(b)ack, (r)e-run, (s)tarters, (o)rdered-commands, (t)raverse, (l)eaves '
    ).toLowerCase()
    if (input === null || input === 'b') {
      return
    } else if (input === 's') {
      console.warn(`Number of starters ${validator.GetVisibleThingsAtTheMoment().Size()}`)
      for (const item of validator.GetVisibleThingsAtTheMoment().GetIterableIterator()) {
        console.warn(`${item[0]}`)
      }
    } else if (input === 'l') {
      ViewLeavesOfAimFile(aimFile.GetLeaves(), titlePath)
    } else if (input === 'r') {
      validator.DeconstructAimFileAndRecordSteps(aimFile)
    } else if (input === 'o') {
      ViewCommands(aimFile.GetOrderedCommands(), [...titlePath])
    } else if (input === 't') {
      const theAchievementPiece = aimFile.GetTheAny()
      if (theAchievementPiece != null) {
        ViewAimDeconstruction(theAchievementPiece, validator, aimFile, validator.GetVisibleThingsAtTheMoment(), [...titlePath])
      } else {
        prompt(`${aimFile.GetAimName()} Achievement.piece WAS NULL. Hit any key to continue: `)
      }
    }
  }
}
