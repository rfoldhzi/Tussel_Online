from units import UnitDB

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

class Unit:
    def __init__(self, UnitName:str, pos:tuple):
        self.pos = pos


def checkIfCanCounter(attacker:Unit, defender:Unit):
    if "counter" in UnitDB[defender.name]:
        counterPoints = findPatternPoints(UnitDB[defender.name]["counterPattern"],defender.pos)
        if attacker.pos in counterPoints:
            return False
    return True

def placeUnit(self, unitName:str, pos:tuple, thisPlayer: str):

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



