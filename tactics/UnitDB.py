UnitDB = {
    "soldier": {
        "health":3,
        "attack":2,
        "counter":2,
        "cost":1,
        "penalty":["resource",],
        "attackPattern": [
            " X ",
            "XSX",
            " X "
        ],
        "counterPattern": [
            " X ",
            "XSX",
            " X "
        ]
    },
    "tank": {
        "health":7,
        "attack":4,
        "counter":1,
        "cost":1,
        "penalty":["discard",],
        "attackPattern": [
            "  X ",
            "SXXX",
            "  X "
        ],
        "counterPattern": [
            "X X",
            " S ",
            "X X"
        ]
    },
    "mine": {
        "health":4,
        "cost":1,
        "penalty":("discard",),
        "generation":("resource",),
        "generationPattern":(
            "X X",
            " S ",
            "X X",
        ),
        "constructionPattern":(
            "XXX",
            "XSX",
            "XXX",
        ),
    },
    "sea mine": {
        "health":2,
        "trap":5,
        "cost":0,
        "penalty":[],
        "trapPattern": [
            " XX",
            "XSX",
            "XX "
        ],
        "abilities":{"kamikaze":0}
    },
    
    "sniper": {
        "health":2,
        "attack":5,
        "cost":1,
        "penalty":["resource",],
        "attackPattern": [
            "X  X  X",
            "       ",
            "       ",
            "X  S  X",
            "       ",
            "       ",
            "X  X  X",
        ],
    },
    "medic":{
        "health":3,
        "cost":1,
        "penalty":("resource",),
        "heal":3,
        "healPattern":(
            "XXX",
            "XSX",
            "XXX",
        )
    },
    "heavy": {
        "health":5,
        "cost":1,
        "penalty":("discard",),
        "attack":4,
        "attackPattern":(
            "X X",
            " S ",
            "X X",
        ),
        "counter":2,
        "counterPattern":(
            " X ",
            "XSX",
            " X ",
        ),
    },
    "defender": {
        "health":5,
        "defense":1,
        "cost":1,
        "penalty":("resource",),
        "counter":4,
        "counterPattern":(
            "XXX",
            "XSX",
            "   ",
        ),
    },
    "plane": {
        "health":4,
        "cost":1,
        "penalty":("discard",),
        "attack":4,
        "attackPattern":(
            " S ",
            "X X",
            "X X",
        ),
        "counter":2,
        "counterPattern":(
            "X X",
            "X X",
            " S ",
        ),
    },
    "bomber": {
        "health":7,
        "cost":2,
        "penalty":("discard",),
        "attack":5,
        "attackPattern":(
            "  S  ",
            "XX XX",
            "XX XX",
            "XX XX",
            "XX XX",
        ),
        "abilities":{"explosive":0}
    },
    "factory":{
        "health":8,
        "cost":2,
        "penalty":("discard",),
        "generation":("resource",),
        "generationPattern":(
            "  X  ",
            "XXSXX",
            "  X  ",
        ),
        "constructionPattern":(
            "XXX",
            "XSX",
            "XXX",
        ),
    },
    "research center":{
        "health":7,
        "cost":3,
        "penalty":("lostTech",),
        "tech":1,
        "constructionPattern":(
            "XXX",
            "XSX",
            "XXX",
        ),
    }
}