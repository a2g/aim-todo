/*
 * This is only used in LogicGrid
 * should it be moved there?
 */
export class SingleFileData {
  public name: string
  public tickCount: number
  public isVisible: boolean

  constructor (name: string, isVisible: boolean) {
    this.name = name
    this.isVisible = isVisible
    this.tickCount = 0
  }
}
