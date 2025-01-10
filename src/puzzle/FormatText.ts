import { AddBrackets } from './AddBrackets'
import { Colors } from './Colors'

import { IdPrefixes } from '../../IdPrefixes'

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
      Colors.Yellow +
      AddBrackets(single.slice(9), isParenthesisNeeded) +
      Colors.Reset
    )
  }
  if (single.startsWith(IdPrefixes.InvAchievement)) {
    if (!isColor) return single.slice(8)
    return Colors.Yellow + single.slice(8) + Colors.Reset
  }
  if (single.startsWith('sol_a')) {
    if (!isColor) return single.slice(9)
    return Colors.Yellow + single.slice(9) + Colors.Reset
  }
  if (single.startsWith('sol_inv_')) {
    if (!isColor) return single.slice(8)
    return Colors.Yellow + single.slice(8) + Colors.Reset
  }
  if (single.startsWith(IdPrefixes.Inv)) {
    if (!isColor) return single.slice(4)
    return Colors.Green + single.slice(4) + Colors.Reset
  }
  if (single.startsWith(IdPrefixes.Obj)) {
    if (!isColor) return single.slice(4)
    return Colors.Cyan + single.slice(4) + Colors.Reset
  }
  if (single.startsWith(IdPrefixes.Achievement)) {
    if (!isColor) return single.slice(1)
    return Colors.Green + single.slice(1) + Colors.Reset
  }

  if (single.startsWith(IdPrefixes.Dialog) || single.startsWith(IdPrefixes.Dialogs)) {
    if (!isColor) return single.slice(1)
    return Colors.Red + single.slice(1) + Colors.Reset
  }
  if (single.startsWith(IdPrefixes.Player)) {
    if (!isColor) return AddBrackets(single.slice(7), isParenthesisNeeded)
    return (
      Colors.Red +
      AddBrackets(single.slice(5), isParenthesisNeeded) +
      Colors.Reset
    )
  }
  if (
    single.startsWith('use') ||
    single.startsWith('toggle') ||
    single.startsWith('grab')
  ) {
    if (!isColor) return single
    return Colors.Red + single + Colors.Reset
  }

  return single
}
