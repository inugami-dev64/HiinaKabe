/* Slot definition:

    {
        x: number (0.0 - 1.0), 
        y: number (0.0 - 1.0), 
        color: 0 (empty), 1 - 6 (subtract 1 to get player color/id), 
        topLeftNeighbour: ref to Slot, 
        topRightNeighbour: ref to Slot, 
        leftNeighbour: ref to Slot,
        rightNeighbour: ref to Slot,
        bottomLeftNeighbour: ref to Slot, 
        bottomRightNeighbour: ref to Slot
    }
*/

class Vector {
    constructor(_x, _y) {
        this.x = _x;
        this.y = _y;
    }

    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalise() {
        let magn = this.magnitude;
        this.x /= magn;
        this.y /= magn;
    }

    static dot(_v1, _v2) {
        return _v1.x * _v2.x + _v1.y * _v2.y;
    }
}


class Movement {
    constructor() {
        this.cost = 0;
        this.angle = 0;
        this.nextSlot = null;   // ref to Slot
        this.playerSlot = null; // ref to slot
        this.moveVec = null;    // ref to Vector
    }
}

const UP_VEC = new Vector(0.0, -1.0);


// some non-sense function written by Rainis Randmaa
function playRandomAITurn(board, playerID, playerSlots, targetSlots) {
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
            if(slot[key] && slot[key].color != slot.color && slot[key][key] && !slot[key][key].color) {
                slot[key][key].color = slot.color; 
                slot.color = 0; 
                return true;
            }
            
            if(slot[key] && !slot[key].color) { slot[key].color = slot.color; slot.color = 0; return true; }
        }

        return false;
    });
}


// helper function to help sorting slots in ascending order
function slotCompareY(a, b) {
    return a.rotY - b.rotY;
}


function findSuitableTarget(board) {
    board.sort(slotCompareY);
    console.log(board)

    // check if any of the destination slots are free
    for(let i = 0; i < board.length; i++) {
        if(board[i].color != 0)
            continue;

        return board[i]
    }

    return null;
}


// this function might actually require some sort of path finding algorithm to be implemented
function correctMovement(movement) {

    if(movement.moveVec.x <= 0) {
        if(movement.angle >= 0 && movement.angle < Math.PI / 3) {
            movement.nextSlot = movement.playerSlot.topLeftNeighbour;
            console.log("topLeftNeighbour");
        }
        else if(movement.angle >= Math.PI / 3 && movement.angle < (2 * Math.PI) / 3) {
            movement.nextSlot = movement.playerSlot.leftNeighbour;
            console.log("leftNeighbour");
        }
        else if(movement.angle >= (2 * Math.PI) / 3) {
            movement.nextSlot = movement.playerSlot.bottomLeftNeighbour;
            console.log("bottomLeftNeighbour");
        }
    } else {
        if(movement.angle > 0 && movement.angle <= Math.PI / 3) {
            movement.nextSlot = movement.playerSlot.topRightNeighbour;
            console.log("topRightNeighbour");
        }
        else if(movement.angle > Math.PI / 3 && movement.angle <= (2 * Math.PI) / 3) {
            movement.nextSlot = movement.playerSlot.rightNeighbour;
            console.log("rightNeighbour");
        }
        else if(movement.angle > (2 * Math.PI) / 3) {
            movement.nextSlot = movement.playerSlot.bottomRightNeighbour;
            console.log("bottomRightNeighbour");
        }
    }

    // recursively check find the jump destination 
    if(movement.nextSlot != null && movement.nextSlot.color != 0) {
        movement.playerSlot = movement.nextSlot;
        movement.moveVec.x -= (movement.nextSlot.x - movement.playerSlot.x);
        movement.moveVec.y -= (movement.nextSlot.y - movement.playerSlot.y);
        movement.angle = Math.acos(Vector.dot(movement.moveVec, UP_VEC));
        movement.cost -= movement.moveVec.magnitude;
        correctMovement(movement);
    }
}


// analyse all player slots and determine the least costly player to move with move
function findSuitableMovement(playerSlots, dstSlot, playerID) {
    let minMovement = null;
    
    // search for slots with minimal cost
    for(let i = 0; i < playerSlots.length; i++) {
        //playerSlots[i].color = 0;
        let movement = new Movement;

        movement.moveVec = new Vector(dstSlot.rotX - playerSlots[i].rotX, dstSlot.rotY - playerSlots[i].rotY);
        movement.cost = movement.moveVec.magnitude;
        movement.moveVec.normalise();
        movement.angle = Math.acos(Vector.dot(movement.moveVec, UP_VEC));
        movement.moveVec.x *= movement.cost;
        movement.moveVec.y *= movement.cost;
        movement.playerSlot = playerSlots[i];

        console.log("Movement vector: ", movement.moveVec.x, " ", movement.moveVec.y);
        console.log("Distance to travel is ", movement.moveVec.magnitude);
        console.log("Travel angle: ", movement.angle * 180 / Math.PI);

        correctMovement(movement);
        movement.playerSlot = playerSlots[i];
        
        if(movement.nextSlot != null && (minMovement == null || movement.nextSlot.cost < minMovement.cost))
            minMovement = movement;
    }

    if(minMovement == null)
        throw "Could not find the minimal movement path";

    return minMovement;
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
    //console.log("Playing random AI turn");
    //playRandomAITurn(board, playerID, playerSlots, targetSlots);

    console.log("Checking for suitable move");

    // sort playerSlots and targetSlots on decending order from y coordinate
    playerSlots.sort(slotCompareY);
    targetSlots.sort(slotCompareY);

    dstSlot = findSuitableTarget(board);
    if(dstSlot == null)
        throw "All slots in game are occupied? Not good";

    movement = findSuitableMovement(playerSlots, dstSlot, playerID);
    movement.nextSlot.color = movement.playerSlot.color;
    movement.playerSlot.color = 0;
}
