import { ChoiceSection } from './ChoiceSection'
import { NonChoiceSection } from './NonChoiceSection'
import { existsSync, readFileSync } from 'fs'
import { parse } from 'jsonc-parser'
import _ from '../../../todo-enums.json'
import { DialogKeywords } from './DialogKeywords'
import { ChoiceLine } from './ChoiceLine'


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

  public AddChoiceSection (choice: ChoiceSection): void {
    this.choices.set(choice.GetKey(), choice)
  }

  public AddNonChoiceSection (nonChoice: NonChoiceSection): void {
    this.nonChoices.set(nonChoice.GetKey(), nonChoice)
  }

  public GetName (): string {
    return this.filename
  }

  GetQueueForChoicesAndSlot (choiceKey: string, slot: number): ChoiceLine[] {
    const choiceSection = this.choices.get(choiceKey)
    if (choiceSection != null) {
      const queue = choiceSection.mapOfQueues.get(slot)
      if (queue != null) {
        return queue
      }
    }
    return []
  }

  CollectSpeechLinesForNonChoiceSection (nonChoice: NonChoiceSection): Array<[string, string]> {
    const toReturn = nonChoice.GetAllSpeechLines()
    return toReturn
  }

  CollectSpeechLinesForGivenGoto (goto: string): Array<[string, string]> {
    const toReturn = new Array<[string, string]>()
    const choice = this.choices.get(goto)
    if (choice != null) {
      // assume all main_choices are all with the index given in the json
      const speechLines = this.CollectSpeechLinesForGivenSlotInGivenChoiceSection(0, goto);
      toReturn.push(...speechLines)
    } else {
      const nonChoiceSection = this.nonChoices.get(goto)
      if (nonChoiceSection != null) {
        const speechLines = this.CollectSpeechLinesForNonChoiceSection(nonChoiceSection);
        toReturn.push(...speechLines)
      } else {
        toReturn.push(['error', `Given goto not found as either choice or non-choice: ${goto}`])
      }
    }
    return toReturn
  }

  CollectSpeechLinesForGivenSlotInGivenChoiceSection (slot: number, choiceName: string): Array<[string, string]> {
    const toReturn = new Array<[string, string]>()
    const queue = this.GetQueueForChoicesAndSlot(choiceName, slot)
    if (queue != null) {
      // go through all of these, not returning until extracted all choice.speech and underlings
      for (const choiceLine of queue) {
        toReturn.push(['you', choiceLine.speech])
        this.CollectSpeechLinesForGivenGoto(choiceLine.goto)

        // remove head of queue so can't be used again
        // even if it doesn't have select-once.. we don't
        // ever want to play the same speech twice
        queue.shift()
      }
    } else {
      toReturn.push(['error', `Given choice name not found: ${choiceName} ${slot}`])
    }
    return toReturn
  }

  public CollectSpeechLinesForMainChoice (): Array<[string, string]> {
    return this.CollectSpeechLinesForGivenSlotInGivenChoiceSection(this.indexOfSlotInMain, DialogKeywords.MainChoices);
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
}
