import { AddBrackets } from "../common/puzzle/AddBrackets"
import { FormatText } from "../common/puzzle/FormatText"
import { RawObjectsAndVerb } from "../common/puzzle/RawObjectsAndVerb"

export function GetRestrictionSpiel (command: RawObjectsAndVerb, settings: Settings): string {

  const restrictionSpiel =
    command.prerequisites.length > 0
      ? AddBrackets(FormatText(command.prerequisites, settings.isColor))
      : ''

  return restrictionSpiel
}