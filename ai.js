/* Slot definition:

    {
        x: number (0.0 - 1.0), 
        y: number (0.0 - 1.0), 
        color: 0 (empty), 1 - 6 (subtract 1 to get player color/id), 
        topLeftNeighbour: ref to Slot, 
        topRightNeighbour: ref to Slot, 
        bottomLeftNeighbour: ref to Slot, 
        bottomRightNeighbour: ref to Slot
    }
*/

function playRandomAITurn(board, playerID, playerSlots, targetSlots) {
    console.log('in playRandomAITurn(', board, playerID, playerSlots, targetSlots, ')');
    shuffleArray(playerSlots).some(slot => {
        let keys = shuffleArray([
            "topLeftNeighbour",
            "topRightNeighbour",
            "bottomLeftNeighbour",
            "bottomRightNeighbour",
            "leftNeighbour",
            "rightNeighbour",
        ]);

        for(key of keys) {
            
            if(slot[key] && slot[key].color && slot[key].color != slot.color && 
                    slot[key][key] && !slot[key][key].color) {
                slot[key][key].color = slot.color; 
                slot.color = 0; 
                return true;
            }
            
            if(slot[key] && !slot[key].color) { slot[key].color = slot.color; slot.color = 0; return true; }
        }

        return false;
    });
}

/**
    @param board: [Slot]            Game board (reference)
    @param playerID: number (0-5)   Player whose turn it is
    @param playerSlots: [Slot]      Player slots (reference)
    @param targetSlots: [Slot]      Target slots (reference)
    @returns void

    Takes one turn for the given player.
*/
function playAITurn(board, playerID, playerSlots, targetSlots) {
    playRandomAITurn(board, playerID, playerSlots, targetSlots);
}