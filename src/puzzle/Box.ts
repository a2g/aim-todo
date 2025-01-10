import { existsSync, readFileSync } from 'fs'
import { SingleFile } from './SingleFile'
import { Stringify } from './Stringify'
import { VisibleThingsMap } from './VisibleThingsMap'
import { parse } from 'jsonc-parser'
import { DialogFile } from './talk/DialogFile'
import { Piece } from './Piece'
import { AchievementStubMap } from './AchievementStubMap'
import { Aggregates } from './Aggregates'
import { _STARTER_JSONC } from '../_STARTER_JSONC'

/**
 * So the most important part of this class is that the data
 * in it is read only. So I've put that in the name.
 * I wanted to convey the idea that it represents one *.jsonc file
 * so that's in there too.
 */
export class Box {
  public static GetArrayOfSingleObjectVerbs (): string[] {
    return ['grab', 'toggle']
  }

  public static GetArrayOfInitialStatesOfSingleObjectVerbs (): boolean[] {
    return [true, true]
  }

  private readonly allObjs: string[]
  private readonly allAchievements: string[]
  private readonly achievementWordSet: Set<string>
  private readonly allInvs: string[]
  private readonly allPlayers: string[]
  private readonly mapOfStartingThings: VisibleThingsMap
  private readonly startingInvSet: Set<string>
  private readonly startingPropSet: Set<string>
  private readonly startingAchievementSet: Set<string>
  private readonly filename: string
  private readonly path: string
  private readonly pieces: Map<string, Set<Piece>>
  private readonly dialogFiles: Map<string, DialogFile>
  private readonly aggregates: Aggregates

  constructor (path: string, filename: string, aggregates: Aggregates) {
    this.aggregates = aggregates
    this.path = path
    this.dialogFiles = new Map<string, DialogFile>()
    this.filename = filename

    this.allObjs = []
    this.allAchievements = []
    this.allInvs = []
    this.allPlayers = []
    /* preen starting invs from the startingThings */
    this.startingInvSet = new Set<string>()
    this.startingAchievementSet = new Set<string>()
    this.startingPropSet = new Set<string>()
    this.achievementWordSet = new Set<string>()
    this.mapOfStartingThings = new VisibleThingsMap(null)
    this.pieces = new Map<string, Set<Piece>>()
    this.dialogFiles = new Map<string, DialogFile>()

    this.aggregates.mapOfBoxes.set(filename, this)
    const box1 = this.aggregates.mapOfBoxes.get(filename)
    console.assert(box1 !== null)
    this.aggregates.mapOfBoxes.set(filename, this)
    if (filename.length !== 0) {
      if (!existsSync(path + filename)) {
        throw new Error(
          `file doesn't exist ${process.cwd()} ${path}${filename} `
        )
      }
      const text = readFileSync(path + filename, 'utf8')
      const scenario = parse(text)

      /* this loop is only to ascertain all the different */
      /* possible object names. ie basically all the enums */
      /* but without needing the enum file */
      const setObjs = new Set<string>()
      const setAments = new Set<string>()
      const setInvs = new Set<string>()
      const setPlayers = new Set<string>()
      for (const gate of scenario.pieces) {
        setInvs.add(Stringify(gate.inv1))
        setInvs.add(Stringify(gate.inv2))
        setInvs.add(Stringify(gate.inv3))
        setAments.add(Stringify(gate.ament1))
        setAments.add(Stringify(gate.ament2))
        setObjs.add(Stringify(gate.obj1))
        setObjs.add(Stringify(gate.obj2))
        setObjs.add(Stringify(gate.obj3))
        setObjs.add(Stringify(gate.obj4))
        setObjs.add(Stringify(gate.obj5))
        setObjs.add(Stringify(gate.obj6))
        setObjs.add(Stringify(gate.obj7))
      }

      /* starting things is optional in the json */
      if (
        scenario.startingThings !== undefined &&
        scenario.startingThings !== null
      ) {
        for (const thing of scenario.startingThings) {
          if (thing.character !== undefined && thing.character !== null) {
            setPlayers.add(thing.character)
          }
        }
      }

      /* collect all the achievements and pieces file */
      const singleFile = new SingleFile(this.path, filename, this.aggregates)
      singleFile.copyAllPiecesToContainers(this)

      /* starting things is optional in the json */
      if (
        scenario.startingThings !== undefined &&
        scenario.startingThings !== null
      ) {
        for (const thing of scenario.startingThings) {
          const theThing = Stringify(thing.thing)
          if (theThing.startsWith('inv')) {
            this.startingInvSet.add(theThing)
          }
          if (theThing.startsWith('a')) {
            this.startingAchievementSet.add(theThing)
          }
          if (theThing.startsWith('obj')) {
            this.startingPropSet.add(theThing)
          }
        }
        for (const item of scenario.startingThings) {
          if (!this.mapOfStartingThings.Has(item.thing)) {
            this.mapOfStartingThings.Set(item.thing, new Set<string>())
          }
          if (item.character !== undefined && item.character !== null) {
            const { character } = item
            const setOfCharacters = this.mapOfStartingThings.Get(item.thing)
            if (character.length > 0 && setOfCharacters != null) {
              setOfCharacters.add(character)
            }
          }
        }
      }

      setAments.delete('')
      setAments.delete('undefined')
      setPlayers.delete('')
      setPlayers.delete('undefined')
      setObjs.delete('')
      setObjs.delete('undefined')
      setInvs.delete('')
      setInvs.delete('undefined')
      this.allObjs = Array.from(setObjs.values())
      this.allAchievements = Array.from(setAments.values())
      this.allInvs = Array.from(setInvs.values())
      this.allPlayers = Array.from(setPlayers.values())
    }
  }

  public CopyStartingThingCharsToGivenMap (givenMap: VisibleThingsMap): void {
    for (const item of this.mapOfStartingThings.GetIterableIterator()) {
      givenMap.Set(item[0], item[1])
    }
  }

  public GetArrayOfObjs (): string[] {
    return this.allObjs
  }

  public GetArrayOfInvs (): string[] {
    return this.allInvs
  }

  public GetArrayOfAments (): string[] {
    return this.allAchievements
  }

  public GetArrayOfSingleObjectVerbs (): string[] {
    return this.GetArrayOfSingleObjectVerbs()
  }

  public GetArrayOfInitialStatesOfSingleObjectVerbs (): boolean[] {
    return this.GetArrayOfInitialStatesOfSingleObjectVerbs()
  }

  public GetArrayOfInitialStatesOfAchievements (): number[] {
    /* construct array of booleans in exact same order as ArrayOfProps - so they can be correlated */
    const startingSet = this.startingAchievementSet
    const initialStates: number[] = []
    for (const achievement of this.allAchievements) {
      const isNonZero = startingSet.has(achievement)
      initialStates.push(isNonZero ? 1 : 0)
    }
    return initialStates
  }

  public GetSetOfStartingObjs (): Set<string> {
    return this.startingPropSet
  }

  public GetSetOfStartingInvs (): Set<string> {
    return this.startingInvSet
  }

  public GetMapOfAllStartingThings (): VisibleThingsMap {
    return this.mapOfStartingThings
  }

  // public GetStartingThingsForCharacter(charName: string): Set<string> {

  public GetArrayOfInitialStatesOfObjs (): boolean[] {
    /* construct array of booleans in exact same order as ArrayOfProps - so they can be correlated */
    const startingSet = this.GetSetOfStartingObjs()
    const visibilities: boolean[] = []
    for (const obj of this.allObjs) {
      const isVisible = startingSet.has(obj)
      visibilities.push(isVisible)
    }
    return visibilities
  }

  public GetArrayOfInitialStatesOfInvs (): boolean[] {
    /* construct array of booleans in exact same order as ArrayOfProps - so they can be correlated */
    const startingSet = this.GetSetOfStartingInvs()
    const visibilities: boolean[] = []
    for (const inv of this.allInvs) {
      const isVisible = startingSet.has(inv)
      visibilities.push(isVisible)
    }
    return visibilities
  }

  public GetArrayOfPlayers (): string[] {
    return this.allPlayers
  }

  public GetFilename (): string {
    return this.filename
  }

  public AddDialogFile (dialogFile: DialogFile): void {
    this.dialogFiles.set(dialogFile.GetName(), dialogFile)
  }

  public GetSetOfAchievementWords (): Set<string> {
    return this.achievementWordSet
  }

  public GetPieceIterator (): IterableIterator<Set<Piece>> {
    return this.pieces.values()
  }

  public CopyStubsToGivenStubMap (destinationStubMap: AchievementStubMap): void {
    for (const achievementWord of this.achievementWordSet) {
      destinationStubMap.AddAchievementStub(achievementWord, false)
    }
  }

  public static CopyPiecesFromAtoBViaIds (a: Map<string, Set<Piece>>, b: Map<string, Piece>): void {
    a.forEach((setOfPieces: Set<Piece>) => {
      setOfPieces.forEach((piece: Piece) => {
        const newPiece = piece.ClonePieceAndEntireTree()
        b.set(piece.id, newPiece)
      })
    })
  }

  public static CopyPiecesFromAtoB (a: Map<string, Set<Piece>>, b: Map<string, Set<Piece>>): void {
    a.forEach((setOfPieces: Set<Piece>) => {
      setOfPieces.forEach((piece: Piece) => {
        if (!b.has(piece.output)) {
          b.set(piece.output, new Set<Piece>())
        }
        const newPiece = piece.ClonePieceAndEntireTree()
        b.get(piece.output)?.add(newPiece)
      })
    })
  }

  public static CopyDialogsFromAtoB (a: Map<string, DialogFile>, b: Map<string, DialogFile>): void {
    for (const dialog of a.values()) {
      b.set(dialog.GetName(), dialog)
    }
  }

  GetDialogFiles (): Map<string, DialogFile> {
    return this.dialogFiles
  }

  public Get (givenOutput: string): Set<Piece> | undefined {
    return this.pieces.get(givenOutput)
  }

  public GetPieces (): Map<string, Set<Piece>> {
    return this.pieces
  }

  public GetStartingThingsForPlayer (charName: string): Set<string> {
    const startingThingSet = new Set<string>()
    for (const item of this.mapOfStartingThings.GetIterableIterator()) {
      for (const name of item[1]) {
        if (name === charName) {
          startingThingSet.add(item[0])
          break
        }
      }
    }
    return startingThingSet
  }

  GetStartersMapOfAllStartingThings (): VisibleThingsMap {
    const starter = this.aggregates.mapOfBoxes.get(_STARTER_JSONC)
    if (starter != null) {
      return starter.mapOfStartingThings
    }
    return new VisibleThingsMap(null)
  }

  GetStartingPieces (): Map<string, Set<Piece>> {
    const starter = this.aggregates.mapOfBoxes.get(_STARTER_JSONC)
    if (starter != null) {
      return starter.pieces
    }
    return new Map<string, Set<Piece>>()
  }

  GetStartingDialogFiles (): Map<string, DialogFile> {
    const starter = this.aggregates.mapOfBoxes.get(_STARTER_JSONC)
    if (starter != null) {
      return starter.dialogFiles
    }
    return new Map<string, DialogFile>()
  }

  GetPiecesAsString (): string {
    let stringOfPieceIds = ''
    for (const set of this.pieces.values()) {
      for (const piece of set) {
        stringOfPieceIds += `${piece.id}, `
      }
    }
    return stringOfPieceIds
  }

  public FillStoresWithBoxMapData (mapOfBoxes: Map<string, Box>): void {
    for (const box of mapOfBoxes.values()) {
      if (box.filename !== this.filename) {
        Box.CopyPiecesFromAtoB(box.pieces, this.pieces)
        Box.CopyDialogsFromAtoB(box.dialogFiles, this.dialogFiles)
        box.achievementWordSet.forEach(x => this.achievementWordSet.add(x))
        box.mapOfStartingThings.CopyTo(this.mapOfStartingThings)
      }
    }
  }

  public GetFileNameWithoutExtension (): string {
    let withoutExtension = this.filename
    const lastIndexOfDot = this.filename.lastIndexOf('.')
    if (lastIndexOfDot !== -1) {
      withoutExtension = this.filename.substring(0, lastIndexOfDot)
    }
    return withoutExtension
  }
}
