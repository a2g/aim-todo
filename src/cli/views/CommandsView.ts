import promptSync from 'prompt-sync'
import { ShowUnderlinedTitle } from '../formatters/ShowUnderlinedTitle'
import { RawObjectsAndVerb } from '../../common/puzzle/RawObjectsAndVerb'
import { Raw } from '../../common/puzzle/Raw'
import { GetMainSpiel } from '../../api/GetMainSpiel'
import { GetAchievementSpiel } from '../../api/GetAchievementSpiel'
import { GetRestrictionSpiel } from '../../api/GetRestrictionSpiel'
import { FormatCommand } from '../../api/FormatCommand'

const prompt = promptSync({ sigint: true })

export function CommandsView (commands: RawObjectsAndVerb[], titlePath: string[]
): void {
  titlePath.push('Commands')
  let settings = {
    infoLevel: 9
  }
  for (; ;) {
    ShowUnderlinedTitle(titlePath)

    let listItemNumber = 0

    for (const command of commands) {
      // 0 is cleanest, later numbers are more detailed
      if (command.source === Raw.Achievement && settings.infoLevel < 5) {
        continue
      }
      if (command.source === Raw.Achievement && settings.infoLevel < 3) {
        continue
      }
      if (command.source === Raw.Error_ZeroPiecesInAimNoticedInDeconstructing && settings.infoLevel < 1) {
        continue
      }
      listItemNumber++

      const formattedCommand = FormatCommand(
        GetMainSpiel(command, settings),
        GetAchievementSpiel(command, settings),
        GetRestrictionSpiel(command, settings),
        command.typeJustForDebugging,
        settings
      )
      console.warn(`${listItemNumber}. ${formattedCommand}`)
      if (command.source === Raw.Dialog) {
        for (var i = 0; i < command.getChildTupleLength(); i++) {
          const speechLine = command.getChildTuple(i)
          console.warn(`Dialog   ${speechLine[0]}: ${speechLine[1]}`)
        }
      } else if (command.source === Raw.RevealedByPriorStep) {
        for (var i = 0; i < command.getChildTupleLength(); i++) {
          const speechLine = command.getChildTuple(i)
          console.warn(`Reveal   ${speechLine[0]}`)
        }
      }
    }

    // allow user to choose item
    const input2 = prompt('Choose a step (b)ack, (r)e-run:, debug-level(1-9) ').toLowerCase()
    if (input2 === null || input2 === 'b') {
      return
    } else {
      // show map entry for chosen item
      const theNumber2 = Number(input2)
      if (theNumber2 >= 1 && theNumber2 <= 9) {
        settings.infoLevel = theNumber2
      }
    }
  }
}
