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


function getUnitImage(player, name) {
    if (!(player in unitImages)) {
        unitImages[player] = {};
    }
    if (!(name in unitImages[player])) {
        if (!(name in baseUnitImages)) {
            let img = new Image(size, size);
            console.log("requesting image " + name);
            img.src = '/static/assets/' + name + '.png';

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
    for (let y = 0; y < gameObject.height; y++) {
        let l = []
        let l2 = []
        for (let x = 0; x < gameObject.width; x++) {
            l.push(true)
            l2.push(true)
            CloudColors.push(randomDark())
            let BoardColor = hexToRGB(BoardColors[x+y*gameObject.width])
            CloudColors2.push(rgbToHex(BoardColor[0]/2, BoardColor[1]/2,BoardColor[2]/2)) //TODO, make it so it is half the value of board color
        }
        cloudGrid.push(l)
        explorationGrid.push(l2)
    }
}

function updateCloudCover() {
    cloudGrid = [];
    for (let y = 0; y < gameObject.height; y++) {
        let l = []
        for (let x = 0; x < gameObject.width; x++) {
            l.push(true)
        }
        cloudGrid.push(l)
    }
    for (let unit of gameObject.units[this_player]) {
        spaces = getRangeCircles(unit,true)
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
    for (let y = 0; y < gameObject.height; y++) {
        for (let x = 0; x < gameObject.width; x++) {
            if (explorationGrid[y][x]) {
                let tileColor = CloudColors[x + gameObject.width * y]
                context.fillStyle = tileColor;
                context.fillRect(x * size + x_offset, y * size + y_offset, size, size);
            } else if (cloudGrid[y][x]) {
                let tileColor = CloudColors2[x + gameObject.width * y]
                context.fillStyle = tileColor;
                context.fillRect(x * size + x_offset, y * size + y_offset, size, size);
            }
            
        }
    }
}