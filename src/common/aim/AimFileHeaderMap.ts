import { AimFileHeader } from "./AimFileHeader"


export class AimFileHeaderMap {


    public map: Map<string, AimFileHeader>

    constructor() {
        this.map = new Map<string, any>()
    }

    RemoveZeroedOrUnneededAims () {

    }

    Size (): number {
        return this.map.size
    }

    GetRawMap (): Map<string, AimFileHeader> {
        return this.map
    }

    Set (file: string, root: AimFileHeader) {
        this.map.set(file, root)
    }


    GetAimTreeByFilenameNoThrow (filename: string): any {
        return this.map.get(filename)
    }

    public GetAims (): IterableIterator<AimFileHeader> {
        return this.map.values()
    }

    Clone (): AimFileHeaderMap {
        const mapToReturn = new AimFileHeaderMap()
        for (const blah of this.map) {
            const key = blah[0]
            const header: AimFileHeader = blah[1]
            mapToReturn.Set(key, header)// TODO: this should be a CLone!
        }
        return mapToReturn
    }

    GenerateMapOfLeavesFromAllAimTrees (isOnlyNulls: boolean): Map<string, any | null> {
        const map = isOnlyNulls ? new Map<string, any | null>() : new Map<string, any | null>()
        return map
    }
}