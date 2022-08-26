function thing() {
    console.log("HI BUDDY");
}

let baseUnitImages = {};
let unitImages = {};
//const playerColors = [[201, 59, 54, 255], [0, 195, 255], [255, 136, 0, 255], [41, 61, 148],
//[128, 242, 46], [169, 88, 245], [255, 255, 64], [18, 252, 104]]
const playerColors = [[219, 20, 13, 255], [0, 195, 255], [255, 116, 27, 255], [9, 48, 224],
[128, 242, 46], [169, 88, 245], [255, 255, 64], [18, 252, 104]];
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

function getUnitImage(player, name) {
    if (!(player in unitImages)) {
        unitImages[player] = {};
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
                unitImages = [];
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
        createShadow(unitCanvas)

        unitImages[player][name] = ctx.canvas;
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
        if (unit.state == "resources" && unit != unitToIgnore) {
            resources[unit.stateData] += unit.resourceGen[unit.stateData]
        } else if (unit.state == "build" && unit != unitToIgnore) {
            cost = getCost(unit.stateData[1])
            for (let r in cost) {
                resources[r] -= cost[r]
            }
        }
    }

    //Also need to deal with resources with researching

    return resources;
}

function checkIfAffordable(unitName, effectiveResources) {
    let cost = getCost(unitName);
    for (let r in cost) {
        if (effectiveResources[r] < cost[r]) {
            return false;
        }
    }
    return true;
}

function initClouds() {
    CloudColors = [];
    CloudColors2 = []
    cloudGrid = [];
    explorationGrid = []
    cloudType = gameObject.mode
    for (let y = 0; y < gameObject.height; y++) {
        let l = []
        let l2 = []
        for (let x = 0; x < gameObject.width; x++) {
            l.push(true)
            l2.push(true)
            if (cloudType == "halo") {
                CloudColors2.push(randomDark())
                let BoardColor = hexToRGB(BoardColors[x + y * gameObject.width])
                CloudColors.push(rgbToHex(BoardColor[0] / 2, BoardColor[1] / 2, BoardColor[2] / 2))
            } else if (cloudType == "poly") {
                CloudColors.push(randomWhite())
            }

        }
        cloudGrid.push(l)
        explorationGrid.push(l2)
    }
}

function updateCloudCover() {
    if (cloudType == "halo") {
        cloudGrid = [];
        for (let y = 0; y < gameObject.height; y++) {
            let l = []
            for (let x = 0; x < gameObject.width; x++) {
                l.push(true)
            }
            cloudGrid.push(l)
        }
    }
    for (let unit of gameObject.units[this_player]) {
        spaces = getRangeCircles(unit, true)
        for (let pos of spaces) {
            if (cloudGrid[pos[1]][pos[0]]) {
                cloudGrid[pos[1]][pos[0]] = false
            }
            if (explorationGrid[pos[1]][pos[0]]) {
                explorationGrid[pos[1]][pos[0]] = false
            }
        }
    }
}

function drawClouds() {
    if (cloudType == "clear") {
        return
    }
    for (let y = 0; y < gameObject.height; y++) {
        for (let x = 0; x < gameObject.width; x++) {
            if (cloudType == "halo" && explorationGrid[y][x]) {
                let tileColor = CloudColors2[x + gameObject.width * y]
                context.fillStyle = tileColor;
                context.fillRect(x * size + x_offset, y * size + y_offset, size, size);
            } else if (cloudGrid[y][x]) {
                let tileColor = CloudColors[x + gameObject.width * y]
                context.fillStyle = tileColor;
                context.fillRect(x * size + x_offset, y * size + y_offset, size, size);
            }

        }
    }
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


    x_offset = (canvas.width - (size*(maxX-minX+1)))/2 - size * minX
    y_offset = (canvas.height - (size*(maxY-minY+1)))/2 - size * minY
}

function GetUnlockedTechs() {
    let techs = []
    for (let t of gameObject.tech[this_player]) {
        for (let t2 of TechDB[t]["unlocks"]) {
            if (!(techs.includes(t2))) {
                techs.push(t2)
            }
        }
    }

    //let starters = ['improvements', 'recruitment', 'armament', 'aviation']
    for (let t of starters) {
        if (!techs.includes(t)) {
            techs.push(t)
        }
    }
    let toRemove = []
    for (let t of gameObject.tech[this_player]) {
        if (TechDB[t].deny != undefined) {
            for (let t2 in TechDB[t].deny) {
                if (techs.includes(t2)) {
                    toRemove.push(t2)
                }
            }
        }
    }
    for (let t of toRemove) {
        const index = techs.indexOf(5)
        techs.splice(index, 1)
    }
    return techs
}

//Tree is the tech that starts the tree, key is current tech, and n is layer of tree
function getTreeSizes(tree, key, n = 0) {
    //currentTechMenu, treeSizes, treeOffsets
    if (TechDB[key]["unlocks"] == []) {
        if (treeSizes[tree].length <= n) {
            while (treeSizes[tree].length <= n) {
                treeSizes[tree].push([])
                treeOffsets[tree].push(0)
            }
        }
        treeSizes[tree][n].append(1)
        return 1
    } else {
        let total = 0
        if (gameObject.tech[this_player].includes(key) || currentTechMenu.includes(key)) {
            for (let subTech of TechDB[key]["unlocks"]) {
                total += getTreeSizes(tree, subTech, n + 1)
            }
        }
        if (total == 0) {
            if (treeSizes[tree].length <= n) {
                while (treeSizes[tree].length <= n) {
                    treeSizes[tree].push([])
                    treeOffsets[tree].push(0)
                }
            }
            total = 1
        }
        treeSizes[tree][n].push(total)
        return total
    }
}

//Tree is the tech that starts the tree, key is current tech, and n is layer of tree
function placeBoxes(tree, key, n = 0) {
    //boxPlacements, treeOffsets
    let noSubtrees = true
    if (gameObject.tech[this_player].includes(key) || currentTechMenu.includes(key)) {
        for (let subTech of TechDB[key]["unlocks"]) {
            noSubtrees = false
            placeBoxes(tree, subTech, n + 1)
        }
    }
    boxPlacements[tree].push([[treeOffsets[tree][n] + treeSizes[tree][n][0] / 2.0 - 0.5, n], key])
    console.log(treeOffsets[tree][n] + treeSizes[tree][n][0] / 2.0 - 0.5, n, key)
    console.log(treeOffsets[tree])
    console.log(treeSizes[tree])
    treeOffsets[tree][n] += treeSizes[tree][n][0]
    if (noSubtrees) {
        for (let i = n + 1; i < treeSizes[tree].length; i++) {
            treeOffsets[tree][i] += treeSizes[tree][n][0]
        }
    }
    treeSizes[tree][n].shift() //Look right here to for fixing
    console.log(treeOffsets[tree])
    console.log(treeSizes[tree])
}

function drawLinesHelper(key, d, treeXOffset, treeYOffset) {
    let extraX = -2
    let extraY = -2
    if (gameObject.tech[this_player].includes(key) || currentTechMenu.includes(key)) {
        for (let subTech of TechDB[key]["unlocks"]) {
            drawLinesHelper(subTech, d, treeXOffset, treeYOffset)
        }
        for (let subTech of TechDB[key]["unlocks"]) {
            let x1 = d[key][0][0] + treeXOffset
            let y1 = d[key][0][1] + treeYOffset
            let x2 = d[subTech][0][0] + treeXOffset
            let y2 = d[subTech][0][1] + treeYOffset
            let ColorOfLine = "#FFFFFF"

            context.strokeStyle = ColorOfLine;
            context.lineWidth = techSize / 8;

            context.beginPath();
            context.moveTo(
                Math.floor((x1 + 0.5) * (techSize + 1) + 1 + extraX + x_offset),
                Math.floor((y1*mult + 0.5) * (techSize + 1) + 1 + extraY + y_offset),
            );
            context.lineTo(
                Math.floor((x2 + 0.5) * (techSize + 1) + 1 + extraX + x_offset),
                Math.floor((y2*mult + 0.5) * (techSize + 1) + 1 + extraY + y_offset),
            );
            context.stroke();
        }
    }
}

function drawLines(tree, treeXOffset, treeYOffset) {
    d = {}
    for (let key of boxPlacements[tree]) {
        if (!(key[1] in d)) {
            d[key[1]] = []
        }
        d[key[1]].push(key[0])
    }
    drawLinesHelper(tree, d, treeXOffset, treeYOffset)
}

let currentTechMenu = []
let currentTechImages = {}
let currentTechImagesInverted = {}
let currentTechButtons = {}
let currentlyResearch = false
let redrawResearch = false
let PrevTechHover = null
let CurrentTechHover = null
let knownTechHover = null
let treeSizes = {}
let treeOffsets = {}
let boxPlacements = {}
let treeWidth = {}
let treeHeight = {}
let techSize = 60
let mult = 1.5
const starters = ['improvements','recruitment','armament','aviation']


function researchMenu() {
    let techs = GetUnlockedTechs()
    //if (techs == currentTechMenu && currentlyResearch && knownTechHover == CurrentTechHover) {
    if (currentlyResearch && knownTechHover == CurrentTechHover && !redrawResearch) {
    
        console.log("it passed")
        return
    }
    knownTechHover = CurrentTechHover
    currentlyResearch = true
    currentTechMenu = techs

    if (redrawResearch == false) {
        treeSizes = {}
        treeOffsets = {}
        boxPlacements = {}  
        treeWidth = {}
        treeHeight = {}
        for (let tech of starters) {
            treeSizes[tech] = [] //initilize each tree
            treeOffsets[tech] = [] //initilize each tree
            boxPlacements[tech] = [] //initilize each tree
            getTreeSizes(tech, tech)
            treeWidth[tech] = treeSizes[tech][0][0]
            placeBoxes(tech,tech)
            treeHeight[tech] = treeSizes[tech].length
            
        }

        console.log("_______")
        console.log(boxPlacements)
        console.log(treeSizes)
        console.log(treeOffsets)

    }
    redrawResearch = false
    //let size = Math.floor(techSize)
    techSize = size

    currentTechButtons = {}
    /*
    let w = Math.ceil(Math.sqrt(techs.length))
    if (w == 0) {
        w = 1
    }
    */
    clearBoard()

    context.fillStyle = "#101010";
    context.fillRect(x_offset, y_offset, gameObject.width*size,  gameObject.height*size);
    //context.fillRect(0, 0, canvas.width, canvas.height);

    let maybeDeny = []
    if (CurrentTechHover != null) {

        maybeDeny = TechDB[CurrentTechHover].deny || []
    }

    let treeXOffset = 0
    let treeYOffset = 0

    let extraX = 0
    let extraY = 0    

    context.imageSmoothingEnabled = false;

    let j = 0
    for (let key in boxPlacements) {
        if (j == 1) {
            console.log("end of row 1")
            treeXOffset = 0
            let k = 0
            for (let key2 in treeWidth) { //Add up two layers of trees. [0] is the top layer, [1] is the bottom layer
                if (k==0) {
                    treeYOffset = Math.max(treeYOffset, treeHeight[key2])
                } else {
                    break
                }
                k += 1
            }
        }

        drawLines(key, treeXOffset, treeYOffset)
        
        for (let techPlacement of boxPlacements[key]) {
            let t = techPlacement[1]
            let x = techPlacement[0][0] + treeXOffset
            let y = techPlacement[0][1] + treeYOffset

            const xPos = x*(techSize+1)-1+extraX+x_offset
            const yPos = y*(Math.floor(mult*techSize)+1)-1+extraY+y_offset

            if (!(t in currentTechImages)) {
                currentTechImages[t] = null
                let img = new Image(20, 20);
                console.log("requesting image " + t);
                img.src = '/static/techAssets/' + t.replaceAll(" ", "_") + '.png';

                img.onload = function () {
                    img.setAttribute('crossOrigin', '');
                    img.crossOrigin = "Anonymous";
                    currentTechImages[t] = img;

                    console.log("recieved image " + t);

                    let techCanvas = document.createElement('canvas');
                    techCanvas.setAttribute('width', 20);
                    techCanvas.setAttribute('height', 20);
                    let ctx = techCanvas.getContext('2d');
                    ctx.imageSmoothingEnabled = false;
                    ctx.drawImage(img, 0, 0, 20, 20);
                    invertTechImage(techCanvas)
                    currentTechImagesInverted[t] = ctx.canvas;
                }
            }

            if (gameObject.tech[this_player].includes(t)) {
                context.fillStyle = "#FFFFFF";
                context.fillRect(xPos-techSize*0.04, yPos-techSize*0.04, techSize*1.08, techSize*1.08);
            }
            

            let button = new Button(xPos, yPos, techSize, techSize, "#555555", "", researchButtonClicked);
            button.name = t
            button.parameters = button
            if (t in currentTechImages && currentTechImages[t] != null) {
                button.img = currentTechImages[t]
                if (t == CurrentTechHover) {
                    button.img = currentTechImagesInverted[t]
                }
            }
            if (!currentTechMenu.includes(t)) {
                button.foreground = "#00000088"
            } else if (maybeDeny.includes(t)) {
                button.foreground = "#000000BB"
            }

            currentTechButtons[t] = button
            button.render()
        }

        treeXOffset += treeWidth[key]
        j+=1
    }

    context.imageSmoothingEnabled = true;
}