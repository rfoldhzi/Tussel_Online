from flask import Flask, render_template
from game import Game

app = Flask(__name__)

CurrentGame = Game(2)
CurrentGame.addPlayer()
CurrentGame.start()

@app.route('/')
def canvas():
    return render_template('canvas2.html')

@app.route('/finish_turn')
def finish_turn():
    CurrentGame.round()
    return CurrentGame.getJSON()