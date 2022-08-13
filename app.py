from flask import Flask, render_template, request
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

@app.route('/action', methods=['GET', 'POST'])
def action():
    if request.method == "POST":
        try:
            print("data recieved",request.data.decode())
            CurrentGame.setState(0, request.data.decode())
        except Exception as e:
            print(str(e))
    print("HELLO")
    print("this is it ->", request.data.decode())
    return "bye"