import { AddBrackets } from "../common/stuff/AddBrackets"
import { FormatText } from "../cli/formatters/FormatText"
import { Step } from "../common/stuff/Step"

export function GetRestrictionSpiel (command: Step, settings: Settings): string {

  const restrictionSpiel =
    command.prerequisites.length > 0
      ? AddBrackets(FormatText(command.prerequisites, settings.isColor))
      : ''

  return restrictionSpiel
}