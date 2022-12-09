import random
from UnitDB import UnitDB

def findStartOffset(pattern):
    for y in range(len(pattern)):
        for x in range(len(pattern[0])):
            if pattern[y][x] == "S":
                return x,y
    return None


def getAttackPoints(pattern, pos):
    pass

class Unit:
    def __init__(self, name: str, player: str, pos: tuple, givenID: int):
        self.name = name.lower()
        self.health = UnitDB[name]["health"]
        self.player = player
        self.pos = pos
        self.UnitID = givenID

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
            
    def placeUnit(self, player: str, unitName: str, pos: tuple):

        self.currentUnitID += 1
        newUnit = Unit(unitName, player, pos, self.currentUnitID)
        self.units[player].append(newUnit)



