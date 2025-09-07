import { IdPrefixes } from "../../IdPrefixes"
import { AddBrackets } from "../common/puzzle/AddBrackets"
import { FormatText } from "../common/puzzle/FormatText"
import { Raw } from "../common/puzzle/Raw"
import { RawObjectsAndVerb } from "../common/puzzle/RawObjectsAndVerb"

export function GetMainSpiel (command: RawObjectsAndVerb, settings: Settings): string {

  const isColor = settings.isColor != null ? settings.isColor : false
  const verb = FormatText(command.source, isColor)
  const output = FormatText(command.output)
  const objectA =
    FormatText(command.objectA, isColor) +
    FormatText(command.startingCharacterForA, isColor, true)
  if (command.objectB === undefined) {
    command.dumpRaw()
  }
  const objectB =
    FormatText(command.objectB, isColor) +
    FormatText(command.startingCharacterForB, isColor, true)

  command.restrictionSpiel =
    command.prerequisites.length > 0
      ? AddBrackets(FormatText(command.prerequisites, isColor))
      : ''

  let mainSpiel = '<not set>'
  switch (command.source) {
    default:
      let joiner = ' '
      switch (command.source) {
        case Raw.Command:
          joiner = ' with '
          break
        case Raw.Toggle:
          joiner = ' to '
          break;
      }
      mainSpiel = verb + ' ' + objectA + joiner + objectB + ' results in ' + output + ' '
      break
    case Raw.EndOfAchievement:
      mainSpiel = ` --------------- end of achievement ${objectA}`
      break;
    case Raw.Auto:
      if (command.objectB.startsWith(IdPrefixes.Inv)) {
        mainSpiel = `You obtain a ${objectB}`
      } else if (command.objectB.startsWith(IdPrefixes.Obj)) {
        mainSpiel = `You now see a ${objectB}`
      } else if (objectB.startsWith(IdPrefixes.Dialog)) {
        mainSpiel = `You now see a dialogty ${objectB}`
      } else if (objectB.startsWith(IdPrefixes.Aim)) {
        // source = Raw.Achievement
        mainSpiel = `Achievement unlocked ${objectB}`
      } else {
        mainSpiel = `${objectB} generically appears.... `
      }
  }
  return mainSpiel
}