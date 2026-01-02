import { Step } from "../common/stuff/Step";


export function GetChildrenAsJsonArray (command: Step): Array<[string, string]> {
  return command.GetChildTuples()
}
