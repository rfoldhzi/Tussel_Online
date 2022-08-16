function getUnitFromPos(player, x, y) {
    for (let unit of gameObject.units[player]) {
        console.log(unit)
        if (unit.position[0] == x && unit.position[1] == y) {
            console.log("selected equals")
            return unit;
        }
    }
    return null;
}

function getAnyUnitFromPos(x, y) {
    for (let player in gameObject.units) {
        for (let unit of gameObject.units[player]) {
            //console.log(unit)
            if (unit.position[0] == x && unit.position[1] == y) {
                console.log("selected equals")
                return unit;
            }
        }
    }
    return null;
}

function getPlayerfromUnit(unit) {
    for (let player in gameObject.units) {
        for (let unit2 of gameObject.units[player]) {
            if (unit === unit2) {
                return player;
            }
        }
    }
    return null;
}

function checkFriendly(unit1, unit2) {
    player = getPlayerfromUnit(unit1)
    if (player == null) {
        return false;
    }
    return gameObject.units[player].includes(unit2);
}

function checkFriendlyPlayer(unit, player) {
    return gameObject.units[player].includes(unit);
}

function getCount(unitName) {
    let count = 0;
    for (let unit of gameObject.units[this_player]) {
        if (unit.name == unitName) {
            count++;
        }
    }
    return count;
}