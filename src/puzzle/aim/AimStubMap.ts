import { AimStub } from "./AimStub"


export class AimStubMap {


    public map: Map<string, AimStub>

    constructor() {
        this.map = new Map<string, any>()
    }

    RemoveZeroedOrUnneededAims () {

    }

    Size (): number {
        return this.map.size
    }

    GetRawMap (): Map<string, AimStub> {
        return this.map
    }

    Set (file: string, root: AimStub) {
        this.map.set(file, root)
    }


    GetAimTreeByFilenameNoThrow (filename: string): any {
        return this.map.get(filename)
    }

    public GetAims (): IterableIterator<AimStub> {
        return this.map.values()
    }

    Clone (): AimStubMap {
        const mapToReturn = new AimStubMap()
        for (const blah of this.map) {
            const key = blah[0]
            const stub: AimStub = blah[1]
            mapToReturn.Set(key, stub)// TODO: this should be a CLone!
        }
        return mapToReturn
    }

    GenerateMapOfLeavesFromAllAimTrees (isOnlyNulls: boolean): Map<string, any | null> {
        const map = isOnlyNulls ? new Map<string, any | null>() : new Map<string, any | null>()
        return map
    }
}