UnitDB = {
    "medic":{
        "health":3,
        "cost":1,
        "penalty":("resource"),
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
        "penalty":("discard"),
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
        "penalty":("resource"),
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
        "penalty":("discard"),
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
        "penalty":("discard"),
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
        "penalty":("discard"),
        "generation":("resource"),
        "generationPattern":(
            "XXX",
            "XSX",
            "XXX",
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
        "penalty":("lostTech"),
        "tech":1,
        "constructionPattern":(
            "XXX",
            "XSX",
            "XXX",
        ),
    }

}