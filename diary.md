# start

## Sat 12th April 2025

First bug was that we kept getting the header completion Step added over and over again

  if (deconstructDoer.IsZeroPieces() && !deconstructDoer.IsValidated()) {
      // then write the achievement we just achieved
      deconstructDoer.SetValidated(true)

      const raw = new RawObjectsAndVerb()
      raw.type = Raw.DeConstructorNoticedZeroPieces


2. The next step was making sure isZero pieces worked correctly.. because it didn't
   So I changed IzZeroPieces to GetNumberOfPiecesRecurseively)()


TODO: do we really need to cache the pieceCount - or should we calculate every tiem?
TODO: rename commands to Steps. BEauctiful word that implies order, and also could be anything, either verb, or chat, or just aim completion.

3. next bit was making deconstruct doer deal with the resultant tree?
   Or figuring out why it wouldn't deconstruct.
   Answer was that we were deleting too much - we just needed to delete the children.
   We also didn't need to pass the parent in.

4. Next problem is why after we complete one round, do we not show one complete  - ie a tick?
 The answer is that since the 
  a. current algorithm stops dleteing parts when things are empty. then we still get the root node left
 b. since when we recurse to count pieces in 'the any' we can't really tell up from down, then we end up with one piece remaining.  
  Do to check for completion, we must check against 1, not 0

5. ok, now I need to do make it merge boxes in.
Now aims are decoupled from boxes, we know that if we hit one, it needs to be merged.
So we can pass file and folder into constructor, and throw exception if not exist.
But we need to pass path down the chain. 