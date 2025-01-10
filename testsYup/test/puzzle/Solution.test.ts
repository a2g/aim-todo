// Typescript Unit test
/*
import { SolverViaRootPiece } from '../../../src/puzzle/SolverViaRootPiece.js'
import { Box } from '../../../src/puzzle/Box.js'

describe('Solution', () => {
  it('Test of a none clone solution', async () => {
    const box = new Box('test/puzzle/','Test1First.jsonc')

    const solutions = new SolverViaRootPiece(box)

    const wasCloneEncountered = solutions.SolvePartiallyUntilCloning()

    expect(wasCloneEncountered).to.equal(false)
    expect(solutions.NumberOfSolutions()).to.equal(1)
    const first = solutions.GetSolutions().at(0)
    if (first != null) {
      expect(first?.AreAnyInputsNull()).to.equal(false)
    }
  })
  /*
    it("Test of a non cloning five step", () => {
        const box = new SceneSingle("test/puzzle/Test1First.jsonc");
        const pile:PileOfPieces = new PileOfPieces();
        json.CopyPiecesFromBoxToPile(pile);
        const objective = "obj_death_by_guitar";
        const collection = new SolutionCollection();
        const solution = new Solution(new Piece("", "", objective), map)
        collection.push(solution);
        // process the rest of the Pieces
        do {
            collection.SolvePartiallyUntilCloning();
        } while (collection.IsPiecesRemaining());

        const solution0 = collection[0];;
        assert.strictEqual(0, solution0.GetLeafPieces().size);
        assert.strictEqual(1, solution0.GetIncompletePieces().size);

        {
            const leafPieceMap = solution0.GetLeafPieces();
            assert.strictEqual(5, leafPieceMap.size);
            // commenting out the things below, because they will change
            //assert.ok(leafPieceMap.has("inv_deflated_ball"));
            //assert.ok(leafPieceMap.has("inv_pump_with_bike_adapter"));
            //assert.ok(leafPieceMap.has("inv_needle"));
            //assert.ok(leafPieceMap.has("obj_raised_backboard"));
            //assert.ok(leafPieceMap.has("inv_pole_hook"));
        }
    });

    it("Test of another non-cloning 5 step", () => {
        const box = new SceneSingle("test/puzzle/Test1First.jsonc");
        const pile:PileOfPieces = new PileOfPieces();
        const pile:PileOfPieces = new PileOfPieces();
        json.CopyPiecesFromBoxToPile(pile);
        const objective = "obj_death_by_slamdunk";
        const collection = new SolutionCollection();
        const solution = new Solution(new Piece("", "", objective), map);
        collection.push(solution);
        // process the rest of the Pieces
        do {
            collection.SolvePartiallyUntilCloning();
        } while (collection.IsPiecesRemaining());

        const solution0 = collection[0];;
        assert.strictEqual(0, solution0.GetLeafPieces().size);
        assert.strictEqual(1, solution0.GetIncompletePieces().size);

        {
            const leafPieceMap = solution0.GetLeafPieces();
            assert.strictEqual(5, leafPieceMap.size);
            // commenting out the things below, because they will change
            //assert.ok(leafPieceMap.has("inv_deflated_ball"));
            //assert.ok(leafPieceMap.has("inv_pump_with_bike_adapter"));
            //assert.ok(leafPieceMap.has("inv_needle"));
            //assert.ok(leafPieceMap.has("obj_raised_backboard"));
            //assert.ok(leafPieceMap.has("inv_pole_hook"));
        }
    });

    it('Solution test cloning with High Permutation scene2', async () => {
      const box = new Box('./tests/'+'TestHighPermutationSolution.jsonc')

      const startingThings = box.GetMapOfAllStartingThings()

      const pile = new PileOfPieces(null)
      box.CopyPiecesFromBoxToPile(pile)

      const rootMap = new RootPieceMap(null)
      box.CopyFullAchievementPiecesTreesToContainer(rootMap)
      const solution = new Solution(rootMap, pile, startingThings)

      const collection = new SolverViaRootPiece(solution)
      const wasCloneEncountered = collection.SolvePartiallyUntilCloning()

      expect(wasCloneEncountered).to.equal(false)
      // having this actually result in a single solution is awesome.
      // we don't want too many or it will be hard to understand
      // that the multiple solutions are the same thing.
      expect(collection.GetSolutions().length).to.equal(1)
      // const solution0 = collection.GetSolutions()[0]
      // expect(solution0.GetRootMap().GenerateMapOfLeaves().size).to.equal(27)
      // expect(solution0.GetIncompletePieces().size).to.equal(0)

      // process the rest of the Pieces
      do {
        collection.SolvePartiallyUntilCloning()
      } while (collection.AreAnyInputsNull())

      // const leaves = solution0.GetRootMap().GenerateMapOfLeaves()
      // expect(leaves.size).to.equal(27)
      // expect(leaves).has('/root comment 1/a_win/inv_final_catalyst/')
      /*
      assert.ok(leaves.has('/root comment 1/a_win/inv_final_catalyst/'))
      assert.ok(leaves.has('/root comment 1/a_win/obj_stageE/obj_stageD/obj_switched_on_item1/'))
      assert.ok(leaves.has('/root comment 1/a_win/obj_stageE/obj_stageD/obj_switched_on_item2/'))
      assert.ok(leaves.has('/root comment 1/a_win/obj_stageE/obj_stageD/obj_switched_on_item3/'))
      assert.ok(leaves.has('/root comment 1/a_win/obj_stageE/obj_stageD/obj_switched_on_item4/'))
      assert.ok(leaves.has('/root comment 1/a_win/obj_stageE/obj_stageD/obj_stageC/obj_switched_on_item1/'))
      assert.ok(leaves.has('/root comment 1/a_win/obj_stageE/obj_stageD/obj_stageC/obj_switched_on_item2/'))
      assert.ok(leaves.has('/root comment 1/a_win/obj_stageE/obj_stageD/obj_stageC/obj_switched_on_item3/'))
      assert.ok(leaves.has('/root comment 1/a_win/obj_stageE/obj_stageD/obj_stageC/obj_stageB/obj_switched_on_item1/'))
      assert.ok(leaves.has('/root comment 1/a_win/obj_stageE/obj_stageD/obj_stageC/obj_stageB/obj_switched_on_item2/'))
      assert.ok(leaves.has('/root comment 1/a_win/obj_stageE/obj_stageD/obj_stageC/obj_stageB/obj_stageA/obj_dispatcher/'))
      assert.ok(leaves.has('/root comment 1/a_win/obj_stageE/obj_stageD/obj_stageC/obj_stageB/obj_stageA/obj_switched_on_item1/'))
      assert.ok(leaves.has('/root comment 1/a_win/obj_stageE/obj_switched_on_item1/obj_rigged_item1/obj_switch1/'))
      assert.ok(leaves.has('/root comment 1/a_win/obj_stageE/obj_switched_on_item1/obj_rigged_item1/obj_attached_item1/obj_rigging_place1/'))
      assert.ok(leaves.has('/root comment 1/a_win/obj_stageE/obj_switched_on_item1/obj_rigged_item1/obj_attached_item1/inv_box_of_items/'))
      assert.ok(leaves.has('/root comment 1/a_win/obj_stageE/obj_switched_on_item2/obj_rigged_item2/obj_switch2/'))
      assert.ok(leaves.has('/root comment 1/a_win/obj_stageE/obj_switched_on_item2/obj_rigged_item2/obj_attached_item2/obj_rigging_place2/'))
      assert.ok(leaves.has('/root comment 1/a_win/obj_stageE/obj_switched_on_item2/obj_rigged_item2/obj_attached_item2/inv_box_of_items/'))
      assert.ok(leaves.has('/root comment 1/a_win/obj_stageE/obj_switched_on_item3/obj_rigged_item3/obj_switch3/'))
      assert.ok(leaves.has('/root comment 1/a_win/obj_stageE/obj_switched_on_item3/obj_rigged_item3/obj_attached_item3/obj_rigging_place3/'))
      assert.ok(leaves.has('/root comment 1/a_win/obj_stageE/obj_switched_on_item3/obj_rigged_item3/obj_attached_item3/inv_box_of_items/'))
      assert.ok(leaves.has('/root comment 1/a_win/obj_stageE/obj_switched_on_item4/obj_rigged_item4/obj_switch4/'))
      assert.ok(leaves.has('/root comment 1/a_win/obj_stageE/obj_switched_on_item4/obj_rigged_item4/obj_attached_item4/obj_rigging_place4/'))
      assert.ok(leaves.has('/root comment 1/a_win/obj_stageE/obj_switched_on_item4/obj_rigged_item4/obj_attached_item4/inv_box_of_items/'))
      assert.ok(leaves.has('/root comment 1/a_win/obj_stageE/obj_switched_on_item5/obj_rigged_item5/obj_switch5/'))
      assert.ok(leaves.has('/root comment 1/a_win/obj_stageE/obj_switched_on_item5/obj_rigged_item5/obj_attached_item5/obj_rigging_place5/'))
      assert.ok(leaves.has('/root comment 1/a_win/obj_stageE/obj_switched_on_item5/obj_rigged_item5/obj_attached_item5/inv_box_of_items/'))

      */

/*
})
*/

/* don't forget to test remove piece
box.RemovePiece(theOneToRemove)

{
  const arrayAfter = box.Get('outputA')
  const countAfterRemoval = arrayAfter != null ? arrayAfter.size : 0
  expect(countAfterRemoval).toEqual(3)
}

*/
