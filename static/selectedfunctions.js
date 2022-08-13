function getMoveCircles(unit) {
    console.log(unit.possibleStates)
    if (!(unit.possibleStates.includes('move'))) {
        console.log("stopped at start")
        return [];
    }
        
    let sp = unit.speed
    let spaces = []
    if (unit.type !== 'aircraft') {
        spaces.push(unit.position)
        for (let i = 0; i<sp; i++) {
            let newSpaces = []
            for (let pos of spaces){
                for (let x = pos[0]-1; x < pos[0]+2; x++) {
                    for (let y = pos[1]-1; y < pos[1]+2; y++) {

                        if (!(spaces.includes([x,y])) && x >= 0 && y >= 0 && y<gameObject.height && x<gameObject.width) { //If within board
                            blocking_unit = getAnyUnitFromPos(x,y)
                            if (blocking_unit != null) {
                                if (getPlayerfromUnit(blocking_unit) == this_player) {
                                    if (blocking_unit.state == "move") {
                                        if (blocking_unit.stateData == pos) {
                                            continue
                                        }
                                    } else {
                                        continue
                                    }
                                } else {
                                    continue
                                }
                            }
                            let water = Grid[y][x]
                            if ((water == (unit.type == 'boat')) || unit.type == "aircraft") {
                                newSpaces.push([x,y])
                            }   
                        }
                        
                        
                            
                    }
                }
            }
            spaces = spaces.concat(newSpaces);
        }
        spaces.shift()
     } else {
        for (let x = unit.position[0]-sp; x < unit.position[0]+1+sp; x++) {
            for (let y = unit.position[1]-sp; y < unit.position[1]+1+sp; y++) {
                if ( !(spaces.includes([x,y])) && x >= 0 && y >= 0 && y<gameObject.height && x<gameObject.width) { 
                    blocking_unit = getAnyUnitFromPos(x,y)
                    if (blocking_unit != null) {
                        if (getPlayerfromUnit(blocking_unit) == this_player) {
                            if (blocking_unit.state == "move") {
                                if (blocking_unit.stateData == pos) {
                                    continue
                                }
                            } else {
                                continue
                            }
                        } else {
                            continue
                        }
                    }
                    let water = Grid[y][x]
                    if ((water == (unit.type == 'boat')) || unit.type == "aircraft") {
                        newSpaces.push([x,y])
                    }
                }
            }
        }
     }
    return spaces;
}

function getRangeCircles(unit, anyBlock = false, built = false) {
    let sp = unit.range
    let spaces = []
    for (let x = unit.position[0]-sp; x < unit.position[0]+1+sp; x++) {
        for (let y = unit.position[1]-sp; y < unit.position[1]+1+sp; y++) {
            if (x >= 0 && y >= 0 && y<gameObject.height && x<gameObject.width) { //If within board:
                let unit2 = null;
                if (!anyBlock) {
                    unit2 = getAnyUnitFromPos(x,y)
                    if (unit2 && unit2.state == "move") {
                        if (checkFriendly(unit, unit2)) {
                            unit2 = null;
                        }
                    }
                }
                if (anyBlock || unit2 == null) {
                    water = Grid[y][x]
                    if (built) {
                        t = UnitDB[built]['type'] || 0
                        if ((water == (t == 'boat')) || t == "aircraft") {
                            spaces.push([x,y])
                        }
                            
                    } else {
                        if (anyBlock || (!water)) {
                            spaces.push([x,y])
                        }
                    }
                }
            }
        }
    }
    return spaces
}