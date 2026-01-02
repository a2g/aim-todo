import { ChoiceSection } from './dialog/ChoiceSection'
import { NonChoiceSection } from './dialog/NonChoiceSection'
import { existsSync, readFileSync } from 'fs'
import { parse } from 'jsonc-parser'
import _ from '../../../todo-enums.json'
import { DialogKeywords } from './dialog/DialogKeywords'
import { ChoiceLine } from './dialog/ChoiceLine'


/** Represents a dialog file
 * 
 * These can get tricky, so there are classes representing sub-parts in the dialog folder.
 */
export class DialogFile {
  filename: string
  choices: Map<string, ChoiceSection>
  nonChoices: Map<string, NonChoiceSection>
  indexOfSlotInMain: number

  constructor(filename: string) {
    this.filename = filename
    this.choices = new Map<string, ChoiceSection>()
    this.nonChoices = new Map<string, NonChoiceSection>()

    const pathAndFile = './' + filename
    if (!existsSync(pathAndFile)) {
      throw new Error(
        `The dialogs_xxxx.jsonc was not found: ${pathAndFile} `
      )
    }
    const text = readFileSync(pathAndFile, 'utf-8')
    const parsedJson: any = parse(text)
    this.indexOfSlotInMain = parsedJson.index_of_slot_in_main
    const dialogs = parsedJson.dialogs

    for (const key in dialogs) {
      const array = dialogs[key]

      if (key.endsWith('_choices')) {
        const choiceSection = new ChoiceSection(pathAndFile, key)
        choiceSection.Init(array)
        this.AddChoiceSection(choiceSection)
      } else {
        const nonChoiceSection = new NonChoiceSection(pathAndFile, key)
        nonChoiceSection.Init(array)
        this.AddNonChoiceSection(nonChoiceSection)
      }
    }
  }

  public Clone (): DialogFile {
    const dialogFile = new DialogFile(this.GetName())
    for (const choice of this.choices.values()) {
      dialogFile.AddChoiceSection(choice.Clone())
    }
    for (const nonChoice of this.nonChoices.values()) {
      dialogFile.AddNonChoiceSection(nonChoice.Clone())
    }
    return dialogFile
  }

  Clear (): void {
    for (const choice of this.choices.values()) {
      for (const queue of choice.mapOfQueues.values()) {
        for (const line of queue.values()) {
          line.isUsed = false
        }
      }
    }
  }

  public AddChoiceSection (choice: ChoiceSection): void {
    this.choices.set(choice.GetKey(), choice)
  }

  public AddNonChoiceSection (nonChoice: NonChoiceSection): void {
    this.nonChoices.set(nonChoice.GetKey(), nonChoice)
  }

  public GetName (): string {
    return this.filename
  }

  public CollectSpeechLinesForMainChoice (arrayOfLines: Array<[string, string]>) {
    this.CollectSpeechLinesForGivenSlotInGivenChoiceSection(this.indexOfSlotInMain, DialogKeywords.MainChoices, arrayOfLines);
  }

  private GetQueueForChoicesAndSlot (choiceKey: string, slot: number): ChoiceLine[] {
    const choiceSection = this.choices.get(choiceKey)
    if (choiceSection != null) {
      const queue = choiceSection.mapOfQueues.get(slot)
      if (queue != null) {
        return queue
      }
    }
    return []
  }

  private CollectSpeechLinesForNonChoiceSection (nonChoice: NonChoiceSection, speechLines: Array<[string, string]>): boolean {
    return nonChoice.CollectSpeechLinesAndQuitOnExit(speechLines)
  }

  private CollectSpeechLinesForGivenGoto (goto: string, arrayOfLines: Array<[string, string]>): boolean {
    const choice = this.choices.get(goto)
    if (choice != null) {
      // assume all main_choices are all with the index given in the json
      if (this.CollectSpeechLinesForGivenSlotInGivenChoiceSection(0, goto, arrayOfLines)) {
        return true
      }
    } else {
      const nonChoiceSection = this.nonChoices.get(goto)
      if (nonChoiceSection != null) {
        if (this.CollectSpeechLinesForNonChoiceSection(nonChoiceSection, arrayOfLines)) {
          return true
        }
      } else {
        arrayOfLines.push(['error', `Given goto not found as either choice or non-choice: ${goto}`])
        return true
      }
    }
    return false
  }

  private CollectSpeechLinesForGivenSlotInGivenChoiceSection (slot: number, choiceName: string, arrayOfLines: Array<[string, string]>): boolean {
    const queue = this.GetQueueForChoicesAndSlot(choiceName, slot)
    if (queue != null) {
      // go through all of these, not returning until extracted all choice.speech and underlings
      for (const choiceLine of queue) {
        // remove head of queue so can't be used again
        // even if it doesn't have select-once.. we don't
        // ever want to play the same speech twice
        queue.shift()

        arrayOfLines.push(['you', choiceLine.speech])
        if (this.CollectSpeechLinesForGivenGoto(choiceLine.goto, arrayOfLines)) {
          return true
        }
      }
    } else {
      arrayOfLines.push(['error', `Given choice name not found: ${choiceName} ${slot}`])
      return true
    }
    return false
  }
}
