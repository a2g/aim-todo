import { AimFile } from "./AimFile"


/**
 * A map of AimFile objects, keyed by their filename without extension.
 */
export class AimFiles {

    public map: Map<string, AimFile>

    constructor() {
        this.map = new Map<string, AimFile>()
    }

    Size (): number {
        return this.map.size
    }

    GetRawMap (): Map<string, AimFile> {
        return this.map
    }

    Set (file: string, root: AimFile) {
        this.map.set(file, root)
    }


    GetAimFileByFilenameNoThrow (filename: string): AimFile | undefined {
        return this.map.get(filename)
    }

    public GetAimFiles (): IterableIterator<AimFile> {
        return this.map.values()
    }

    Clone (): AimFiles {
        const mapToReturn = new AimFiles()
        for (const blah of this.map) {
            const key = blah[0]
            const aimFile: AimFile = blah[1]
            mapToReturn.Set(key, aimFile)// TODO: this should be a CLone!
        }
        return mapToReturn
    }
}