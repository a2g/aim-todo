import { LogicGrid } from '../../../src/puzzle/LogicGrid'
import { expect, test } from '@jest/globals'

test('FindMostNearlyCompleteRowOrColumnCombined', () => {
  const sizeFour: Array<[string, boolean]> = [
    ['a', true],
    ['b', true],
    ['c', true],
    ['d', true]
  ]

  const t = new LogicGrid(sizeFour, sizeFour)

  // nearly fill the 2 column and test that the column gets picked
  t.SetColumnRow(2, 0)
  t.SetColumnRow(2, 1)
  t.SetColumnRow(2, 2)
  {
    const r1 = t.FindMostNearlyCompleteRowOrColumnCombined()
    expect(r1).toEqual(LogicGrid.ColumnsStartHere + 2)
  }

  // fill the column completely and test that the column doesn't get picked
  t.SetColumnRow(2, 3)
  {
    const r2 = t.FindMostNearlyCompleteRowOrColumnCombined()
    expect(r2).not.toEqual(LogicGrid.ColumnsStartHere + 2)
  }

  // nearly fill the 2 row, and test it gets picked
  t.SetColumnRow(0, 2)
  t.SetColumnRow(1, 2)
  {
    const r3 = t.FindMostNearlyCompleteRowOrColumnCombined()
    expect(r3).toEqual(2)
  }

  // fill the column completely and test that the column doesn't get picked
  t.SetColumnRow(3, 2)
  {
    const r4 = t.FindMostNearlyCompleteRowOrColumnCombined()
    expect(r4).not.toEqual(2)
  }
})

/*
export function TestBestColumnOrRow() {
    const sizeFour: [string, boolean][] = [["a", true], ["b", true], ["c", true], ["d", true]];

    const t = new TruthTable(sizeFour, sizeFour);

    {
        // prior to setting, there is no clear best choice
        const c0 = t.FindMostNearlyCompleteColumn();
        const r0 = t.FindMostNearlyCompleteRow();
    }
    {
        t.SetColumnRow(2, 2);// defintely 2,2
        const c1 = t.FindMostNearlyCompleteColumn();
        const r1 = t.FindMostNearlyCompleteRow();
        expect(2, c1);
        expect(2, r1);
    }
    {
        t.SetColumnRow(1, 1);// tie and tie
        const c2 = t.FindMostNearlyCompleteColumn();
        const r2 = t.FindMostNearlyCompleteRow();
        //expect(2, c2);
        //expect(0, r1); could be either
    }
    {
        t.SetColumnRow(2, 1);// definitely 2 and 1
        const c3 = t.FindMostNearlyCompleteColumn();
        const r3 = t.FindMostNearlyCompleteRow();
        expect(2, c3);
        expect(1, r3);
    }

    {
        t.SetColumnRow(1, 0);// tie and 1
        const c4 = t.FindMostNearlyCompleteColumn();
        const r4 = t.FindMostNearlyCompleteRow();
        expect(1, r4);
    }
    {
        t.SetColumnRow(0, 0);// tie and tie
        const c5 = t.FindMostNearlyCompleteColumn();
        const r5 = t.FindMostNearlyCompleteRow();
        //expect(1, c5);
        //expect(0, r5);
    }
    {
        t.SetColumnRow(2, 0);// definitely (2) and (0)
        const c6 = t.FindMostNearlyCompleteColumn();
        const r6 = t.FindMostNearlyCompleteRow();
        expect(2, c6);
        expect(0, r6);
    }
    // ok so far we haven't completed any sets, so now we start
    {
        t.SetColumnRow(3, 0);// this should make 0 fully complete, leaving 1 the "MostNearlyComplete" row
        const nextRow = t.FindMostNearlyCompleteRow();
        expect(1, nextRow);
    }
    {
        t.SetColumnRow(2, 3);// this should make col2 fully complete, leaving 1 the "MostNearlyComplete" col
        const nextColumn = t.FindMostNearlyCompleteColumn();
        expect(1, nextColumn);
    }
    // now lets set everything, to test returning of -1
    {
        t.SetColumnRow(0, 0);
        t.SetColumnRow(0, 1);
        t.SetColumnRow(0, 2);
        t.SetColumnRow(0, 3);
        t.SetColumnRow(1, 0);
        t.SetColumnRow(1, 1);
        t.SetColumnRow(1, 2);
        t.SetColumnRow(1, 3);
        t.SetColumnRow(2, 0);
        t.SetColumnRow(2, 1);
        t.SetColumnRow(2, 2);
        t.SetColumnRow(2, 3);
        {
            const nextColumn = t.FindMostNearlyCompleteColumn();
            const nextRow = t.FindMostNearlyCompleteRow();
            expect(3, nextColumn);
        }
        t.SetColumnRow(3, 0);
        t.SetColumnRow(3, 1);
        t.SetColumnRow(3, 2);
        {
            const nextColumn = t.FindMostNearlyCompleteColumn();
            const nextRow = t.FindMostNearlyCompleteRow();
            expect(3, nextColumn);
            expect(3, nextRow);
        }

        t.SetColumnRow(3, 3);
        {
            const nextColumn = t.FindMostNearlyCompleteColumn();
            const nextRow = t.FindMostNearlyCompleteRow();
            expect(-1, nextColumn);
            expect(-1, nextRow);
        }
    }
}
*/
