import { IdPrefixes } from "../../IdPrefixes"
import { AddBrackets } from "../common/stuff/AddBrackets"
import { FormatText } from "../common/stuff/FormatText"
import { StepType } from "../common/stuff/StepType"
import { Step } from "../common/stuff/Step"

export function GetAchievementSpiel (command: Step, settings: Settings): string {

  const isColor = settings.isColor != null ? settings.isColor : false
  const verb = FormatText(command.stepType, isColor)
  const output = FormatText(command.output)
  const objectA = FormatText(command.objectA, isColor)
  if (command.objectB === undefined) {
    command.dumpRaw()
  }
  const objectB = FormatText(command.objectB, isColor)

  command.restrictionSpiel =
    command.prerequisites.length > 0
      ? AddBrackets(FormatText(command.prerequisites, isColor))
      : ''

  let mainSpiel = '<not set>'
  switch (command.stepType) {
    default:
      let joiner = ' '
      switch (command.stepType) {
        case StepType.Command:
          joiner = ' with '
          break
        case StepType.Toggle:
          joiner = ' to '
          break;
      }
      mainSpiel = verb + ' ' + objectA + joiner + objectB + ' results in ' + output + ' '
      break
    case StepType.Auto:
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