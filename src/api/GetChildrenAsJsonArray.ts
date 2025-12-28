import { RawObjectsAndVerb } from "../common/puzzle/RawObjectsAndVerb";


export function GetChildrenAsJsonArray (command: RawObjectsAndVerb): Array<[string, string]> {
  return command.GetChildTuples()
}
