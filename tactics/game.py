import random
from UnitDB import UnitDB

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
    offsetX = startOffset[0]+pos[0]
    offsetY = startOffset[1]+pos[1]

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
            return False
    return True



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
        self.turn = 0
        self.id = id
        self.currentUnitID = 0
        
    #adds a new player and all revelant lists to the game object
    def addPlayer(self):
        p = str(len(self.units))
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
        if not self.start:
            self.start = True
            #Create decks and hands

            allCards = list(UnitDB.keys())

            for p in self.decks:
                for _ in range(30):
                    self.decks[p].append(random.choice(allCards))
                
                for _ in range(7):
                    self.hands[p].append(self.decks[p].pop(0))
            
    def placeUnit(self, thisPlayer: str, unitName: str, pos: tuple):
        self.currentUnitID += 1
        newUnit = Unit(unitName, thisPlayer, pos, self.currentUnitID)
        self.units[thisPlayer].append(newUnit)

        #TODO: Check Construction pattern

        abilities = UnitDB[unitName]["abilities"] or {}

        newUnit = Unit(unitName, pos)

        if "attack" in UnitDB[unitName]:
            attackPoints = findPatternPoints(UnitDB[unitName]["attackPattern"],pos)
            for player in self.units:
                if player != thisPlayer or "explosive" in abilities:
                    for unit in self.units[player]:
                        if unit.pos in attackPoints:
                            unit.health -= UnitDB[unitName]["attack"] #TODO account for defense
                            if checkIfCanCounter(newUnit, unit):
                                newUnit.health -= UnitDB[unit.name]["counter"]
        
        if "heal" in UnitDB[unitName]:
            healPoints = findPatternPoints(UnitDB[unitName]["healPattern"],pos)
            for unit in self.units[thisPlayer]:
                if unit.pos in healPoints:
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
                #TODO penalties
                self.units[player].remove(unit)
        
        #Don't generate anything if the newUnit has died
        if newUnit.health <= 0:
            return

        #Generation Patterns
        for unit in self.units[thisPlayer]:
            if "generation" in UnitDB[unit.name]:
                generationPoints = findPatternPoints(UnitDB[unitName]["generationPattern"],unit.pos)
                if pos in generationPoints:
                    pass#TODO Get resources
        
        #Tech increase
        if "tech" in UnitDB[unitName]:
            self.tech[thisPlayer] += UnitDB[unitName]["tech"]

        return    


