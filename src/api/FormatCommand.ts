
export function FormatCommand (mainSpiel: string, achievementSpiel: string, restrictionSpiel: string, settings: Settings): string {

  let toReturn = ''
  switch (settings.infoLevel) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
      toReturn = `${mainSpiel}`
      break
    case 8:
      toReturn = `${mainSpiel}  ${achievementSpiel}`
      break
    case 9:
      toReturn = `${mainSpiel}  ${achievementSpiel} ${restrictionSpiel}`
      break
  }
  return toReturn
}
