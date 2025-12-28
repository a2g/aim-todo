import { ChoiceType } from './ChoiceType'

export class ChoiceLine {
  public speech: string
  public goto: string
  public choiceType: ChoiceType
  public isUsed: boolean

  constructor(arrayOfTokens: any[]) {
    this.speech = arrayOfTokens[1]
    this.goto = arrayOfTokens[2]
    this.isUsed = false
    this.choiceType = ChoiceType.None
    if (arrayOfTokens.length >= 4) {
      const iterableObject: { [index: string]: string } = arrayOfTokens[3]
      for (const key in iterableObject) {
        const value = iterableObject[key]
        if (key === 'once') {
          if (value === ChoiceType.ExecutableOnce.toLowerCase()) {
            this.choiceType = ChoiceType.ExecutableOnce
          } else if (value === ChoiceType.ViewableOnce.toLowerCase()) {
            this.choiceType = ChoiceType.ViewableOnce
          } else if (value === ChoiceType.ExecutableOncePerConversation.toLowerCase()) {
            this.choiceType = ChoiceType.ExecutableOncePerConversation
          }

        }
      }
    }
  }
}
