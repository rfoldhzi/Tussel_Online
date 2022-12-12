import random, json, copy
from tactics.UnitDB import UnitDB
from pathlib import Path
from json import JSONEncoder

class Unit:
    def __init__(self, name: str, player: str, pos: tuple, givenID: int):
        self.name = name.lower()
        self.health = UnitDB[name]["health"]
        self.player = player
        self.pos = pos
        self.UnitID = givenID

def findStartSpot(pattern: tuple):
    for y in range(len(pattern)):
        for x in range(len(pattern[0])):
            if pattern[y][x] == 'S':
                return x,y
    return None

def findPatternPoints(pattern: tuple, pos:tuple):
    startOffset = findStartSpot(pattern=pattern)
    offsetX = pos[0]-startOffset[0]
    offsetY = pos[1]-startOffset[1]

    points = []
    for y in range(len(pattern)):
        for x in range(len(pattern[0])):
            if pattern[y][x] == 'X':
                points.append((x+offsetX,y+offsetY))
    
    return points

def checkIfCanCounter(attacker:Unit, defender:Unit):
    if "counter" in UnitDB[defender.name]:
        counterPoints = findPatternPoints(UnitDB[defender.name]["counterPattern"],defender.pos)
        if attacker.pos in counterPoints:
            return True
    return False



class Game:
    #Creates a new game and initilizes all settings and the map
    def __init__(self, id = 0):
        self.units = {} #Store players' units
        self.decks = {}
        self.hands = {}
        self.discardpiles = {}
        self.resources = {} #Store players' resource counts
        self.went = {}
        self.tech = {}
        self.scores = {}
        self.ready = False
        self.started = False
        self.currentPlayerTurn = None
        self.playerOrder = []
        self.width = 10
        self.height = 10
        self.turn = 0
        self.id = id
        self.currentUnitID = 0

        
    #adds a new player and all revelant lists to the game object
    def addPlayer(self, p:str = None):
        if p == None:
            p = str(len(self.units))
        #p = str(len(self.units))
        self.units[p] = []
        self.decks[p] = []
        self.hands[p] = []
        self.discardpiles = []
        self.resources[p] = 4
        self.went[p] = False
        self.tech[p] = 0
        self.scores[p] = 0
    
    #Starts the game and finds starting spots for each of the player's towns
    def start(self):
        if not self.started:
            print("Starting up")
            self.started = True
            #Create decks and hands

            allCards = list(UnitDB.keys())

            self.playerOrder = []

            for p in self.decks:
                self.playerOrder.append(p)
                for _ in range(30):
                    self.decks[p].append(random.choice(allCards))
                
                for _ in range(7):
                    self.hands[p].append(self.decks[p].pop(0))
            
            self.currentPlayerTurn =  self.playerOrder[0]
            
    def decodeAction(self, player:str, data:str):
        split = data.split(':')
        card = split[0]
        pos = (int(split[1]),int(split[2]))
        self.playerAction(thisPlayer=player, card=card, pos=pos)

    def playerAction(self, thisPlayer:str, card:str, pos:tuple):
        print("performing player action")
        #First, we do checks to ensure this is a valid play
        if self.currentPlayerTurn != thisPlayer: #has to be this player's turn to play a card
            print("it is not %s's turn. It is %s's turn" % (thisPlayer, self.currentPlayerTurn))
            return

        if not card in self.hands[thisPlayer]: #Player must have card to play card
            print("%s doesn't have %s in their hand of %s" % (thisPlayer, card, self.hands[thisPlayer]))
            return
        if pos[0] < 0 or pos[0] >= self.width or pos[1] < 0 or pos[1] >= self.height: #Play must be in bounds
            print("The position x:%s, y:%s is out of bounds"%(pos[0],pos[1]))
            return

        for player in self.units:
            for unit in self.units[player]:
                if unit.pos == pos: #Can't play on top of any units
                    print("there is already a %s at %s" % (unit.name, str(pos)))
                    return
        
        if self.resources[thisPlayer] < UnitDB[card]["cost"]:
            print("You afford a %s cost %s with only %s resources, %s" % (UnitDB[card]["cost"], card, self.resources[thisPlayer], thisPlayer))
            return

        print("passed all checks!")
        
        #Now we handle removing the card from the hand
        self.hands[thisPlayer].remove(card)

        #and now we place the unit and see all of the effects
        self.placeUnit(thisPlayer=thisPlayer, unitName=card,pos=pos)

        #And finally we draw a card (if deck isn't empty) and gain a resource
        if len(self.decks[thisPlayer]) > 0:
            self.hands[thisPlayer].append(self.decks[thisPlayer].pop(0))
        
        print("old resources",self.resources[thisPlayer])
        self.resources[thisPlayer] += 1
        print("new resources",self.resources[thisPlayer])

        self.turn += 1
        #set it to the next player's turn
        self.currentPlayerTurn = self.playerOrder[(self.playerOrder.index(self.currentPlayerTurn)+1)%len(self.playerOrder)] 
            
    def placeUnit(self, thisPlayer: str, unitName: str, pos: tuple):

        print("creating unit")
        self.currentUnitID += 1
        newUnit = Unit(unitName, thisPlayer, pos, self.currentUnitID)
        self.units[thisPlayer].append(newUnit)
        self.resources[thisPlayer] -= UnitDB[unitName]["cost"]
        print(str(self.units[thisPlayer]))
        print("unit created", newUnit)

        #TODO: Check Construction pattern

        abilities = UnitDB[unitName].get("abilities",{})
        print("abilities that we have",abilities)
        print("do we have explosive?","explosive" in abilities)

        if "attack" in UnitDB[unitName]:
            attackPoints = findPatternPoints(UnitDB[unitName]["attackPattern"],pos)
            for player in self.units:
                if player != thisPlayer or ("explosive" in abilities):
                    for unit in self.units[player]:
                        if unit.pos in attackPoints:
                            unit.health -= UnitDB[unitName]["attack"] #TODO account for defense
                            if checkIfCanCounter(newUnit, unit):
                                newUnit.health -= UnitDB[unit.name]["counter"]
        
        if "heal" in UnitDB[unitName]:
            healPoints = findPatternPoints(UnitDB[unitName]["healPattern"],pos)
            print("healPoints",healPoints)
            for unit in self.units[thisPlayer]:
                print("unit.name",unit.name,"pos",unit.pos)
                if unit.pos in healPoints:
                    print("found",unit.name,"in heal range")
                    unit.health += UnitDB[unitName]["heal"]
                    #TODO ensure don't go over max health
        
        #Trap Patterns
        for player in self.units:
            if player != thisPlayer:
                for unit in self.units[player]:
                    if "trap" in UnitDB[unit.name]:
                        trapPoints = findPatternPoints(UnitDB[unitName]["trapPattern"],unit.pos)
                        if pos in trapPoints:
                            newUnit.health -= UnitDB[unitName]["trap"] #TODO Defense

        #Destroy with no health units
        RemoveList = {}
        for player in self.units:
            RemoveList[player] = []
            for unit in self.units[player]:
                if unit.health <= 0:
                    RemoveList[player].append(unit)
        #Actual removal
        for player in RemoveList:
            for unit in RemoveList[player]:
                for item in UnitDB[unit.name]["penalty"]:
                    if item == "discard":
                        if len(self.hands[player]) > 0:
                            self.hands[player].pop(0)
                        #TODO if out of cards, this player loses
                    elif item == "resource":
                        if self.resources[player] <= 0:
                            if len(self.hands[player]) > 0:
                                self.hands[player].pop(0)
                            #TODO if out of cards, this player loses
                        else:
                            self.resources[player] -= 1
                    elif item == "mill":
                        if len(self.decks[player]) <= 0:
                            if len(self.hands[player]) > 0:
                                self.hands[player].pop(0)
                            #TODO if out of cards, this player loses
                        else:
                            self.decks[player].pop(0)

                self.units[player].remove(unit)
        
        #Don't generate anything if the newUnit has died
        if newUnit.health <= 0:
            return

        #Generation Patterns
        for unit in self.units[thisPlayer]:
            if "generation" in UnitDB[unit.name]:
                print("fonud a generationner")
                generationPoints = findPatternPoints(UnitDB[unit.name]["generationPattern"],unit.pos)
                if pos in generationPoints:
                    print("AND we are close to it!")
                    for item in UnitDB[unit.name]["generation"]:
                        print("the item we get is",item)
                        if item == "card":
                            if len(self.decks[thisPlayer]) > 0:
                                self.hands[thisPlayer].push(self.decks[player].pop(0))
                        elif item == "resource":
                            print("yay money")
                            self.resources[thisPlayer] += 1
        
        #Tech increase
        if "tech" in UnitDB[unitName]:
            self.tech[thisPlayer] += UnitDB[unitName]["tech"]

        return    

    def getJSON(self):
        SELF = self
        uncopied = True
        JSONData = json.dumps(SELF, indent=0, cls=Encoder)
        JSONData = str(JSONData)
        JSONData = JSONData.replace("\n", '')
        JSONData = JSONData.replace(": ",':')
        return JSONData

    def saveGame(self):
        print("saving!!")
        with open(Path("savefiles/tactics_games/game_%s.txt" % self.id), 'w') as f:
            f.write(self.getJSON())

class Encoder(JSONEncoder):
        def default(self, o):
            #Posible thing to do is is find all units with attack as their state and change statedata to unitID
            return o.__dict__

class UnitMaker(Unit):
    def __init__(self, dictionary):
        for k, v in dictionary.items():
            setattr(self, k, v)

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
                #for v2 in l:
                #    if v2 == "neutral" or v2 == "rebel":
                #        continue
                #    v[int(v2)] = v[v2]
                #    del(v[v2])
            setattr(self, k, v)
        #print(dictionary)
        for i in self.units:
            for j in range(len(self.units[i])):
                self.units[i][j] = UnitMaker(self.units[i][j])
                self.units[i][j].pos = tuple(self.units[i][j].pos )