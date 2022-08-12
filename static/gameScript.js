function getUnitFromPos(player,x,y) {
    for (let unit of gameObject.units[player]) {
        console.log(unit)
        if (unit.position[0] == x && unit.position[1] == y){
            console.log("selected equals")
            return unit;
        }
    }
    return null;
}
       