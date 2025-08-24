import { Evolution } from "../../common/puzzle/Evolution"
import { Happener } from "../../common/puzzle/Happener"
import { PlayerAI } from "../../common/puzzle/PlayerAI"


export class Playable {
  private readonly player: PlayerAI

  private readonly solution: Evolution

  private readonly happener: Happener

  private isCompleted: boolean

  constructor(player: PlayerAI, happener: Happener, solution: Evolution) {
    this.player = player
    this.solution = solution
    this.happener = happener
    this.isCompleted = false
  }

  public GetPlayer (): PlayerAI {
    return this.player
  }

  public GetSolution (): Evolution {
    return this.solution
  }

  public GetHappener (): Happener {
    return this.happener
  }

  public SetCompleted (): void {
    this.isCompleted = true
  }

  public IsCompleted (): boolean {
    return this.isCompleted
  }
}
