import promptSync from 'prompt-sync'

import { ShowUnderlinedTitle } from '../formatters/ShowUnderlinedTitle'
import { ValidatorView } from './ValidatorView'

import { Solutions } from '../../common/files/Solutions'
import { Solved } from '../../common/stuff/Solved'
import { FormatText } from '../../common/stuff/FormatText'
const prompt = promptSync({})

export function ViewForwardValidate (validators: Solutions): void {
  const titlePath = ['ForwardsValidate']
  for (; ;) {
    ShowUnderlinedTitle(titlePath)
    const numberOfSolutions: number = validators.GetSolutions().length

    console.warn(`Number of solutions = ${numberOfSolutions} , Legend: (a, b)= (not-yet-done, total)`)
    if (validators.GetSolutions().length > 1) {
      console.warn('    0. All solutions')
    }
    const validatorList = validators.GetSolutions()
    for (let i = 0; i < validatorList.length; i++) {
      const validator = validatorList[i]
      const name = FormatText(validator.GetName())
      //  "1. XXXXXX"   <- this is the format we list the solutions
      const a = validator.GetNumberOfNotYetValidated()
      const b = validator.GetNumberOfAimFiles()
      const status = a === 0 ? Solved.Solved : Solved.Not

      console.warn(`    ${i + 1}. ${status}(${a}/${b}) ${name} `)
    }

    // allow user to choose item
    const firstInput = prompt(
      '\nChoose one of the numbers or (b)ack, (r)e-run all, e(x)it '
    ).toLowerCase()

    if (firstInput === null || firstInput === 'b') {
      break
    }
    if (firstInput === 'x') {
      return
    }

    if (firstInput === 'r') {
      validators.DeconstructAllAchievementsOfAllSolutionsAndRecordSteps()
      continue
    } else {
      const theNumber = Number(firstInput)
      if (theNumber < 1 || theNumber > validators.GetSolutions().length) {
        continue
      }

      // if they chose a number, go to that number
      const validator = validators.GetSolutions()[theNumber - 1]
      ValidatorView(validator, [...titlePath])
    }
  }
}
