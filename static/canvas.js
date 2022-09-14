let jsonText = '{"units":{"0":[{"name":"town","parent":null,"type":"building","possibleStates":["resources","build","research"],"state":null,"stateData":null,"speed":1,"range":1,"attack":2,"defense":2,"maxHealth":50,"health":50,"UnitID":"0","score":450,"resourceGen":{"gold":10,"metal":10,"energy":10},"abilities":{"costly":1.75},"position":[3,3],"population":0,"maxPopulation":4}],"1":[{"name":"bot fortress","parent":null,"type":"building","possibleStates":["resources","build"],"state":null,"stateData":null,"speed":1,"range":1,"attack":2,"defense":3,"maxHealth":50,"health":50,"UnitID":"1","score":300,"resourceGen":{"gold":0,"metal":20,"energy":20},"abilities":{},"position":[3,15],"population":0,"maxPopulation":4}],"2":[{"name":"town","parent":null,"type":"building","possibleStates":["resources","build","research"],"state":null,"stateData":null,"speed":1,"range":1,"attack":2,"defense":2,"maxHealth":50,"health":50,"UnitID":"2","score":450,"resourceGen":{"gold":10,"metal":10,"energy":10},"abilities":{"costly":1.75},"position":[9,9],"population":0,"maxPopulation":4}],"3":[{"name":"plant base","parent":null,"type":"building","possibleStates":["resources","build"],"state":null,"stateData":null,"speed":1,"range":1,"attack":2,"defense":2,"maxHealth":8,"health":8,"UnitID":"3","score":200,"resourceGen":{"energy":10},"abilities":{"deathSpawn":"mad plant base"},"position":[15,3],"population":0,"maxPopulation":3}],"4":[{"name":"plant base","parent":null,"type":"building","possibleStates":["resources","build"],"state":null,"stateData":null,"speed":1,"range":1,"attack":2,"defense":2,"maxHealth":8,"health":8,"UnitID":"4","score":200,"resourceGen":{"energy":10},"abilities":{"deathSpawn":"mad plant base"},"position":[15,15],"population":0,"maxPopulation":3}]},"resources":{"0":{"gold":20,"metal":0,"energy":0},"1":{"gold":20,"metal":0,"energy":0},"2":{"gold":20,"metal":0,"energy":0},"3":{"gold":20,"metal":0,"energy":0},"4":{"gold":20,"metal":0,"energy":0}},"went":{"0":false,"1":true,"2":true,"3":true,"4":true},"tech":{"0":[],"1":[],"2":[],"3":[],"4":[]},"scores":{"0":0,"1":0,"2":0,"3":0,"4":0},"progress":{"0":{},"1":{},"2":{},"3":{},"4":{}},"botmode":[],"ready":true,"started":true,"turn":0,"id":0,"mode":"halo","allai":false,"width":19,"height":19,"ai":4,"targetPlayers":4,"intGrid":[255,255,248,127,14,7,192,192,248,24,31,3,1,192,112,16,31,199,31,253,183,255,227,255,246,223,252,113,252,4,7,1,192,96,124,12,15,129,129,240,56,127,15,255,255,128]}';
let gameObject = JSON.parse(jsonText)
let gameObject2 = null;
let ButtonCollection = {};
let doneButton;
let logoutButton;
let outOfDate = false;
let currentTurn = -1;
let territoryMap = []
let territoryNumberCode = []
let animationInterval = false;
let animationCounter = -1;
let animationMax = 30;
let animationTerritoryMap = [];

class Button {
    constructor(x, y, width, height, color, text, func, ...parameters) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.color = color;
        this.text = text;
        this.func = func;
        this.parameters = parameters;
    }

    addImage(img) {
        this.img = img;
    }

    render() {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
        let fontSize = this.height - 2
        context.font = fontSize + "px Arial";
        context.fillStyle = this.textColor || "white";
        context.textAlign = "center";
        context.fillText(this.text, this.x + Math.floor(this.width / 2), this.y + Math.floor(this.height * .8) + 2);
        if (this.hasOwnProperty('img') && this.img != null) {
            context.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
        if (this.hasOwnProperty('foreground')) {
            context.fillStyle = this.foreground;
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    potentialMouseClick(mouseX, mouseY) {
        if (mouseX >= this.x && mouseX < this.x + this.width && mouseY >= this.y && mouseY < this.y + this.height) {
            this.func(this.parameters)
            return true;
        }
        return false;
    }
    isMouseHovering(mouseX, mouseY) {
        return mouseX >= this.x && mouseX < this.x + this.width && mouseY >= this.y && mouseY < this.y + this.height
    }
}

function httpPostAsync(theUrl, data) {
    var xmlHttp = new XMLHttpRequest();
    //var data = JSON.stringify({"data": data});
    xmlHttp.open("POST", theUrl, true);
    xmlHttp.send(data);
}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function endTurn() {
    callback = function (responseText) {
        jsonText = responseText;
        newGameObject = JSON.parse(jsonText)
        clearSelected()
        useNewGameObject(newGameObject)
        /*
        if (gameObject.intGrid.join(',') !== newGameObject.intGrid.join(',')) {
            gameObject = newGameObject;
            generateGrid()
            generateBoardColors();
            initClouds()
        }
        gameObject = newGameObject;
        clearSelected()
        updateCloudCover()
        drawBoard()
        */
    }
    httpGetAsync(location.protocol+"//" + window.location.host + "/done/"+this_game+"/"+this_player, callback);
}


//Sets up a new gameObject
function useNewGameObject(newGameObject) {
    if (gameObject.intGrid.join(',') !== newGameObject.intGrid.join(',')) {
        gameObject = newGameObject;
        initilizeOffsets()
        generateGrid()
        generateBoardColors();
        initClouds()
    }
    //if (outOfDate && currentTurn == newGameObject.turn) {
    if (outOfDate) {
        return //Don't render if this is outofdate to recent info sent to server
        //Just wait for the next request.
    }
    if (animationCounter >= 0) { // animationCounter < 0 makes sure not already animating
        return
    }
    if (currentTurn != -1 && newGameObject.turn > currentTurn) { 
        console.log("entering animation")
        animationInterval = window.setInterval(drawAnimation, 33);
        animationCounter = 0
        gameObject2 = newGameObject;
        setAnimateSpeed(gameObject,gameObject2)
        determineAnimationTerritories(gameObject,gameObject2)
        return
    }
    gameObject = newGameObject;
    currentTurn = gameObject.turn;
    //clearSelected()
    if (selected) {
        let newSelected = getUnitByID(selected.UnitID)
        //newSelected.state = selected.state
        newSelected.stateData = selected.stateData
        selected = newSelected
    }
    console.log("reinit stuff")
    determineTerritories()
    organizeTechTrees()
    initilizeTechOffsets()
    updateCloudCover()
    drawBoard()
}

function loadGame() {
    callback = function (responseText) {
        jsonText = responseText;
        newGameObject = JSON.parse(jsonText)
        useNewGameObject(newGameObject)
    }
    outOfDate = false
    httpGetAsync(location.protocol+"//" + window.location.host + "/get_game/"+this_game, callback);
}

//Takes state data and applies it to current Game
function setState(data) {
    let split = data.split(':')
    let unit = getUnitByID(split[0])
    if (unit == null) { //Unit doesn't exist (incorrect state file I think)
        return
    }
    if (selected == unit) {
        return //Don't want to reset the state of selected
    }
    let state = split[1]
    let stateData = split[2]
    if (state == 'move') {
        stateData = [parseInt(split[2]),parseInt(split[3])]
    } else if (state == 'attack') {
        stateData = getUnitByID(split[2])
    } else if (state == 'heal') {
        stateData = getUnitByID(split[2])
    } else if (state == 'build') {
        stateData = [[parseInt(split[2]),parseInt(split[3])],split[4]]
    } else if (state == 'transport') {
        stateData = [[parseInt(split[2]),parseInt(split[3])],split[4]]
    } else if (state == 'transport') {
        state = null
        stateData = null
    }
    
    unit.state = state
    unit.stateData = stateData
}

//Gets state data and updates game if a gameobject is sent here from server
function loadGame2() {
    callback = function (responseText) {
        jsonText = responseText;
        states = JSON.parse(jsonText)
        if (states.units != undefined) {
            //Its not states, its a game object!
            outOfDate = false
            useNewGameObject(states)
            return
        }

        if (this_player in states) {
            for (let key in states[this_player]) {
                setState(key + ":"+states[this_player][key])
            }
        }
        

        drawBoard()
    }
    outOfDate = false
    //httpGetAsync(location.protocol+"//" + window.location.host + "/get_states", callback);
    httpGetAsync(location.protocol+"//" + window.location.host + "/get_states/"+this_game+"/"+currentTurn, callback);
}

function logout() {
    window.location.href = location.protocol+"//" + window.location.host+"/logout"
    return
    this_player += 1
    this_player %= Object.keys(gameObject.units).length
    console.log("this_player",this_player, gameObject.units.length)
    loadGame()
    //drawBoard()
}

function sendToServer(text) {
    outOfDate = true
    console.log("sending to server: " + text)
    httpPostAsync(location.protocol+"//" + window.location.host + "/action/"+this_game, text);
}

function convertToStr(u, state, stateData) {
    let s = u.UnitID + ':' + state + ':';
    if (state == 'move') {
        s += stateData[0] + ':' + stateData[1]
    } else if (state == 'attack') {
        s += stateData.UnitID
    } else if (state == 'heal') {
        s += stateData.UnitID
    } else if (state == 'resources') {
        s += stateData
    } else if (state == 'research') {
        s += stateData
    } else if (state == 'build') {
        s += stateData[0][0] + ':' + stateData[0][1] + ":"
        s += stateData[1]
    } else if (state == 'transport') {
        s += stateData[0][0] + ':' + stateData[0][1] + ":"
        s += stateData[1]
    }
    return s
}



function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}


function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRGB(hex) {
    return [
        parseInt(hex.slice(1,3), 16), 
        parseInt(hex.slice(3,5), 16),
        parseInt(hex.slice(5,7), 16)
    ]
}

function randomGreen() {
    let g = Math.random() * 50 + 150;
    return rgbToHex(Math.floor(g * Math.random() * 0.5), Math.floor(g), Math.floor(g * Math.random() * 0.5));
}
function randomYellow() {
    let y = Math.random() * 55 + 175;
    return rgbToHex(Math.floor(y), Math.floor(y * (Math.random() * 0.15 + .65)), Math.floor(y * Math.random() * 0.15));
}
function randomBlue() {
    let b = Math.random() * 30 + 180;
    return rgbToHex(Math.floor(b * Math.random() * 0.2), Math.floor(b * Math.random() * 0.25 + .5), Math.floor(b));
}

function randomBlueWeighted(x) {
    let base = 13;
    let sub = ((base) * (base + 1)) / 2 - ((base - x) * ((base - x) + 1)) / 2;
    if (x > base) {
        sub = ((base) * (base + 1)) / 2 + x - base;
    }
    sub = Math.floor(sub)
    let g = Math.max(0, 180 - sub)
    let b = Math.max(0, 180 - Math.floor(sub / 2))
    return rgbToHex(Math.floor(b * Math.random() * .1 + .1), Math.floor(g * (Math.random() * .125 + .625)), b)
}

function randomDark() {
    let g = Math.random() * 50;
    return rgbToHex(Math.floor(g), Math.floor(g), Math.floor(g));
}
function randomWhite() {
    let g = Math.random() * 35 + 210;
    return rgbToHex(Math.floor(g), Math.floor(g), Math.floor(g + Math.random() * 20));
}

var canvas// = document.getElementById("myCanvas");
let is_dragging = false;
let maybe_dragging = false;
let drag_click = false;
let forceTouchEnabled = false;
let startX;
let startY;
let startX_offset;
let startY_offset;
let true_startX;
let true_startY;
let true_startX_offset;
let true_startY_offset;
let x_offset = 0;
let y_offset = 0;
let size = 20;
let zoom_distance;
let start_size = 20;

let this_player = 0;
let this_game = 0;
let selected = null;

var context;// = canvas.getContext('2d');
let fontSize = Math.floor(size / 2);

function clearBoard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

let BlueCircle = new Image(40, 40)
BlueCircle.src = '/static/assets/MoveCircle.png'
let OrangeHex = new Image(40, 40)
OrangeHex.src = '/static/assets/BuildHex.png'
let RedX = new Image(40, 40)
RedX.src = '/static/assets/AttackX.png'
let RedTarget = new Image(40, 40)
RedTarget.src = '/static/assets/AttackTarget.png'
let GreenT = new Image(40, 40)
GreenT.src = '/static/assets/HealT.png'
let GreenCircle = new Image(40, 40)
GreenCircle.src = '/static/assets/TransportCircle.png'
let Beaker = new Image(40, 40)
Beaker.src = '/static/assets/Beaker.png'

let statLogos = {
    "attack":new Image(20, 20),
    "defense":new Image(20, 20),
    "health":new Image(20, 20),
    "population":new Image(20, 20),
    "range":new Image(20, 20),
    "speed":new Image(20, 20),
}

for (let key in statLogos) {
    statLogos[key].src = '/static/assets/statLogos/'+key+'.png'
}

function drawActionIcons() {
    for (const position of moveCircles) {
        //console.log(position);
        context.drawImage(BlueCircle, size * position[0] + x_offset, size * position[1] + y_offset, size, size);
    }
    for (const position of buildHexes) {
        //console.log(position);
        context.drawImage(OrangeHex, size * position[0] + x_offset, size * position[1] + y_offset, size, size);
    }

    context.textAlign = "right";
    fontSize = Math.floor(size / 3);
    context.font = fontSize + "px Arial";
    context.fillStyle = "#F00"
    context.strokeStyle = 'black';
    context.lineWidth = Math.floor(fontSize / 6);

    for (const position of possibleAttacks) {
        context.drawImage(RedX, size * position[0] + x_offset, size * position[1] + y_offset, size, size);
        context.strokeText(position[2], size * position[0] + size + x_offset, size * position[1] + size - fontSize + y_offset);
        context.fillText(position[2], size * position[0] + size + x_offset, size * position[1] + size - fontSize + y_offset);
    }
    context.fillStyle = "#0F0"
    for (const position of possibleHeals) {
        //console.log(position);
        context.drawImage(GreenT, size * position[0] + x_offset, size * position[1] + y_offset, size, size);
        context.strokeText(position[2], size * position[0] + size + x_offset, size * position[1] + size - fontSize + y_offset);
        context.fillText(position[2], size * position[0] + size + x_offset, size * position[1] + size - fontSize + y_offset);
    }
    for (const position of transportSpots) {
        //console.log(position);
        context.drawImage(GreenCircle, size * position[0] + x_offset, size * position[1] + y_offset, size, size);
    }
    for (const position of dropOffSpots) {
        //console.log(position);
        context.drawImage(GreenCircle, size * position[0] + x_offset, size * position[1] + y_offset, size, size);
    }
    if (selected != null) {
        if (selected.possibleStates.includes("research") && stateDataMode == null) {
            context.drawImage(Beaker, size * selected.position[0] + x_offset, size * selected.position[1] + y_offset, size, size);
        }
    }
}

let resourceBoxHeight = 22
let statBoxHeight = 22


function drawResources() {

    let newResources = {
        "gold": 0,
        "metal": 0,
        "energy": 0
    }

    for (let unit of gameObject.units[this_player]) {
        if (unit.state == "resources") {
            if (unit.stateData || unit.stateData in newResources) {
                newResources[unit.stateData] += unit.resourceGen[unit.stateData]
            }
        }
    }

    if (canvas.height > canvas.width) {
        resourceBoxHeight = Math.floor(canvas.height / 36) + 6
    }

    context.fillStyle = "#505050";
    context.fillRect(0, 0, canvas.width, resourceBoxHeight);

    context.textAlign = "center";
    context.font = (resourceBoxHeight - 2) + "px Arial";
    context.fillStyle = "#FFFF00";
    context.fillText(gameObject.resources[this_player]["gold"] + " + " + newResources["gold"], canvas.width * .2, resourceBoxHeight - 5);
    context.fillStyle = "#DDDDDD";
    context.fillText(gameObject.resources[this_player]["metal"] + " + " + newResources["metal"], canvas.width * .5, resourceBoxHeight - 5);
    context.fillStyle = "#00FFFF";
    context.fillText(gameObject.resources[this_player]["energy"] + " + " + newResources["energy"], canvas.width * .8, resourceBoxHeight - 5);
}
function drawStats() {

    if (selected == null) {
        statBoxHeight = 0
        return
    }

    statBoxHeight = resourceBoxHeight

    context.fillStyle = "#202020";
    context.fillRect(0, resourceBoxHeight, canvas.width, statBoxHeight);

    let statCount = 6
    let currentStatCount = 0
    if (!selected.possibleStates.includes("attack")) {
        statCount -= 1
    }
    if (!selected.possibleStates.includes("move")) {
        statCount -= 1
    }
    if (selected.population == undefined) {
        statCount -= 1
    }

    context.textAlign = "left";
    context.font = (statBoxHeight - 2) + "px Arial";

    function drawStat(stat, text, color) {
        let width = statBoxHeight + statBoxHeight/4 + statBoxHeight*0.5*text.toString().length
        console.log("width", width)
        context.fillStyle = color;
        context.fillText(text, canvas.width * (currentStatCount+1.3) * (1/(statCount+1)) + statBoxHeight/4 - width/2, resourceBoxHeight + statBoxHeight - 6);
        context.drawImage(statLogos[stat], canvas.width * (currentStatCount+1.3) * (1/(statCount+1))-statBoxHeight - width/2,resourceBoxHeight,statBoxHeight,statBoxHeight)
        currentStatCount += 1
    }

    console.log(statLogos["health"])

    drawStat("health",selected.health + "/" + selected.maxHealth,"#CEFFD7")

    if (selected.possibleStates.includes("attack")) {
        drawStat("attack",selected.attack,"#FF0800")
    }

    drawStat("defense",selected.defense,"#205DFF")

    if (selected.possibleStates.includes("move")) {
        drawStat("speed",selected.speed,"#00F5B9")
    }
    
    drawStat("range",selected.range,"#FFA300")

    if (selected.population != undefined) {
        drawStat("population",selected.population + "/" + selected.maxPopulation,"#9434EB")
    }

    return
}

function drawUnits() {
    for (const player in gameObject.units) {
        for (const unit of gameObject.units[player]) {
            //console.log(unit)
            drawUnit(player, unit);
        }
    }
    for (const unit of gameObject.units[this_player]) {
        //console.log(unit)
        drawUnitResources(this_player, unit);
    }
}

function drawUnitHealths() {
    for (const player in gameObject.units) {
        for (const unit of gameObject.units[player]) {
            //console.log(unit)
            drawUnitHealth(player, unit);
        }
    }
}

// Draws colored boxes for territories during animations
function drawAnimationTerritories() {
    let y = 0
    for (const layer of animationTerritoryMap) {
        let x = 0
        for (const player of layer) {
            if (player != null) {
                drawTerritoryAtPos(player,x,y)
            }
            x += 1
        }
        y += 1
    }
}

// Draws colored boxes for territories normally
function drawTerritories2() {
    let selectedX = -1
    let selectedY = -1
    if (selected != null) {
        selectedX = selected.position[0]
        selectedY = selected.position[1]
    }
    let y = 0
    for (const layer of territoryMap) {
        let x = 0
        for (const player of layer) {
            if (player != null) {
                if (x == selectedX && y == selectedY) {
                    drawTerritoryAtPos2Highlight(player,x,y)
                } else {
                    drawTerritoryAtPos2(player,x,y)
                }
            }
            x += 1
        }
        y += 1
    }
}

function drawTerritories() {
    for (const player in gameObject.units) {
        for (const unit of gameObject.units[player]) {
            //console.log(unit)
            drawTerritory(player, unit);
        }
    }
}

function drawTerritoriesSpecificGameObject(specific_gameObject) {
    for (const player in specific_gameObject.units) {
        for (const unit of specific_gameObject.units[player]) {
            //console.log(unit)
            drawTerritory(player, unit);
        }
    }
}

function drawStateLines() {
    for (const unit of gameObject.units[this_player]) {
        drawStateLine(unit);
    }
}

function drawUI() {
    //Gui is rendered below
    drawResources()
    drawStats()
    

    for (let key in ButtonCollection) {
        ButtonCollection[key].render();
    }

    if (stateDataMode == "build2") {
        buildPopup(selected.stateData[0])
    }
}

function drawBoard() {
    if(animationCounter >= 0) {
        console.log("not drawing board")
        return
    }
    console.log("drawing board")
    

    if (selected != null && stateDataMode == "research") {
        researchMenu();
        drawUI()
        return
    }

    clearBoard()

    currentlyResearch = false

    for (let y = 0; y < gameObject.height; y++) {
        for (let x = 0; x < gameObject.width; x++) {
            let tileColor = BoardColors[x + gameObject.width * y]
            context.fillStyle = tileColor;
            context.fillRect(x * size + x_offset, y * size + y_offset, size, size);
        }
    }

    drawTerritories2()
    drawStateLines()

    fontSize = Math.floor(size / 3);
    context.font = fontSize + "px Arial";
    context.strokeStyle = 'black';
    context.lineWidth = Math.floor(fontSize / 6);

    context.textAlign = "right";
    //drawTerritories()
    
    drawUnits();
    drawActionIcons()
    drawUnitHealths();

    drawClouds()

    drawUI()

    for (let btn of buildButtons) {
        btn.render();
    }
    for (let btn of resourceButtons) {
        btn.render();
    }
}

function drawAnimation() {
    animationCounter += 1
    if (animationCounter >= animationMax) {
        animationCounter = -1
        clearInterval(animationInterval) //Ends animation frame rendering
        //gameObject = gameObject2
        //gameObject2 = null
        currentTurn = gameObject2.turn
        useNewGameObject(gameObject2)
        //drawBoard()
        return 
    }

    let t = animationCounter/animationMax
    
    clearBoard()

    for (let y = 0; y < gameObject.height; y++) {
        for (let x = 0; x < gameObject.width; x++) {
            let tileColor = BoardColors[x + gameObject.width * y]
            context.fillStyle = tileColor;
            context.fillRect(x * size + x_offset, y * size + y_offset, size, size);
        }
    }
    drawTerritories2()
    animateBoard(gameObject,gameObject2,t)
    //drawClouds()
}

var intervalID = window.setInterval(myCallback, 2000);

function myCallback() {
    loadGame2()//drawBoard();
}

function replaceColor2(srcR, srcG, srcB, dstR, dstG, dstB) {
    const im = context.getImageData(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < im.data.length; i += 4) {
        //console.log(im.data[i]+ " " + im.data[i + 1] + " " + im.data[i + 2]);
        if (
            im.data[i] === srcR &&
            im.data[i + 1] === srcG &&
            im.data[i + 2] === srcB
        ) {

            im.data[i] = dstR;
            im.data[i + 1] = dstG;
            im.data[i + 2] = dstB;
        }
    }
    context.putImageData(im, 0, 0);
}

function drawStateLine(unit) { //As in "action state" (draws the line corresponding to a units action)
    let position1 = unit.position
    let position2 = null
    let color = "#FFFFFF"

    if (unit.state == "move") {
        position2 = unit.stateData
        color = "#00FFFF"
    } else if (unit.state == "build") {
        position2 = unit.stateData[0]
        color = "#FF8800"
    } else if (unit.state == "attack") {
        position2 = unit.stateData.position
        if (position2 == undefined) {
            let target = getUnitByID(unit.stateData)
            if (target) {
                position2 = target.position
            }
        }
        color = "#FF0000"
    } else if (unit.state == "heal") {
        position2 = unit.stateData.position
        color = "#FFFFFF"
    } else if (unit.state == "transport") {
        position2 = unit.stateData[0]
        color = "#32E632"
    }

    if (position2 != null) {
        //Here we define position3, used for the midpoint of the bezier curve
        let xCenter = (position1[0]+position2[0])/2
        let yCenter = (position1[1]+position2[1])/2

        let x = position1[0]
        let y = position2[1]
        //This statement is used to switch direction of the curve on every other space
        if ((position1[0]+position1[1]) % 2 == 0) {
            x = position2[0]
            y = position1[1]
        }

        //If statement checks if pos1 and pos2 are colinear, and if they are range 2 or further apart
        //If so, add slight curve
        if ((position1[0] == position2[0] || position1[1] == position2[1]) && Math.abs(position1[0] + position1[1] - position2[0] - position2[1]) > 1) {
            let mult = 1
            if ((position1[0]+position1[1]) % 2 == 0) {
                mult = -1
            }
            x = xCenter
            y = yCenter
            if (position1[0] == position2[0]) {
                x += 0.5*mult
            } else {
                y += 0.5*mult
            }
        }

        let position3 = [(xCenter + x)/2, (yCenter + y)/2]
        
        //Black line and sqaure (for outline)
        context.strokeStyle = "#000000";
        context.lineWidth = size * .25;
        context.fillStyle = "#000000";

        let halfSize = size / 2; //Used to center the line in the middle of square

        context.beginPath();
        context.moveTo(position1[0] * size + x_offset + halfSize, position1[1] * size + y_offset + halfSize);
        
        
        context.quadraticCurveTo(position3[0] * size + x_offset + halfSize, position3[1] * size + y_offset + halfSize,
            position2[0] * size + x_offset + halfSize, position2[1] * size + y_offset + halfSize);
        context.stroke();

        let boxSize = .33

        context.fillRect(position2[0] * size + x_offset + size * (1 - (boxSize))/2, position2[1] * size + y_offset + size * (1 - (boxSize))/2, size * boxSize, size * boxSize);

        //Colored line and square
        context.strokeStyle = color;
        context.lineWidth = size * .21;

        context.fillStyle = color;

        context.beginPath();
        context.moveTo(position1[0] * size + x_offset + halfSize, position1[1] * size + y_offset + halfSize);
        //context.lineTo(position2[0] * size + x_offset + halfSize, position2[1] * size + y_offset + halfSize);
        context.quadraticCurveTo(position3[0] * size + x_offset + halfSize, position3[1] * size + y_offset + halfSize,
            position2[0] * size + x_offset + halfSize, position2[1] * size + y_offset + halfSize);
        
        context.stroke();

        boxSize = boxSize-0.04

        context.fillRect(position2[0] * size + x_offset + size * (1 - (boxSize))/2, position2[1] * size + y_offset + size * (1 - (boxSize))/2, size * boxSize, size * boxSize);
    }
}

function drawTerritoryAtPos(player,x,y) {
    context.fillStyle = rgbToHex(playerColors[player][0], playerColors[player][1], playerColors[player][2]) + "99";
    context.fillRect(x * size + x_offset, y * size + y_offset, size, size);
}

let thickness = 0.05
let oppositeThickness = 1 - thickness

//Draws outlined territory
function drawTerritoryAtPos2(player,x,y) {
    context.fillStyle = rgbToHex(playerColors[player][0], playerColors[player][1], playerColors[player][2]);
    if (territoryNumberCode[y][x] % 2 >= 1) { //Top
        context.fillRect(x * size + x_offset, y * size + y_offset, size, size * thickness);
    }
    if (territoryNumberCode[y][x] % 4 >= 2) { //Top right
        context.fillRect((x+oppositeThickness) * size + x_offset, y * size + y_offset, size * thickness, size * thickness);
    }
    if (territoryNumberCode[y][x] % 8 >= 4) { //Right
        context.fillRect((x+oppositeThickness) * size + x_offset, y * size + y_offset, size * thickness, size);
    }
    if (territoryNumberCode[y][x] % 16 >= 8) { //Right bottom
        context.fillRect((x+oppositeThickness) * size + x_offset, (y+oppositeThickness) * size + y_offset, size * thickness, size * thickness);
    }
    if (territoryNumberCode[y][x] % 32 >= 16) { //Bottom
        context.fillRect(x * size + x_offset, (y+oppositeThickness) * size + y_offset, size, size * thickness);
    }
    if (territoryNumberCode[y][x] % 64 >= 32) { //Bottom left
        context.fillRect(x * size + x_offset, (y+oppositeThickness) * size + y_offset, size * thickness, size * thickness);
    }
    if (territoryNumberCode[y][x] % 128 >= 64) { //Left
        context.fillRect(x * size + x_offset, y * size + y_offset, size * thickness, size);
    }
    if (territoryNumberCode[y][x] % 256 >= 128) { //Left
        context.fillRect(x * size + x_offset, y * size + y_offset, size * thickness, size * thickness);
    }
    context.fillStyle = rgbToHex(playerColors[player][0], playerColors[player][1], playerColors[player][2]) + "33";
    context.fillRect(x * size + x_offset, y * size + y_offset, size, size);
    //context.fillRect(x * size + x_offset, y * size + y_offset, size, size);
}

//Same as function before, but this one highlights the square
function drawTerritoryAtPos2Highlight(player,x,y) {
    context.fillStyle = "#FFFFFFBB";
    context.fillRect(x * size + x_offset, y * size + y_offset, size, size);

    context.fillStyle = rgbToHex(playerColors[player][0], playerColors[player][1], playerColors[player][2]);
    if (territoryNumberCode[y][x] % 2 >= 1) { //Top
        context.fillRect(x * size + x_offset, y * size + y_offset, size, size * thickness);
    }
    if (territoryNumberCode[y][x] % 4 >= 2) { //Top right
        context.fillRect((x+oppositeThickness) * size + x_offset, y * size + y_offset, size * thickness, size * thickness);
    }
    if (territoryNumberCode[y][x] % 8 >= 4) { //Right
        context.fillRect((x+oppositeThickness) * size + x_offset, y * size + y_offset, size * thickness, size);
    }
    if (territoryNumberCode[y][x] % 16 >= 8) { //Right bottom
        context.fillRect((x+oppositeThickness) * size + x_offset, (y+oppositeThickness) * size + y_offset, size * thickness, size * thickness);
    }
    if (territoryNumberCode[y][x] % 32 >= 16) { //Bottom
        context.fillRect(x * size + x_offset, (y+oppositeThickness) * size + y_offset, size, size * thickness);
    }
    if (territoryNumberCode[y][x] % 64 >= 32) { //Bottom left
        context.fillRect(x * size + x_offset, (y+oppositeThickness) * size + y_offset, size * thickness, size * thickness);
    }
    if (territoryNumberCode[y][x] % 128 >= 64) { //Left
        context.fillRect(x * size + x_offset, y * size + y_offset, size * thickness, size);
    }
    if (territoryNumberCode[y][x] % 256 >= 128) { //Left
        context.fillRect(x * size + x_offset, y * size + y_offset, size * thickness, size * thickness);
    }
    
    //context.fillRect(x * size + x_offset, y * size + y_offset, size, size);
}

function drawTerritory(player, unit) {
    if (selected === unit) {
        context.fillStyle = "#FFFFFFBB";
    } else {
        context.fillStyle = rgbToHex(playerColors[player][0], playerColors[player][1], playerColors[player][2]) + "33";
    }
    context.fillRect(unit.position[0] * size + x_offset, unit.position[1] * size + y_offset, size, size);
}

//Get unit image size multiplier based on unit type (or specified size)
function getMultiplier(unitName, unitType = -1) {
    if (unitType == -1) {
        unitType = UnitDB[unitName].type || "trooper";
    }
    let multiplier = 0.7;
    if (unitType == "building") {
        multiplier = 0.85;
    } else if (unitType == "trooper" || unitType == "bot") {
        multiplier = 0.6;
    }
    multiplier = UnitDB[unitName].size || multiplier;
    return multiplier
}

function drawUnit(player, unit) {

    let img = getUnitImage(player, unit.name);

    if (img != null) {
        let multiplier = getMultiplier(unit.name, unit.type);
        context.drawImage(img, size * unit.position[0] + x_offset + size * (1 - multiplier) * .5, size * unit.position[1] + y_offset + size * (1 - multiplier) * .5, size * multiplier, size * multiplier);
    }

    //context.fillStyle = "white";
    //context.strokeText(unit.health, size * unit.position[0] + size + x_offset, size * unit.position[1] + size + y_offset);
    //context.fillText(unit.health, size * unit.position[0] + size + x_offset, size * unit.position[1] + size + y_offset);
}

function drawUnitHealth(player, unit) {
    context.fillStyle = "white";
    context.strokeText(unit.health, size * unit.position[0] + size + x_offset, size * unit.position[1] + size + y_offset);
    context.fillText(unit.health, size * unit.position[0] + size + x_offset, size * unit.position[1] + size + y_offset);
}

function drawUnitResources(player, unit) {
    if (unit.state == "resources") {
        context.fillStyle = resourceColors[unit.stateData];
        context.fillRect(size * unit.position[0] + x_offset + size * (1 - 0.2) * .1, size * unit.position[1] + y_offset + size * (1 - 0.2) * .9, size*.2, size*.2);
    }
}



let mouse_down = function (event) {
    event.preventDefault();
    console.log(event)

    startX = parseInt(event.clientX);
    startY = parseInt(event.clientY);
    startX_offset = x_offset;
    startY_offset = y_offset;


    maybe_dragging = true;
    //is_dragging = true;
    return;
}

let mouse_up = function (event) {
    if (!is_dragging) {
        if (maybe_dragging) {
            maybe_dragging = false;
            event.preventDefault();
            handleClick(parseInt(event.clientX), parseInt(event.clientY))
        }
        return;
    } else {
        let mouseX = parseInt(event.clientX);
        let mouseY = parseInt(event.clientY);
        if (checkWhatCouldBeClicked(startX,startY) == checkWhatCouldBeClicked(mouseX,mouseY)) {
            event.preventDefault();
            handleClick(mouseX, mouseY)
            is_dragging = false;
            return
        }
    }

    event.preventDefault();
    is_dragging = false;
}

let mouse_out = function (event) {
    if (!is_dragging) {
        return;
    }

    event.preventDefault();
    is_dragging = false;
}

let mouse_move = function (event) {
    if (maybe_dragging) {
        maybe_dragging = false;
        is_dragging = true;
    }
    if (!is_dragging) {
        if (stateDataMode == "research") {
            let mouseX = parseInt(event.clientX);
            let mouseY = parseInt(event.clientY);
            for (let key in currentTechButtons) {
                if (currentTechButtons[key].isMouseHovering(mouseX,mouseY)) {
                    //currentTechButtons[CurrentTechHover].img = currentTechImages[CurrentTechHover]
                    CurrentTechHover = key;
                    console.log("current hover", CurrentTechHover)
                    //currentTechButtons[CurrentTechHover].img = currentTechImagesInverted[CurrentTechHover]
                    redrawResearch = true //Used to trigger update for research menu
                    drawBoard()
                    return
                }
            }
            redrawResearch = true
            CurrentTechHover = null;
            drawBoard()
        }
        return;
    }

    event.preventDefault();

    let mouseX = parseInt(event.clientX);
    let mouseY = parseInt(event.clientY);

    let dx = mouseX - startX;
    let dy = mouseY - startY;

    x_offset = startX_offset + dx;
    y_offset = startY_offset + dy;

    if (stateDataMode == "research") {
        redrawResearch = true //Used to trigger update for research menu
    }
    

    drawBoard();
}

//Touch based events
let touch_down = function (event) {
    event.preventDefault();

    if (event.touches.length == 1) {

        startX = parseInt(event.touches[0].clientX);
        startY = parseInt(event.touches[0].clientY);
        startX_offset = x_offset;
        startY_offset = y_offset;

        true_startX = startX;
        true_startY = startY;
        true_startX_offset = startX_offset;
        true_startY_offset = startY_offset;

        maybe_dragging = true;
        if (event.touches[0].force <= 0.5) { //If there is a touch with less force, enable force click drag
            forceTouchEnabled = true
        }
    } else if (event.touches.length == 2) {
        if (!is_dragging) {
            startX = parseInt(event.touches[0].clientX);
            startY = parseInt(event.touches[0].clientY);
            startX_offset = x_offset;
            startY_offset = y_offset;

            true_startX = startX;
            true_startY = startY;
            true_startX_offset = startX_offset;
            true_startY_offset = startY_offset;

            is_dragging = true;
            maybe_dragging = false;
        }
        let secondX = parseInt(event.touches[1].clientX);
        let secondY = parseInt(event.touches[1].clientY);
        zoom_distance = Math.pow((Math.pow(event.touches[0].clientX - secondX, 2) + Math.pow(event.touches[0].clientY - secondY, 2)), 0.5);
        start_size = size;
    }
    return;
}

let touch_up = function (event) {
    drag_click = false
    if (!is_dragging) {
        if (maybe_dragging) {
            maybe_dragging = false;
            event.preventDefault();
            handleClick(parseInt(startX), parseInt(startY))
        }
        return;
    }

    event.preventDefault();

    if (event.touches.length == 1) {
        startX = parseInt(event.touches[0].clientX);
        startY = parseInt(event.touches[0].clientY);
        startX_offset = x_offset;
        startY_offset = y_offset;

        true_startX = startX;
        true_startY = startY;
        true_startX_offset = startX_offset;
        true_startY_offset = startY_offset;
    } else if (event.touches.length == 0) {
        is_dragging = false;
    }

}

let touch_move = function (event) {
    event.preventDefault();
    if (drag_click) {
        startX = parseInt(event.touches[0].clientX);
        startY = parseInt(event.touches[0].clientY);
        return;
    }
    if (maybe_dragging) {
        if (forceTouchEnabled && event.touches[0].force >= 0.2) {
            drag_click = true;
            handleClick(parseInt(startX), parseInt(startY))
            startX = parseInt(event.touches[0].clientX);
            startY = parseInt(event.touches[0].clientY);
            return
        }
        maybe_dragging = false;
        is_dragging = true;
    }
    if (!is_dragging) {
        return;
    }


    let mouseX = parseInt(event.touches[0].clientX);
    let mouseY = parseInt(event.touches[0].clientY);

    if (event.touches.length == 2) {
        let secondX = parseInt(event.touches[1].clientX);
        let secondY = parseInt(event.touches[1].clientY);
        let new_zoom_distance = Math.pow((Math.pow(event.touches[0].clientX - secondX, 2) + Math.pow(event.touches[0].clientY - secondY, 2)), 0.5);
        size = start_size * (new_zoom_distance / zoom_distance);

        let xBlocks = (true_startX - true_startX_offset) / start_size
        let xProjected = true_startX_offset + size * xBlocks
        let xChange = true_startX - xProjected

        startX = true_startX - xChange

        let yBlocks = (true_startY - true_startY_offset) / start_size
        let yProjected = true_startY_offset + size * yBlocks
        let yChange = true_startY - yProjected

        startY = true_startY - yChange

        //startX_offset = true_startX_offset - (true_startX-true_startX_offset) * (new_zoom_distance/zoom_distance);
        //startY_offset = true_startY_offset - (true_startY-true_startY_offset) * (new_zoom_distance/zoom_distance);

        //startX = true_startX - (true_startX-true_startX_offset) * (new_zoom_distance/zoom_distance);
        //startY = true_startY - (true_startY-true_startY_offset) * (new_zoom_distance/zoom_distance);

        //unitImages = {};
    }

    let dx = mouseX - startX;
    let dy = mouseY - startY;

    x_offset = startX_offset + dx;
    y_offset = startY_offset + dy;

    currentlyResearch = false //Used to trigger update for research menu

    drawBoard();
}



document.addEventListener('DOMContentLoaded', function () {

    if (document.querySelector('meta[name="player_id"]')){
        this_player = parseInt(document.querySelector('meta[name="player_id"]').content)
    }
    if (document.querySelector('meta[name="game_id"]')){
        this_game = document.querySelector('meta[name="game_id"]').content
    }

    canvas = document.getElementById("myCanvas");
    context = canvas.getContext('2d');
    canvas.onmousedown = mouse_down;
    canvas.onmouseup = mouse_up;
    canvas.onmouseout = mouse_out;
    canvas.onmousemove = mouse_move;
    canvas.addEventListener("touchstart", touch_down, false);
    canvas.addEventListener("touchmove", touch_move, false);
    canvas.addEventListener("touchend", touch_up, false);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    defaultButtonMenu()

    canvas.addEventListener('wheel', function (event) {

        console.log(event.deltaY);

        let mouseX = parseInt(event.clientX);
        let mouseY = parseInt(event.clientY);

        let xBlocks = (mouseX - x_offset) / size
        let yBlocks = (mouseY - y_offset) / size

        let change = event.deltaY / -50
        size *= 1+(change)/10;
        regulateSquareSize()

        let xProjected = x_offset + size * xBlocks
        let xChange = mouseX - xProjected

        x_offset += xChange
        startX_offset += xChange

        let yProjected = y_offset + size * yBlocks
        let yChange = mouseY - yProjected

        y_offset += yChange
        startY_offset += yChange


        console.log(size);

        //unitImages = {};
        currentlyResearch = false //Used to trigger update for research menu

        drawBoard();

        event.preventDefault();
    }, false);

    generateGrid()
    generateBoardColors();
    initClouds()
    updateCloudCover()

    if (canvas.getContext) {
        context.fillStyle = '#fa4b2a';    // color of fill
        context.fillRect(10, 40, 140, 160); // create rectangle  


        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 20; x++) {
                context.fillStyle = randomGreen();
                context.fillRect(x * 20, y * 20, 20, 20);
            }
        }
    }
    loadGame2();

    document.body.onkeyup = function (e) {
        if (e.key == " " ||
            e.code == "Space" ||
            e.keyCode == 32
        ) {
            endTurn()
        }
    }
})

