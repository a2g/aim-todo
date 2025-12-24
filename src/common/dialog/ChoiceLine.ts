import { ChoiceType } from './ChoiceType'
import { VisibleIf } from './VisibleIf'

export class ChoiceLine {
  public speech: string
  public goto: string
  public onceType: ChoiceType
  public theseRequisites: string[]
  public isUsed: boolean

  constructor(arrayOfTokens: any[]) {
    this.theseRequisites = []
    this.speech = arrayOfTokens[1]
    this.goto = arrayOfTokens[2]
    this.isUsed = false
    this.onceType = ChoiceType.None
    if (arrayOfTokens.length >= 4) {
      const iterableObject: { [index: string]: string } = arrayOfTokens[3]
      for (const key in iterableObject) {
        const value = iterableObject[key]
        if (key === 'once') {
          if (value === ChoiceType.SelectableOnce.toLowerCase()) {
            this.onceType = ChoiceType.SelectableOnce
          } else if (value === ChoiceType.OfferableOnce.toLowerCase()) {
            this.onceType = ChoiceType.OfferableOnce
          } else if (value === ChoiceType.SelectableOncePerDialog.toLowerCase()) {
            this.onceType = ChoiceType.SelectableOncePerDialog
          }
        } else if (key === VisibleIf.Exists) {
          this.theseRequisites.push(value)
        } else if (key === VisibleIf.NotExists) {
          this.theseRequisites.push(value)
        } else if (key === VisibleIf.Met) {
          this.theseRequisites.push(value)
        } else if (key === VisibleIf.NotMet) {
          this.theseRequisites.push(value)
        } else if (key === VisibleIf.Owned) {
          this.theseRequisites.push(value)
        } else if (key === VisibleIf.NotOwned) {
          this.theseRequisites.push(value)
        }
      }
    }
  }
}
