import { Command } from './Command'
import { Happen } from './Happen'
import { Happenings } from './Happenings'
import { Box } from './Box'
import { SpecialTypes } from './SpecialTypes'
import { VisibleThingsMap } from './VisibleThingsMap'
import { PieceBase } from './PieceBase'

export class Piece extends PieceBase {
  public id: string

  public type: string

  public reuseCount: number // pieces are allowed to used many times in a puzzle solving network - this enables that

  public boxToMerge: Box | null

  private dialogPath: any // only valid for CHAT

  public spielOutput: string

  public inputSpiels: string[]

  public parent: PieceBase | null // this is not needed for leaf finding - but *is* needed for command finding.

  public characterPrerequisites: string[]

  public happenings: Happenings | null

  public command: Command | null

  constructor(
    id: string,
    boxToMerge: Box | null,
    output: string,
    type = 'undefined',
    reuseCount = 1, // put it here so all the tests don't need to specify it.
    command: Command | null = null,
    happenings: Happenings | null = null,
    prerequisites: Array<{ character: string }> | null | undefined = null, // put it here so all the tests don't need to specify it.
    inputA = 'undefined',
    inputB = 'undefined',
    inputC = 'undefined',
    inputD = 'undefined',
    inputE = 'undefined',
    inputF = 'undefined' // no statics in typescript, so this seemed preferable than global let Null = 'Null'
  ) {
    super(output)
    this.id = id
    this.boxToMerge = boxToMerge
    this.parent = null
    this.reuseCount = reuseCount
    this.spielOutput = `${output}`
    this.type = type
    this.command = command
    this.happenings = happenings
    this.characterPrerequisites = []
    this.dialogPath = ''
    if (typeof prerequisites !== 'undefined' && prerequisites !== null) {
      for (const restriction of prerequisites) {
        this.characterPrerequisites.push(restriction.character)
      }
    }
    this.inputSpiels = []
    if (inputA !== 'undefined' && inputA !== undefined && inputA.length > 0) {
      this.inputSpiels.push(inputA)
      this.inputHints.push(inputA)
      this.inputs.push(null)
    }
    if (inputB !== 'undefined' && inputB !== undefined && inputB.length > 0) {
      this.inputSpiels.push(inputB)
      this.inputHints.push(inputB)
      this.inputs.push(null)
    }
    if (inputC !== 'undefined' && inputC !== undefined && inputC.length > 0) {
      this.inputSpiels.push(inputC)
      this.inputHints.push(inputC)
      this.inputs.push(null)
    }
    if (inputD !== 'undefined' && inputD !== undefined && inputD.length > 0) {
      this.inputSpiels.push(inputD)
      this.inputHints.push(inputD)
      this.inputs.push(null)
    }
    if (inputE !== 'undefined' && inputE !== undefined && inputE.length > 0) {
      this.inputSpiels.push(inputE)
      this.inputHints.push(inputE)
      this.inputs.push(null)
    }
    if (inputF !== 'undefined' && inputF !== undefined && inputF.length > 0) {
      this.inputSpiels.push(inputF)
      this.inputHints.push(inputF)
      this.inputs.push(null)
    }
  }

  public SetCount (count: number): void {
    this.reuseCount = count
  }

  public ClonePieceAndEntireTree (): Piece {
    const clone = new Piece(this.id, null, '', '')
    // set the stuff that isn't passed above
    clone.id = this.id
    clone.type = this.type
    clone.reuseCount = this.reuseCount
    clone.output = this.output
    clone.boxToMerge = this.boxToMerge
    clone.dialogPath = this.dialogPath

    // the hints
    for (const inputHint of this.inputHints) {
      clone.inputHints.push(inputHint)
    }

    // the display hints
    for (const inputHint of this.inputSpiels) {
      clone.inputSpiels.push(inputHint)
    }

    // the pieces - and parent
    for (const input of this.inputs) {
      if (input != null) {
        const child = input.ClonePieceAndEntireTree()
        child.SetParent(clone)
        clone.inputs.push(child)
      } else {
        clone.inputs.push(null)
      }
    }

    for (const restriction of this.characterPrerequisites) {
      clone.characterPrerequisites.push(restriction)
    }

    if (this.happenings != null) {
      clone.happenings = this.happenings.Clone()
    }
    if (this.command != null) {
      clone.command = new Command(this.command.verb, this.command.type, this.command.object1, this.command.object2, this.command.error)
    }

    return clone
  }

  AddChildAndSetParent (child: Piece): void {
    this.inputs.push(child)
    this.inputHints.push(child.output)
    this.inputSpiels.push(child.output)
    child.SetParent(this)
  }

  public FindAnyPieceMatchingIdRecursively (id: string): Piece | null {
    if (this.id === id) {
      return this
    }
    for (const input of this.inputs) {
      const result =
        input != null ? input.FindAnyPieceMatchingIdRecursively(id) : null
      if (result != null) {
        return result
      }
    }
    return null
  }

  public ReturnTheFirstNullInputHint (): string {
    for (let i = 0; i < this.inputs.length; i++) {
      const input = this.inputs[i]
      if (input === null) {
        return this.inputHints[i]
      }
      const result = input.ReturnTheFirstNullInputHint()
      if (result.length > 0) {
        return result
      }
    }
    return ''
  }

  public HeaderOutInputK (k: number, type: SpecialTypes): void {
    const objectToObtain = this.inputHints[k]
    //  update the display string - for easier browsing!
    this.inputSpiels[k] = `${objectToObtain} (${type})`
    const newLeaf = new Piece('header', null, objectToObtain, type)
    newLeaf.parent = this
    this.inputs[k] = newLeaf
  }

  public SetParent (parent: PieceBase | null): void {
    this.parent = parent
  }

  public GetParent (): PieceBase | null {
    return this.parent
  }

  public getPrerequisites (): string[] {
    return this.characterPrerequisites
  }

  public GetOutput (): string {
    return this.output
  }

  public UpdateVisibleWithOutcomes (visiblePieces: VisibleThingsMap): void {
    if (this.happenings != null) {
      for (const happening of this.happenings.array) {
        switch (happening.type) {
          case Happen.AchievementIsSet:
          case Happen.InvAppears:
          case Happen.ObjAppears:
            visiblePieces.Set(happening.itemA, new Set<string>())
            break
          case Happen.InvGoes:
          case Happen.ObjGoes:
          default:
            visiblePieces.Delete(happening.itemA)
            break
        }
      }
    }
  }


  SetDialogPath (dialogPath: string): void {
    this.dialogPath = dialogPath
  }

  GetDialogPath (): string {
    return this.dialogPath
  }

  public GetCountRecursively (): number {
    let count = 1
    for (const inputPiece of this.inputs) {
      if (inputPiece != null) {
        count += inputPiece.GetCountRecursively()
      }
    }
    return count
  }
}
