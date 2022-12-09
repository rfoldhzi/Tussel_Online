UnitDB = {
    "soldier": {
        "health":3,
        "attack":2,
        "counter":2,
        "cost":1,
        "penalty":["resource"],
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
        "penalty":["discard"],
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
        "penalty":["resource"],
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
}