#os.chdir(r"/Users/reeganfoldhazi/Documents/PythonStuff")
from pathlib import Path
from UnitDB import UnitDB
from UnitDB import TechDB
from UnitDB import FactionUnits
import numpy as np
import random,operator,json,copy,os,sys
#os.chdir(os.path.dirname(sys.argv[0]))
import methods, Computer, settings
from json import JSONEncoder

startingspots = [[0,0],[9,9], [9,0]]
board_y = 10
board_x = 10

#Checks the range of between two positions. A has to be unit, and B can be a unit or a list
def checkRange(a,b):
    if type(b) == list:
        return max(abs(a.position[0]-b[0]), abs(a.position[1]-b[1]))
    return max(abs(a.position[0]-b.position[0]), abs(a.position[1]-b.position[1]))

#Determines damage dealt when an attack is done. 
#Formula Damage = (AP/(AP+DP))*Attack*5, AP = Attack * (% of remaining health), DP = Defense * (% of remaining health)
def damageCalc(a,b):
    attackPower = a.attack*(a.health/a.maxHealth)
    defensePower = b.defense*(b.health/b.maxHealth)
    return round((attackPower/(attackPower+defensePower))*a.attack*5)

#Gets spaces nearby given unit. Can be for speed, range, build, or anything. 
#If given sp (Speed), it will use that as range. Default is unit's range.
#If given pos (Position), it will use that as starting point. Default is unit's position.
#If ignore is false, it will not give spaces that units are in
def getRangeCircles(game, unit, sp = False, pos = False, ignore = False):#Could be more effiecint
    if not sp:
        sp = unit.range
    if not pos:
        pos = unit.position
    spaces = []
    for x in range(pos[0]-sp, pos[0]+1+sp):
        for y in range(pos[1]-sp, pos[1]+1+sp):
            if x >= 0 and y >= 0 and y<game.height and x<game.width:#If within board:
                if ignore or game.getAnyUnitFromPos(x,y) == None:
                    spaces.append([x,y])
    return spaces

#Used to set the state of a unit without a state. Sets their state to generate resources, and 
#usually picks resource that it genereates the most of
def setDefaultState(game):
    for i in game.units:
            for u in game.units[i]:
                if u.state == None and 'resources' in u.possibleStates:
                    u.state = 'resources'
                    u.stateData = max(u.resourceGen.items(), key=operator.itemgetter(1))[0]

#Returns how many of a specific type of unit a certain player has
def getCount(unitName, playerNum, game):
    count = 0
    for unit in game.units[playerNum]:
        if unit.name == unitName:
            count+=1
    return count

#Determines if a unit can be built on a specific space.
def CheckIfGoodToBuild(self, playerNum, u, Grid, pos = False):
    if not pos:
        pos = u.stateData[0]
    buildName = None
    if u.state == "build":
        buildName = u.stateData[1]
    elif u.state == "upgrade":
        buildName = u.stateData
    cost = UnitDB[buildName]['cost']

    #Handles the "costly" ability. The specific "costly" stat is the rate of change per already
    #existing unit. Always rounds down to closest 5
    if 'abilities' in UnitDB[buildName] and 'costly' in UnitDB[buildName]['abilities']:
        cost = copy.copy(cost)
        count = getCount(buildName, playerNum,self)
        for v in cost:
            cost[v] = cost[v]*(UnitDB[buildName]['abilities']['costly']**count)//5*5
            
    for v in cost:
        if self.resources[playerNum][v] < cost[v]:#Check each resource
            print("Too expensive")
            return False #If too expensive, ignore build
    if u.state == "build":
        if getattr(u,'maxPopulation',False):
            if u.population >= u.maxPopulation:
                print("Too populated")
                return False #Max popultion reached
        if getattr(u,'maxSupplies',False):
            if u.supplies <= 0:
                print("Too few supplies")
                return False #Doesn't have any supplies remaining
        if checkRange(u, pos) > u.range:
            print("Too far")
            return False #Can't build out of range
    t = UnitDB[buildName].get('type') or 0
    if Grid[pos[1]][pos[0]]:#on Water
        if t not in ['aircraft', 'boat']:
            print("Too much water")
            return False #Can't build type on water
    else:#on land
        if t == 'boat':
            print("Too land")
            return False #Can't build boat on land
    if t == 'building':#Can't build buildings near enemy buildings
        Range = UnitDB[buildName].get('range') or 1
        if 'abilities' in UnitDB[buildName] and 'closebuild' in UnitDB[buildName]['abilities']:
            Range = UnitDB[buildName]['abilities']['closebuild']
        for v in getRangeCircles(self,u,Range,pos, True):
            unit = self.getAnyUnitFromPos(v[0],v[1])
            if unit and unit.type == 'building':
                if not self.checkFriendly(u,unit):
                    print("Too close")
                    return False
    print("Nothing wrong!")
    return True

def chooseMap(players): #Looks randomly for a map with the correct number of players, and sorts them
                        #into a dict if it can't find one, then picks a map with more player slots
                        #If all else fails, crash (should probably do something else)
    possibleMaps = os.listdir('maps')
    if settings.mapType == "any" or settings.mapType == "regular":
        folders = []
        for file in possibleMaps:
            if not os.path.isfile("maps/%s" % file):
                folders.append(file)
        for folder in folders:
            possibleMaps.remove(folder)
            if settings.mapType == "any":
                possibleMaps += ["%s/%s" % (folder, x) for x in os.listdir("maps/%s" % folder)]
    else:
        print("djdjdjdjd")
        possibleMaps = ["%s/%s" % (settings.mapType, x) for x in os.listdir("maps/%s" % settings.mapType)]

    if len(possibleMaps) == 0:
        print("possibleMaps is empty")
        return 0/0
    
    if players == 1: # 1 player can be on any map
        return random.choice(possibleMaps)
    mapByPlayers = {}
    notDone = True
    while notDone and len(possibleMaps) > 0:
        print("possiblilities",possibleMaps)
        print("mapByPlayers",mapByPlayers)
        map = random.choice(possibleMaps)
        playerCount = methods.getPlayerCountFromMap("maps/%s" % map)
        if playerCount == players:
            return map
        if not (playerCount in mapByPlayers):
            mapByPlayers[playerCount] = []
        possibleMaps.remove(map)
        mapByPlayers[playerCount].append(map)

    for i in range(12): #Arbititary limit on how many player slots to look for
        if i + players in mapByPlayers:
            return random.choice(mapByPlayers[i + players])

    print("Too many players")
    return 0/0

UnitID = 0 #Static varible to give a unit a unique ID

class Unit:
    def __init__(self, pos = [0,0], name = 'soldier', parent= None, score = -1, givenID = UnitID):
        global UnitID
        self.name = name.lower()
        self.parent = parent
        self.type = UnitDB[name].get('type') or 'trooper'
        self.possibleStates = UnitDB[name].get('possibleStates') or ['attack','move','resources']
        #self.possiblebuilds = UnitDB[name].get('possibleBuilds') or []
        self.state = None
        self.stateData = None
        self.speed = UnitDB[name].get('speed') or 1
        self.range = UnitDB[name].get('range') or 1
        self.attack = UnitDB[name].get('attack') or 2
        self.defense = UnitDB[name].get('defense') or 2
        self.maxHealth = UnitDB[name].get('health') or 10
        self.health = int(self.maxHealth)
        self.UnitID = str(givenID)
        if score == -1:
            self.score = 0
            costs = UnitDB[name].get('cost') or {}
            for key in costs:
                self.score += costs[key]
        else:
            self.score = score
        UnitID += 1
        self.resourceGen = UnitDB[name].get('resourceGen') or {
            "gold": 2,
            "metal": 0,
            "energy": 0
            }
        #self.resourceGen = dict(self.resourceGen)
        self.abilities = UnitDB[name].get('abilities') or {}
        self.position = pos
        if ('build' in self.possibleStates and self.type == 'building') or UnitDB[name].get('population'):
            self.population = 0
            self.maxPopulation = UnitDB[name].get('population') or 3
        if UnitDB[name].get('supplies'):
            self.supplies = UnitDB[name].get('supplies')
            self.maxSupplies = UnitDB[name].get('supplies')

class Encoder(JSONEncoder):
        def default(self, o):
            #Posible thing to do is is find all units with attack as their state and change statedata to unitID
            return o.__dict__

class UnitMaker(Unit):
    def __init__(self, dictionary):
        for k, v in dictionary.items():
            setattr(self, k, v)

class Game:
    #Creates a new game and initilizes all settings and the map
    def __init__(self, id = 0, makeAreas = True):
        self.units = {} #Store players' units
        self.resources = {} #Store players' resource counts
        self.went = {}
        self.tech = {}
        self.scores = {}
        self.progress = {}
        self.botmode = []
        self.factions = {}
        self.ready = False
        self.started = False
        self.turn = 0
        self.id = id
        self.mode = settings.mode
        self.allai = settings.allai
        self.currentUnitID = 0
        
    
    #adds a new player and all revelant lists to the game object
    def addPlayer(self):
        p = len(self.units)
        self.units[p] = []
        self.resources[p] = {'gold':100,'metal':200,'energy':0}
        self.went[p] = False
        self.tech[p] = []
        self.scores[p] = 0
        self.progress[p] = {}
        #b = Unit(startingspots[p], 'town')
        #self.units[p].append(b)
    
    #Starts the game and finds starting spots for each of the player's towns
    def start(self):
        if not self.started:

            possibleMaps = os.listdir('maps')

            # Add to possibleMaps all the maps that are in directories
            for i in range(len(possibleMaps)):
                if os.path.isdir(os.path.join('maps', possibleMaps[i])):
                    newMaps = os.listdir(os.path.join('maps', possibleMaps[i]))
                    for Map in newMaps:
                        possibleMaps.append(os.path.join(possibleMaps[i], Map))

            specificMap = getattr(self, "wantedMap", False) or settings.Map
            if hasattr(self, "wantedMap"):
                del (self.wantedMap)
            print("specific map", specificMap, "%s.png" % specificMap in possibleMaps)
            print("possibleMaps", possibleMaps)
        
            if settings.Map == "generated":
                self.map = "generated"
                self.width,self.height = settings.width, settings.height
                self.ai = settings.ai
                self.targetPlayers = 0
                grid = methods.newGrid(self.width,self.height)
                grid = methods.makeAreas(grid)
            elif "%s.png" % specificMap in possibleMaps:
                self.map = "%s.png" % specificMap
                self.width,self.height = methods.getWidthAndHeight("maps/%s" % self.map)
                self.ai = methods.getAICountFromMap("maps/%s" % self.map)
                self.targetPlayers = methods.getPlayerCountFromMap("maps/%s" % self.map)
                grid = methods.generateMapFromImage("maps/%s" % self.map)
            else:
                self.map = chooseMap(len(self.units))
                self.width,self.height = methods.getWidthAndHeight("maps/%s" % self.map)
                self.ai = methods.getAICountFromMap("maps/%s" % self.map)
                self.targetPlayers = methods.getPlayerCountFromMap("maps/%s" % self.map)
                grid = methods.generateMapFromImage("maps/%s" % self.map)
            
            self.intGrid = list(np.packbits(np.uint8(grid)))
            for i in range(len(self.intGrid)):
                self.intGrid[i] = int(self.intGrid[i])
            print(type(self.intGrid), type(self.intGrid[0]))

            realPlayers = len(self.units)

            self.started = True
            if len(self.units) < self.targetPlayers:
                self.ai += self.targetPlayers - len(self.units)
            for i in range(self.ai):
                self.addPlayer()
                self.went[len(self.units)-1] = True
            Grid = methods.intToList(self.intGrid, self.width)
            print('units',self.units)

            neutralUnits = []
            rebelUnits = []

            if self.map == "generated":
                startingspots = methods.findStartSpots(Grid, len(self.units))
            else:
                startingspots = methods.findStartSpotsFromMap("maps/%s" % self.map)
                neutralUnits = methods.findNeutralUnitsFromMap("maps/%s" % self.map)
                rebelUnits = methods.findRebelUnitsFromMap("maps/%s" % self.map)

            del(self.map)
            
            if startingspots == "RETRY":
                cont = True
                while cont:
                    print("Rety retry retry retrtr retert retry ")
                    grid = methods.newGrid(self.width,self.height)
                    grid = methods.makeAreas(grid)
                    startingspots = methods.findStartSpots(Grid, len(self.units))
                    if startingspots != "RETRY":
                        cont = False
                self.intGrid = list(np.packbits(np.uint8(grid)))
                for i in range(len(self.intGrid)):
                    self.intGrid[i] = int(self.intGrid[i])

            playerStartingSpots = startingspots[:realPlayers]
            aiStartingSpots = startingspots[realPlayers:]

            random.shuffle(playerStartingSpots)
            random.shuffle(aiStartingSpots)

            startingspots = playerStartingSpots + aiStartingSpots
            #random.shuffle(startingspots)
            #abc = start
            
            print(startingspots)
            i = 0
            #starters = ['king slime', 'king blob']
            #starters = ['the hunter', 'king blob']
            for p in self.units:
                #self.units[p].append(Unit(startingspots[p], starters[i]))
                if i >= realPlayers: #AIs start with trees
                    if random.random() < 0.25:
                        self.units[p].append(self.newUnit(startingspots[p], "town"))
                    elif random.random() < 0.25:
                        self.units[p].append(self.newUnit(startingspots[p], "plant base"))
                        self.factions[p] = "plants"
                    elif random.random() < 0.33:
                        self.units[p].append(self.newUnit(startingspots[p], "bot fortress"))
                        self.factions[p] = "bots"
                    elif random.random() < 0.5:
                        self.units[p].append(self.newUnit(startingspots[p], "tree"))
                        self.factions[p] = "nature"
                    else:
                        self.units[p].append(self.newUnit(startingspots[p], "mothership"))
                        self.factions[p] = "alien"
                else:
                    self.units[p].append(self.newUnit(startingspots[p], "town"))
                    spaces = getRangeCircles(self, self.units[p][0])
                    random.shuffle(spaces)
                    for _ in range(2):
                        water = True
                        while water:
                            water = Grid[spaces[0][1]][spaces[0][0]]
                            if water:
                                spaces.pop(0)
                        self.units[p].append(self.newUnit(spaces[0], "soldier"))
                        spaces.pop(0)
                i+=1

            self.units["neutral"] = []
            self.resources["neutral"] = {'gold':20,'metal':0,'energy':0}
            self.went["neutral"] = True
            self.tech["neutral"] = []
            self.scores["neutral"] = 0
            self.progress["neutral"] = {}
            self.botmode.append("neutral")

            self.units["rebel"] = []
            self.resources["rebel"] = {'gold':100,'metal':200,'energy':0}
            self.went["rebel"] = True
            self.tech["rebel"] = []
            self.scores["rebel"] = 0
            self.progress["rebel"] = {}
            self.botmode.append("rebel")
            self.factions["rebel"] = "rebel"

            for unitAndPos in neutralUnits:
                # unitAndPos[0] is a unit, unitAndPos[1] is the position
                self.units["neutral"].append(self.newUnit(unitAndPos[1], unitAndPos[0]))
            
            for unitAndPos in rebelUnits:
                # unitAndPos[0] is a unit, unitAndPos[1] is the position
                self.units["rebel"].append(self.newUnit(unitAndPos[1], unitAndPos[0]))


    #??? Something to do with JSON stuff
    def generateZippedBytes(self):
        #print(vars(self))
        SELF = self
        uncopied = True
        for i in SELF.units:
            for u in SELF.units[i]:
                if u.state == "attack" and type(u.stateData) != str and u.stateData:
                    if uncopied:
                        SELF = copy.copy(self)
                        uncopied = False
                    print("STATE DATA", type(u.stateData), u.stateData)
                    if type(u.stateData) == dict:
                        u.stateData = u.stateData["UnitID"]
                    else:
                        u.stateData = u.stateData.UnitID
        JSONData = json.dumps(SELF, indent=0, cls=Encoder)
        JSONData = str(JSONData)
        JSONData = JSONData.replace("\n", '')
        JSONData = JSONData.replace(": ",':')
        with open('jsonStuff.txt', 'w') as f:
            f.write(JSONData)
        ZIP = methods.zipper(JSONData)
        """
        for i in self.units:
            for u in self.units[i]:
                if u.state == "attack" and type(u.stateData) == str:
                    print("STATE DATA2222", type(u.stateData), u.stateData)
                    u.stateData = self.getUnitFromID2(u.stateData)
        """
        #SON = json.loads(ZIP)
        return str.encode(ZIP)

    def getJSON(self):
        SELF = self
        uncopied = True
        for i in SELF.units:
            for u in SELF.units[i]:
                if u.state == "attack" and type(u.stateData) != str and u.stateData:
                    if uncopied:
                        SELF = copy.copy(self)
                        uncopied = False
                    print("STATE DATA", type(u.stateData), u.stateData)
                    if type(u.stateData) == dict:
                        u.stateData = u.stateData["UnitID"]
                    else:
                        u.stateData = u.stateData.UnitID
        JSONData = json.dumps(SELF, indent=0, cls=Encoder)
        JSONData = str(JSONData)
        JSONData = JSONData.replace("\n", '')
        JSONData = JSONData.replace(": ",':')
        return JSONData
    
    def turnToBot(self,player):
        self.botmode.append(player)
        self.went[player] = True

    #Finds the unit that a player owns at a specified position
    def getUnitFromPos(self,player,x,y):
        post = [x,y]
        for u in self.units[player]:
            if u.position == [x,y]:
                return u
        return None

    #Finds any unit that is at the specified position
    def getAnyUnitFromPos(self,x,y):
        post = [x,y]
        for i in self.units:
            for u in self.units[i]:
                if u.position == [x,y]:
                    return u
        return None
    
    #Returns the player who owns a specific unit
    def getPlayerfromUnit(self,unit):
        for i in self.units:
            for u in self.units[i]:
                if u == unit:
                    return i
        return None
    
    #Returns true if the same player owns both units
    def checkFriendly(self, unit1, unit2):
        player = self.getPlayerfromUnit(unit1)
        if player == None:
            return False
        return unit2 in self.units[self.getPlayerfromUnit(unit1)]

    #Returns true if the given player owns the given unit
    def checkFriendlyPlayer(self, unit, player):
        return unit in self.units[player]
    
    #Finds the unit with a specific ID
    def getUnitFromID(self, ID):
        for i in self.units:
            for u in self.units[i]:
                if u.UnitID == ID:
                    return u
        return None
    
    #Finds the unit with a specific ID (its different in typing)
    def getUnitFromID2(self, ID):
        for i in self.units:
            for u in self.units[i]:
                if type(u) == dict and u['UnitID'] == ID:
                    return u
                elif type(u) != dict and u.UnitID == ID:
                    return u
        return None
    
    def checkIfUnitTransported(self, transportee, transporter):
        if hasattr(transporter, "carrying"):
            for u in transporter.carrying:
                if type(u) == dict:
                    if u["UnitID"] == transportee.UnitID:
                        return True
                else:
                    print("option2")
                    if u.UnitID == transportee["UnitID"]:
                        return True
        return False

    #Function to give a unit buffs based on a given tech
    def upgradeTech(self, unit, v):
        currentAbility = v[0]
        if currentAbility == 'unlock build' and v[1] == unit.name:#[1] is builder
            if not getattr(unit, 'possiblebuilds', False):
                unit.possiblebuilds = list(UnitDB[unit.name].get('possibleBuilds')) or []
            unit.possiblebuilds.append(v[2])#[2] is what was unlocked
        elif currentAbility == 'lose build' and v[1] == unit.name:#[1] is builder
            if not getattr(unit, 'possiblebuilds', False):
                unit.possiblebuilds = list(UnitDB[unit.name].get('possibleBuilds')) or []
            if v[2] in unit.possiblebuilds:
                unit.possiblebuilds.remove(v[2])#[2] is what was lost
        elif currentAbility == 'unlock upgrade' and v[1] == unit.name:#[1] is builder
            if not getattr(unit, 'possibleupgrades', False):
                unit.possibleupgrades = list(UnitDB[unit.name].get('possibleUpgrades')) or []
            unit.possibleupgrades.append(v[2])#[2] is what was unlocked
        elif currentAbility == 'stat' and v[1] == unit.name:#v[1] is unit
            print('nwe unit')
            print('we are in the belly of the beaast: stat changes', v)
            setattr(unit, v[2], getattr(unit, v[2])+v[3])#v[2] is stat, v[3] is how much it changes
        elif currentAbility == 'typeStat' and v[1] == unit.type:#[1] is what unit type was affected
            print('current')
            print('we are in the belly of the beast: stat changes', v)
            setattr(unit, v[2], getattr(unit, v[2])+v[3])#v[2] is stat, v[3] is how much it changes
        elif currentAbility == 'gain ability' and v[1] == unit.name:
            unit.abilities[v[2]] = v[3]#v[2] is ability, v[3] is value
        elif currentAbility == 'typeAbility' and v[1] == unit.type:#[1] is what unit type was affected
            unit.abilities[v[2]] = v[3]#v[2] is ability, v[3] is value
        elif currentAbility == 'gain state' and v[1] == unit.name:#[1] is unit
            unit.possibleStates.append(v[2]) #v[2] is new state
    
    #Upgrades a unit with all techs that a player has
    def upgradeUnit(self, unit, player):
        for t in self.tech[player]:
            abil = TechDB[t]['ability']
            for v in abil:
                self.upgradeTech(unit, v)

    #Upgrades all current units with a specific tech (used when a tech is unlocked)
    def upgradeCurrentUnits(self, player, tech):
        print('upgrading currents')
        abil = TechDB[tech]['ability']
        for unit in self.units[player]:
            for v in abil:
                self.upgradeTech(unit, v)
    
    #I believe this has something to do with decoding given json
    def setState(self,player, data):#unit, state,statedata
        split = data.split(':')
        unit = self.getUnitFromID(split[0])
        state = split[1]
        stateData = split[2]
        if state == 'move':
            stateData = [int(split[2]),int(split[3])]
        elif state == 'attack':
            stateData = self.getUnitFromID(split[2])
        elif state == 'heal':
            stateData = self.getUnitFromID(split[2])
        elif state == 'build':
            stateData = [[int(split[2]),int(split[3])],split[4]]
        elif state == 'transport':
            print("Transport in. DATA:", data,"SPLIT:",split)
            stateData = [[int(split[2]),int(split[3])],split[4]]
            print("Final RESULT:",stateData)
        elif state == "cancel":
            state = None
            stateData = None

        if state != None and stateData == None:
            return

        player2 = self.getPlayerfromUnit(unit)
        for u in self.units[player2]:
            if u == unit:
                print("")
                unit.state = state
                unit.stateData = stateData
                break#Stop unnessary looping
    
    # Triggered when player idicates that they are done manipulating their units. 
    # If all players are done, round end is triggered.
    def playerDone(self,player):
        self.went[player] = True
        allWent = True
        print(self.went)
        for p in self.went:
            if not self.went[p]:
                print(p,'is a failure')
                allWent = False
        if allWent:
            print('????')
            for p in self.went:
                self.went[p] = False
            self.round()
        else:
            self.addIndicatorsToStateFile()
    
    # Checks if the player is alive. 
    # Potential Bug: I don't think deleting these is a good idea. I'm commenting it out for now
    def checkIfAlive(self,player):
        if len(self.units[player]) == 0:
            #del(self.units[player])
            #del(self.resources[player])
            #del(self.went[player])
            return False
        return True
    
    #Takes unit and returns its state and state data in a condensed string form (":attack:54")
    #similar to convertToString found in client.py
    def shortConvertToString(self, unit):
        state = unit.state
        stateData = unit.stateData
        s = '%s:' % state
        if state == 'move':
            s+= '%s:%s' % tuple(stateData)
        elif state == 'attack':
            if type(stateData) == str:  #Sometimes stateData is still the unitID, could be a problem
                s+= stateData
            else:   
                s+= stateData.UnitID
        elif state == 'heal':
            if type(stateData) == str:  #Sometimes stateData is still the unitID, could be a problem
                s+= stateData
            else:   
                s+= stateData.UnitID
        elif state == 'resources':
            s+= stateData
        elif state == 'research':
            s+= stateData
        elif state == 'build':
            s+= '%s:%s:' % tuple(stateData[0])
            s+= stateData[1]
        elif state == 'transport':
            s+= '%s:%s:' % tuple(stateData[0])
            s+= stateData[1]
        elif state == 'upgrade':
            s+= stateData
        elif state == 'resupply':
            if type(stateData) == str:  #Sometimes stateData is still the unitID, could be a problem
                s+= stateData
            else:   
                s+= stateData.UnitID
        return s
    
    #Sets the turn of the current game and saves it to states file
    #Saves current states of units into states file
    #Previously added the refresh tag to states file to indicate a refresh needs to be sent to client
    def addIndicatorsToStateFile(self):
        #text = ""
        #for playerNum in self.units:
        #    text += "%srefresh" % playerNum

        
        try:
            with open(Path("savefiles/states/game_%s.json" % self.id), "r+") as f:
                #print("file111",f.read())
                data = json.load(f)
                #data["refresh"] = text

                data["turn"] = self.turn
                data["went"] = self.went
                for playerNum in self.units:
                    data[str(playerNum)] = {}
                    for unit in self.units[playerNum]:
                        if unit.state == None:
                            continue
                        data[str(playerNum)][unit.UnitID] = self.shortConvertToString(unit)

                f.truncate(0)
                f.seek(0)
                json.dump(data, f)
        except:
            with open(Path("savefiles/states/game_%s.json" % self.id), "w") as f:
                f.write('{"turn": 0}')

    #Retrieves states from state file and applies it to self
    def applyStates(self):
        with open(Path("savefiles/states/game_%s.json" % self.id), "r") as f:
            data = json.load(f)
            for key in data:
                try:
                    if int(key) in self.units:
                        for unitID in data[key]:
                            self.setState(int(key),"%s:%s"%(unitID, data[key][unitID]))
                except:
                    print("key failed",key)

    def clearNeutralStates(self):
        if ("neutral" in self.units):
            for unit in self.units["neutral"]:
                unit.state = None
                unit.stateData = None

    # Performs EVERYTHING at the end of a round. 
    # Order: Buff Units, AI/Default States, Resources, Resupply, Attack/Heal, Move, Build/Upgrade, Cloak, Research, Resource Cap, Debuff units 
    def round(self):
        """
        grid = methods.intToList(self.intGrid, self.width)
        print("Lololsdfgosdf")
        print(grid)
        grid = methods.smoothAreas(grid)
        print('qwerttyuiu', grid)
        self.intGrid = list(np.packbits(np.uint8(grid)))
        for i in range(len(self.intGrid)):
            self.intGrid[i] = int(self.intGrid[i])
        """
        self.applyStates()

        buffedUnitOrignals = {}

        for playerNum in self.units:
            for unit in self.units[playerNum]:
                if 'buff' in unit.abilities:
                    print("Buffing nearby units...")
                    tiles = getRangeCircles(self, unit, sp = 1, ignore = True)
                    for pos in tiles:
                        unit2 = self.getUnitFromPos(playerNum,pos[0],pos[1])
                        if unit2 and unit2 != unit: #Ensure there is a unit, and also can't buff self
                            print("This guy is getting BUFFED")
                            targetStat = unit.abilities['buff'][0]
                            if not unit2 in buffedUnitOrignals:
                                buffedUnitOrignals[unit2] = {}
                            if targetStat == 'production': #We do this for production because its not a normal stat to buff
                                print("BUFFING PRODUCTION")
                                #buffedUnitOrignals[unit2] = {"stat":targetStat, "orig": unit2.resourceGen}
                                targetUnits = unit.abilities['buff'][1]
                                if unit2.name in targetUnits:
                                    print("BUFFING PRODUCTION EVEN BETTER")
                                    multiplier = unit.abilities['buff'][2]
                                    if not targetStat in buffedUnitOrignals[unit2]:
                                        buffedUnitOrignals[unit2][targetStat] = dict(unit2.resourceGen)
                                    print("current production for",unit2,'is',unit2.resourceGen)
                                    unit2.resourceGen = dict(unit2.resourceGen)
                                    for r in unit2.resourceGen:
                                        unit2.resourceGen[r] = int(unit2.resourceGen[r] * multiplier)
                                    print("New production for",unit2,'is',unit2.resourceGen)
                                
                            else:
                                if not hasattr(unit2, targetStat): #Don't buff if it doesn't have the stat
                                    continue
                                multiplier = unit.abilities['buff'][1]
                                print("This guy's %s was buffed" % targetStat)
                                #buffedUnitOrignals[unit2] = {"stat":targetStat, "orig": getattr(unit2, targetStat)}
                                if not targetStat in buffedUnitOrignals[unit2]:
                                    buffedUnitOrignals[unit2][targetStat] = getattr(unit2, targetStat)
                                setattr(unit2, targetStat, getattr(unit2, targetStat) * multiplier)


        
        self.turn += 1
        print('stuff')
        #AI = range(len(self.units))
        AI = range(len(self.units)-self.ai,len(self.units))
        if "neutral" in self.units:
            AI = range(len(self.units)-self.ai-2,len(self.units)-2)
        if self.allai:
            AI = range(len(self.units))
            if "neutral" in self.units:
                AI = range(len(self.units)-2)
        for v in AI:
            Computer.CurrentAI(self,v)
            self.went[v] = True
        for player in self.botmode:
            Computer.CurrentAI(self,player)
            self.went[player] = True
        setDefaultState(self)
        self.clearNeutralStates()

        #Restrictions on actions
        cloakRestrictedActions = ("move", "cloak")
        positionsOfCloakedUnits = []
        for i in self.units:
            for u in self.units[i]:
                if hasattr(u, "cloaked"):
                    positionsOfCloakedUnits.append(u.position)
                    if not (u.state in cloakRestrictedActions):
                        u.state = None
                        u.stateData = None

        if len(positionsOfCloakedUnits) > 0:
            for player in self.units:
                for u in self.units[i]:
                    if 'detect' in u.abilities: #"detect" allows units to see cloaked units
                        for pos in getRangeCircles(self,u,ignore = True):
                            if pos in positionsOfCloakedUnits:
                                cloakedUnit = self.getAnyUnitFromPos(pos[0],pos[1])
                                if hasattr(cloakedUnit, "detectedBy"):
                                    cloakedUnit.detectedBy.append(player)
                                else:
                                    cloakedUnit.detectedBy = [player]

        #Check for attacks on cloaked units

        
        #Gain resources
        for i in self.units:
            for u in self.units[i]:
                print("checking", vars(u))
                if u.state == "resources":#stateData is the type of resource generate
                    self.resources[i][u.stateData] += u.resourceGen[u.stateData]
        
        #Resupply
        for i in self.units:
            for u in self.units[i]:
                if u.state == "resupply" and u.stateData: #stateData is target of resupply
                    goodToSupply = True
                    target = u.stateData
                    if type(target) == str:
                        target = self.getUnitFromID(target)

                    if goodToSupply and checkRange(u, target) <= u.range:#Check if in range
                        if not getattr(target,'maxSupplies',False): #skip if target doesn't take supplies
                            continue
                        if getattr(u,'maxSupplies',False): #transfer supplies if both have max amounts
                            suppliesTransfered = min(target.maxSupplies - target.supplies, u.supplies)
                            u.supplies -= suppliesTransfered
                            target.supplies += suppliesTransfered
                        else:
                            target.supplies = target.maxSupplies
                        if target.supplies == target.maxSupplies:
                            u.state = None
                            u.stateData = None
                        else:
                            if getattr(u,'maxSupplies',False):
                                if u.supplies <= 0:
                                    u.state = None
                                    u.stateData = None
        
        #Attack
        hurtList = {} #List for units that are hurt by attacks
        hunterList = {} #List for units that are doing the attacking

        #Damaging Conditions
        for i in self.units:
            for u in self.units[i]:
                if hasattr(u,"conditions"):
                    if "burn" in u.conditions:
                        if not (u in hurtList): 
                            hurtList[u] = 0
                        hurtList[u] += 2
                        u.conditions["burn"]["length"] -= 1
                        if u.conditions["burn"]["length"] <= 0:
                            del u.conditions["burn"]

        for i in self.units:
            for u in self.units[i]:
                if u.state == "attack" and u.stateData: #stateData is target of attack
                    goodToAttack = True
                    target = u.stateData
                    if type(target) == str:
                        target = self.getUnitFromID(target)
                    #"onlyHit" means attacker can only attack certain unit types
                    if 'onlyHit' in u.abilities: 
                        if not (target.type in u.abilities['onlyHit']):
                            goodToAttack = False
                    if hasattr(target, "cloaked"):
                        if hasattr(target, "detectedBy"):
                            if not (i in target.detectedBy):
                                goodToAttack = False
                        else:
                            goodToAttack = False

                    print(vars(u))
                    if goodToAttack and checkRange(u, target) <= u.range:#Check if in range
                        if not (target in hurtList): 
                            hurtList[target] = 0
                            hunterList[target] = u
                        print("HURT",u.name, damageCalc(u, target), target.name)
                        hurtList[target] += damageCalc(u, target)

                        if 'attackCondition' in u.abilities: # "attackCondition" means a condition is applied when an attack is performed
                            # u.abilities['attackCondition'][0] is condition name
                            # u.abilities['attackCondition'][1] is condition length
                            Condition = u.abilities["attackCondition"][0]
                            Length = u.abilities["attackCondition"][1]
                            if not hasattr(target,"conditions"):
                                target.conditions = {}
                            if Condition in target.conditions:
                                target.conditions[Condition] = {"length":Length + target.conditions[Condition]["length"]}
                            else:
                                target.conditions[Condition] = {"length":Length}
                        
                if 'decay' in u.abilities: # "decays" means unit takes damage every round equal to the ability's amount
                    if not (u in hurtList): 
                        hurtList[u] = 0
                    hurtList[u] +=  u.abilities['decay']
        print("HUNTER list", hunterList)
        for v in hunterList:
            print(v.name,':', hunterList[v])
            if 'kamikaze' in v.abilities: # "kamikaze" means you die when you attack
                v.health = -10
        #Heal
        for i in self.units:
            for u in self.units[i]:
                if u.state == "heal" and u.stateData: #stateData is target of heal
                    goodToHeal = True
                    target = u.stateData
                    if type(target) == str:
                        target = self.getUnitFromID(target)
                    #"onlyHeal" means attacker can only heal certain unit types
                    if 'onlyHeal' in u.abilities:
                        targetType = False
                        if type(target) == dict:
                            targetType = target["type"]
                        else:
                            targetType = target.type
                        if not (targetType in u.abilities['onlyHeal']):
                            goodToHeal = False
                    print(vars(u))
                    if goodToHeal and checkRange(u, target) <= u.range:#Check if in range
                        if not (target in hurtList): 
                            hurtList[target] = 0
                        heal = UnitDB[u.name].get('heal') or 5
                        print("Heal",u.name, heal, target.name)
                        hurtList[target] -= heal #We use hurt list for healing too
        
        for u in hurtList:#Units get hurt/healed
            print(u.name, "took", hurtList[u])
            u.health-=hurtList[u]
        RemoveList = []
        parent_link_chain_List = []
        for i in self.units:#Destroy units with 0 or less health & set to max health anyone who is over
            for u in self.units[i]:
                if u.health <= 0:
                    RemoveList.append(u)
                    #"parent_link" means all children are destroyed when the parent is destroyed
                    if 'parent_link' in u.abilities: 
                        parent_link_chain_List.append(u)
                elif u.health > u.maxHealth:
                    u.health = u.maxHealth

        extraRemoveList = []
        
        while len(parent_link_chain_List) > 0:
            u = parent_link_chain_List[0]
            parent_link_chain_List.pop(0)
            player = self.getPlayerfromUnit(u)
            for u2 in self.units[player]:
                u2Parent = False
                if type(u2) == dict: #In case the u2 is a dict
                    u2Parent = u2["parent"]
                else:
                    u2Parent = u2.parent
                if u2Parent:
                    if u2Parent == u.UnitID and not(u2 in RemoveList):
                        extraRemoveList.append(u2)
                        if 'parent_link' in u2.abilities: 
                            parent_link_chain_List.append(u2)

        RemoveList += extraRemoveList

        for u in RemoveList: # Hunter Events (happens before destroy in case hunter is removed)     
            GoodToDeathSpawn = True #Small check used to make sure "deathspawn" is good to go (things preventing it include "convert")

            if u in hunterList: #For abilities that the hunters may have.
                hunter = hunterList[u]
                print('there is a hunter', hunter.name, hunter)
                hunterPlayer = self.getPlayerfromUnit(hunter)
                self.scores[hunterPlayer] += int(u.score/2)
                
                #"takeover" means a unit is built in dead unit's space
                if 'takeover' in hunter.abilities:
                    if checkRange(hunter,u) <= 1:
                        hunter.state = 'build'
                        hunter.stateData = [u.position,hunter.abilities['takeover']]
                #"charge" means hunter moves into dead unit's space
                elif 'charge' in hunter.abilities: 
                    print('CHAAAARGEE')
                    if checkRange(hunter,u) <= 1:
                        print('It should work')
                        hunter.state = 'move'
                        hunter.stateData = u.position
                #"convert" means the defeated unit joins the opposing team (potential for broken combos with cross faction units)
                elif 'convert' in hunter.abilities:
                    print("philsophy")
                    newUnit = self.newUnit(u.position,u.name,None, u.score)
                    self.upgradeUnit(newUnit, hunterPlayer)
                    self.scores[hunterPlayer] += u.score
                    self.units[hunterPlayer].append(newUnit)

                    GoodToDeathSpawn = False
                #"claimable" means it will spawn a copy of itself, owned by a different player.
                elif 'claimable' in u.abilities: 
                    player = self.getPlayerfromUnit(u)
                    if player == "neutral":
                        newUnitName = u.name
                        if (u.name in FactionUnits) and (hunterPlayer in self.factions) and (self.factions[hunterPlayer] in FactionUnits[u.name]):
                            newUnitName = FactionUnits[u.name][self.factions[hunterPlayer]]
                        newUnit = self.newUnit(u.position,newUnitName,None, u.score)
                        self.upgradeUnit(newUnit, hunterPlayer)
                        
                        self.scores[hunterPlayer] += u.score
                        self.units[hunterPlayer].append(newUnit)

                        GoodToDeathSpawn = False
                    else:
                        newUnit = self.newUnit(u.position,u.name,None, u.score)
                        self.units["neutral"].append(newUnit)

                        GoodToDeathSpawn = False
                #"reclaimable" means it will spawn a certain unit, owned by a different player.
                elif 'reclaimable' in u.abilities: 
                    player = self.getPlayerfromUnit(u)
                    if player == "neutral":
                        newUnit = self.newUnit(u.position,u.abilities['reclaimable'],None, u.score)
                        self.upgradeUnit(newUnit, hunterPlayer)
                        
                        self.scores[hunterPlayer] += u.score
                        self.units[hunterPlayer].append(newUnit)

                        GoodToDeathSpawn = False
                    else:
                        newUnit = self.newUnit(u.position,u.abilities['reclaimable'],None, u.score)
                        self.units["neutral"].append(newUnit)

                        GoodToDeathSpawn = False
            
            if GoodToDeathSpawn and 'deathSpawn' in u.abilities:
                newUnit = self.newUnit(u.position,u.abilities['deathSpawn'],u.UnitID)
                self.upgradeUnit(newUnit, i)

                #"default_transport" means this transporter unit starts with a list of units in its cargo
                if 'default_transport' in newUnit.abilities:
                    #Kind of neglecting score here
                    newUnit.carrying = []
                    newUnit.population = len(newUnit.abilities['default_transport'])
                    for transporteeName in newUnit.abilities['default_transport']:
                        #Same default position (though doesn't matter since transported)
                        transportee = self.newUnit(newUnit.position,transporteeName) 
                        self.upgradeUnit(transportee, i)
                        newUnit.carrying.append(transportee)

                self.units[self.getPlayerfromUnit(u)].append(newUnit)

        for u in RemoveList:#more destroy
            print(u, u.name, 'is destroyed')
            player = self.getPlayerfromUnit(u)
            if u.parent:
                par = self.getUnitFromID(u.parent)
                if par:
                    if getattr(par,'maxPopulation',False): #Reduces population of parent
                        par.population = max(0,par.population-1)
            if hasattr(u, "carrying"):
                for u2 in u.carrying:
                    u2Parent = False
                    u2Score = 0
                    if type(u2) == dict: #In case the u2 is a dict
                        u2Parent = u2["parent"]
                        u2Score = u2["score"]
                    else:
                        u2Parent = u2.parent
                        u2Score = u2.score
                    if u2Parent:
                        par = self.getUnitFromID(u2Parent)
                        if par:
                            if getattr(par,'maxPopulation',False): #Reduces population of parent
                                par.population = max(0,par.population-1)
                    
                    u.score += u2Score # Add transportee's score to transporter when transporter is removed
            self.scores[player] -= int(u.score/2)
            self.units[player].remove(u)
        
        for i in self.units:#Turn off attack of dead targets
            for u in self.units[i]:
                if u.state == "attack" or u.state == "heal" or u.state == "resupply":
                    target = u.stateData
                    if type(target) == str:
                        target = self.getUnitFromID(target)
                    if target == None:
                        u.state = None
                        u.stateData = None
                    elif target.health <= 0:
                        u.state = None
                        u.stateData = None
                    """
                    if u.stateData.health <= 0:
                        u.state = None
                        u.stateData = None
                    """
        #Movement
        BlockedSpaces = []
        Grid = methods.intToList(self.intGrid, self.width)
        
        for i in self.units:
            for u in self.units[i]:
                BlockedSpaces.append(u.position)
        while True: #continually tries to move units until a cycle goes with no units moving
            cont = False
            for i in self.units:
                for u in self.units[i]:
                    if u.state == "move":
                        if checkRange(u, u.stateData) <= u.speed:
                            if not u.stateData in BlockedSpaces:#If open, move
                                water = Grid[u.stateData[1]][u.stateData[0]]
                                if (water == (u.type == 'boat')) or u.type == "aircraft":
                                    BlockedSpaces.remove(u.position)
                                    u.position = u.stateData
                                    u.state = None
                                    u.stateData = None
                                    BlockedSpaces.append(u.position)
                                    cont = True
            if cont:
                continue
            break

        #Move into Transports

        RemoveList = [] #Reset RemoveList to remove transported units

        for i in self.units:
            for u in self.units[i]:
                if u.state == "move":
                    if checkRange(u, u.stateData) <= u.speed:
                        transportUnit = self.getUnitFromPos(i,u.stateData[0],u.stateData[1])
                        if transportUnit:
                            if "transport" in transportUnit.abilities:
                                #We also need extra checks to see if it was valid
                                if not u.type in transportUnit.abilities["transport"]:
                                    continue
                                if transportUnit.population >= transportUnit.maxPopulation:
                                    continue
                                RemoveList.append(u)#self.units[i].remove(u)
                                if hasattr(transportUnit, "carrying"):
                                    transportUnit.carrying.append(u)
                                else:
                                    transportUnit.carrying = [u]
                                transportUnit.population += 1

        for u in RemoveList:
            self.units[self.getPlayerfromUnit(u)].remove(u)

        #Drop off transported units
        for i in self.units:
            for u in self.units[i]:
                if u.state == "transport":#State data is list [0] is pos, [1] is name
                    print("stateData",u.stateData)
                    if not u.stateData[0] in BlockedSpaces:
                        
                        transportedUnit = None
                        transportedUnitUnchanged = None #Unchanged version of transported Unit so we can remove it later
                        for v in u.carrying: #May need to check that unit has carrying attribute
                            vName = False
                            if type(v) == dict:
                                vName = v["name"]
                            else:
                                vName = v.name
                            if vName == u.stateData[1]:
                                transportedUnit = v
                                transportedUnitUnchanged = v
                                if type(transportedUnit) == dict:
                                    transportedUnit = UnitMaker(transportedUnit)
                        
                        if transportedUnit == None: #Just in case unit can't be found
                            u.state = None
                            u.stateData = None
                            continue
                        
                        #Make Sure water is valid for unit type
                        water = Grid[u.stateData[0][1]][u.stateData[0][0]]
                        if not ((water == (transportedUnit.type == 'boat')) or transportedUnit.type == "aircraft"):
                            continue

                        if transportedUnit:
                            u.carrying.remove(transportedUnitUnchanged)
                            self.units[i].append(transportedUnit)
                            transportedUnit.position = u.stateData[0]
                            transportedUnit.state = None
                            transportedUnit.stateData = None
                            transportedUnit.transporter = u.UnitID #So the animation knows where this unit came from
                            BlockedSpaces.append(u.stateData[0])
                            u.population -= 1
                        u.state = None
                        u.stateData = None

        UpgradeRemoveList = []

        #Build and Upgrade
        for i in self.units:
            for u in self.units[i]:
                if u.state == "build":#State data is list [0] is pos, [1] is name
                    if not u.stateData[0] in BlockedSpaces:#if not blocked
                        affordable = CheckIfGoodToBuild(self, i, u, Grid)#True
                        """
                        for v in UnitDB[u.stateData[1]]['cost']:
                            if self.resources[i][v] < UnitDB[u.stateData[1]]['cost'][v]:#Check each resource
                                affordable = False #If too expensive, ignore build
                        if getattr(u,'maxPopulation',False):
                            if u.population >= u.maxPopulation:
                                affordable = False #Max popultion reached
                        if checkRange(u, u.stateData[0]) > u.range:
                            affordable = False #Can't build out of range
                        t = UnitDB[u.stateData[1]].get('type') or 0
                        if Grid[u.stateData[0][1]][u.stateData[0][0]]:#on Water
                            if t not in ['aircraft', 'boat']:
                                affordable = False #Can't build type on water
                        else:#on land
                            if t == 'boat':
                                affordable = False #Can't build boat on land
                        if affordable and t == 'building':#Can't build buildings near enemy buildings
                            Range = UnitDB[u.stateData[1]].get('range') or 1
                            for v in getRangeCircles(self,u,Range,u.stateData[0], True):
                                unit = self.getAnyUnitFromPos(v[0],v[1])
                                if unit and unit.type == 'building':
                                    if not self.checkFriendly(u,unit):
                                        affordable = False
                        """
                        if affordable:
                            if getattr(u,'maxPopulation',False): #increase population
                                u.population += 1
                            if getattr(u,'maxSupplies',False): #decrease supplies
                                u.supplies -= 1
                            cost = UnitDB[u.stateData[1]]['cost']
                            #"costly" increases cost of unit based on how many the player already owns
                            if 'abilities' in UnitDB[u.stateData[1]] and 'costly' in UnitDB[u.stateData[1]]['abilities']:
                                cost = copy.copy(cost)
                                count = getCount(u.stateData[1], i,self)
                                for v in cost:
                                    cost[v] = int(cost[v]*(UnitDB[u.stateData[1]]['abilities']['costly']**count)//5*5)


                            score = 0
                            for v in cost:#player loses resources
                                self.resources[i][v] -= cost[v]
                                score += cost[v] #Awards points for each cost when building
                            BlockedSpaces.append(u.stateData[0])

                            self.scores[i] += score

                            newUnit = self.newUnit(u.stateData[0],u.stateData[1],u.UnitID, score)
                            self.upgradeUnit(newUnit, i)
                            self.units[i].append(newUnit)

                            #"default_transport" means this transporter unit starts with a list of units in its cargo
                            if 'default_transport' in newUnit.abilities:
                                #Kind of neglecting score here
                                newUnit.carrying = []
                                newUnit.population = len(newUnit.abilities['default_transport'])
                                for transporteeName in newUnit.abilities['default_transport']:
                                    #Same default position (though doesn't matter since transported)
                                    transportee = self.newUnit(u.stateData[0],transporteeName) 
                                    self.upgradeUnit(transportee, i)
                                    newUnit.carrying.append(transportee)
                            

                            #"multibuild" tries to build multiple units at once
                            if 'multibuild' in u.abilities:
                                for k in range(u.abilities['multibuild']):
                                    tiles = getRangeCircles(self, u)
                                    for j in range(len(tiles)):
                                        pos = random.choice(tiles)
                                        if (not pos in BlockedSpaces) and CheckIfGoodToBuild(self, i, u, Grid, pos):
                                            self.units[i].append(self.newUnit(pos,u.stateData[1],u.UnitID))
                                            BlockedSpaces.append(pos)
                                            if getattr(u,'maxPopulation',False):
                                                u.population += 1
                                            if getattr(u,'maxSupplies',False):
                                                u.supplies -= 1
                                            break
                                        else:
                                            tiles.remove(pos)
                            
                            u.state = None
                            u.stateData = None
                elif u.state == "upgrade":
                    affordable = CheckIfGoodToBuild(self, i, u, Grid, pos = u.position)
                    if affordable:
                        cost = UnitDB[u.stateData]['cost']
                        #"costly" increases cost of unit based on how many the player already owns
                        if 'abilities' in UnitDB[u.stateData] and 'costly' in UnitDB[u.stateData]['abilities']:
                            cost = copy.copy(cost)
                            count = getCount(u.stateData, i,self)
                            for v in cost:
                                cost[v] = int(cost[v]*(UnitDB[u.stateData]['abilities']['costly']**count)//5*5)

                        score = 0
                        for v in cost:#player loses resources
                            self.resources[i][v] -= cost[v]
                            score += cost[v] #Awards points for each cost when building
                        
                        self.scores[i] += score

                        newUnit = self.newUnit(u.position,u.stateData, u.parent, score + u.score)
                        newUnit.UnitID = u.UnitID
                        if getattr(u,'maxPopulation',False) and getattr(newUnit,'maxPopulation',False):
                            newUnit.population = u.population
                        if getattr(u,'maxSupplies',False) and getattr(newUnit,'maxSupplies',False):
                            newUnit.supplies = newUnit.maxSupplies - (u.maxSupplies - u.supplies)
                        newUnit.health = newUnit.maxHealth - (u.maxHealth - u.health)
                        self.upgradeUnit(newUnit, i)
                        self.units[i].append(newUnit)

                        UpgradeRemoveList.append(u)
                        

        for u in UpgradeRemoveList:
            player = self.getPlayerfromUnit(u)
            self.units[player].remove(u)


        #Cloak

        #Disable cloaks of units that are being moved into
        for i in self.units:
            for u in self.units[i]:
                if u.state == "move":
                    blockerUnit = self.getAnyUnitFromPos(u.stateData[0], u.stateData[1])
                    if blockerUnit and hasattr(blockerUnit, "cloaked"):
                        del blockerUnit.cloaked
                        if blockerUnit.state == "cloak":
                            blockerUnit.state = None
                        if hasattr(u, "cloaked"): # If cloaked unit moves into cloaked unit, they both lose cloaked
                            del u.cloaked
                            if u.state == "cloak":
                                u.state = None
                elif u.state == "transport" or u.state == "build":
                    blockerUnit = self.getAnyUnitFromPos(u.stateData[0][0], u.stateData[0][1])
                    if blockerUnit and hasattr(blockerUnit, "cloaked"):
                        del blockerUnit.cloaked
                        if blockerUnit.state == "cloak":
                            blockerUnit.state = None

        #Toggle Cloaks
        for i in self.units:
            for u in self.units[i]:
                if u.state == "cloak":
                    if hasattr(u, "cloaked"):
                        del u.cloaked
                    else:
                        u.cloaked = True
                    u.state = None

        #Research
        for playerNum in self.units:
            for u in self.units[playerNum]:
                if u.state == "research":#stateData is the tech
                    tech = u.stateData
                    if tech in self.tech[playerNum]:#If they already have the tech, don't research it
                        continue
                    if TechDB[tech]['cost'] > self.resources[playerNum]["energy"]:#Can't afford
                        continue
                    if not tech in self.progress[playerNum]:
                        self.progress[playerNum][tech] = 0
                    ResearchRate = 1
                    if 'fast research' in u.abilities:
                        ResearchRate = u.abilities['fast research']
                    self.progress[playerNum][tech] += ResearchRate
                    self.resources[playerNum]["energy"] -= TechDB[tech]['cost']
                    if self.progress[playerNum][tech] >= TechDB[tech]['time']:#When we have researched enough to unlock
                        self.tech[playerNum].append(tech)
                        self.upgradeCurrentUnits(playerNum, tech)
                        u.state = None
                        u.stateData = None
                        del self.progress[playerNum][tech]

        #Capout Resources at 2000
        cap = 2000
        for i in self.resources:
            for v in self.resources[i]:
                if self.resources[i][v] > cap:
                    self.resources[i][v] = cap

        print("Right about HERE:")
        print(buffedUnitOrignals)
        for unit in buffedUnitOrignals:
            for targetStat in buffedUnitOrignals[unit]:
                print("buff was reversed")
                if targetStat == "production":
                    unit.resourceGen = buffedUnitOrignals[unit][targetStat]
                else:
                    setattr(unit, targetStat, buffedUnitOrignals[unit][targetStat])
        
        #Fix incorrect and invalid states
        for i in self.units:
            for u in self.units[i]:
                if u.state == "attack": #Turn off attack of out-of-range targets
                    target = u.stateData
                    if type(target) == str:
                        target = self.getUnitFromID(target)
                    if checkRange(u, target) > u.range:
                        u.state = None
                        u.stateData = None
                elif u.state == "heal": #Turn off heal of out-of-range and full health targets
                    target = u.stateData
                    if type(target) == str:
                        target = self.getUnitFromID(target)
                    if checkRange(u, target) > u.range or target.health >= target.maxHealth:
                        u.state = None
                        u.stateData = None
                elif u.state == "resupply": #Turn off resupply of out-of-range and fully supplied targets
                    target = u.stateData
                    if type(target) == str:
                        target = self.getUnitFromID(target)
                    if checkRange(u, target) > u.range or (getattr(target, "maxSupplies",False) and target.supplies >= target.maxSupplies):
                        u.state = None
                        u.stateData = None

        for i in self.units:
            for u in self.units[i]:
                pass#u.state = None
                #u.stateData = None

        self.saveGame()
        self.addIndicatorsToStateFile()

        print('MORE stuff')
        
    def saveGame(self):#savefiles/games/
        #Path("source_data/text_files/raw_data.txt")
        
        #with open('savefiles\\games\\game_%s.txt' % self.id, 'w') as f:
        for i in self.units:
            for j in range(len(self.units[i])):
                if self.units[i][j].state == "attack" and ((type(self.units[i][j].stateData) == Unit) or (type(self.units[i][j].stateData) == UnitMaker)):
                    self.units[i][j].stateData = self.units[i][j].stateData.UnitID
                elif self.units[i][j].state == "heal" and ((type(self.units[i][j].stateData) == Unit) or (type(self.units[i][j].stateData) == UnitMaker)):
                    self.units[i][j].stateData = self.units[i][j].stateData.UnitID

        with open(Path("savefiles/games/game_%s.txt" % self.id), 'w') as f:
            f.write(self.getJSON())
        
        clearAndReWrite = False
        
        with open(Path("savefiles/games/game_%s.txt" % self.id), 'r') as f:
            try:
                if (f.read() != self.getJSON()):
                    clearAndReWrite = True
            except:
                print("An exception occurred")
                clearAndReWrite = True
        
        if clearAndReWrite:
            with open(Path("savefiles/games/game_%s.txt" % self.id), 'r+') as f:
                f.truncate(0)
            with open(Path("savefiles/games/game_%s.txt" % self.id), 'w') as f:
                f.write(self.getJSON())
            print("REQ WROTE THE DEAL")
    
    def newUnit(self, pos = [0,0], name = 'soldier', parent= None, score = -1):
        self.currentUnitID += 1
        return Unit(pos = pos, name = name, parent= parent, score = score, givenID = self.currentUnitID)
                            

#This part recreates the game from JSON from the server
class GameMaker(Game):
    def __init__(self, text):
        #print("TEST", text)
        #text = methods.unzipper(text)
        #print(text)
        dictionary = None
        for i in range(20):
            try:
                print("ATTEMPTING")
                dictionary = json.loads(text)
                break
            except json.decoder.JSONDecodeError as e:
                print("THE TEXT", text)
                print('e',e)
                if not e.args[0].startswith("Expecting ',' delimiter:"):
                    raise
                text = ','.join((text[:e.pos], text[e.pos:]))
        else:
            print("Stuff")
            raise Exception("Uhhh....something happened, (delimeter comma thing)") 
        for k, v in dictionary.items():
            if type(v) == dict:
                l = []
                for v2 in v:
                    l.append(v2)
                for v2 in l:
                    if v2 == "neutral" or v2 == "rebel":
                        continue
                    v[int(v2)] = v[v2]
                    del(v[v2])
            setattr(self, k, v)
        #print(dictionary)
        for i in self.units:
            for j in range(len(self.units[i])):
                self.units[i][j] = UnitMaker(self.units[i][j])
        
        for i in self.units:
            for j in range(len(self.units[i])):
                if self.units[i][j].state == "attack" and type(self.units[i][j].stateData) == str:
                    print("Okay... I'm going to do the thing")
                    print("thingL:", self.units[i][j].stateData)
                    new = self.getUnitFromID2(self.units[i][j].stateData)
                    print("dfdfjkdrhjdhj")
                    self.units[i][j].stateData = new
                elif self.units[i][j].state == "heal" and type(self.units[i][j].stateData) == str:
                    print("Okay... I'm going to do the thing")
                    print("thingL:", self.units[i][j].stateData)
                    new = self.getUnitFromID2(self.units[i][j].stateData)
                    print("dfdfjkdrhjdhj")
                    self.units[i][j].stateData = new

#Saves action from client into state file
def stateStuff(id = 2,player = 0, received = ":::"):
    data = None

    try:
        with open(Path("savefiles/states/game_%s.json" % id), "r") as f:
            data = json.load(f)
    except:
        print("there was an exception")
        pass

    if data == None:
        print("panik")
        data = {}
    
    if str(player) not in data:
        data[str(player)] = {}

    
    unitID = received[:received.find(":")]
    state = received[received.find(":")+1:]

    data[str(player)][unitID] = state

    with open(Path("savefiles/states/game_%s.json" % id), 'w') as f:
        json.dump(data, f)