import { IdPrefixes } from '../../../IdPrefixes'
import { AddBrackets } from '../../common/stuff/AddBrackets'
import { Keywords } from '../../common/stuff/Keywords'



export function FormatText (
  input: string | string[],
  isColor = true,
  isParenthesisNeeded = false
): string {
  if (Array.isArray(input)) {
    // format arrays in to a lovely comma-separated list
    let toReturn = ''
    for (const nameToAdd of input) {
      toReturn +=
        toReturn.length > 0 ? `, ${FormatText(nameToAdd, isColor)}` : nameToAdd
    }
    return toReturn
  }

  const single = input.toString()
  if (single.startsWith('sol_obj_')) {
    if (!isColor) return AddBrackets(single.slice(9), isParenthesisNeeded)
    return (
      Keywords.Sol +
      AddBrackets(single.slice(9), isParenthesisNeeded) +
      Keywords.SolEnd
    )
  }
  if (single.startsWith(IdPrefixes.InvAchievement)) {
    if (!isColor) return single.slice(8)
    return Keywords.Inv + single.slice(8) + Keywords.InvEnd
  }
  if (single.startsWith('sol_a')) {
    if (!isColor) return single.slice(9)
    return Keywords.Sol + single.slice(9) + Keywords.SolEnd
  }
  if (single.startsWith('sol_inv_')) {
    if (!isColor) return single.slice(8)
    return Keywords.Sol + single.slice(8) + Keywords.SolEnd
  }
  if (single.startsWith(IdPrefixes.Inv)) {
    if (!isColor) return single.slice(4)
    return Keywords.Inv + single.slice(4) + Keywords.InvEnd
  }
  if (single.startsWith(IdPrefixes.Obj)) {
    if (!isColor) return single.slice(4)
    return Keywords.Obj + single.slice(4) + Keywords.ObjEnd
  }
  if (single.startsWith(IdPrefixes.Aim)) {
    if (!isColor) return single
    return Keywords.Aim + single + Keywords.AimEnd
  }
  // aims were green
  // objs were cyan
  // invs were green
  // solutions were yellow
  // dialogs were red
  // single object commands were red

  if (single.startsWith(IdPrefixes.Dialog) || single.startsWith(IdPrefixes.Dialogs)) {
    if (!isColor) return single.slice(1)
    return Keywords.Dialog + single.slice(1) + Keywords.DialogEnd
  }
  if (single.startsWith(IdPrefixes.Player)) {
    if (!isColor) return AddBrackets(single.slice(7), isParenthesisNeeded)
    return (
      Keywords.Dialog +
      AddBrackets(single.slice(5), isParenthesisNeeded) +
      Keywords.DialogEnd
    )
  }
  if (
    single.startsWith('use') ||
    single.startsWith('toggle') ||
    single.startsWith('grab')
  ) {
    if (!isColor) return single
    return Keywords.Single + single + Keywords.SingleEnd
  }

  return single
}
