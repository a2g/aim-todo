import promptSync from 'prompt-sync'
import { FormatText } from '../../puzzle/FormatText'
import { AddBrackets } from '../../puzzle/AddBrackets'
import { ShowUnderlinedTitle } from '../ShowUnderlinedTitle'
import { Solution } from '../../puzzle/aim/Solution'
import { Solutions } from '../../puzzle/aim/Solutions'
const prompt = promptSync({})

export function SolutionView (solution: Solution, _solutions: Solutions, titlePath: string[]): void {
  titlePath.push('Solution')
  for (; ;) {
    ShowUnderlinedTitle(titlePath)

    const text = FormatText(solution.GetSolvingPath())
    const NAME_NOT_DETERMINABLE = 'name_not_determinable'
    // HACKY!
    const label =
      text.length > 8
        ? text
        : NAME_NOT_DETERMINABLE

    console.warn(`${label}`)
    let listItemNumber = 0
    let incomplete = 0
    for (const achievementStub of solution.GetAimTreeMap().GetAims()) {
      listItemNumber++

      // display list item
      const output = achievementStub.GetAimName()
      const theAchievementPiece = achievementStub.GetTheAny()
      let inputs = ''
      if (theAchievementPiece != null) {
        for (let i = 0; i < theAchievementPiece.inputSpiels.length; i++) {
          const inputSpiel = theAchievementPiece.inputSpiels[i]
          inputs += (i === 0) ? '' : ','
          inputs += `${FormatText(inputSpiel)}`
        }
      }
      const status = achievementStub.GetSolved() as string
      const needed = achievementStub.IsNeeded() ? 'Y' : 'N'
      console.warn(
        `${listItemNumber}. ${status} ${needed} ${FormatText(output)} ${AddBrackets(inputs)} `
      )
      incomplete += achievementStub.IsSolved() ? 0 : 1
    }

    console.warn(`Number of achievements incomplete ${incomplete}/${listItemNumber}`)

    // allow user to choose item
    const input = prompt(
      'Choose achievement to climb down on or (b)ack, (r)e-run: '
    ).toLowerCase()
    if (input === null || input === 'b') {
      break
    }
    if (input === 'x') {
      return
    }
    if (input === 'r') {
      //solution.ProcessUntilCloning(solutions)
      //solution.UpdateAchievementSolvedStatuses()
      continue
    } else {
      // show map entry for chosen item
      const theNumber = Number(input)
      if (theNumber > 0 && theNumber <= listItemNumber) {
        let j = 0
        for (const achievement of solution.GetAimTreeMap().GetAims()) {
          j++
          if (j === theNumber) {
            const theAchievementPiece = achievement.GetTheAny()
            if (theAchievementPiece != null) {
              // PieceView(theAchievementPiece, solution.GetVisibleThingsAtTheStart(), [...titlePath])
            } else {
              prompt(`${achievement.GetAimName()} Achievement.piece WAS NULL. Hit any key to continue: `)
            }
          }
        }
      }
    }
  }
}
