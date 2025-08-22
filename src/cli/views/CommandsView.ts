import promptSync from 'prompt-sync'
import { ShowUnderlinedTitle } from '../ShowUnderlinedTitle'
import { Raw } from '../../puzzle/Raw'
import { RawObjectsAndVerb } from '../../puzzle/RawObjectsAndVerb'
const prompt = promptSync({ sigint: true })

export function CommandsView (commands: RawObjectsAndVerb[], titlePath: string[]
): void {
  titlePath.push('Commands')
  let infoLevel = 9
  for (; ;) {
    ShowUnderlinedTitle(titlePath)

    let listItemNumber = 0

    for (const command of commands) {
      // 0 is cleanest, later numbers are more detailed
      if (command.source === Raw.Achievement && infoLevel < 5) {
        continue
      }
      if (command.source === Raw.Achievement && infoLevel < 3) {
        continue
      }
      if (command.source === Raw.Error_ZeroPiecesInAimNoticedInDeconstructing && infoLevel < 1) {
        continue
      }
      listItemNumber++
      const formattedCommand = FormatCommand(command, infoLevel)
      console.warn(`${listItemNumber}. ${formattedCommand}`)
      if (command.source === Raw.Dialog) {
        for (var i = 0; i < command.getChildTupleLength(); i++) {
          const speechLine = command.getChildTuple(i)
          console.warn(`   ${speechLine[0]}: ${speechLine[1]}`)
        }
      } else if (command.source === Raw.Reveal) {
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
        infoLevel = theNumber2
      }
    }
  }
}

function FormatCommand (raw: RawObjectsAndVerb, infoLevel: number): string {
  raw.PopulateSpielFields()
  let toReturn = ''
  switch (infoLevel) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
      toReturn = `${raw.mainSpiel}`
      break
    case 8:
      toReturn = `${raw.mainSpiel}  ${raw.achievementSpiel}`
      break
    case 9:
      toReturn = `${raw.mainSpiel}  ${raw.achievementSpiel} ${raw.restrictionSpiel} ${raw.typeJustForDebugging}`
      break
  }
  return toReturn
}
