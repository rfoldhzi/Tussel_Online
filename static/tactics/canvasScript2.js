function thing() {
    console.log("HI BUDDY");
}

let baseUnitImages = {};
let unitImages = {};
let highlightUnitImages = {}; //Unit images with a white shadow
//const playerColors = [[201, 59, 54, 255], [0, 195, 255], [255, 136, 0, 255], [41, 61, 148],
//[128, 242, 46], [169, 88, 245], [255, 255, 64], [18, 252, 104]]
const playerColors = {
    "0":[219, 20, 13, 255], //Red
    "1":[0, 195, 255], //Blue
    "2":[255, 116, 27, 255], //Orange
    "3":[9, 48, 224],  //Navy
    "4":[61, 227, 0], //Green
    "5":[125, 43, 255], //Purple
    "6":[255, 255, 64], //Yellow
    "7":[255, 0, 221], //Pink
    "8":[230, 230, 230], //White
    "9":[82, 255, 168], //Cyan
    "10":[138, 63, 21], //Brown
    "11":[194, 145, 81], //Tan
    "neutral":[40,40,40], //Black
    "rebel":[150,150,150], //Gray
    "rjfx3":[150,150,150],
    "rjfx5":[255, 116, 27]
};
const resourceColors = {
    "gold": "#DDDD00",
    "metal": "#DDDDDD",
    "energy": "#00FFFF"
}

function replaceColor(imageCanvas, src, dst) {
    let context = imageCanvas.getContext('2d');
    let im = context.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
    for (var i = 0; i < im.data.length; i += 4) {
        if (
            im.data[i] === src[0] &&
            im.data[i + 1] === src[1] &&
            im.data[i + 2] === src[2]
        ) {

            im.data[i] = dst[0];
            im.data[i + 1] = dst[1];
            im.data[i + 2] = dst[2];
        }
    }
    context.putImageData(im, 0, 0);
}

function colorHalfBrightness(color){
    return [Math.floor(color[0]/2),Math.floor(color[1]/2),Math.floor(color[2]/2)]
}

function createShadow(imageCanvas) {
    let context = imageCanvas.getContext('2d');
    let im = context.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
    const pixelsToCheck = [4,-4,imageCanvas.width*4,imageCanvas.width*-4];
    const pixelsToCheck2 = [8,-8];

    for (var i = 0; i < im.data.length; i += 4) {
        if (im.data[i + 3] == 0) {
            if (im.data[i + 3 + 4] == 255 || im.data[i + 3 - 4] == 255
                || im.data[i + 3 + imageCanvas.width*4] == 255 || im.data[i + 3 - imageCanvas.width*4] == 255) {
                im.data[i + 3] = 40
                for (let n of pixelsToCheck) {
                    if (im.data[i + n] <= 30 && im.data[i + 1 + n] <= 30 && im.data[i + 2 + n] <= 30) {
                        continue
                    }
                    im.data[i + 3] = 250
                }
                    
            } else if (im.data[i + 3 + 8] == 255 || im.data[i + 3 - 8] == 255
                || im.data[i + 3 + imageCanvas.width*8] == 255 || im.data[i + 3 - imageCanvas.width*8] == 255) {
                    for (let n of pixelsToCheck2) {
                        if (im.data[i + n] <= 30 && im.data[i + 1 + n] <= 30 && im.data[i + 2 + n] <= 30) {
                            continue
                        }
                        im.data[i + 3] = 80
                    }
            } 
        }
    }
    context.putImageData(im, 0, 0);
}

//Black outline around unit (ignoreing where there is already black), then fading white
function createWhiteShadow(imageCanvas) {
    let context = imageCanvas.getContext('2d');
    let im = context.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
    const pixelsToCheck = [4,-4,imageCanvas.width*4,imageCanvas.width*-4];
    const pixelsToCheck2 = [8,-8];

    //Black outline (except around already present black)
    outer : for (var i = 0; i < im.data.length; i += 4) {
        if (im.data[i + 3] == 0) {
            if (im.data[i + 3 + 4] == 255 || im.data[i + 3 - 4] == 255
                || im.data[i + 3 + imageCanvas.width*4] == 255 || im.data[i + 3 - imageCanvas.width*4] == 255) {
                    for (let n of pixelsToCheck) {
                        if (im.data[i + n + 3] == 255 && im.data[i + n] <= 30 && im.data[i + 1 + n] <= 30 && im.data[i + 2 + n] <= 30) {
                            continue outer //if next to any black, don't create outline. Go to next pixel
                        }
                    }
                    
                    im.data[i + 3] = 254
                }
        }
    }

    //white shadow
    for (var i = 0; i < im.data.length; i += 4) {
        if (im.data[i + 3] == 0) {
            //Inner white shadow
            if (im.data[i + 3 + 4] >= 254 || im.data[i + 3 - 4] >= 254
                || im.data[i + 3 + imageCanvas.width*4] >= 254 || im.data[i + 3 - imageCanvas.width*4] >= 254) {
                
                im.data[i + 0] = 255
                im.data[i + 1] = 255
                im.data[i + 2] = 255
                im.data[i + 3] = 250
            
            
            } else if (im.data[i + 3 + 8] >= 254 || im.data[i + 3 - 8] >= 254
                || im.data[i + 3 + imageCanvas.width*8] >= 254 || im.data[i + 3 - imageCanvas.width*8] >= 254) {
                
                //Outer white shadow
                im.data[i + 0] = 255
                im.data[i + 1] = 255
                im.data[i + 2] = 255
                im.data[i + 3] = 80
                
            } 
        }
    }
    context.putImageData(im, 0, 0);
}

function invertTechImage(imageCanvas) {
    let context = imageCanvas.getContext('2d');
    let im = context.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
    let RR1 = im.data[0]
    let GG1 = im.data[1]
    let BB1 = im.data[2]
    let RR2
    let GG2
    let BB2
    for (var i = 0; i < im.data.length; i += 4) {
        if (
            im.data[i] != RR1 ||
            im.data[i + 1] != GG1 ||
            im.data[i + 2] != BB1
        ) {
            RR2 = im.data[i]
            GG2 = im.data[i + 1]
            BB2 = im.data[i + 2]
            break
        }
    }
    for (var i = 0; i < im.data.length; i += 4) {
        if (
            im.data[i] === RR1 &&
            im.data[i + 1] === GG1 &&
            im.data[i + 2] === BB1
        ) {
            im.data[i] = RR2;
            im.data[i + 1] = GG2;
            im.data[i + 2] = BB2;
        } else if (
            im.data[i] === RR2 &&
            im.data[i + 1] === GG2 &&
            im.data[i + 2] === BB2
        ) {
            im.data[i] = RR1;
            im.data[i + 1] = GG1;
            im.data[i + 2] = BB1;
        }

    }
    context.putImageData(im, 0, 0);
}

function ConvertImageToBlackAndWhite(imageCanvas) {
    let context = imageCanvas.getContext('2d');
    let im = context.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
    for (var i = 0; i < im.data.length; i += 4) {
        let Brightness = (0.299*im.data[i] + 0.587*im.data[i + 1] + 0.114*im.data[i + 2])
        im.data[i] = (Brightness * 5 + im.data[i])/6;
        im.data[i + 1] = (Brightness * 5 + im.data[i + 1])/6;
        im.data[i + 2] = (Brightness * 5 + im.data[i + 2])/6;
    }
    context.putImageData(im, 0, 0);
}

function getOutlinedUnitImage(player, name) {
    if (UnitDB[name].baseUnit != undefined) {
        name = UnitDB[name].baseUnit
    }
    return highlightUnitImages[player][name]
}

function getUnitImage(player, name) {
    if (UnitDB[name].baseUnit != undefined) {
        name = UnitDB[name].baseUnit
    }
    if (!(player in unitImages)) {
        unitImages[player] = {};
        highlightUnitImages[player] = {}
    }
    if (!(name in unitImages[player])) {
        if (!(name in baseUnitImages)) {
            let img = new Image(size, size);
            console.log("requesting image " + name);
            img.src = '/static/assets/' + name.replaceAll(" ", "_") + '.png';

            img.onload = function () {
                img.setAttribute('crossOrigin', '');
                img.crossOrigin = "Anonymous";
                baseUnitImages[name] = img;

                console.log("recieved image " + name);
                //unitImages = [];
                for (const player2 in unitImages) {
                    if (name in unitImages[player2]) {
                        delete unitImages[player2][name]
                    }
                }
                createCardButtons(gameObject.hands[this_player])
                drawBoard();
            }
            baseUnitImages[name] = null;
            return null;
        }
        if (baseUnitImages[name] == null) {
            return null;
        }


        //img.height = size;

        let unitCanvas = document.createElement('canvas');
        //unitCanvas.setAttribute('width', size);
        //unitCanvas.setAttribute('height', size);
        unitCanvas.setAttribute('width', 60);
        unitCanvas.setAttribute('height', 60);
        let ctx = unitCanvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        //ctx.drawImage(baseUnitImages[name], 0, 0, size, size);
        ctx.drawImage(baseUnitImages[name], 0, 0, 60, 60);
        replaceColor(unitCanvas, [233, 19, 212], playerColors[player])
        replaceColor(unitCanvas, [117, 10, 107], colorHalfBrightness(playerColors[player]))
        createShadow(unitCanvas)

        unitImages[player][name] = ctx.canvas;
        if (player == this_player) {

            let highlightCanvas = document.createElement('canvas');
            highlightCanvas.setAttribute('width', 60);
            highlightCanvas.setAttribute('height', 60);

            let ctx2 = highlightCanvas.getContext('2d');
            ctx2.imageSmoothingEnabled = false;
            ctx2.drawImage(baseUnitImages[name], 0, 0, 60, 60);

            replaceColor(highlightCanvas, [233, 19, 212], playerColors[player])
            replaceColor(highlightCanvas, [117, 10, 107], colorHalfBrightness(playerColors[player]))
            createWhiteShadow(highlightCanvas)

            //ctx2.drawImage(unitCanvas, 0, 0);

            highlightUnitImages[player][name] = ctx2.canvas;
        }
    };

    return unitImages[player][name];

}





let BoardColors = []
let Grid = []
let depthMap = []
let cloudGrid = []
let explorationGrid = []
let CloudColors = []
let CloudColors2 = []
let cloudType = "halo"

function intToBoolList(n) {
    let L = [];
    let nCopy = n;
    for (let i = 7; i >= 0; i--) {
        if (nCopy >= Math.pow(2, i)) {
            L.push(true);
            nCopy -= Math.pow(2, i)
        } else {
            L.push(false);
        }
    }
    return L;
}

let xs = [1, 0, -1, 0]
let ys = [0, 1, 0, -1]

function isNextToWater(pos) {
    for (let i = 0; i < 4; i++) {
        x = pos[0] + xs[i]
        y = pos[1] + ys[i]
        if (x >= 0 && y >= 0 && y < gameObject.height && x < gameObject.width) {
            if (Grid[y][x]) {
                return true;
            }
        }
    }
    return false;
}

function lowestNextTo(x, y) { //Calculates which adjecent tile has lowest depth value (excludes tiles that are -1)
    let lowest = -1
    for (let i = 0; i < xs.length; i++) {
        if (x + xs[i] >= 0 && x + xs[i] < depthMap.length && y + ys[i] >= 0 && y + ys[i] < depthMap[0].length) {
            if (depthMap[x + xs[i]][y + ys[i]] != -1) {
                if (depthMap[x + xs[i]][y + ys[i]] < lowest) {
                    lowest = depthMap[x + xs[i]][y + ys[i]]
                }
            }
            if (lowest == -1) {
                lowest = depthMap[x + xs[i]][y + ys[i]]
            }
        }
    }
    return lowest;
}

function generateDepthMap() {
    depthMap = [];

    for (let layer of Grid) { //This part sets all land to 0 and water to -1
        let list = []
        for (let v2 of layer) {
            if (v2) {
                list.push(-1);
            } else {
                list.push(0);
            }
        }
        depthMap.push(list);
    }

    let keepGoing = true;
    while (keepGoing) {
        console.log(depthMap);
        keepGoing = false;
        let x = 0;
        let newDepthMap = JSON.parse(JSON.stringify(depthMap))

        for (let list of depthMap) {
            let y = 0;
            for (let n of list) {
                if (n == -1) {
                    keepGoing = true;
                    lowest = lowestNextTo(x, y)
                    if (lowest != -1) {
                        newDepthMap[x][y] = lowest + 1;
                    }
                }
                y += 1
            }
            x += 1
        }
        depthMap = newDepthMap
    }

}

function generateGrid() {
    Grid = []
    for (let y =0; y<gameObject.height; y++) {
        layer = [];
        for (let x=0; x<gameObject.width; x++) {
            layer.push(false);
        }
        Grid.push(layer);
    }
    generateDepthMap();
}

function generateGridOLD() {
    Grid = []
    let numbers = gameObject.intGrid;
    let i = 0
    let total = 0;
    let layer = []
    for (let n of numbers) {
        let boolList = intToBoolList(n);
        for (let TF of boolList) {
            if (total >= gameObject.width * gameObject.height) {
                break;
            }
            if (i >= gameObject.width) {
                Grid.push(layer);
                layer = [];
                i = 0
            }
            layer.push(TF);
            i += 1;
            total += 1;
            //console.log("a true false");
        }
    }
    Grid.push(layer); //One last for push for final layer

    generateDepthMap();


}

function generateBoardColors() {
    BoardColors = []
    for (let y = 0; y < gameObject.height; y++) {
        for (let x = 0; x < gameObject.width; x++) {
            if (Grid[y][x]) {
                BoardColors.push(randomBlueWeighted(depthMap[y][x]));
            } else {
                if (isNextToWater([x, y])) {
                    BoardColors.push(randomYellow());
                } else {
                    BoardColors.push(randomGreen());
                }
            }
        }
    }
    /*
    let numbers = gameObject.intGrid;
    for (const n of numbers) {
        let boolList = intToBoolList(n);
        for (const TF of boolList) {
            if (TF) {
                
            } else {
                
            }
        }
    }
    */
}

function getCost(unitName) {
    console.log(unitName);
    let cost = UnitDB[unitName]['cost']
    if ('abilities' in UnitDB[unitName] && 'costly' in UnitDB[unitName]['abilities']) {

        cost = { ...cost } //copy the list

        count = getCount(unitName)
        for (let v in cost) {
            cost[v] = Math.floor(cost[v] * Math.pow(UnitDB[unitName]['abilities']['costly'], count) / 5) * 5
        }
    }
    return cost
}

function getEffectiveResources(unitToIgnore) {
    let resources = gameObject.resources[this_player]
    resources = { ...resources } //copy the list
    for (let unit of gameObject.units[this_player]) {
        if (unit == unitToIgnore) {
            continue
        }
        if (unit.state == "resources") {
            resources[unit.stateData] += unit.resourceGen[unit.stateData]
        } else if (unit.state == "build") {
            cost = getCost(unit.stateData[1])
            for (let r in cost) {
                resources[r] -= cost[r]
            }
        } else if (unit.state == "upgrade") {
            cost = getCost(unit.stateData)
            for (let r in cost) {
                resources[r] -= cost[r]
            }
        } else if (unit.state == "research") {
            resources["energy"] -= TechDB[unit.stateData]["cost"]
        }
    }

    //Also need to deal with resources with researching

    return resources;
}

function checkIfAffordable(unitName) {
    let cost = getCost(unitName);
    for (let r in cost) {
        if (effectiveResources[r] < cost[r]) {
            return false;
        }
    }
    return true;
}

//Keeps the size within a resonable range
function regulateSquareSize() {
    let minSize = 500/Math.max(gameObject.width, gameObject.height)
    if (size < minSize) {
        size = minSize
    } else if (size > 100) {
        size = 100
    }
    size = Math.floor(size)
}

function initilizeOffsets() {
    let minX = null;
    let maxX = null;
    let minY = null;
    let maxY = null
    for (let unit of gameObject.units[this_player]) {
        if (minX == null) {
            minX = unit.position[0]
            maxX = unit.position[0]
            minY = unit.position[1]
            maxY = unit.position[1]
        }
        if (unit.position[0] < minX) {
            minX = unit.position[0]
        }
        if (unit.position[0] > maxX) {
            maxX = unit.position[0]
        }
        if (unit.position[1] < minY) {
            minY = unit.position[1]
        }
        if (unit.position[1] > maxY) {
            maxY = unit.position[1]
        }
    }

    //To give a 1 space buffer around units
    minX -= 1
    maxX += 1
    minY -= 1
    maxY += 1

    const sizeByX = canvas.width/(maxX-minX+1)
    const sizeByY = canvas.height/(maxY-minY+1)

    size = Math.floor(Math.min(sizeByX, sizeByY))
    regulateSquareSize()


    x_offset = Math.floor((canvas.width - (size*(maxX-minX+1)))/2 - size * minX)
    y_offset = Math.floor((canvas.height - (size*(maxY-minY+1)))/2 - size * minY)
}

function setAnimateSpeed(g1, g2) {
    let minX = Math.floor((-x_offset)/(size))
    let minY = Math.floor((-y_offset)/(size))
    let maxX = Math.floor((canvas.width-x_offset)/(size))
    let maxY = Math.floor((canvas.height-y_offset)/(size))

    let unitCount = 0
    for (const player in g1.units) {
        for (const unit1 of g1.units[player]) {
            if (unit1.position[0] < minX || unit1.position[0] > maxX 
                || unit1.position[1] < minY || unit1.position[1] > maxY) {
                    continue
                }
            let unit2 = getUnitByIDwithGameObject(g2, unit1.UnitID)
            if (unit2 == null) { //Unit Died
                unitCount += 1
            } else if (unit1.position[0] != unit2.position[0] || unit1.position[1] != unit2.position[1]) {
                //Unit moved
                unitCount += 1
            } else if (unit1.health != unit2.health) { //Unit health changed
                unitCount += 1
            }
        }
    }
    for (const player in g2.units) {
        for (const unit2 of g2.units[player]) {
            let unit1 = getUnitByIDwithGameObject(g1, unit2.UnitID)
            if (unit1 == null) { //Unit was built
                unitCount += 1
            }
        }
    }
    animationMax = Math.min(60,Math.max(15,5+unitCount*2))
    console.log(animationMax)
}


let directions = {1:[0,-1], 4:[1,0], 16:[0,1], 64:[-1,0]}

//For territories: claim territories with 3 friendly troops adjacent
function claim3s() {
    for (let y = 0; y < gameObject.height; y++) {
        for (let x = 0; x < gameObject.width; x++) {
            if (territoryMap[y][x] == null) {
                let player1 = -1
                let player2 = -1
                let friendlyCount1 = 0 //Count number of friendly units that are adjacent
                let friendlyCount2 = 0
                //We use two counters because we only want the player with the majority. If there are 3 players around
                //this spot, no one has a majority. Thus, we only need to keep track of two players
                for (const num in directions) {
                    if (territoryMap[y + directions[num][1]] === undefined) { //ignore if out of bounds
                        continue
                    }
                    if (player1 == -1) {
                        player1 = territoryMap[y + directions[num][1]][x + directions[num][0]]
                        friendlyCount1 += 1
                    } else if (player2 == -1 && territoryMap[y + directions[num][1]][x + directions[num][0]] !== player1) {
                        player2 = territoryMap[y + directions[num][1]][x + directions[num][0]]
                        friendlyCount2 += 1
                    } else {
                        if (territoryMap[y + directions[num][1]][x + directions[num][0]] === player1) {
                            friendlyCount1 += 1
                        } else if (territoryMap[y + directions[num][1]][x + directions[num][0]] === player2) {
                            friendlyCount2 += 1
                        }
                    }
                }
                if (friendlyCount1 >= 3) {
                    territoryMap[y][x] = player1
                } else if (friendlyCount2 >= 3) {
                    territoryMap[y][x] = player2
                }
            }
        }
    }
}

//For territories: claim territories with 2 friendly troops across from one another
function claimAcross() {
    for (let y = 0; y < gameObject.height; y++) {
        for (let x = 0; x < gameObject.width; x++) {
            if (territoryMap[y][x] == null) {
                let player1 = null
                let player2 = null
                if (territoryMap[y - 1] !== undefined && territoryMap[y + 1] !== undefined) {
                    if (territoryMap[y - 1][x] == territoryMap[y + 1][x]) {
                        player1 = territoryMap[y - 1][x]
                    }
                }
                if (territoryMap[y][x - 1] == territoryMap[y][x + 1]) {
                    player2 = territoryMap[y][x - 1]
                }
                if (player1 != player2) {
                    if (player1 != null) {
                        territoryMap[y][x] = player1
                    } else if (player2 != null) {
                        territoryMap[y][x] = player2
                    }
                }
            }
        }
    }
}

//For territories: create number map based on powers of twos showing where territory edges should go
function numberMap() {
    for (let y = 0; y < gameObject.height; y++) {
        for (let x = 0; x < gameObject.width; x++) {
            let player = territoryMap[y][x]
            if (player != null) {
                let total = 0
                for (const num in directions) {
                    if (territoryMap[y + directions[num][1]] === undefined) {//Make sure y layer is in range
                        total += parseInt(num)
                    } else if (territoryMap[y + directions[num][1]][x + directions[num][0]] !== player) {
                        total += parseInt(num)
                    }
                }
                if (territoryMap[y + 1] !== undefined) { //Checks to make sure in range
                    if (total % 2 < 1 &&  total % 8 < 4) { //Top right
                        if (territoryMap[y - 1][x + 1] !== player) {
                            total += 2
                        }
                    }
                    if (total % 8 < 4 &&  total % 32 < 16) { //Bottom right
                        if (territoryMap[y + 1][x + 1] !== player) {
                            total += 8
                        }
                    }
                }
                if (territoryMap[y - 1] !== undefined) { //Checks to make sure in range
                    if (total % 32 < 16 &&  total % 128 < 64) { //bottom left
                        if (territoryMap[y + 1][x - 1] !== player) {
                            total += 32
                        }
                    }
                    if (total % 128 < 64 &&  total % 2 < 1) { //Top left
                        if (territoryMap[y - 1][x - 1] !== player) {
                            total += 128
                        }
                    }
                }
                territoryNumberCode[y][x] = total
            }
        }
    }
}

//Calculates where territories should go during animation
//Stores this map into animationTerritoryMap
function determineAnimationTerritories(g1,g2) {
    territoryMap = []
    territoryNumberCode = []
    for (let i = 0; i<gameObject.height; i++) {
        let layer = []
        let layer2 = []
        for (let j = 0; j<gameObject.width; j++) {
            layer.push(null)
            layer2.push(0)
        }
        territoryMap.push(layer)
        territoryNumberCode.push(layer2)
    }
    for (const player in g1.units) {
        for (const unit1 of g1.units[player]) {
            territoryMap[unit1.position[1]][unit1.position[0]] = player
        }
    }

    claim3s()
    claimAcross()
    claim3s()
    claimAcross()
    claim3s()

    for (const player in g2.units) {
        for (const unit2 of g2.units[player]) {
            territoryMap[unit2.position[1]][unit2.position[0]] = player
        }
    }

    numberMap()
}

//Calculates where territories should go
//Stores this map into territoryMap and territoryNumberCode
function determineTerritories() {
    territoryMap = []
    territoryNumberCode = []
    for (let i = 0; i<gameObject.height; i++) {
        let layer = []
        let layer2 = []
        for (let j = 0; j<gameObject.width; j++) {
            layer.push(null)
            layer2.push(0)
        }
        territoryMap.push(layer)
        territoryNumberCode.push(layer2)
    }
    for (const player in gameObject.units) {
        for (const unit of gameObject.units[player]) {
            if ("generation" in UnitDB[unit.name]) {
                let points = findPatternPoints(UnitDB[unit.name]["generationPattern"], unit.pos)
                for (let point of points) {
                    territoryMap[point[1]][point[0]] = 6
                }
            }
            if ("counter" in UnitDB[unit.name]) {
                let points = findPatternPoints(UnitDB[unit.name]["counterPattern"], unit.pos)
                for (let point of points) {
                    territoryMap[point[1]][point[0]] = 1
                }
            }
        }
    }
    for (const player in gameObject.units) {
        for (const unit of gameObject.units[player]) {
            territoryMap[unit.pos[1]][unit.pos[0]] = player
        }
    }

    
    //claim3s()
    //claimAcross()
    //claim3s()
    //claimAcross()
    //claim3s()

    numberMap()
}

//Determine which units are buffed, buff them, and add their ID's to to buffedUnits
function determineBuffedUnits() {
    buffedUnits = {}
    for (const player in gameObject.units) {
        for (const unit of gameObject.units[player]) {
            if ("buff" in unit.abilities) {
                targetStat = unit.abilities['buff'][0]
                multiplier = unit.abilities['buff'][1]
                tiles = getRangeCircles(unit, anyBlock = true, built = false, sp = 1, )
                for (const pos of tiles) {
                    unit2 = getUnitFromPos(player,pos[0],pos[1])
                    if (unit2 && unit2 != unit) {
                        if (!(targetStat in buffedUnits)) {
                            buffedUnits[targetStat] = []
                        }
                        buffedUnits[targetStat].push(unit2.UnitID)
                        if (unit2[targetStat] !== undefined) {
                            unit2[targetStat] *= multiplier
                        }
                    }
                }
            }
        }
    }
}

function animateBoard(g1, g2, t) {
    for (const player in g1.units) {
        for (const unit1 of g1.units[player]) {
            let unit2 = getUnitByIDwithGameObject(g2, unit1.UnitID)
            if (unit2 == null) { //Unit destroyed
                if (unit1.state == "move") {
                    let possibleTransport = getUnitFromPosGameObject(g2, player, unit1.stateData[0], unit1.stateData[1])
                    if (possibleTransport != null) {
                        if (checkIfUnitTransported(unit1,possibleTransport)) {
                            animateUnit(unit1,possibleTransport,t,player)
                            continue
                        }
                    }
                }
                animateUnit(unit1,unit1,t,player)
            } else {
                animateUnit(unit1,unit2,t,player)
            }
        }
    }
    for (const player in g2.units) {
        for (const unit2 of g2.units[player]) {
            let unit1 = getUnitByIDwithGameObject(g1, unit2.UnitID)
            if (unit1 == null) { //Unit was just build
                animateUnit(null,unit2,t,player)
            }
        }
    }
}
function Lerp(a,b,t) {
    return a + t*(b-a)
}

function drawLerpedImage(img,x1,y1,x2,y2,t, multiplier) {
    let xCenter = (x1+x2)/2
    let yCenter = (y1+y2)/2

    let x3 = x1
    let y3 = y2
    //This statement is used to switch direction of the curve on every other space
    if ((x1+y1) % 2 == 0) {
        x3 = x2
        y3 = y1
    }

    if ((x1 == x2 || y1 == y2) && Math.abs(x1 + y1 - x2 - y2) > 1) {
        let mult = 1
        if ((x1+y1) % 2 == 0) {
            mult = -1
        }
        x3 = xCenter
        y3 = yCenter
        if (x1 == x2) {
            x3 += 0.5*mult
        } else {
            y3 += 0.5*mult
        }
    }

    x3 = (xCenter + x3)/2
    y3 = (yCenter + y3)/2

    let startX = size * x1 + x_offset + size * (1 - multiplier) * .5
    let startY = size * y1 + y_offset + size * (1 - multiplier) * .5
    let midX = size * x3 + x_offset + size * (1 - multiplier) * .5
    let midY = size * y3 + y_offset + size * (1 - multiplier) * .5
    let endX = size * x2 + x_offset + size * (1 - multiplier) * .5
    let endY = size * y2 + y_offset + size * (1 - multiplier) * .5
    let actual_X = Lerp(Lerp(startX,midX,t),Lerp(midX,endX,t), t)
    let actual_Y = Lerp(Lerp(startY,midY,t),Lerp(midY,endY,t), t)
    context.drawImage(img, actual_X, actual_Y, size * multiplier, size * multiplier);
}

function animateUnit(unit1, unit2, t, specfic_player) {

    let unit = unit1 || unit2;
    let x = unit.position[0]
    let y = unit.position[1]

    //If not in animate Grid: return

    //If out of bounds: return

    let img = getUnitImage(specfic_player, unit.name);
    if (img == null) {
        return
    }
    let defaultAnimation = true;
    let multiplier = getMultiplier(unit.name, unit.type);

    if ((unit1 && unit2) && (unit1.cloaked != undefined || unit2.cloaked != undefined)) { //Make cloaked units lerp between transparency
        context.globalAlpha = Lerp((unit1.cloaked)? 0.4 : 1, (unit2.cloaked)? 0.4 : 1, t)
    }

    if (unit1 == null) {
        //Transport unit stuff
        let parent = getUnitByID(unit2.parent)
        if (unit2.transporter != undefined) {
            parent = getUnitByID(unit2.transporter)
        }
        if (parent != null) {
            defaultAnimation = false
            let x2 = parent.position[0]
            let y2 = parent.position[1]
            //return if x2 or y2 out of bounds
            drawLerpedImage(img,x2,y2,x,y,t, multiplier)
        }
    } else if (x != unit2.position[0] || y != unit2.position[1]) {
        defaultAnimation = false
        drawLerpedImage(img,x,y,unit2.position[0],unit2.position[1],t, multiplier)
    }
    if (defaultAnimation) {
        context.drawImage(img, size * unit.position[0] + x_offset + size * (1 - multiplier) * .5, size * unit.position[1] + y_offset + size * (1 - multiplier) * .5, size * multiplier, size * multiplier);
        context.globalAlpha = 1 //Reset transparency in case unit was cloaked
        
        //Draw "Aura" buff effects
        for (const targetStat in buffedUnits) {
            if (buffedUnits[targetStat].includes((unit.UnitID))) {
                context.drawImage(buffImages[targetStat], size * unit.position[0] + x_offset + size * (1 - multiplier) * .5, size * unit.position[1] + y_offset + size * (1 - multiplier) * .5, size * multiplier, size * multiplier);
            }
        }
        
        //State square
        //Lerped health
        let healthText = unit.health
        context.fillStyle = "white";
        fontSize = Math.floor(size / 3);
        context.font = fontSize + "px Arial";
        context.textAlign = "right";
        context.strokeStyle = 'black';
        context.lineWidth = Math.floor(fontSize / 6);
        if (unit1 != null && unit2 != null) {
            if (unit2.health < unit1.health) {
                healthText = Math.floor(Lerp(unit1.health, unit2.health, t))
                context.fillStyle = "red";
            } else if (unit2.health > unit1.health) {
                healthText = Math.floor(Lerp(unit1.health, unit2.health, t))
            } else if (unit1 == unit2) { // Unit is dying, lerping health with 0
                healthText = Math.floor(Lerp(unit1.health, 0, t))
                context.fillStyle = "red";
            }
        }
        context.strokeText(healthText, size * unit.position[0] + size + x_offset, size * unit.position[1] + size + y_offset);
        context.fillText(healthText, size * unit.position[0] + size + x_offset, size * unit.position[1] + size + y_offset);
    }

    if (unit1 == unit2) { //This unit is dead
        context.drawImage(RedX, size * x + x_offset, size * y + y_offset, size, size);
    }
    context.globalAlpha = 1 //Reset transparency in case unit was cloaked
}


//Draws a popup box describing a unit thats about to be built
function buildPopup(unit, player = this_player) {
    ButtonCollection = {}
    createCancelButton()

    let boxWidth = Math.floor(canvas.height * 0.9 * .7)
    let boxHeight = Math.floor(boxWidth * 0.25)

    let boxXoffset = Math.floor((canvas.width - boxWidth) / 2)
    boxYoffset = Math.floor(canvas.height * .98 - boxHeight)

    if (canvas.height > canvas.width) {
        boxWidth = Math.floor(canvas.width * 0.9)
        if (canvas.width/canvas.height > .7) {
            boxWidth = Math.floor(canvas.height * 0.9 * .7)
        }
        boxXoffset =  Math.floor((canvas.width - boxWidth) / 2)
        boxHeight = Math.floor(boxWidth * 0.25)
        boxYoffset = Math.floor(canvas.height * .98 - boxHeight)
    }

    context.fillStyle = "#222"
    context.fillRect(boxXoffset, boxYoffset, boxWidth, boxHeight);
    context.fillStyle = "#BBB"
    context.fillRect(boxXoffset, boxYoffset, boxHeight, boxHeight);
    var grd = context.createLinearGradient(boxXoffset, 0, boxXoffset + boxHeight* 1.5, 0);
    grd.addColorStop(0, "#DDD");
    grd.addColorStop(0.5, "#777");
    grd.addColorStop(0.7, "#444");
    grd.addColorStop(1, "#222");
    context.fillStyle = grd
    context.fillRect(boxXoffset, boxYoffset, boxHeight*1.5, boxHeight);


    
    let image = getUnitImage(player, unit)
    if (image != null) {
        let multiplier = getMultiplier(unit)
        context.drawImage(image, boxXoffset+boxHeight*(1-multiplier)/2, boxYoffset+boxHeight*(1-multiplier)/2, boxHeight*multiplier, boxHeight*multiplier);
    }

    //Resource costs
    i = 0
    context.font = (boxHeight*.2) + "px Arial";
    context.textAlign = "right";
    let cost = getCost(unit)
    let resourceTextSize = 0
    for (let resource in cost) {
        if (cost[resource] <= 0) {
            continue
        }
        context.fillStyle = resourceColors[resource]
        context.fillText(cost[resource] + " "+resource, boxXoffset+boxWidth*.98, boxYoffset+boxHeight*.2 + i * boxHeight*.2);
        if (i < 2) {
            resourceTextSize = Math.max(context.measureText(cost[resource] + " "+resource).width + boxWidth*.04, resourceTextSize)
        }
        i+= 1        
        
    }
    console.log(resourceTextSize,resourceTextSize)

    //Unit Title
    let fontSize = boxHeight*.3
    context.font = fontSize + "px Arial";
    context.textAlign = "left";
    context.fillStyle = "white";
    if (context.measureText(titleCase(unit)).width> boxWidth - (boxHeight+boxWidth*.02 + resourceTextSize)) {
        let CurrentSize = context.measureText(titleCase(unit)).width
        let TargetSize = boxWidth - (boxHeight+boxWidth*.02 + resourceTextSize)
        fontSize = boxHeight*.3* TargetSize/CurrentSize
        context.font = fontSize + "px Arial";
    }
    context.fillText(titleCase(unit), boxXoffset+boxHeight+boxWidth*.02, boxYoffset+fontSize+(boxHeight*.3-fontSize)/3+boxHeight*.02);


    let currentStatCount = 0 

    function drawStat(stat, text, color) {
        let width = statBoxHeight + statBoxHeight/4 + statBoxHeight*0.5*text.toString().length
        console.log("width", width)

        let xPos = boxXoffset + boxWidth*.27 + Math.floor(currentStatCount/2) * boxWidth*.15
        let yPos = boxYoffset + boxHeight*.4 + boxHeight*.3 * (currentStatCount % 2)

        context.fillStyle = color;
        context.font = (boxHeight*.25) + "px Arial";
        context.textAlign = "left";

        context.drawImage(statLogos[stat], xPos,yPos, boxHeight*.25, boxHeight*.25)
        context.fillText(text, xPos + boxHeight*.27, yPos+(boxHeight*.22))

        
        currentStatCount += 1
    }

    let health = UnitDB[unit].health || 10
    let possibleStates = UnitDB[unit].possibleStates || ['attack','move','resources'] 
    let range = UnitDB[unit].range || 1
    let speed = UnitDB[unit].speed || 1
    let attack = UnitDB[unit].attack || 2
    let defense = UnitDB[unit].defense || 2
    let unitType = UnitDB[unit].type || "trooper"
    let resourceGen = UnitDB[unit].resourceGen || {
        "gold": 2,
        "metal": 0,
        "energy": 0
    }
    drawStat("health",health,"#CEFFD7")


    if (possibleStates.includes("attack")) {
        drawStat("attack",attack,"#FF0800")
    }

    drawStat("defense",defense,"#205DFF")

    if (possibleStates.includes("move")) {
        drawStat("speed",speed,"#00F5B9")
    }
    
    drawStat("range",range,"#FFA300")

    if ((possibleStates.includes("build") && unitType == 'building') || UnitDB[unit].population != undefined) {
        let population = UnitDB[unit].population || 3
        drawStat("population",population,"#9434EB")
    }

    if (UnitDB[unit].supplies != undefined) {
        drawStat("supplies",UnitDB[unit].supplies,"#FF0")
    }

    //Resource Production
    if (possibleStates.includes("resources")) {
        fontSize = boxHeight*.16
        context.font = fontSize + "px Arial";
        context.textAlign = "right";
        

        let resourceWidths = 0
        for (let resource in resourceGen) {
            if (resourceGen[resource] <= 0) {
                continue;
            }
            context.fillStyle = resourceColors[resource];
            context.fillText("+"+resourceGen[resource], boxXoffset + boxWidth*.975-resourceWidths, boxYoffset+boxHeight*.9)
            resourceWidths += context.measureText(" +"+resourceGen[resource]).width
        }
        if (resourceWidths > 0) {
            context.fillStyle = "#FFF"
            context.font = Math.floor(fontSize*.7) + "px Arial";//Preserve font size
            context.fillText("Production:", boxXoffset + boxWidth*.975, boxYoffset+boxHeight*.9-fontSize)
        }
    }
}

//Draws a popup box describing a unit in detail
function detailedUnitInfo(unit, unit2) { //TODO more comments on this thing
    popupUnit = unit
    //defaultButtonMenu()

    let boxWidth = canvas.width * .3
    let boxHeight = boxWidth * .75

    let boxXoffset = Math.floor((canvas.width - boxWidth) / 2)
    let boxYoffset = Math.floor((canvas.height - boxHeight) / 2)

    if (canvas.height > canvas.width) {
        boxWidth = Math.floor(canvas.width * 0.9)
        boxXoffset = Math.floor(canvas.width * 0.05)

        boxHeight = Math.floor(canvas.height * 0.33)
        boxYoffset = Math.floor(canvas.height * 0.33)
    }

    context.fillStyle = "#222"
    context.fillRect(boxXoffset, boxYoffset, boxWidth, boxHeight);
    context.fillStyle = "#333"
    context.fillRect(boxXoffset+boxWidth*.6, boxYoffset, boxWidth*.4, boxHeight);

    //All the stats
    let name = unit.name
    let baseName = unit.name
    if (UnitDB[name].baseUnit != undefined) {
        baseName = UnitDB[name].baseUnit
    }
    let health = unit.health//UnitDB[unit].health || 10
    let maxHealth = unit.maxHealth//UnitDB[unit].health || 10
    let possibleStates = unit.possibleStates//UnitDB[unit].possibleStates || ['attack','move','resources'] 
    let range = unit.range//UnitDB[unit].range || 1
    let speed = unit.speed//UnitDB[unit].speed || 1
    let attack = unit.attack//UnitDB[unit].attack || 2
    let defense = unit.defense//UnitDB[unit].defense || 2
    let unitType = unit.type//UnitDB[unit].type || "trooper"
    let cost = getCost(unit.name)
    let resourceGen = unit.resourceGen || {
        "gold": 2,
        "metal": 0,
        "energy": 0
    }
    let possibleBuilds = unit.possiblebuilds || UnitDB[unit.name]['possibleBuilds'] || []
    let possibleUpgrades = unit.possibleupgrades || UnitDB[unit.name]['possibleUpgrades'] || []

    let name2, baseName2, health2, maxHealth2, possibleStates2, range2, speed2, attack2, defense2, resourceGen2, possibleBuilds2, possibleUpgrades2, cost2 = undefined
    if (unit2 != undefined) {
        name2 = unit2
        baseName2 = name2
        if (UnitDB[name2].baseUnit != undefined) {
            baseName2 = UnitDB[name2].baseUnit
        }
        health2 = UnitDB[unit2].health || 10
        maxHealth2 = UnitDB[unit2].health || 10
        possibleStates2 = UnitDB[unit2].possibleStates || ["attack","move"] // TODO: make sure this is right default 
        range2 = UnitDB[unit2].range || 1
        speed2 = UnitDB[unit2].speed || 1
        attack2 = UnitDB[unit2].attack || 2
        defense2 = UnitDB[unit2].defense || 2
        resourceGen2 = UnitDB[unit2].resourceGen || {
            "gold": 2,
            "metal": 0,
            "energy": 0
        }
        possibleBuilds2 = UnitDB[unit2]['possibleBuilds'] || []
        possibleUpgrades2 = UnitDB[unit2]['possibleUpgrades'] || []
        cost2 = getCost(unit2)
        if (baseName2 != baseName) { // unit2 is completely different unit from unit1
            console.log("IT'S THE SAME UNIT")
            name = name2
            health = health2
            maxHealth = maxHealth2
            possibleStates = possibleStates2
            range = range2
            speed = speed2
            attack = attack2
            defense = defense2
            resourceGen = resourceGen2
            possibleBuilds = possibleBuilds2
            possibleUpgrades = possibleUpgrades2
            cost = cost2
        }
    } else {
        name2 = name
        baseName2 = baseName
        health2 = health
        maxHealth2 = maxHealth
        possibleStates2 = possibleStates
        range2 = range
        speed2 = speed
        attack2 = attack
        defense2 = defense
        resourceGen2 = resourceGen
        possibleBuilds2 = possibleBuilds
        possibleUpgrades2 = possibleUpgrades
        cost2 = cost
    }

    //Tech Title
    let fontSize = boxHeight*.12
    context.font = fontSize + "px Arial";
    context.textAlign = "left";
    context.fillStyle = "white";

    let titleText = titleCase(name2)

    let costTextSize = 0
    
    console.log("here", context.measureText(titleText).width,boxWidth,boxWidth - (boxWidth*.02 + costTextSize))
    if (context.measureText(titleCase(name2)).width> boxWidth*.6 - 2 * boxWidth*.02) {
        console.log("too big")
        let CurrentSize = context.measureText(titleText).width
        let TargetSize = boxWidth*.6 - 2 * boxWidth*.02
        fontSize = fontSize * TargetSize/CurrentSize
        context.font = fontSize + "px Arial";
    }

    //Draw title
    context.fillText(titleText, boxXoffset+boxWidth*.02, boxYoffset+fontSize+(boxHeight*.12-fontSize)/3+boxHeight*.02);
    let startYAfterTitle = boxYoffset+boxHeight*.2
    
    // Main unit Image
    let image = getUnitImage(this_player, unit2)//currentTechImages[tech]
    context.imageSmoothingEnabled = true;
    context.fillStyle = "#333"
    context.fillRect(Math.floor(boxXoffset+boxWidth*.02), Math.floor(boxYoffset+boxHeight*.2), boxHeight*.3, boxHeight*.3);
    context.drawImage(image, Math.floor(boxXoffset+boxWidth*.02), Math.floor(boxYoffset+boxHeight*.2), boxHeight*.3, boxHeight*.3);
    var ImageSize = boxHeight*.3
    
    let startXAfterImage = Math.floor(boxXoffset+boxWidth*.02 + boxHeight*.3) 
    
    

    //Show PossibleBuilds Images
    let totalPossibleThings = []
    for (let possibleBuild of possibleBuilds) {
        if (possibleBuilds.includes(totalPossibleThings)) { //Don't want repeats
            continue
        }
    }
    for (let possibleBuild of possibleBuilds2) {
        if (possibleBuilds.includes(totalPossibleThings)) { //Don't want repeats
            continue
        }
    }
    for (let possibleBuild of possibleUpgrades2) {
        if (possibleBuilds.includes(totalPossibleThings)) { //Don't want repeats
            continue
        }
    }
    let numberOfSubtechs = Math.max(totalPossibleThings.length, 3)
    let xAcrossed = 3
    if (numberOfSubtechs > 9 || (numberOfSubtechs % 3 != 0 && (numberOfSubtechs % 4 == 0 || numberOfSubtechs % 4 >= numberOfSubtechs % 3))) {
        xAcrossed = 4
    }
    let i = 0
    for (let possibleBuild of possibleBuilds) { //Draw Build Icons
        let xPos = Math.floor(boxXoffset+boxWidth*.02 + (i%xAcrossed) * ImageSize/xAcrossed)
        let yPos = Math.floor(boxYoffset+boxHeight*.22 + ImageSize + (ImageSize/xAcrossed)*Math.floor(i/xAcrossed))
        let image = getUnitImage(this_player, possibleBuild)//currentTechImages[subTech]
        context.fillStyle = "#CCC"
        if (!possibleBuilds2.includes(possibleBuild)) { //Highlight Red if not included in highlight build
            context.fillStyle = "#F55"
        }
        context.fillRect(xPos, yPos, ImageSize/xAcrossed,ImageSize/xAcrossed);
        context.fillRect(xPos, yPos, ImageSize/xAcrossed,ImageSize/xAcrossed);
        if (image != null) {
            context.drawImage(image, xPos, yPos, ImageSize/xAcrossed,ImageSize/xAcrossed);
        }
        i += 1
    }
    for (let possibleBuild of possibleBuilds2) { //Find all the new things we can build
        if (possibleBuilds.includes(possibleBuild)) { //Don't want repeats
            continue
        }
        let xPos = Math.floor(boxXoffset+boxWidth*.02 + (i%xAcrossed) * ImageSize/xAcrossed)
        let yPos = Math.floor(boxYoffset+boxHeight*.22 + ImageSize + (ImageSize/xAcrossed)*Math.floor(i/xAcrossed))
        let image = getUnitImage(this_player, possibleBuild)//currentTechImages[subTech]
        context.fillStyle = "#2F2"
        context.fillRect(xPos, yPos, ImageSize/xAcrossed,ImageSize/xAcrossed);
        context.fillRect(xPos, yPos, ImageSize/xAcrossed,ImageSize/xAcrossed);
        if (image != null) {
            context.drawImage(image, xPos, yPos, ImageSize/xAcrossed,ImageSize/xAcrossed);
        }
        i += 1
    }
    for (let possibleUpgrade of possibleUpgrades2) { //Only want to show new upgrades
        let xPos = Math.floor(boxXoffset+boxWidth*.02 + (i%xAcrossed) * ImageSize/xAcrossed)
        let yPos = Math.floor(boxYoffset+boxHeight*.22 + ImageSize + (ImageSize/xAcrossed)*Math.floor(i/xAcrossed))
        let image = getUnitImage(this_player, possibleUpgrade)//currentTechImages[subTech]
        context.fillStyle = "#ffa200"
        context.fillRect(xPos, yPos, ImageSize/xAcrossed,ImageSize/xAcrossed);
        if (image != null) {
            context.drawImage(image, xPos, yPos, ImageSize/xAcrossed,ImageSize/xAcrossed);
        }
        i += 1
    }


    let currentStatCount = 0 

    function drawBasicStat(statName, stat, stat2, color) {
        if (stat != stat2) {
            if (stat2 > stat) {
                stat = stat + " + " + (stat2 - stat).toString()
            } else {
                stat = stat + " - " + (stat - stat2).toString()
            }
        }
        drawStat(statName, stat, color)
    }

    function drawStat(stat, text, color) {

        let xPos = startXAfterImage + boxWidth*.02
        let yPos = startYAfterTitle + boxHeight*.1 * (currentStatCount)

        context.fillStyle = color;
        context.font = (boxHeight*.09) + "px Arial";
        context.textAlign = "left";

        context.drawImage(statLogos[stat], xPos,yPos, boxHeight*.08, boxHeight*.08)
        context.fillText(text, xPos + boxHeight*.10, yPos+(boxHeight*.075))

        
        currentStatCount += 1
    }

    


    //Health
    if (maxHealth != maxHealth2) {
        if (maxHealth2 > maxHealth) {
            drawStat("health",health+"/"+maxHealth + " + " + (maxHealth2-maxHealth).toString(),"#CEFFD7")
        } else {
            drawStat("health",health+"/"+maxHealth + " - " + (maxHealth-maxHealth2).toString(),"#CEFFD7")
        }

    } else {
        drawStat("health",health+"/"+maxHealth,"#CEFFD7")
    }

    //Attack
    if (possibleStates2.includes("attack")) {
        drawBasicStat("attack",attack, attack2,"#FF0800")
    }

    //Defense
    drawBasicStat("defense",defense, defense2, "#205DFF")

    //Speed
    if (possibleStates2.includes("move")) {
        drawBasicStat("speed",speed, speed2,"#00F5B9")
    }
    
    //Range
    drawBasicStat("range",range, range2,"#FFA300")

    //Population
    if ((possibleStates2.includes("build") && unitType == 'building') || unit.population != undefined) {
        let population = unit.population
        let maxPopulation = unit.maxPopulation
        let maxPopulation2 = undefined
        if (unit2 != undefined) {
            maxPopulation2 = UnitDB[unit2].population || 3
        } else {
            maxPopulation2 = maxPopulation
        }
        if (maxPopulation != maxPopulation2 && baseName == baseName2) {
            if (maxPopulation2 > maxPopulation) {
                
                drawStat("population",population+"/"+maxPopulation + " + " + (maxPopulation2-maxPopulation).toString(),"#9434EB")
            } else {
                drawStat("population",population+"/"+maxPopulation + " - " + (maxPopulation-maxPopulation2).toString(),"#9434EB")
            }

        } else {
            drawStat("population",population+"/"+maxPopulation,"#9434EB")
        }
    }

    if (unit.supplies != undefined) {
        let supplies = unit.supplies
        let maxSupplies = unit.maxSupplies
        let maxSupplies2 = undefined
        if (unit2 != undefined) {
            maxSupplies2 = UnitDB[unit2].supplies || 0
        } else {
            maxSupplies2 = maxSupplies
        }
        if (maxSupplies != maxSupplies2  && baseName == baseName2) {
            if (maxSupplies2 > maxSupplies) {
                
                drawStat("supplies",unit.supplies+"/"+unit.maxSupplies + " + " + (maxSupplies2-maxSupplies).toString(),"#FF0")
            } else {
                drawStat("supplies",unit.supplies+"/"+unit.maxSupplies + " - " + (maxSupplies-maxSupplies2).toString(),"#FF0")
            }

        } else {
            drawStat("supplies",unit.supplies+"/"+unit.maxSupplies,"#FF0")
        }
    } else if (UnitDB[unit2].supplies != undefined) {
        drawStat("supplies","+"+UnitDB[unit2].supplies,"#FF0")
    }


    //List Abilities (if the unit has any)
    let currentInfoBoxStartHeight = boxYoffset
    let infoBoxStartX = boxXoffset + boxWidth*.6
    let infoBoxWidth = boxWidth*.4

    if (Object.keys(unit.abilities).length > 0) {
        context.fillStyle = "#222"
        context.fillRect(infoBoxStartX, currentInfoBoxStartHeight, infoBoxWidth, boxHeight*.1);
        

        context.font = Math.floor(boxHeight*.09) + "px Arial";
        context.textAlign = "center";
        context.fillStyle = "white";
        console.log(infoBoxStartX + infoBoxWidth*.10, currentInfoBoxStartHeight+(boxHeight*.075))
        context.fillText("Abilities", infoBoxStartX + infoBoxWidth*.5, currentInfoBoxStartHeight+(boxHeight*.08))

        currentInfoBoxStartHeight = currentInfoBoxStartHeight + boxHeight*.1

        //Set font and color for all ability rows
        context.font = Math.floor(boxHeight*.06) + "px Arial";
        context.textAlign = "left";

        let i = 0
        for (let ability in unit.abilities) {
            context.fillStyle = (i%2 == 0) ? "#444" : "#383838";
            context.fillRect(infoBoxStartX, currentInfoBoxStartHeight, infoBoxWidth, boxHeight*.08);

            context.fillStyle = "white";
            context.fillText(ability, infoBoxStartX + infoBoxWidth*.02, currentInfoBoxStartHeight+(boxHeight*.06))

            currentInfoBoxStartHeight = currentInfoBoxStartHeight + boxHeight*.08
            i++;
        }

    }

    if (possibleStates.includes("resources")) {
        context.fillStyle = "#222"
        context.fillRect(infoBoxStartX, currentInfoBoxStartHeight, infoBoxWidth, boxHeight*.1);
        

        context.font = Math.floor(boxHeight*.09) + "px Arial";
        context.textAlign = "center";
        context.fillStyle = "white";
        console.log(infoBoxStartX + infoBoxWidth*.10, currentInfoBoxStartHeight+(boxHeight*.075))
        context.fillText("Production", infoBoxStartX + infoBoxWidth*.5, currentInfoBoxStartHeight+(boxHeight*.08))

        currentInfoBoxStartHeight = currentInfoBoxStartHeight + boxHeight*.1

        //Set font and color for all ability rows
        context.font = Math.floor(boxHeight*.06) + "px Arial";
        context.textAlign = "left";

        let i = 0
        for (let resource in resourceGen) {
            if (resourceGen[resource] <= 0 && (!((resource in resourceGen2) && resourceGen2[resource] > 0))) {
                continue
            }
            context.fillStyle = (i%2 == 0) ? "#444" : "#383838";
            context.fillRect(infoBoxStartX, currentInfoBoxStartHeight, infoBoxWidth, boxHeight*.07);

            context.fillStyle = resourceColors[resource];
            let text = "+"+resourceGen[resource]+" "+resource
            if (resource in resourceGen2) {
                if (resourceGen[resource] != resourceGen2[resource]) {
                    text = "+"+resourceGen[resource]+" ("+resourceGen2[resource]+") "+resource
                }
            } else (
                text = "+"+resourceGen[resource]+" (0) "+resource 
            )
            context.fillText(text, infoBoxStartX + infoBoxWidth*.02, currentInfoBoxStartHeight+(boxHeight*.055))

            currentInfoBoxStartHeight = currentInfoBoxStartHeight + boxHeight*.07
            i++;
        }
    }

    if (true) { //All units should have cost
        context.fillStyle = "#222"
        context.fillRect(infoBoxStartX, currentInfoBoxStartHeight, infoBoxWidth, boxHeight*.1);
        

        context.font = Math.floor(boxHeight*.08) + "px Arial";
        context.textAlign = "center";
        context.fillStyle = "white";
        console.log(infoBoxStartX + infoBoxWidth*.10, currentInfoBoxStartHeight+(boxHeight*.07))
        context.fillText("Cost", infoBoxStartX + infoBoxWidth*.5, currentInfoBoxStartHeight+(boxHeight*.07))

        currentInfoBoxStartHeight = currentInfoBoxStartHeight + boxHeight*.09

        //Set font and color for all ability rows
        context.font = Math.floor(boxHeight*.06) + "px Arial";
        context.textAlign = "left";

        let i = 0
        for (let resource in cost2) {
            context.fillStyle = (i%2 == 0) ? "#444" : "#383838";
            context.fillRect(infoBoxStartX, currentInfoBoxStartHeight, infoBoxWidth, boxHeight*.07);

            context.fillStyle = resourceColors[resource];
            context.fillText(cost2[resource]+" "+resource, infoBoxStartX + infoBoxWidth*.02, currentInfoBoxStartHeight+(boxHeight*.055))

            currentInfoBoxStartHeight = currentInfoBoxStartHeight + boxHeight*.07
            i++;
        }
    }

    if (unit2 != undefined) {
        let buttonColor = "#1090FF"
        if (selected.state == "upgrade" && selected.stateData == unit2) {
            buttonColor = "#10DD30"
        } else if (!checkIfAffordable(unit2)) {
            buttonColor = "#FF6060"
        }

        //"Upgrade" button
        let buttonwidth = context.measureText("Upgrade").width;
        upgradeButton = new Button(boxXoffset + boxWidth - boxWidth*.02 - buttonwidth * 1.8, 
            boxYoffset+boxHeight - boxHeight*.10 - boxHeight*.02, buttonwidth * 1.8, 
            boxHeight*.1, buttonColor, "Upgrade", trueUpgradeButtonClicked);
        upgradeButton.name = tempStateData;
        console.log("upgradeButton", upgradeButton.name)
        ButtonCollection["upgrade_button"] = upgradeButton
        upgradeButton.render()
    }


    //"Back" button
    buttonwidth = context.measureText("Back").width;
    backButton = new Button(boxXoffset + boxWidth*.02, boxYoffset+boxHeight - boxHeight*.10 - boxHeight*.02, buttonwidth * 1.8, boxHeight*.1, "#555", "Back", clearSelected);
    ButtonCollection["back_button"] = backButton
    backButton.render()

    context.imageSmoothingEnabled = true;
}


//Writes text as a dictionary (from stackoverflow)
function wrapText(context, text, x, y, maxWidth, fontSize, fontFace, italicsBold = ""){
    var words = text.split(' ');
    var line = '';
    var lineHeight=fontSize;
  
    context.font = italicsBold + " " + fontSize + "px " + fontFace;
  
    for(var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = context.measureText(testLine);
      var testWidth = metrics.width;
      if(testWidth > maxWidth) {
        context.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      }
      else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
    return(y);
}

//Capitalizes each word in a string (from stackoverflow)
function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        if (splitStr[i] == "ii" || splitStr[i] == "iii" || splitStr[i] == "iv") {
            splitStr[i] = splitStr[i].toUpperCase();
        } else {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);   
        }
    }
    return splitStr.join(' '); 
}



function createCardButtons(hand) {

    let btnCount = hand.length

    let btnSize = 50
    if (canvas.height > canvas.width && canvas.width*canvas.height > 1000000) {
        btnSize = 120
    }

    let currentButtonHeight = 0
    let combinedHeight = btnCount*btnSize + (btnCount-1)*btnSize*.2
    let btnHeightStart = Math.floor(canvas.height*.5 - combinedHeight/2) 
    if (btnHeightStart < resourceBoxHeight + statBoxHeight) {
        while (btnHeightStart < resourceBoxHeight + statBoxHeight && btnSize > 20) {
            btnSize -= 10
            combinedHeight = btnCount*btnSize + (btnCount-1)*btnSize*.2 + buttonLabelSize
            btnHeightStart = Math.floor(canvas.height*.5 - combinedHeight/2)
        }
    }

    buildButtons = []
    let color = (255,255,255)
    for (let card of hand) {
        let newBuildButton = new Button(0, btnHeightStart + currentButtonHeight, btnSize, btnSize, color, "", buildButtonClicked);
        newBuildButton.name = card
        newBuildButton.parameters = newBuildButton;
        newBuildButton.addImage(getUnitImage(this_player, card));
        buildButtons.push(newBuildButton);
        //i++;
        currentButtonHeight += btnSize * 1.2;
    }
}

function findStartSpot(pattern) {
    for (let y=0; y<pattern.length; y++) {
        for (let x=0; x<pattern[0].length; x++) {
            if (pattern[y][x] == 'S') {
                return [x,y]
            }
        }
    }
    return null
}

function findPatternPoints(pattern, pos) {
    let startOffset = findStartSpot(pattern)
    let offsetX = pos[0]-startOffset[0]
    let offsetY = pos[1]-startOffset[1]

    let points = []
    for (let y=0; y<pattern.length; y++) {
        for (let x=0; x<pattern[0].length; x++) {
            if (pattern[y][x] == 'X') {
                if (x >= 0 && x < gameObject.width && y >= 0 && y < gameObject.height) {
                    points.push([x+offsetX,y+offsetY])
                }
            }
        }
    }
    return points
}