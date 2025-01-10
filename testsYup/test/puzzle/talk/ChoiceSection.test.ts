import { expect, test } from '@jest/globals'
import { ChoiceSection } from '../../../../src/puzzle/talk/ChoiceSection'

test('FindMostNearlyCompleteRowOrColumnCombined', () => {
  const choiceSection = new ChoiceSection('file', 'key')
  expect(choiceSection.file).toEqual('file')
})

// Ensure GetAllDialogingWhilstChoosing adds the choosers speech, ie you

// Ensure GetAllDialogingWhilstChoosing only adds the first match - not nay others

// Ensure GetAllDialogingWhilstChoosing uses up the top item in the array.
