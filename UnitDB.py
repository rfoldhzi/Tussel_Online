UnitDB = {
    'soldier':{
        'cost': {'gold':20},
    },
    'scout':{
        'cost': {'gold':50},
        'speed':2,
        'defense':1
    },
    'heavy':{
        'cost': {'gold':50,'metal':25},
        'health': 12,
        'attack':3,
        'resourceGen':{
            "gold": 2
        }
    },
    'defender':{
        'cost': {'gold':20,'metal':10},
        'possibleBuilds': [],
        'possibleStates': ['move','attack','build'],
        'supplies': 2,
        'health': 15,
        'defense':3,
    },
    'sniper':{
        'cost': {'gold':125,'metal':20},
        'health': 7,
        'attack':3,
        'defense':1,
        'range':3,
        'abilities':{'onlyHit':['trooper', 'bot']},
    },
    'rocket':{
        'cost': {'gold':60,'metal':40},
        'possibleStates': ['move','attack'],
        'attack':3,
        'range':2,
        'resourceGen':{"gold": 0},
        'abilities':{'onlyHit':['vehicle','aircraft']},
    },
    'brute':{
        'cost': {'gold':50},
        'health': 20,
        'defense':1,
        "size": 0.65,
    },
    'ranger':{
        'cost': {'gold':50},
        'range':2,
    },
    'wall breaker':{
        'cost': {'gold':40},
        'possibleStates': ['move','attack'],
        'attack':4,
        'speed':2,
        'resourceGen':{"gold": 0},
        'abilities':{'onlyHit':['building'],'kamikaze':0},
    },
    'medic':{
        'cost': {'gold':50},
        'possibleStates': ['move','heal','resources'],
        'heal':10,
        'abilities':{'onlyHeal':['trooper']},
    },
    'general':{
        'cost': {'gold':300},
        'possibleStates': ['move','attack'],
        'abilities':{'buff':['attack', 1.5]},
    },
    'commander':{
        'cost': {'gold':150},
        'possibleStates': ['move','attack'],
        'abilities':{'buff':['defense', 1.75]},
    },
    'scientist':{
        'cost': {'gold':70,'energy':150},
        'possibleStates': ['move','resources','research'],
        'health': 5,
	    'defense': 1,
        'resourceGen':{
            "energy": 2
        }
    },
    'bot':{
        'cost': {'metal':25,'energy':5},
        'type': 'bot',
        'resourceGen':{
            "gold": 1,
            "metal": 1,
            "energy": 1
        }
    },
    'minibot':{
        'cost': {'metal':8,'energy':2},
        'possibleStates': ['move','attack'],
        'type': 'bot',
        'health': 5,
        'attack':1,
        'defense':1,
        'resourceGen':{
            "gold": 0,
            "metal": 0,
            "energy": 0
        },
        "size":0.75,
    },
    'megabot':{
        'cost': {'metal':70,'energy':50},
        'possibleBuilds': ['minibot'],
        'possibleStates': ['move','attack','resources', 'build'],
        'type': 'bot',
        'health': 15,
	    'attack': 2.5,
        'defense': 3.5,
        'population':2,
        'supplies':2,
        'resourceGen':{
            "gold": 0,
            "metal": 3,
            "energy": 1
        }
    },
    'mech':{
        'cost': {'metal':80,'energy':10},
        'possibleBuilds': ['minibot'],
        'possibleStates': ['move','attack', 'build'],
        'type': 'vehicle',
        'health': 15,
        'defense': 3,
        'population':2,
        'supplies':2,
        'resourceGen':{"gold": 0,}
    },
    'outpost':{
        'cost': {'gold':50, 'metal':50, 'energy':50},
        'possibleBuilds': ['radar tower','house','supply depot'],
        'possibleUpgrades': ['outpost ii'],
        'possibleStates': ['resources', 'build','upgrade'],
        'type': 'building',
        'health': 10,
        'population':1,
        'abilities':{'claimable':0,'parent_link':0},
        'resourceGen':{
            "gold": 10,
            "metal": 10,
            "energy": 10
        },
        "size":1,
    },
    'outpost ii':{
        'cost': {'gold':50, 'metal':50, 'energy':50},
        'possibleBuilds': ['radar tower','house','supply depot','factory','mine','power plant'],
        'possibleUpgrades': ['outpost iii'],
        'possibleStates': ['resources', 'build','upgrade'],
        'type': 'building',
        'health': 15,
        'population':2,
        'abilities':{'claimable':0,'parent_link':0},
        'resourceGen':{
            "gold": 12,
            "metal": 12,
            "energy": 12
        },
        "size":1,
        "baseUnit":"outpost"
    },
    'outpost iii':{
        'cost': {'gold':75, 'metal':75, 'energy':75},
        'possibleBuilds': ['radar tower','house','supply depot','factory','mine','power plant','turret'],
        'possibleStates': ['resources', 'build'],
        'type': 'building',
        'health': 20,
        'population':3,
        'abilities':{'claimable':0,'parent_link':0},
        'resourceGen':{
            "gold": 15,
            "metal": 15,
            "energy": 15
        },
        "size":1,
        "baseUnit":"outpost"
    },
    'rebel town':{
        'cost': {'gold':100, 'metal':100, 'energy':100},
        'possibleBuilds': ['barracks','factory','mine','soldier','brute'],
        'possibleStates': ['resources', 'build'],
        'type': 'building',
        'health': 30,
        'population':6,
        'abilities':{'reclaimable':'town','parent_link':0},
        'resourceGen':{
            "gold": 25,
            "metal": 25,
            "energy": 25
        },
        "size":1,
    },
    'town':{
        'cost': {'gold':100, 'metal':100, 'energy':100},
        'possibleBuilds': ['barracks','factory','mine','power plant'],
        'possibleUpgrades': ['town ii'],
        'possibleStates': ['resources', 'build','upgrade'],
        'type': 'building',
        'health': 30,
        'population':4,
        'abilities':{'claimable':0,'parent_link':0},
        'resourceGen':{
            "gold": 25,
            "metal": 25,
            "energy": 25
        },
        "size":1,
    },
    'town ii':{
        'cost': {'gold':50, 'metal':50, 'energy':50},
        'possibleBuilds': ['barracks','factory','mine','power plant','turret','docks','supply depot'],
        'possibleUpgrades': ['town iii'],
        'possibleStates': ['resources', 'build','upgrade','research'],
        'type': 'building',
        'health': 35,
        'population':5,
        'abilities':{'claimable':0,'parent_link':0},
        'resourceGen':{
            "gold": 28,
            "metal": 28,
            "energy": 28
        },
        "size":1,
        "baseUnit":"town"
    },
    'town iii':{
        'cost': {'gold':100, 'metal':100, 'energy':100},
        'possibleBuilds': ['barracks','factory','mine','power plant','turret','docks','supply depot','tank factory','house'],
        'possibleStates': ['resources', 'build','research'],
        'type': 'building',
        'health': 40,
        'population':6,
        'abilities':{'claimable':0,'parent_link':0},
        'resourceGen':{
            "gold": 30,
            "metal": 30,
            "energy": 30
        },
        "size":1,
        "baseUnit":"town"
    },
    'city':{
        'cost': {'gold':200, 'metal':200, 'energy':200},
        'possibleBuilds': ['barracks','factory','mine','power plant','turret','docks','supply depot','tank factory','house'],
        'possibleUpgrades': ['military city', 'civilian city'],
        'possibleStates': ['resources', 'build','upgrade','research'],
        'type': 'building',
        'health': 30,
        'population':5,
        'abilities':{'claimable':0,'parent_link':0},
        'resourceGen':{
            "gold": 30,
            "metal": 30,
            "energy": 30
        },
        "size":1,
    },
    'military city':{
        'cost': {'gold':100, 'metal':100, 'energy':100},
        'possibleBuilds': ['barracks','turret','docks','supply depot','tank factory','fort','anti air turret'],
        'possibleStates': ['resources', 'build'],
        'type': 'building',
        'health': 50,
        'population':5,
        'defense':4,
        'abilities':{'claimable':0,'parent_link':0},
        'resourceGen':{
            "gold": 30,
            "metal": 30,
            "energy": 30
        },
        "size":1,
        "baseUnit":"city"
    },
    'civilian city':{
        'cost': {'gold':100, 'metal':100, 'energy':100},
        'possibleBuilds': ['factory','mine','power plant','supply depot','house','workshop','hospital','research center'],
        'possibleStates': ['resources', 'build','research'],
        'type': 'building',
        'health': 30,
        'population':6,
        'defense':4,
        'abilities':{'claimable':0,'parent_link':0},
        'resourceGen':{
            "gold": 40,
            "metal": 40,
            "energy": 40
        },
        "size":1,
        "baseUnit":"city"
    },
    'rebel metropolis':{
        'cost': {'gold':250, 'metal':250, 'energy':250},
        'possibleBuilds': ['barracks','tank factory','factory','mine','soldier','brute','sniper','turret'],
        'possibleStates': ['resources', 'build',],
        'type': 'building',
        'health': 40,
        'population':10,
        'abilities':{'reclaimable':'metropolis','parent_link':0},
        'resourceGen':{
            "gold": 50,
            "metal": 50,
            "energy": 50
        },
        "size":1.1,
    },
    'metropolis':{
        'cost': {'gold':250, 'metal':250, 'energy':250},
        'possibleBuilds': ['tank factory','turret','workshop','research center'],
        'possibleUpgrades': ['metropolis ii'],
        'possibleStates': ['resources', 'build','upgrade','research'],
        'type': 'building',
        'health': 75,
        'population':6,
        'abilities':{'claimable':0,'parent_link':0},
        'resourceGen':{
            "gold": 50,
            "metal": 50,
            "energy": 50
        },
        "size":1.1,
    },
    'metropolis ii':{
        'cost': {'gold':250, 'metal':250, 'energy':250},
        'possibleBuilds': ['tank factory','turret','workshop','research center','hall of heroes','experimental facility'],
        'possibleUpgrades': ['metropolis iii'],
        'possibleStates': ['resources', 'build','upgrade','research'],
        'type': 'building',
        'health': 85,
        'population':7,
        'abilities':{'claimable':0,'parent_link':0},
        'resourceGen':{
            "gold": 60,
            "metal": 60,
            "energy": 60
        },
        "size":1.1,
        "baseUnit":"metropolis"
    },
    'metropolis iii':{
        'cost': {'gold':400, 'metal':400, 'energy':400},
        'possibleBuilds': ['tank factory','turret','workshop','research center','hall of heroes','experimental facility','shield generator','metropolis expansion'],
        'possibleStates': ['resources', 'build','research'],
        'type': 'building',
        'health': 100,
        'population':8,
        'abilities':{'claimable':0,'parent_link':0},
        'resourceGen':{
            "gold": 75,
            "metal": 75,
            "energy": 75
        },
        "size":1.1,
        "baseUnit":"metropolis"
    },
    'metropolis expansion':{
        'cost': {'gold':100, 'metal':100, 'energy':100},
        'possibleBuilds': ['factory','mine','power plant','supply depot','house','barracks','turret','workshop'],
        'possibleStates': ['resources', 'build'],
        'type': 'building',
        'health': 20,
        'population':3,
        'abilities':{'parent_link':0},
        'resourceGen':{
            "gold": 10,
            "metal": 10,
            "energy": 10
        },
        "size":1,
    },
    'construction worker':{
        'cost': {'gold':200},
        'possibleUpgrades': ['barracks','factory','turret','docks','supply depot'],
        'possibleStates': ['move','heal', 'upgrade'],
        'abilities':{'onlyHeal':['building']},
        'resourceGen':{
            "gold": 0,
            "metal": 0,
            "energy": 0
        }
    },
    'crane':{
        'cost': {'gold':200, 'metal':100},
        'possibleUpgrades': ['barracks','turret','docks','supply depot','tank factory','house'],
        'possibleStates': ['move','resources', 'upgrade'],
        'type': 'vehicle',
        'health':20,
        'defense':3,
        'resourceGen':{
            "gold": 0,
            "metal": 3,
            "energy": 0
        }
    },
    'mechanic':{
        'cost': {'gold':150, 'metal':40},
        'possibleBuilds': ['bot'],
        'possibleStates': ['move','resources', 'build', 'heal'],
        'population':2,
        'supplies':2,
        'abilities':{'onlyHeal':['vehicle', 'bot']},
        'resourceGen':{
            "gold": 0,
            "metal": 0,
            "energy": 2
        }
    },
    'miner':{
        'cost': {'gold':100},
        'possibleUpgrades': ['mine'],
        'possibleStates': ['move','resources', 'upgrade'],
        'resourceGen':{
            "gold": 2,
            "metal": 0,
            "energy": 0
        }
    },
    'mine':{
        'cost': {'metal':25},
        'possibleStates': ['resources'],
        'type': 'building',
        'health': 10,
        'defense': 1,
        #'abilities':{'costly':1.5},
        'resourceGen':{
            "gold": 5,
        }
    },
    'mine shaft':{
        'cost': {'gold':20, 'metal':50},
        'possibleStates': ['none'],
        'type': 'building',
        'health': 15,
        'defense': 1,
        'abilities':{'buff':['production',['mine'], 1.5],
                     'costly':1.75},
        'resourceGen':{
            "gold": 0
        }
    },
    'power grid':{
        'cost': {'gold':50, 'metal':50, 'energy':50},
        'possibleStates': ['none'],
        'type': 'building',
        'health': 15,
        'defense': 1,
        'abilities':{'buff':['production',['power plant', 'nuclear plant'], 1.5],
                     'costly':1.75},
        'resourceGen':{
            "gold": 0
        }
    },
    'recycler':{
        'cost': {'gold':20, 'metal':50, 'energy':10},
        'possibleStates': ['none'],
        'type': 'building',
        'health': 15,
        'defense': 1,
        'abilities':{'buff':['production',['factory'], 1.5],
                     'costly':1.75},
        'resourceGen':{
            "gold": 0
        }
    },
    'shield generator':{
        'cost': {'metal':20,'energy':100},
        'possibleStates': ['none'],
        'type': 'building',
        'health': 15,
        'defense': 0.5,
        'abilities':{'buff':['defense', 2]},
        'resourceGen':{
            "gold": 0,
        }
    },
    'turret':{
        'cost': {'metal':100, 'energy':50},
        'possibleStates': ['attack'],
        'type': 'building',
        'attack': 3,
        'range': 2,
        'health': 10,
    },
    'anti air turret':{
        'cost': {'metal':120, 'energy':60},
        'possibleStates': ['attack'],
        'type': 'building',
        'attack': 4,
        'range': 2,
        'health': 15,
	    'abilities':{'onlyHit':['aircraft']},
    },
    'radar tower':{
        'cost': {'gold':10,'metal':30, 'energy':10},
        'possibleStates': ['none'],
        'type': 'building',
        'range': 3,
        'abilities':{'closebuild':1},
        'resourceGen':{
            "gold": 0,
        }
    },
    'fort':{
        'cost': {'gold':100 ,'metal':250},
        'possibleStates': ['attack','build'],
        'possibleBuilds': ['soldier', 'jeep','medic'],
        'type': 'building',
        'attack': 3,
        'defense': 3,
        'range': 2,
        'health': 30,
        'resourceGen':{
            "metal": 20,
            "energy": 10
        }
    },
    'electric engineer':{
        'cost': {'gold':100},
        'possibleUpgrades': ['power plant','nuclear plant'],
        'possibleStates': ['move','resources', 'upgrade'],
        'resourceGen':{
            "gold": 0,
            "metal": 0,
            "energy": 2
        }
    },
    'power plant':{
        'cost': {'metal':25},
        'possibleStates': ['resources'],
        'type': 'building',
        'health': 10,
        'defense': 1,
        #'abilities':{'costly':1.5},
        'resourceGen':{
            "gold": 0,
            "metal": 0,
            "energy": 5
        }
    },
    'nuclear plant':{
        'cost': {'metal':50, 'energy': 50},
        'possibleStates': ['resources'],
        'type': 'building',
        'health': 15,
        'defense': 1,
        'abilities':{'costly':1.5},
        'resourceGen':{
            "gold": 0,
            "metal": 0,
            "energy": 10
        }
    },
    'factory':{
        'cost': {'metal':25},
        #'possibleBuilds': ['bot','minibot'],
        'possibleStates': ['resources'],
        'type': 'building',
        'health': 10,
        #'abilities':{'costly':1.5},
        'resourceGen':{
            "gold": 0,
            "metal": 5,
            "energy": 0
        }
    },
    'workshop':{
        'cost': {'metal':100, 'energy':25},
        'possibleBuilds': ['bot','mechanic','mech', 'blob'],
        'possibleStates': ['resources', 'build'],
        'type': 'building',
        'health': 15,
        'defense': 1,
        'abilities':{'costly':1.3},
        'resourceGen':{
            "gold": 0,
            "metal": 2,
            "energy": 0
        }
    },
    'hospital':{
        'cost': {'gold':50, 'metal':50},
        'possibleBuilds': ['medic'],
        'possibleStates': ['build','heal'],
        'type': 'building',
        'health': 20,
        'defense': 1,
        'heal':15,
        'population':2,
        'abilities':{'onlyHeal':['trooper']},
        'resourceGen':{
            "gold": 0,
        }
    },
    'barracks':{
        'cost': {'metal':50},
        #'possibleBuilds': ['soldier','scout','heavy','defender','sniper','rocket','brute','medic'],
        'possibleBuilds': ['soldier','scout','heavy','medic'],
        'possibleStates': ['build'],
        'type': 'building',
        'health': 15,
        'abilities':{'costly':1.5},
        'resourceGen':{
            "gold": 0,
        }
    },
    'house':{
        'cost': {'metal':150},
        'possibleBuilds': ['construction worker','miner','electric engineer'],
        'possibleStates': ['build'],
        'type': 'building',
        'population': 2,
        'health': 10,
        'abilities':{'costly':1.5},
        'resourceGen':{
            "gold": 0,
        }
    },
    'supply depot':{
        'cost': {'metal':50},
        'possibleBuilds': ['truck'],
        'possibleStates': ['build','resupply'],
        'type': 'building',
        'population': 2,
        'health': 15,
        'resourceGen':{
            "gold": 0,
        }
    },
    'truck':{
        'cost': {'gold':40, 'metal':40},
        'possibleStates': ['move','resupply'],
        'type': 'vehicle',
        'speed':2,
        'health':10,
        'supplies':5,
        'resourceGen':{"gold": 0}
    },
    'tank factory':{
        'cost': {'metal':100},
        #'possibleBuilds': ['tank','heavy tank','artillery','jeep','crane','mobile fortress'],
        'possibleBuilds': ['tank','jeep','crane'],
        'possibleStates': ['build'],
        'type': 'building',
        'health': 20,
        'abilities':{'costly':1.5},
        'resourceGen':{
            "gold": 0
        }
    },
    'tank':{
        'cost': {'gold':70, 'metal':70},
        'possibleStates': ['move','attack'],
        'type': 'vehicle',
        'health':20,
        'defense':3,
        'resourceGen':{"gold": 0}
    },
    'heavy tank':{
        'cost': {'gold':70, 'metal':150},
        'possibleStates': ['move','attack'],
        'type': 'vehicle',
        'health':25,
        'attack':2.5,
        'defense':4,
        'resourceGen':{"gold": 0}
    },
    'artillery':{
        'cost': {'gold':250, 'metal':70},
        'possibleStates': ['move','attack'],
        'type': 'vehicle',
        'attack':3,
        'range':3,
        'defense':1,
        'resourceGen':{"gold": 0},
        'abilities':{'onlyHit':['building']},
    },
    'infantry support tank':{
        'cost': {'gold':100, 'metal':80},
        'possibleStates': ['move','attack'],
        'type': 'vehicle',
        'health':20,
        'attack':3.5,
        'range':1,
        'defense':3,
        'resourceGen':{"gold": 0},
        'abilities':{'onlyHit':['tropper', 'bot']},
    },
    'tank destroyer':{
        'cost': {'gold':100, 'metal':180},
        'possibleStates': ['move','attack'],
        'type': 'vehicle',
        'health':20,
        'attack':3.5,
        'range':2,
        'defense':2.5,
        'resourceGen':{"gold": 0},
        'abilities':{'onlyHit':['vehicle']},
    },
    'jeep':{
        'cost': {'gold':40, 'metal':40},
        'possibleStates': ['move','attack','transport'],
        'type': 'vehicle',
        'speed':2,
        'health':12,
        'population':1,
        'abilities':{'transport':['trooper']},
        'resourceGen':{"gold": 0}
    },
    'humvee':{
        'cost': {'gold':40, 'metal':80},
        'possibleStates': ['move','attack','transport'],
        'type': 'vehicle',
        'speed':2,
        'health':17,
	    'attack': 3,
	    'defense': 3,
        'population':2,
        'abilities':{'transport':['trooper']},
        'resourceGen':{"gold": 0}
    },
    'mobile fortress':{
        'cost': {'gold':150, 'metal':200, 'energy':100},
        'possibleBuilds': ['soldier','tank'],
        'possibleStates': ['move','attack','resources', 'build'],
        'type': 'vehicle',
        'health': 25,
        'defense': 3,
        'population':3,
        'supplies': 5,
        'resourceGen':{
            "gold": 2,
            "metal": 4,
            "energy": 0
        }
    },
    'airport':{
        'cost': {'gold':50, 'metal':200},
        #'possibleBuilds': ['plane','helicopter','bomber'],
        'possibleBuilds': ['plane'],
        'possibleStates': ['build'],
        'type': 'building',
        'health': 15,
        'abilities':{'costly':1.25},
        'resourceGen':{
            "metal": 0,
        }
    },
    'plane':{
        'cost': {'gold':100, 'metal':100, 'energy':20},
        'possibleStates': ['move','attack'],
        'type': 'aircraft',
        'health':15,
        #'speed':3,
        'speed':2,
        'range':2,
        'defense':1,
        'resourceGen':{"gold": 0}
    },
    'helicopter':{
        'cost': {'gold':100, 'metal':50, 'energy':20},
        #'possibleBuilds': ['soldier','construction worker'],
        'possibleStates': ['move','attack','transport','resupply'],
        'type': 'aircraft',
        'speed':2,
        'defense':1,
        'attack':1.5,
        'population':1,
        'supplies':1,
        'abilities':{'transport':['trooper','bot']},
        'resourceGen':{"gold": 0}
    },
    'chinook':{
        'cost': {'gold':100, 'metal':100, 'energy':20},
        #'possibleBuilds': ['tank','crane','heavy'],
        'possibleStates': ['move','attack','transport','resupply'],
        'type': 'aircraft',
        'speed':2,
        'defense':1.5,
        'attack':2,
        'population':2,
        'supplies':2,
        'abilities':{'transport':['trooper','bot','vehicle']},
        'resourceGen':{"gold": 0}
    },
    'attack helicopter':{
        'cost': {'gold':120, 'metal':120, 'energy':20},
        'possibleStates': ['move','attack','transport'],
        'type': 'aircraft',
        'speed':2,
        'defense':2,
        'attack':3.5,
        'population':1,
        'abilities':{'transport':['trooper','bot']},
        'resourceGen':{"gold": 0}
    },
    'bomber':{
        'cost': {'gold':100, 'metal':150, 'energy':50},
        'possibleStates': ['move','attack'],
        'type': 'aircraft',
        'health':15,
        'speed':2,
        'defense':1,
        'attack':3,
        'resourceGen':{"gold": 0}
    },
    'sea plane':{
        'cost': {'gold':100, 'metal':50, 'energy':20},
        'possibleStates': ['move','attack'],
        'type': 'aircraft',
        'health':15,
        'speed':2,
        'range':2,
        'defense':1.5,
        'attack':3,
        'resourceGen':{"gold": 0},
        'abilities':{'onlyHit':['boat','aircraft']},
    },
    'interceptor':{
        'cost': {'gold':80, 'metal':50, 'energy':50},
        'possibleStates': ['move','attack'],
        'type': 'aircraft',
        'health':9,
        'speed':3,
        'range':2,
        'defense':1.5,
        'attack':3.5,
        'resourceGen':{"gold": 0},
        'abilities':{'onlyHit':['aircraft']},
    },
    'stealth plane':{
        'cost': {'gold':100, 'metal':100, 'energy':200},
        'possibleStates': ['move','attack','cloak'],
        'type': 'aircraft',
        'health':10,
        'speed':3,
        'range':2,
        'defense':1,
        'resourceGen':{"gold": 0}
    },
    'docks':{
        'cost': {'gold':50, 'metal':100},
        'possibleBuilds': ['boat', 'transport boat'],
        'possibleStates': ['build'],
        'type': 'building',
        'health': 15,
        'defense':1,
        'abilities':{'costly':1.2},
        'resourceGen':{
            "gold": 0,
        }
    },
    'ship yard':{
        'cost': {'gold':150, 'metal':250},
        'possibleBuilds': ['battleship', 'destroyer'],
        'possibleStates': ['resources', 'build'],
        'type': 'building',
	    'population': 1,
        'health': 20,
        'defense': 2.5,
        'resourceGen':{
            "metal": 2,
        }
    },
    'naval defense platform':{
        'cost': {'gold':150 ,'metal':200, 'energy':50},
        'possibleStates': ['attack','build'],
        'possibleBuilds': ['mine layer', 'speed boat'],
        'type': 'building',
        'attack': 3.5,
        'defense': 3,
        'range': 2,
        'health': 25,
        'abilities':{'onlyHit':['boat','aircraft']},
        'resourceGen':{
            "metal": 0,
        }
    },
    'boat':{
        'cost': {'gold':20, 'metal':25},
        'possibleStates': ['move','attack'],
        'type': 'boat',
        'resourceGen':{"gold": 0}
    },
    'transport boat':{
        'cost': {'gold':25, 'metal':25},
        'possibleStates': ['move','resources','transport'],
        #'possibleBuilds': ['soldier','construction worker'],
        'type': 'boat',
        'population':2,
        'abilities':{'transport':['trooper','bot']},
        'resourceGen':{"gold": 2}
    },
    'aircraft carrier':{
        'cost': {'gold':50, 'metal':300},
        'possibleBuilds': ['plane'],
        'possibleStates': ['move','attack', 'build'],
        'type': 'boat',
        'health': 25,
        'range':2,
        'defense': 3,
        'population':2,
        'supplies':5,
        'resourceGen':{
            "gold": 0
        }
    },
    'seige boat':{
        'cost': {'gold':100, 'metal':100},
        'possibleBuilds': ['soldier'],
        'possibleStates': ['move', 'build'],
        'type': 'boat',
        'health': 15,
        'defense': 3,
        'population':3,
        'supplies':5,
        'abilities':{'multibuild':4},
        'resourceGen':{
            "gold": 0
        }
    },
    'submarine':{
        'cost': {'gold':50, 'metal':50,'energy':50},
        'possibleStates': ['move','attack','cloak'],
        'type': 'boat',
        'attack': 3.5,
        'resourceGen':{"gold": 0},
        'abilities':{'onlyHit':['boat','building']},
    },
    'floating fortress':{
        'cost': {'gold':75, 'metal':350,'energy':150},
        'possibleBuilds': ['boat','transport boat'],
        'possibleStates': ['move','attack', 'build'],
        'type': 'boat',
        'health': 25,
        'defense': 3.5,
        'population':2,
        'supplies':5,
        'resourceGen':{
            "gold": 0
        }
    },
    'mine layer':{
        'cost': {'gold':50, 'metal':75},
        'possibleBuilds': ['sea mine'],
        'possibleStates': ['move', 'build'],
        'type': 'boat',
        'health': 10,
        'defense': 2,
        'supplies': 4,
        'resourceGen':{
            "metal": 2
        }
    },
    'sea mine':{
        'cost': {'metal':30, 'energy':5},
        'possibleStates': ['attack'],
        'type': 'boat',
        'health':5,
        'speed':0,
        'range':1,
        'attack':3.5,
        'defense':1,
        'abilities':{'kamikaze':0, 'onlyHit':['boat']},
        'resourceGen':{"gold": 0}
    },
    'frigate':{
        'cost': {'gold':75, 'metal':100,'energy':50},
        'possibleStates': ['move','attack'],
        'type': 'boat',
	    'health': 20,
	    'range': 2,
        'attack': 3,
	    'defense': 3,
        'resourceGen':{"gold": 0},
        'abilities':{'onlyHit':['boat','aircraft']},
    },
    'destroyer':{
        'cost': {'gold':100, 'metal':125,'energy':75},
        'possibleBuilds': [],
        'possibleStates': ['move','attack','build'],
        'type': 'boat',
	    'health': 25,
	    'range': 2,
        'attack': 3,
	    'defense': 3.5,
        'supplies': 4,
        'resourceGen':{"gold": 0},
        'abilities':{'onlyHit':['boat','aircraft']},
    },
    'battleship':{
        'cost': {'gold':150, 'metal':200,'energy':100},
        'possibleStates': ['move','attack'],
        'type': 'boat',
	    'health': 30,
	    'range': 1,
        'attack': 4,
	    'defense': 3.5,
        'resourceGen':{"gold": 0},
    },
    'cruiser':{
        'cost': {'gold':200, 'metal':300,'energy':150},
        'possibleStates': ['move','attack'],
        'type': 'boat',
	    'health': 35,
	    'range': 2,
        'attack': 4,
	    'defense': 4,
        'resourceGen':{"gold": 0},
    },
    'speed boat':{
        'cost': {'gold':25, 'metal':25,'energy':25},
        'possibleStates': ['move','attack'],
        'type': 'boat',
	    'health': 10,
	    'speed': 2,
	    'range': 1,
        'attack': 2,
	    'defense': 1.5,
        'resourceGen':{"gold": 0},
    },
    
    'wall':{
        'cost': {'metal':25},
        'possibleStates': ['none'],
        'type': 'building',
        'health': 20,
        'defense': 3,
        'resourceGen':{
            "gold": 0,
        }
    },
    'blob':{
        'cost': {'energy':25},
        'possibleBuilds': ['blob'],
        'possibleStates': ['move','attack','build'],
        'attack':1,
        'defense':1,
        'population':1,
        'supplies':1,
        'abilities':{'costly':1.2},
        'resourceGen':{
            "gold": 0,
            "metal": 0,
            "energy": 2
        }
    },
    'slime':{
        'cost': {'energy':25},
        'possibleStates': ['move','attack','resources'],
        'abilities':{'takeover':'slime'},
        'resourceGen':{
            "gold": 0,
            "metal": 0,
            "energy": 2
        }
    },
    'agent':{
        'cost': {'gold':50, 'energy':20},
        #'possibleBuilds': ['experimental facility', 'hall of heroes'],
        'possibleBuilds': ['hall of heroes'],
        'possibleStates': ['attack','move', 'build'],
        'resourceGen':{
            "gold": 0
        }
    },
    'research center':{
        'cost': {'metal':50, 'energy':100},
        'possibleBuilds': [],
        'possibleStates': ['build', 'research'],
        'health':15,
        'type': 'building',
        'population':2,
        'abilities':{'costly':1.4},
        'resourceGen':{
            "energy": 5
        }
    },
    'experimental facility':{
        'cost': {'gold':200, 'metal':100, 'energy':200},
        #'possibleBuilds': ['sonic cannon', 'ultrabot', 'invinsa tank'],
        'possibleBuilds': [],
        'possibleStates': ['build'],
        'type': 'building',
        'defense': 1,
        'population':2,
        'abilities':{'costly':1.5},
        'resourceGen':{
            "energy": 10
        }
    },
    'sonic cannon':{
        'cost': {'gold':50, 'metal':125, 'energy':250},
        'possibleStates': ['move','attack'],
        'type': 'vehicle',
        'health':5,
        'range':2,
        'attack':6,
        'defense':1,
        'resourceGen':{"gold": 0}
    },
    'ultrabot':{
        'cost': {'gold':250,'metal':50,'energy':125},
        'possibleStates': ['move','attack','build'],
        'possibleBuilds': ['bot','minibot'],
        'type': 'vehicle',
        'health': 25,
        'attack': 4,
        'defense': 4,
        'population':2,
        'resourceGen':{
            "gold": 0
        }
    },
    'invinsa tank':{
        'cost': {'gold':125, 'metal':250, 'energy':50},
        'possibleStates': ['move','attack'],
        'type': 'vehicle',
        'health':30,
        'attack':2,
        'defense':6,
        'resourceGen':{"gold": 0}
    },
    'hall of heroes':{
        'cost': {'gold':300, 'metal':50, 'energy':50},
        'possibleBuilds': ['the hunter', 'king blob', 'the recruiter'],
        'possibleStates': ['build'],
        'type': 'building',
        'health':20,
        'population':1,
        'abilities':{'costly':2},
        'resourceGen':{
            "gold": 0
        }
    },
    'the hunter':{
        'cost': {'gold':300,'metal':50},
        'attack':4,
        'defense':1,
        'range':4,
        'abilities':{'onlyHit':['trooper', 'bot', 'monster']},
        'resourceGen':{
            "gold": 4
        }
    },
    'king blob':{
        'cost': {'energy':100},
        'possibleBuilds': ['blob'],
        'possibleStates': ['move','attack','resources', 'build'],
        'health':20,
        'resourceGen':{
            "gold": 0,
            "metal": 0,
            "energy": 10
        }
    },
    'king of the blob nation of the southeastern blob continent on the blob planet hiding behind jupiter':{
        'cost': {'energy':153},
        'possibleBuilds': ['blob', 'king blob'],
        'possibleStates': ['move','attack','resources', 'build'],
        'health':10,
        'attack':0.5,
        'defense':3.5,
        'range':2,
        'resourceGen':{
            "gold": 0,
            "metal": 0,
            "energy": 20
        }
    },
    'king slime':{
        'cost': {'energy':200},
        'possibleBuilds': ['slime'],
        'possibleStates': ['move','attack','resources', 'build'],
        'health':20,
        'abilities':{'takeover':'slime'},
        'resourceGen':{
            "gold": 0,
            "metal": 0,
            "energy": 10
        }
    },
    'ninja':{
        'cost': {'gold':200,'metal':10},
        'possibleStates': ['move','attack','cloak'],
        'attack':3.5,
        'defense':2,
        'speed':2,
    },
    'king':{
        'cost': {'gold':200},
        'possibleBuilds': ['castle'],
        'possibleStates': ['move','attack','resources', 'build'],
        'health':15,
        'population':1,
        'resourceGen':{
            "gold": 20
        }
    },
    'castle':{
        'cost': {'gold':100 ,'metal':100},
        'possibleStates': ['attack','resources','build'],
        'possibleBuilds': ['knight'],
        'type': 'building',
        'defense': 3,
        'health': 20,
        'population':4,
        'resourceGen':{
            "gold": 10,
        }
    },
    'knight':{
        'cost': {'gold':50 ,'metal':50},
        'health': 15,
        'attack':2.5,
        'defense':4,
        'abilities':{'charge':0},
        'resourceGen':{
            "gold": 4
        },
    },
    'calvary':{
        'cost': {'gold':35},
        'speed':2,
        'abilities':{'charge':0},
    },
    'the recruiter':{
        'cost': {'gold':300},
        'possibleBuilds': ['recruited soldier'],
        'possibleStates': ['move','attack','resources', 'build'],
        'population':3,
        'resourceGen':{
            "gold": 4,
            "metal": 0,
            "energy": 0,
        }
    },
    'recruited soldier':{
        'cost': {'gold':0},
        'attack':2.5,
        'defense':2.5,
        'resourceGen':{
            "gold": 0
        }
    },
    'defense platform':{
        'cost': {'gold':50 ,'metal':150, 'energy':150},
        'possibleStates': ['attack','build'],
        'possibleBuilds': [],
        'type': 'building',
        'attack': 1.5,
        'defense': 3,
        'range': 2,
        'health': 20,
        'abilities':{'costly':1.2},
        'resourceGen':{"gold": 0}
    },
    'missile':{
        'cost': {'metal':20, 'energy':5},
        'possibleStates': ['move','attack'],
        'type': 'aircraft',
        'health':3,
        'speed':2,
        'range':1,
        'attack':3.5,
        'defense':1,
        'abilities':{'kamikaze':0,'decay':1},
        'resourceGen':{"gold": 0}
    },
    'fire missile':{
        'cost': {'metal':20, 'energy':15},
        'possibleStates': ['move','attack'],
        'type': 'aircraft',
        'health':3,
        'speed':2,
        'range':1,
        'attack':2,
        'defense':1,
        'abilities':{'kamikaze':0,'decay':1,'attackCondition':["burn",5]},
        'resourceGen':{"gold": 0}
    },
    '3':{
        'cost': {'energy':1000},
        'possibleStates': ['move','attack','build','resources','research','heal','upgrade','resupply'],
        'possibleBuilds': ['bot','fire missile'],
        'possibleUpgrades': ['3 v2'],
        'supplies':20,
        'heal':5,
        'population':8,
        'abilities':{'multibuild':1,'convert':0,'deathSpawn':'3s helicopter','fast research':2,'parent_link':0, 'buff':['speed', 2]},
        'resourceGen':{"energy": 50}
    },
    '3 v2':{
        'cost': {'energy':1500},
        'possibleStates': ['move','attack','build','resources','research','heal','resupply','cloak'],
        'possibleBuilds': ['bot','fire missile'],
        'health': 20,
        'attack': 3,
        'defense': 3,
        'speed': 2,
        'supplies':30,
        'heal':10,
        'population':16,
        'abilities':{'multibuild':2,'convert':0,'deathSpawn':'3s helicopter','fast research':3,'parent_link':0, 'buff':['speed', 2]},
        'resourceGen':{"energy": 100},
        "baseUnit":"3"
    },
    '3 weakened':{
        'cost': {'energy':500},
        'possibleStates': ['move','attack','build','resupply','upgrade'],
        'possibleUpgrades': ['3'],
        'possibleBuilds': ['bot'],
        'supplies':5,
        'population':4,
        'abilities':{'convert':0,'parent_link':0},
        'resourceGen':{"energy": 0},
        "baseUnit":"3"
    },
    '3s helicopter':{
        'cost': {'gold':50, 'metal':150, 'energy':50},
        'possibleStates': ['move','attack','transport','resupply'],
        'type': 'aircraft',
        'speed':2,
        'defense':3.5,
        'population':1,
        'supplies':2,
        'abilities':{'transport':['trooper','bot'],'default_transport':['3 weakened']},
    },


    #Wild Life Faction
    'tree':{
        'cost': {'gold':50, 'metal':50, 'energy':50},
        'possibleBuilds': ['cave', 'shrub','pond','thorns'],
        'possibleStates': ['resources', 'build'],
        'type': 'building',
        'health': 25,
        'population':4,
        'abilities':{'reclaimable':'town','parent_link':0},
        'resourceGen':{
            "gold": 20,
            "metal": 20,
            "energy": 15
        },
        "size":0.9,
    },
    'small tree':{
        'cost': {'gold':30, 'metal':30, 'energy':30},
        'possibleBuilds': ['cave', 'shrub'],
        'possibleStates': ['resources', 'build'],
        'type': 'building',
        'health': 15,
        'population':1,
        'abilities':{'reclaimable':'outpost','parent_link':0},
        'resourceGen':{
            "gold": 5,
            "metal": 5,
            "energy": 0
        },
        "size":0.8,
    },
    'big tree':{
        'cost': {'gold':50, 'metal':50, 'energy':50},
        'possibleBuilds': ['cave', 'shrub','pond','thorns'],
        'possibleStates': ['resources', 'build'],
        'type': 'building',
        'health': 40,
        'population':6,
        'abilities':{'reclaimable':'city','parent_link':0},
        'resourceGen':{
            "gold": 5,
            "metal": 5,
            "energy": 0
        },
        "size":1,
    },
    'mountain':{
        'cost': {'gold':200, 'metal':200, 'energy':200},
        'possibleBuilds': ['cave', 'shrub','pond','thorns','hawk','pig','wasp'],
        'possibleStates': ['resources', 'build'],
        'type': 'building',
        'health': 50,
        'defense': 4,
        'population':9,
        'abilities':{'reclaimable':'metropolis','parent_link':0},
        'resourceGen':{
            "gold": 40,
            "metal": 40,
            "energy": 35
        },
        "size":1.1,
    },
    'pond':{
        'cost': {'gold':20, 'energy':30},
        'possibleBuilds': ['snake','fish'],
        'possibleStates': ['resources', 'build'],
        'type': 'building',
        'population':3,
        'resourceGen':{
            "gold": 10,
            "metal": 0,
            "energy": 10
        }
    },
    'cave':{
        'cost': {'gold':10, 'metal':45},
        'possibleBuilds': ['hyena', 'bats','bear'],
        'possibleStates': ['resources', 'build'],
        'type': 'building',
        'health': 15,
        'population':2,
        'resourceGen':{
            "gold": 0,
            "metal": 20,
            "energy": 0
        }
    },
    'shrub':{
        'cost': {'energy':40, 'metal':40},
        'possibleBuilds': ['wasp','beaver'],
        'possibleStates': ['resources', 'build','heal'],
        'type': 'building',
        'heal':5,
        'population':2,
        'abilities':{'onlyHeal':['building']},
        'resourceGen':{
            "gold": 5,
            "metal": 0,
            "energy": 5
        }
    },
    'thorns':{
        'cost': {'metal':70},
        'possibleStates': ['attack'],
        'type': 'building',
        'resourceGen':{
            "gold": 0
        },
        'size':.75,
    },
    'log':{
        'cost': {'metal':25},
        'possibleStates': ['none'],
        'type': 'building',
        'health': 10,
        'defense': 3,
        'resourceGen':{
            "gold": 0,
        }
    },
    'hyena':{
        'cost': {'metal':20},
        'health': 8,
    },
    'bear':{
        'cost': {'gold':100},
        'possibleStates': ['attack','move','resources'],
        'health': 15,
        'attack':3,
        'resourceGen':{
            "gold": 4,
            "metal": 4,
            "energy": 0
        }
    },
    'fish':{
        'cost': {'energy':30},
        'possibleBuilds': ['pond'],
        'possibleStates': ['move','heal','resources'],
        'heal':2,
        'type': 'boat',
        'resourceGen':{"energy": 3}
    },
    'bats':{
        'cost': {'gold':40},
        'possibleStates': ['move','attack'],
        'type': 'aircraft',
        'health':7,
        'speed':2,
        'defense':1,
        'resourceGen':{"gold": 0}
    },
    'snake':{
        'cost': {'gold':50,'energy':10},
        'possibleStates': ['move','attack'],
        'attack':3.5,
        'abilities':{'onlyHit':['trooper']},
        'resourceGen':{"gold": 8}
    },
    'wasp':{
        'cost': {'gold':100},
        'possibleStates': ['move','attack'],
        'type': 'aircraft',
        'health':5,
        'speed':2,
        'defense':1,
        'attack':3.5,
        'abilities':{'onlyHit':['trooper']},
        'resourceGen':{"gold": 0},
        'size':0.5
    },
    'beaver':{
        'cost': {'gold':50,'metal':50},
        'possibleBuilds': ['log'],
        'possibleStates': ['move','attack','build'],
        'supplies': 2,
        'health': 10,
        'defense':3,
        'abilities':{'onlyHit':['building']},
    },
    'hawk':{
        'cost': {'gold':100},
        'possibleStates': ['move','attack'],
        'type': 'aircraft',
        'health':15,
        'speed':3,
        'defense':1,
        'resourceGen':{"gold": 0}
    },
    'pig':{
        'cost': {'metal':50},
        'possibleStates': ['move','attack'],
        'health': 15,
        'defense':3,
        'abilities':{'onlyHit':['building','vehicle','boat']},
    },
    #Bots Faction
    'bot fortress':{
        'cost': {'gold':0, 'metal':150, 'energy':150},
        'possibleBuilds': ['servitor'],
        'possibleStates': ['resources', 'build'],
        'type': 'building',
        'health': 50,
	    'defense': 3,
        'population':4,
        'resourceGen':{
            "gold": 0,
            "metal": 20,
            "energy": 20
        },
        "size":1,
    },
    'servitor':{
        'cost': {'gold':0, 'metal':40, 'energy':40},
        'possibleBuilds': ['bot defense platform', 'bot factory', 'bot power core'],
        'possibleStates': ['move', 'attack', 'build'],
        'type': 'aircraft',
        'health': 20,
	'defense': 3,
        'resourceGen':{
            "gold": 0
        }
    },
    'bot defense platform':{
        'cost': {'gold':0, 'metal':100, 'energy':60},
        'possibleStates': ['attack', 'resources'],
        'type': 'building',
        'health': 15,
	'range': 3,
	'attack': 3,
	'defense': 3.5,
        'resourceGen':{
            "gold": 10,
            "metal": 0,
            "energy": 10
        }
    },
    'bot power core':{
        'cost': {'gold':0, 'metal':60, 'energy':60},
        'possibleBuilds': ['bot engineer'],
        'possibleStates': ['resources', 'build'],
        'type': 'building',
        'health': 20,
        'population':3,
        'resourceGen':{
            "gold": 0,
            "metal": 10,
            "energy": 50
        }
    },
    'bot engineer':{
        'cost': {'gold':0, 'metal':40, 'energy':40},
        'possibleBuilds': ['bot', 'bot factory', 'bot power station'],
        'possibleStates': ['move', 'resources', 'build'],
        'type': 'bot',
        'health': 10,
        'population':3,
        'resourceGen':{
            "gold": 5,
            "metal": 10,
            "energy": 0
        }
    },
    'bot power station':{
        'cost': {'gold':0, 'metal':40, 'energy':60},
        'possibleStates': ['resources'],
        'type': 'building',
        'health': 20,
        'resourceGen':{
            "gold": 5,
            "metal": 10,
            "energy": 30
        }
    },
    'bot factory':{
        'cost': {'gold':0, 'metal':40, 'energy':40},
        'possibleBuilds': ['bot', 'mech', 'bot engineer', 'bot destroyer'],
        'possibleStates': ['resources', 'build'],
        'type': 'building',
        'health': 17,
        'population':4,
        'abilities':{'costly':1.1},
        'resourceGen':{
            "gold": 10,
            "metal": 30,
            "energy": 5
        }
    },
    'bot destroyer':{
        'cost': {'gold':0, 'metal':200, 'energy':200},
        'possibleStates': ['move', 'attack'],
        'type': 'boat',
        'health': 25,
	    'attack': 3.5,
	    'defense': 3.5,
        'resourceGen':{
            "gold": 0
        }
    },
    #Plant Faction
    'plant base':{
        'cost': {'energy':200},
        'possibleBuilds': ['walking roots'],
        'possibleStates': ['resources', 'build'],
        'type': 'building',
        'health': 8,
        'population':3,
        'abilities':{'deathSpawn':'mad plant base'},
        'resourceGen':{
            "energy": 10
        },
        "size":1,
    },
    'mad plant base':{
        'cost': {'gold':0},
        'possibleBuilds': ['seed'],
        'possibleStates': ['build'],
        'type': 'building',
        'health': 16,
        'range': 4,
        'population':8,
        'abilities':{'multibuild':1},
        'resourceGen':{
            "energy": 0
        },
        "size":1,
    },
    'seed':{
        'cost': {'energy':0},
        'possibleBuilds': ['plant base'],
        'possibleStates': ['build'],
        'type': 'building',
        'health': 2,
        'population': 1,
        'abilities':{'deathSpawn':'mad seed',
                     'decay':1},
        'resourceGen':{
            "energy": 0
        }
    },
    'mad seed':{
        'cost': {'energy':0},
        'possibleBuilds': ['plant base'],
        'possibleStates': ['move','build'],
        'type': 'building',
        'health': 2,
        'speed': 2,
        'abilities':{'decay':1},
        'resourceGen':{
            "energy": 0
        }
    },
    'walking roots':{
        'cost': {'energy':10},
        'possibleBuilds': ['flower', 'plant house'],
        'possibleStates': ['move', 'resources', 'build'],
        'health': 5,
        'range': 2,
        'population':2,
        'abilities':{'deathSpawn':'mad walking roots'},
        'resourceGen':{
            "gold": 20,
            "metal": 20,
            "energy": 0
        },
        "size":.75,
    },
    'mad walking roots':{
        'cost': {'gold':0},
        'possibleStates': ['move', 'attack'],
        'population':3,
        'resourceGen':{
            "gold": 0
        },
        "size":.75,
    },
    'flower':{
        'cost': {'gold':15},
        'possibleStates': ['resources'],
        'type': 'building',
        'health': 4,
        'abilities':{'deathSpawn':'mad flower'},
        'resourceGen':{
            "metal": 1
        },
        "size":.7,
    },
    'mad flower':{
        'cost': {'gold':0},
        'possibleStates': ['attack'],
        'type': 'building',
        "size":.7,
    },
    'plant house':{
        'cost': {'metal':30},
        'possibleBuilds': ['phydent', 'jellyfish'],
        'possibleStates': ['build'],
        'type': 'building',
        'health': 6,
        'population':2,
        'abilities':{'deathSpawn':'mad plant house'},
        'resourceGen':{
            "energy": 0
        }
    },
    'mad plant house':{
        'cost': {'metal':0},
        'possibleBuilds': ['spider'],
        'possibleStates': ['build'],
        'type': 'building',
        'health': 8,
        'population':2,
        'resourceGen':{
            "energy": 0
        }
    },
    'phydent':{
        'cost': {'metal':70},
        'possibleStates': ['move'],
        'type': 'monster',
        'health': 6,
        'abilities':{'deathSpawn':'mad phydent'},
        'resourceGen':{
            "metal": 0
        }
    },
    'mad phydent':{
        'cost': {'metal':0},
        'possibleStates': ['move', 'attack'],
        'type': 'monster',
        'health': 18,
        'attack': 3,
        'defense': 3,
        'resourceGen':{
            "metal": 0
        }
    },
    'jellyfish':{
        'cost': {'gold':30},
        'possibleStates': ['move'],
        'type': 'boat',
        'health': 6,
        'abilities':{'deathSpawn':'mad jellyfish'},
        'resourceGen':{
            "metal": 0
        }
    },
    'mad jellyfish':{
        'cost': {'metal':0},
        'possibleStates': ['move', 'attack'],
        'type': 'boat',
        'health': 12,
        'resourceGen':{
            "metal": 0
        }
    },
    'spider':{
        'cost': {'metal':40,'energy':10},
        'possibleStates': ['move'],
        'health': 3,
        'abilities':{'deathSpawn':'mad spider'},
        'resourceGen':{
            "metal": 0
        }
    },
    'mad spider':{
        'cost': {'metal':0},
        'possibleStates': ['move', 'attack'],
        'health': 7,
        'attack': 3.5,
        'defense': 1,
        'resourceGen':{
            "metal": 0
        }
    },

    #Glob Faction
    'mothership':{
        'cost': {'energy':200},
        'possibleBuilds': ['glob lab','alien fighter','alien transport','mining vessel','alien power generator'],
        'possibleStates': ['move','resources', 'build'],
        'type': 'aircraft',
        'health': 50,
        'resourceGen':{
            "energy": 20, 
            "metal": 10, 
        },
        "size":1,
    },

    'alien transport':{
        'cost': {'energy':20, 'metal':30},
        'possibleStates': ['move', 'transport'],
        'type': 'aircraft',
        'health': 10,
        'speed':2,
        'abilities':{'default_transport':['cow','alien foot soldier','alien foot soldier']},
        'resourceGen':{
            "gold": 0
        }
    },

    'cow':{
        'cost': {'gold':20},
        'possibleStates': ['move','resources'],
        'health': 12,
        'resourceGen':{
            "gold": 10,
            "metal": 0,
            "energy": 0
        }
    },

    'alien foot soldier':{
        'cost': {'gold':20},
        'resourceGen':{"gold": 0}
        #Maybe multi-attack ability
    },

    'alien fighter':{
        'cost': {'energy':20, 'metal':30},
        'possibleStates': ['move','attack'],
        'type': 'aircraft',
        'health':10,
        'speed':2,
        'range':2,
        'defense':1,
        'resourceGen':{"gold": 0}
    },

    'mining vessel':{
        'cost': {'metal':5, 'energy':50},
        'possibleStates': ['resources'],
        'type': 'building',
        'health': 18,
        'abilities':{'costly':1.1},
        'resourceGen':{
            "metal": 20
        }
    },

    'alien power generator':{
        'cost': {'metal':50, 'energy':5},
        'possibleStates': ['resources'],
        'type': 'aircraft',
        'health': 18,
        'abilities':{'costly':1.1},
        'resourceGen':{
            "energy": 20
        }
    },

    'glob lab':{
        'cost': {'metal':50, 'energy':10},
        'possibleBuilds': ['glob','glob walker', 'glob symbiote'],
        'possibleStates': ['resources', 'build'],
        'type': 'building',
        'health': 15,
        'abilities':{'costly':1.5},
        'resourceGen':{
            "gold": 5,
        }
    },

    'glob':{
        'cost': {'gold':20},
        'possibleStates':['move', 'attack'],
        'health': 5,
        'abilities':{'deathSpawn':'small glob'},
        'resourceGen':{
            "metal": 0
        }
    },
    'small glob':{
        'cost': {'gold':20},
        'possibleStates':['move', 'attack'],
        'health': 3,
        'attack': 1.5,
        'abilities':{'deathSpawn':'baby glob'},
        'resourceGen':{
            "metal": 0
        }
    },
    'baby glob':{
        'cost': {'gold':20},
        'possibleStates':['move', 'attack'],
        'health': 1,
        'attack': 1,
        'resourceGen':{
            "metal": 0
        }
    },

    'glob walker':{
        'cost': {'gold':40},
        'possibleBuilds': ['glob snake'],
        'possibleStates': ['move', 'resources', 'build'],
        'health': 20,
        'population':2,
        'resourceGen':{
            "energy": 2
        }
    },

    'glob snake':{
        'cost': {'gold':20,'energy':10},
        'possibleStates': ['move','attack'],
        'attack':3.5,
        'abilities':{'onlyHit':['trooper']}
    },

    'glob symbiote':{
        'cost': {'energy':100, 'gold':30},
        'possibleStates': ['move','attack'],
        'type': 'aircraft',
        'health':10,
        'attack':5,
        'speed':2,
        'defense':1,
        'abilities':{'onlyHit':['trooper','bot','aircraft','boat','vehicle','monster'],'convert':0,'kamikaze':0,}
    },
}

TechDB = {
    #RED
    'bionics':{
        'cost': 20,
        'time': 1,
        'ability': [],
        'unlocks': ['experimental facility','tough skin'],
        'quote':"Lab Rats",
    },
    'experimental facility':{
        'cost': 20,
        'time': 1,
        #'ability': [['unlock build', 'agent', 'experimental facility']],
        #'ability': [['unlock build', 'metropolis', 'experimental facility']],
        'ability': [['unlock upgrade', 'crane', 'experimental facility']],
        'unlocks': ['sonic cannon','ultrabot','invinsa tank'],
        'text': "Unlocks the Experimental Facility at the Crane.",
        'quote':"For all those expirments that you're doing",
    },
    'sonic cannon':{
        'cost': 20,
        'time': 2,
        'ability': [['unlock build', 'experimental facility', 'sonic cannon']],
        'unlocks': ['thunder clap', 'composit armor'],
        'quote':"Don't get me wrong, but what about a glass canon?",
    },
    'thunder clap':{
        'cost': 60,
        'time': 3,
        'ability': [['stat', 'sonic cannon', 'attack', 0.5]],
        'unlocks': ['sonic enhancements'],
        'quote':"I could feel that from hear!",
    },
    'sonic enhancements':{
        'cost': 80,
        'time': 4,
        'ability': [['gain ability', 'sonic cannon', 'buff', ['attack', 1.5]]],
        'unlocks': [],
        'quote':"Even if they somehow manage to survive this, they'll be exposed to my teamates",
    },
    'composit armor':{
        'cost': 40,
        'time': 2,
        'ability': [['stat', 'sonic cannon', 'defense', 1]],
        'unlocks': ['sound amplifier'],
        'quote':"I do enjoy not dying",
    },
    'sound amplifier':{
        'cost': 80,
        'time': 5,
        'ability': [['stat', 'sonic cannon', 'range', 1]],
        'unlocks': [],
        'quote':"Delete your enemies from afar",
    },
    'invinsa tank':{
        'cost': 20,
        'time': 2,
        'ability': [['unlock build', 'experimental facility', 'invinsa tank']],
        'unlocks': ['unmovable object', 'a good counter'],
        'quote':"It's practically invincible",
    },
    'a good counter':{
        'cost': 40,
        'time': 2,
        'ability': [['stat', 'invinsa tank', 'attack', 1]],
        'unlocks': ['unstoppable force'],
        'quote':"make the iron lords proud",
    },
    'unstoppable force':{
        'cost': 80,
        'time': 4,
        'ability': [['gain ability', 'invinsa tank', 'charge', 0]],
        'unlocks': [],
        'quote':"A relentless charge straight through your enemy and they can't do anything about it",
    },
    'unmovable object':{
        'cost': 60,
        'time': 3,
        'ability': [['stat', 'invinsa tank', 'defense', 0.5]],
        'unlocks': ['bulwark'],
        'quote':"be the rock",
    },
    'bulwark':{
        'cost': 80,
        'time': 4,
        'ability': [['gain ability', 'invinsa tank', 'buff', ['defense', 1.5]]],
        'unlocks': [],
        'quote':"none shall break my line",
    },
    'ultrabot':{
        'cost': 20,
        'time': 2,
        'ability': [['unlock build', 'experimental facility', 'ultrabot']],
        'unlocks': ['harder','better','faster','stronger'],
        'quote':"Look at this absolute bot",
    },
    'harder':{
        'cost': 20,
        'time': 2,
        'ability': [['stat', 'ultrabot', 'defense', 1]],
        'unlocks': ['legion crusher', 'army builder'],
        'deny': ['better','faster','stronger'],
        'quote':"HARDER better faster stronger",
    },
    'better':{
        'cost': 20,
        'time': 3,
        'ability': [['stat', 'ultrabot', 'range', 1]],
        'unlocks': ['legion crusher', 'army builder'],
        'deny': ['harder','faster','stronger'],
        'quote':"harder BETTER faster stronger",
    },
    'faster':{
        'cost': 20,
        'time': 3,
        'ability': [['stat', 'ultrabot', 'speed', 1]],
        'unlocks': ['legion crusher', 'army builder'],
        'deny': ['better','harder','stronger'],
        'quote':"harder better FASTER stronger",
    },
    'stronger':{
        'cost': 20,
        'time': 2,
        'ability': [['stat', 'ultrabot', 'attack', 0.5]],
        'unlocks': ['legion crusher', 'army builder'],
        'deny': ['better','faster','harder'],
        'quote':"harder better faster STRONGER",
    },
    'legion crusher':{
        'cost': 40,
        'time': 4,
        'ability': [['stat', 'ultrabot', 'attack', 0.5],
		   ['stat', 'ultrabot', 'defense', 0.5],
		   ['lose build', 'ultrabot', 'bot']],
        'unlocks': ['deconstructing armies'],
        'deny': ['army builder'],
        'quote':"The giant that usurps entire armies",
    },
    'deconstructing armies':{
        'cost': 60,
        'time': 4,
        'ability': [['stat', 'ultrabot', 'attack', 0.5],
		   ['stat', 'ultrabot', 'defense', 0.5]],
        'unlocks': [],
        'quote':"Infectors take advantage of the many, so we had to make a singular warrior that matches their might",
    },
    'army builder':{
        'cost': 40,
        'time': 4,
        'ability': [['unlock build', 'ultrabot', 'megabot'],
                    ['lose build', 'ultrabot', 'bot']],
        'unlocks': ['crushing legion'],
        'deny': ['legion crusher'],
        'quote':"The metalic hoard shall rise, like what once was",
    },
    'crushing legion':{
        'cost': 60,
        'time': 4,
        'ability': [['stat', 'megabot', 'attack', 1],
		   ['stat', 'minibot', 'attack', 1]],
        'unlocks': [],
        'quote':"The ancient war can fianlly be ended with this true power",
    },
    'tough skin':{
        'cost': 20,
        'time': 1,
        'ability': [['stat', 'the hunter', 'defense', 0.5],
                    ['stat', 'cyborg', 'defense', 0.5]],
        'unlocks': ['eagle vision','enhanced muscles'],
        'quote':"Ok. That helps. Right?",
    },
    'eagle vision':{
        'cost': 20,
        'time': 1,
        'ability': [['stat', 'the hunter', 'range', 1]],
        'unlocks': ['bulletproof skin'],
        'quote':"So he can fly?",
    },
    'bulletproof skin':{
        'cost': 20,
        'time': 1,
        'ability': [['stat', 'cyborg', 'defense', 0.5]],
        'unlocks': ['xray vision'],
        'quote':"But it isn't really",
    },
    'xray vision':{
        'cost': 20,
        'time': 2,
        'ability': [['stat', 'cyborg', 'range', 1]],
        'unlocks': [],
        'quote':"But he can't see through walls",
    },
    'enhanced muscles':{
        'cost': 50,
        'time': 1,
        'ability': [['stat', 'the hunter', 'attack', 0.5],
                    ['stat', 'cyborg', 'attack', 0.5]],
        'unlocks': [],
        'deny': ['eagle vision','bulletproof skin','xray vision'],
        'quote':"Going to the gym works too...",
    },

    #Blue
    'time travel':{
        'cost': 20,
        'time': 1,
        'ability': [],
        'unlocks': ['time of stealth','land of kings','ancient enemy'],
        'quote':"Into the fourth dimension",
    },
    'time of stealth':{
        'cost': 20,
        'time': 3,
        'ability': [['unlock build', 'hall of heroes', 'ninja']],
        'unlocks': ['weapons','armor','speed'],
        'quote':"Stealth 100",
    },
    'weapons':{
        'cost': 20,
        'time': 2,
        'ability': [['stat', 'ninja', 'attack', 0.5]],
        'unlocks': [],
        'deny': ['armor','speed'],
        'quote':"Attack 100",
    },
    'armor':{
        'cost': 20,
        'time': 1,
        'ability': [['stat', 'ninja', 'defense', 0.5]],
        'unlocks': [],
        'deny': ['weapons','speed'],
        'quote':"Armor 100",
    },
    'speed':{
        'cost': 20,
        'time': 1,
        'ability': [['stat', 'ninja', 'speed', 1]],
        'unlocks': [],
        'deny': ['armor','weapons'],
        'quote':"Speed 100",
    },
    'land of kings':{
        'cost': 20,
        'time': 1,
        'ability': [['unlock build', 'hall of heroes', 'king']],
        'unlocks': ['calvary'],
        'quote':"Knights and Noblemen",
    },
    'calvary':{
        'cost': 20,
        'time': 1,
        'ability': [['unlock build', 'castle', 'calvary']],
        'unlocks': ['knights of old'],
        'quote':"I know we have guns, but, what if we had horses",
    },
    'knights of old':{
        'cost': 50,
        'time': 2,
        'ability': [['stat', 'knight', 'attack', 0.5],
                    ['stat', 'knight', 'defense', 0.5]],
        'unlocks': [],
        'quote':"Knights of the square table",
    },
    'ancient enemy':{
        'cost': 20,
        'time': 2,
        'ability': [['unlock build', 'research center', 'slime']],
        'unlocks': ['hostile takeover','counter measures'],
        'quote':"I fear, an ancient enemy has returned",
    },
    'hostile takeover':{
        'cost': 20,
        'time': 1,
        'ability': [['unlock build', 'workshop', 'slime'],
                    ['lose build', 'workshop', 'blob']],
        'unlocks': ['stronger slimes'],
        'deny': ['counter measures'],
        'quote':"Hey, this is my place now.",
    },
    'stronger slimes':{
        'cost': 75,
        'time': 3,
        'ability': [['stat', 'slime', 'attack', 0.5],],
        'unlocks': ['slimy slimes','negotiations'],
        'quote':"Very stronk slimes",
    },
    'slimy slimes':{
        'cost': 50,
        'time': 3,
        'ability': [['stat', 'slime', 'maxHealth', 2],
                    ['stat', 'slime', 'health', 2]],
        'unlocks': ['usurper'],
        'deny': ['negotiations'],
        'quote':"VERY slimy bois",
    },
    'usurper':{
        'cost': 100,
        'time': 4,
        'ability': [['unlock build', 'hall of heroes', 'king slime'],
                    ['lose build', 'hall of heroes', 'king blob']],
        'unlocks': [],
        'quote':"There's always a bigger fish",
    },
    'negotiations':{
        'cost': 50,
        'time': 4,
        'ability': [['unlock build', 'workshop', 'blob'],
                    ['lose build', 'workshop', 'slime']],
        'unlocks': ['united kingdoms'],
        'deny': ['slimy slimes'],
        'quote':"Ah yes, the negotiator",
    },
    'counter measures':{
        'cost': 20,
        'time': 2,
        'ability': [['gain ability', 'king blob', 'multibuild', 1]],
        'unlocks': ['stronger blobs'],
        'deny': ['hostile takeover'],
        'quote':"Hey no, go back you slimes",
    },
    'stronger blobs':{
        'cost': 50,
        'time': 4,
        'ability': [['stat', 'blob', 'attack', 0.5],],
        'unlocks': ['denser blobs','alignment'],
        'quote':"Wait they have muscles now?",
    },
    'denser blobs':{
        'cost': 50,
        'time': 2,
        'ability': [['stat', 'slime', 'maxHealth', 2],
                    ['stat', 'slime', 'health', 2]],
        'unlocks': ['conquest'],
        'deny': ['alignment'],
        'quote':"Just mix some gold in there...",
    },
    'conquest':{
        'cost': 75,
        'time': 2,
        'ability': [['unlock build', 'research center', 'blob'],
                    ['lose build', 'research center', 'slime']],
        'unlocks': [],
        'quote':"Ah, victory",
    },
    'alignment':{
        'cost': 100,
        'time': 4,
        'ability': [['stat', 'research center', 'maxPopulation', 1]],
        'unlocks': ['united kingdoms'],
        'deny': ['denser blobs'],
        'quote':"Alligning ourselves with the enemy",
    },
    'united kingdoms':{
        'cost': 100,
        'time': 5,
        'ability': [['unlock build', 'king blob', 'slime']],
        'unlocks': ['symbiosis'],
        'quote':"Never thought I'd be fighting alongside a slime",
    },
    'symbiosis':{
        'cost': 100,
        'time': 3,
        'ability': [['unlock build', 'research center', 'blob'],
                    ['unlock build', 'workshop', 'slime']],
        'unlocks': [],
        'quote':"Not a slime, a friend",
    },
    
    #Green
    'recruitment':{
        'cost': 20,
        'time': 1,
        'ability': [],
        'unlocks': ['defensive tactics','offensive tactics'],
        'quote': "For all your infantry needs",
    },
    'defensive tactics':{
        'cost': 20,
        'time': 1,
        'ability': [],
        'unlocks': ['tougher', 'defenders'],
        'deny': ['offensive tactics'],
        'quote': "The best defense...",
    },
    'more':{
        'cost': 20,
        'time': 2,
        'ability': [['stat', 'barracks', 'maxPopulation', 1]],
        'unlocks': [],
        'quote': "More! MORE!!!",
    },
    'defenders':{
        'cost': 20,
        'time': 1,
        'ability': [['unlock build', 'barracks', 'defender']],
        'unlocks': ['riot shields', 'rockets', 'rangers'],
        'quote': "They are literally blocks of shields",
    },
    'riot shields':{
        'cost': 40,
        'time': 2,
        'ability': [['stat', 'defender', 'defense', 0.5]],
        'unlocks': ['blockade'],
        'quote': "Just a perecaution",
    },
    'blockade':{
        'cost': 10,
        'time': 3,
        'ability': [['unlock build', 'defender', 'wall']],
        'unlocks': [],
        'quote': "They can build walls now? They can build walls now.",
    },
    'tougher':{
        'cost': 20,
        'time': 4,
        'ability': [['typeStat', 'trooper', 'defense', 0.5]],
        'unlocks': ['more', 'defensive recruitment'],
        'quote': "Thick skin",
    },
    'rockets':{
        'cost': 20,
        'time': 3,
        'ability': [['unlock build', 'barracks', 'rocket']],
        'unlocks': ['target lock', 'commanding presence'],
        'quote': "Light 'em up boys!",
    },
    'target lock':{
        'cost': 40,
        'time': 2,
        'ability': [['stat', 'rocket', 'attack', 0.5]],
        'unlocks': [],
        'quote': "Target acquired",
    },
    'commanding presence':{
        'cost': 50,
        'time': 5,
        'ability': [['unlock build', 'barracks', 'commander']],
        'unlocks': [],
        'quote': "In my book, experience outranks everything",
    },
    'rangers':{
        'cost': 30,
        'time': 2,
        'ability': [['unlock build', 'barracks', 'ranger']],
        'unlocks': [],
        'quote': '"A ranger is a person who takes care of a park or a piece of land." -Google',
    },
    'defensive recruitment':{
        'cost': 20,
        'time': 2,
        'ability': [['stat', 'recruited soldier', 'defense', 0.5]],
        'unlocks': ['reserves'],
        'quote': "Look for the ones that brought shields with them",
    },
    'reserves':{
        'cost': 20,
        'time': 2,
        'ability': [['stat', 'the recruiter', 'maxPopulation', 1]],
        'unlocks': [],
        'quote': "More soldiers = more fun",
    },
    'offensive tactics':{
        'cost': 20,
        'time': 1,
        'ability': [],
        'unlocks': ['stronger soldiers', 'brute force'],
        'deny': ['defensive tactics'],
        'quote': "...is a good offense.",
    },
    'brute force':{
        'cost': 30,
        'time': 1,
        'ability': [['unlock build', 'barracks', 'brute']],
        'unlocks': ['ranged support', 'blinding rage','demolitionists'],
        'quote': "A bit brutish if you ask me.",
    },
    'ranged support':{
        'cost': 30,
        'time': 3,
        'ability': [['unlock build', 'barracks', 'sniper']],
        'unlocks': ['head hunter', 'offensive coordination'],
        'quote': "Watch your six mate, snipers all around",
    },
    'charge':{
        'cost': 50,
        'time': 6,
        'ability': [['typeAbility', 'trooper', 'charge', 0]],
        'unlocks': [],
        'quote': "CHARGE!!",
    },
    'stronger soldiers':{
        'cost': 50,
        'time': 8,
        'ability': [['typeStat', 'trooper', 'attack', 0.5]],
        'unlocks': ['charge', 'offensive recruitment'],
        'quote': "Yup, bigger muscles = more gun strength",
    },
    'offensive recruitment':{
        'cost': 20,
        'time': 2,
        'ability': [['stat', 'recruited soldier', 'attack', 0.5]],
        'unlocks': [],
        'quote': "Look for the ones that brought guns with them",
    },
    'blinding rage':{
        'cost': 40,
        'time': 2,
        'ability': [['stat', 'brute', 'attack', 0.5]],
        'unlocks': ['raw strength'],
        'quote': "I can't see!",
    },
    'raw strength':{
        'cost': 60,
        'time': 2,
        'ability': [['stat', 'brute', 'maxHealth', 5],
                    ['stat', 'brute', 'health', 5]],
        'unlocks': [],
        'quote': "Pure muscle",
    },
    'head hunter':{
        'cost': 60,
        'time': 3,
        'ability': [['stat', 'sniper', 'attack', 0.5]],
        'unlocks': ['camouflage'],
        'quote': "Full metal jacket",
    },
    'camouflage':{
        'cost': 80,
        'time': 10,
        'ability': [['gain state', 'sniper', 'cloak']],
        'unlocks': [],
        'quote': "Initiating active camo.",
    },
    'demolitionists':{
        'cost': 100,
        'time': 1,
        'ability': [['unlock build', 'barracks', 'wall breaker']],
        'unlocks': [],
        'quote': "It only takes a little bit of motivating to get them out there.",
    },
    'offensive coordination':{
        'cost': 50,
        'time': 5,
        'ability': [['unlock build', 'barracks', 'general']],
        'unlocks': [],
        'quote': "Here comes the general",
    },
    
    #Yellow
    'armament':{
        'cost': 20,
        'time': 1,
        'ability': [],
        'unlocks': ['heavy weapons','naval warfare'],
        'quote': "Tanks and Boats",
    },
    'heavy weapons':{
        'cost': 20,
        'time': 1,
        'ability': [],
        'unlocks': ['taking their land','defending our territory'],
        'quote': "Boom.",
    },
    'taking their land':{
        'cost': 20,
        'time': 1,
        'ability': [],
        'unlocks': ['artillery','taking land','heavier'],
        'quote': "This land is my land, this land's not your land",
    },
    'artillery':{
        'cost': 20,
        'time': 2,
        'ability': [['unlock build', 'tank factory', 'artillery']],
        'unlocks': ['seige cannons'],
        'quote': "This is where the fun begins",
    },
    'seige cannons':{
        'cost': 50,
        'time': 3,
        'ability': [['stat', 'artillery', 'attack', 0.5]],
        'unlocks': ['stronger hulls'],
        'quote': "Cannons? This will never do",
    },
    'stronger hulls':{
        'cost': 20,
        'time': 3,
        'ability': [['stat', 'artillery', 'maxHealth', 2],
                    ['stat', 'artillery', 'health', 2]],
        'unlocks': [],
        'quote': "Tough armor. That's good, right?",
    },
    'taking land':{
        'cost': 50,
        'time': 5,
        'ability': [['typeAbility', 'vehicle', 'charge', 0]],
        'unlocks': ['heavier'],
        'quote': "it's free real estate",
    },
    'defending our territory':{
        'cost': 20,
        'time': 1,
        'ability': [],
        'unlocks': ['mobile fortress','heavier'],
        'quote': "Get off my lawn",
    },
    'mobile fortress':{
        'cost': 20,
        'time': 2,
        'ability': [['unlock build', 'tank factory', 'mobile fortress']],
        'unlocks': [],
        'quote': "The fortress is now on wheels",
    },
    'heavier':{
        'cost': 20,
        'time': 2,
        'ability': [['unlock build', 'tank factory', 'heavy tank']],
        'unlocks': ['heavier weapons','heavier armor'],
        'quote': "What exactly makes these tanks heavier?",
    },
    'heavier armor':{
        'cost': 40,
        'time': 2,
        'ability': [['stat', 'heavy tank', 'defense', 0.5]],
        'unlocks': [],
        'deny': ['heavier weapons'],
        'quote': "Oh that's why!",
    },
    'heavier weapons':{
        'cost': 50,
        'time': 3,
        'ability': [['stat', 'heavy tank', 'attack', 0.5]],
        'unlocks': [],
        'deny': ['heavier armor'],
        'quote': "Oh that's why!",
    },
    
    'naval warfare':{
        'cost': 20,
        'time': 1,
        'ability': [],
        'unlocks': ['taking their shores', 'defending our water'],
	    'quote': "Anchors aweigh, my boys, anchors aweigh",
    },
    'taking their shores':{
        'cost': 20,
        'time': 1,
        'ability': [],
        'unlocks': ['subs','seige boats', 'heavy duty shells', 'speed boats'],
	    'deny': ['defending our water'],
	    'quote': "Croatia simulator",
    },
    'defending our water':{
        'cost': 20,
        'time': 1,
        'ability': [],
        'unlocks': ['backup navy', 'thicker hulls', 'mine layers', 'frigates'],
	    'deny': ['taking their shores'],
	    'quote': "Don't want no tragedy of the commons",
    },
    'floating fortress':{
        'cost': 20,
        'time': 2,
        'ability': [['unlock build', 'docks', 'floating fortress']],
        'unlocks': ['greater yield', 'point defense systems'],
	    'quote': "It's like a whole moving dock.",
    },
    'greater yield':{
        'cost': 50,
        'time': 2,
        'ability': [['stat', 'floating fortress', 'maxPopulation', 1]],
        'unlocks': [],
	    'quote': "Increased naval opperations",
    },
    'backup navy':{
        'cost': 20,
        'time': 2,
        'ability': [['stat', 'docks', 'maxPopulation', 1]],
        'unlocks': [],
	    'quote': "boats go brrrrrrrr",
    },
    'subs':{
        'cost': 20,
        'time': 2,
        'ability': [['unlock build', 'docks', 'submarine']],
        'unlocks': ['hydrodynamics'],
	    'quote': "Reports say the enemy might be hiding their subs in the sea.",
    },
    'hydrodynamics':{
        'cost': 50,
        'time': 4,
        'ability': [['stat', 'submarine', 'speed', 1]],
        'unlocks': [],
	    'quote': "zooooooom",
    },
    'seige boats':{
        'cost': 20,
        'time': 2,
        'ability': [['unlock build', 'docks', 'seige boat']],
        'unlocks': ['heavy deployment'],
	    'quote': "D-day intensifies",
    },
    'thicker hulls':{
        'cost': 40,
        'time': 3,
        'ability': [['typeStat', 'boat', 'defense', 0.5]],
        'unlocks': ['heavy duty defense'],
	    'quote': "Barely afloat but hard to kill",
    },
    'heavy duty shells':{
        'cost': 40,
        'time': 3,
        'ability': [['typeStat', 'boat', 'attack', 0.5]],
        'unlocks': ['heavy duty offense'],
	    'quote': "Big bullets leave big wounds",
    },
    'point defense systems':{
        'cost': 50,
        'time': 2,
        'ability': [['stat', 'floating fortress', 'attack', 1]],
        'unlocks': [],
	    'quote': "Get off my floating fortress, this thing is too expensive to lose.",
    },
    'heavy deployment':{
        'cost': 80,
        'time': 12,
        'ability': [['unlock build', 'seige boat', 'heavy']],
        'unlocks': [],
	    'quote': "This is actually commically OP, but don't tell 3",
    },
    'mine layers':{
        'cost': 30,
        'time': 2,
        'ability': [['unlock build', 'docks', 'mine layer']],
        'unlocks': [],
	    'quote': "We might even find nemo",
    },
    'speed boats':{
        'cost': 30,
        'time': 2,
        'ability': [['unlock build', 'docks', 'speed boat']],
        'unlocks': [],
	    'quote': "going for a joy ride",
    },
    'heavy duty defense':{
        'cost': 40,
        'time': 3,
        'ability': [['stat', 'boat', 'defense', 0.5]],
        'unlocks': ['floating fortress', 'naval defense'],
	    'quote': "Impossible to kill",
    },
    'heavy duty offense':{
        'cost': 40,
        'time': 3,
        'ability': [['stat', 'boat', 'attack', 0.5]],
        'unlocks': ['warships', 'destroyers'],
	    'quote': "tiny ships, big guns",
    },
    'warships':{
        'cost': 80,
        'time': 4,
        'ability': [['unlock build', 'docks', 'battleship']],
        'unlocks': ['ship yards'],
	    'quote': "Here come the big guns",
    },
    'ship yards':{
        'cost': 100,
        'time': 6,
        'ability': [['unlock upgrade', 'crane', 'ship yard'],
                    ['unlock build', 'metropolis', 'ship yard'],
                    ['unlock build', 'military city', 'ship yard']],
        'unlocks': ['cruisers'],
	    'quote': "something something death star something something",
    },
    'naval defense':{
        'cost': 80,
        'time': 4,
        'ability': [['unlock upgrade', 'crane', 'naval defense platform'],
                    ['unlock build', 'metropolis', 'naval defense platform'],
                    ['unlock build', 'military city', 'naval defense platform']],
        'unlocks': ['coast guard'],
	    'quote': "Through surf and storm and howling gale.",
    },
    'coast guard':{
        'cost': 80,
        'time': 5,
        'ability': [['unlock build', 'naval defense platform', 'frigate']],
        'unlocks': [],
	    'quote': "Through surf and storm and howling gale.",
    },
    'cruisers':{
        'cost': 120,
        'time': 7,
        'ability': [['unlock build', 'ship yard', 'cruiser']],
        'unlocks': [],
	    'quote': "Cruising for a bruising",
    },
    'frigates':{
        'cost': 80,
        'time': 3,
        'ability': [['unlock build', 'docks', 'frigate']],
        'unlocks': ['heavy engines'],
	    'quote': "Anti-air naval defense",
    },
    'heavy engines':{
        'cost': 80,
        'time': 4,
        'ability': [['stat', 'frigate', 'speed', 1]],
        'unlocks': [],
	    'quote': "Heavy duty engines, lots of fuel but it's for a good cause, speed!",
    },
    'destroyers':{
        'cost': 80,
        'time': 3,
        'ability': [['unlock build', 'docks', 'destroyer']],
        'unlocks': ['mobile missile launch'],
	    'quote': "Heavy duty naval destroyers, not so good on the shore though",
    },
    'mobile missile launch':{
        'cost': 80,
        'time': 6,
        'ability': [['unlock build', 'destroyer', 'missile']],
        'unlocks': [],
	    'quote': "Verticle launch platforms engage",
    },
    #Orange
    'aviation':{
        'cost': 40,
        'time': 2,
        'ability': [],
        'unlocks': ['airport'],
        'quote': "This is what the Wright brothers came up with",
    },
    'airport':{
        'cost': 40,
        'time': 2,
        'ability': [['unlock upgrade', 'crane', 'airport'],
                    ['unlock build', 'metropolis', 'airport'],
                    ['unlock build', 'metropolis ii', 'airport'],
                    ['unlock build', 'metropolis iii', 'airport'],
                    ['unlock build', 'military city', 'airport']],
        'text':"Unlocks the Airport at the Crane, Metropolis, and Military City.",
        'unlocks': ['helicopter','water launch','rapid launch','super sonic speed'],
        'quote': "What do we want? Planes! When do we want them? Neeeooow!",
    },
    'helicopter':{
        'cost': 40,
        'time': 5,
        'ability': [['unlock build', 'airport', 'helicopter']],
        'unlocks': ['heavy lifting'],
        'quote': "Wait, these came after planes!",
    },
    'heavy lifting':{
        'cost': 50,
        'time': 5,
        'ability': [['stat', 'helicopter', 'maxPopulation', 1]],
        'unlocks': ['chinook', 'attack helicopters'],
        'quote': "Better propellers, I guess",
    },
    'chinook':{
        'cost': 100,
        'time': 7,
        'ability': [['unlock build', 'airport', 'chinook']],
        'unlocks': [],
        'deny': ['attack helicopters'],
        'quote': "Two propellers, twice the lift",
    },
    'attack helicopters':{
        'cost': 100,
        'time': 7,
        'ability': [['unlock build', 'airport', 'attack helicopter']],
        'unlocks': [],
        'deny': ['chinook'],
        'quote': "Apache gunship",
    },
    'water launch':{
        'cost': 80,
        'time': 5,
        'ability': [['unlock build', 'docks', 'aircraft carrier']],
        'unlocks': ['sea plane'],
        'quote': "Floating Airports!",
    },
    'sea plane':{
        'cost': 30,
        'time': 2,
        'ability': [['unlock build', 'aircraft carrier', 'sea plane']],
        'unlocks': ['copter launch','stronger carriers'],
        'quote': "What's better than planes over the land? Planes over the water!",
    },
    'copter launch':{
        'cost': 40,
        'time': 5,
        'ability': [['unlock build', 'aircraft carrier', 'helicopter']],
        'unlocks': [],
        'deny': ['stronger carriers'],
        'quote': "Oh man, helicopters are after planes again!",
    },
    'stronger carriers':{
        'cost': 50,
        'time': 8,
        'ability': [['stat', 'aircraft carrier', 'attack', 0.5], 
                    ['stat', 'aircraft carrier', 'defense', 0.5],
                    ['stat', 'aircraft carrier', 'maxHealth', 5],
                    ['stat', 'aircraft carrier', 'health', 5]],
        'unlocks': [],
        'deny': ['copter launch'],
        'text': "Increases the attack and defense of Aircraft Carriers by 0.5, and increases its health by 5.",
        'quote': "The carriers themselves are useful too",
    },
    'rapid launch':{
        'cost': 40,
        'time': 4,
        'ability': [['stat', 'airport', 'range', 1]],
        'unlocks': ['air traffic control'],
        'quote': "Yeeting those planes out there",
    },
    'air traffic control':{
        'cost': 120,
        'time': 2,
        'ability': [['stat', 'airport', 'maxPopulation', 1]],
        'unlocks': ['bombers', 'interceptors'],
        'quote': "Don't make me crash two planes above your house",
    },
    'bombers':{
        'cost': 20,
        'time': 4,
        'ability': [['unlock build', 'airport', 'bomber']],
        'unlocks': [],
        'deny': ['interceptors'],
        'quote': "What if we put massive explosives on planes going through the air at high speeds?",
    },
    'interceptors':{
        'cost': 20,
        'time': 4,
        'ability': [['unlock build', 'airport', 'interceptor']],
        'unlocks': [],
        'deny': ['bombers'],
        'quote': "Time for a dog fight",
    },
    'super sonic speed':{
        'cost': 100,
        'time': 5,
        'ability': [['stat', 'plane', 'speed', 1]],
        'unlocks': ['better armor'],
        'quote': "REACHING LIGHT SPEED NOW!!! errrrrrrrr",
    },
    'better armor':{
        'cost': 40,
        'time': 2,
        'ability': [['typeStat', 'aircraft', 'defense', 0.5]],
        'unlocks': ['better weapons', 'stealth planes'],
        'quote': "Hey, it ain't fuel efficient, but it can take a hit",
    },
    'better weapons':{
        'cost': 80,
        'time': 8,
        'ability': [['typeStat', 'aircraft', 'attack', 0.5]],
        'unlocks': [],
        'deny': ['stealth planes'],
        'quote': "pew pew",
    },
    'stealth planes':{
        'cost': 100,
        'time': 3,
        'ability': [['unlock build', 'airport', 'stealth plane']],
        'unlocks': [],
        'deny': ['better weapons'],
        'quote': "They'll never see it coming",
    },
    
    #Purple
    'improvements':{
        'cost': 20,
        'time': 1,
        'ability': [],
        #'unlocks': ['the city', 'miscellaneous upgrades'],
        'unlocks': ['bionics','time travel', 'miscellaneous upgrades'],
        'quote':"There is always room for improvement",
    },
    'the city':{
        'cost': 20,
        'time': 1,
        'ability': [],
        'unlocks': ['bionics','time travel'],
        #'ability': [['unlock build', 'crane', 'metropolis']],
        #'unlocks': ['bionics','city planning','time travel'],
    },
    'city planning':{
        'cost': 5,
        'time': 2,
        'ability': [],
        'unlocks': ['supply lines','urban expansion','civil fortification'],
    },
    'supply lines':{
        'cost': 20,
        'time': 3,
        'ability': [],
        'unlocks': ['recycling','quarries','power lines'],
    },
    'recycling':{
        'cost': 50,
        'time': 4,
        'ability': [['unlock build', 'metropolis', 'recycler'],
                    ['unlock build', 'metropolis expansion', 'recycler']],
        'unlocks': [],
    },
    'quarries':{
        'cost': 50,
        'time': 4,
        'ability': [['unlock build', 'metropolis', 'mine shaft'],
                    ['unlock build', 'metropolis expansion', 'mine shaft']],
        'unlocks': [],
    },
    'power lines':{
        'cost': 50,
        'time': 4,
        'ability': [['unlock build', 'metropolis', 'power grid'],
                    ['unlock build', 'metropolis expansion', 'power grid']],
        'unlocks': [],
    },
    'urban expansion':{
        'cost': 20,
        'time': 3,
        'ability': [],
        'unlocks': ['suburbs','expanding city limits'],
    },
    'suburbs':{
        'cost': 25,
        'time': 2,
        'ability': [['unlock build', 'metropolis', 'town'],
                    ['unlock build', 'metropolis expansion', 'town']],
        'unlocks': [],
    },
    'expanding city limits':{
        'cost': 35,
        'time': 4,
        'ability': [['unlock build', 'metropolis', 'metropolis expansion']],
        'unlocks': ['indefinite expansion'],
    },
    'indefinite expansion':{
        'cost': 50,
        'time': 7,
        'ability': [['unlock build', 'metropolis expansion', 'metropolis expansion']],
        'unlocks': [],
    },
    'civil fortification':{
        'cost': 40,
        'time': 3,
        'ability': [],
        'unlocks': ['defensive measures','city improvements'],
    },
    'defensive measures':{
        'cost': 45,
        'time': 3,
        'ability': [['unlock build', 'metropolis', 'defense platform'],
                    ['unlock build', 'metropolis expansion', 'defense platform']],
        'unlocks': ['offense platform'],
    },
    'offense platform':{
        'cost': 60,
        'time': 7,
        'ability': [['unlock build', 'defense platform', 'missile']],
        'unlocks': [],
    },
    'city improvements':{
        'cost': 50,
        'time': 2,
        'ability': [],
        'unlocks': ['immigration','resistant structures','taller skyscapers'],
    },
    'immigration':{
        'cost': 250,
        'time': 2,
        'ability': [['gain ability', 'metropolis', 'buff', ['maxPopulation', 1.5]]],
        'unlocks': [],
    },
    'resistant structures':{
        'cost': 50,
        'time': 5,
        'ability': [['stat', 'metropolis', 'defense', 1]],
        'unlocks': [],
    },
    'taller skyscapers':{
        'cost': 50,
        'time': 5,
        'ability': [['stat', 'metropolis', 'maxHealth', 10],
                    ['stat', 'metropolis', 'health', 10]],
        'unlocks': [],
    },
    'miscellaneous upgrades':{
        'cost': 25,
        'time': 1,
        'ability': [],
        'unlocks': ['stronger walls','double time','deflector shields','further dectection'],
        'quote': "Upgrades people, upgrades",
    },
    'stronger walls':{
        'cost': 20,
        'time': 4,
        'ability': [['stat', 'wall', 'maxHealth', 5],
                    ['stat', 'wall', 'health', 5]],
        'unlocks': [],
        'quote': "Nothing's getting over that wall, well, maybe a ladder",
    },
    'double time':{
        'cost': 10,
        'time': 10,
        'ability': [['gain ability', 'research center', 'fast research', 2]],
        'unlocks': [],
        'quote': "Keep it up boys, double time lets go!",
    },
    'deflector shields':{
        'cost': 30,
        'time': 7,
        'ability': [['unlock build', 'crane', 'shield generator']],
        'unlocks': [],
        'text': "Unlocks the Shield Generator at the Crane.",
        'quote': "We must pull back and set up our deflector shields!",
    },
    'further dectection':{
        'cost': 20,
        'time': 4,
        'ability': [['stat', 'radar tower', 'range', 1]],
        'unlocks': [],
        'quote': "Remeber the Battle of Brittian?",
    },
}





FactionUnits = {
    "town": {
        "nature": "tree"
    },
    "outpost": {
        "nature": "small tree"
    },
    "city": {
        "nature": "big tree"
    },
    "metropolis": {
        "nature": "mountain"
    },
}

