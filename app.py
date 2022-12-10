from flask import (
    Flask,
    render_template,
    redirect,
    flash,
    url_for,
    session,
    request
)
from game import Game, GameMaker
from tactics.game import Game as TacticalGame
from tactics.game import GameMaker as TacticalGameMaker
import game, UnitDB, traceback
import tactics.UnitDB as TacticalUnitDB
from os import walk
import json

from wtforms import (
    StringField,
    PasswordField,
    BooleanField,
    IntegerField,
    DateField,
    TextAreaField,
)
from flask_login import UserMixin
from pathlib import Path

from flask_wtf import FlaskForm
from wtforms.validators import InputRequired, Length, EqualTo, Regexp ,Optional
from flask_login import (
    UserMixin,
    login_user,
    LoginManager,
    logout_user,
    login_required,
    current_user,
)

app = Flask(__name__)
login_manager = LoginManager()
login_manager.init_app(app)

#CurrentGame = Game(2)
#CurrentGame.addPlayer()
#CurrentGame.addPlayer()
#CurrentGame.start()
#CurrentGame.saveGame()

app.secret_key = b'_5#y5L"F4Q8z\n\xec]/' #Made up secret key

class User(UserMixin):
    def __init__(self, username):
        self.username = username
        self.password = "123"

    def get_id(self):
        return self.username

    def __repr__(self):
        return '<User %r>' % self.username
    
    def get(user_id):
        if user_id == "RjFx3":
            return User("RjFx3")
        elif user_id == "RjFx5":
            return User("RjFx5")
        return User(user_id)

@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)

@login_manager.unauthorized_handler
def unauthorized_callback():
    print("unauthorized_callback",url_for('login'))
    return redirect(url_for('login'))

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

class login_form(FlaskForm):
    email = StringField(validators=[Optional(), Length(1, 64)])
    pwd = PasswordField(validators=[Optional(), Length(min=8, max=72)])
    # Placeholder labels to enable form rendering
    username = StringField(
        validators=[InputRequired()]
    )

class create_game_form(FlaskForm):
    player_count = StringField(validators=[Optional(), Length(1, 2)])
    cloud_mode = StringField(validators=[Optional(), Length(1, 8)])
    mapType = StringField(validators=[Optional(), Length(1, 30)])
    game_id = StringField(validators=[Optional(), Length(1, 8)])
    players = StringField(validators=[Optional(), Length(1, 64)])

@app.route('/submit', methods=['GET', 'POST'])
def submit():
    form = login_form()
    if form.validate_on_submit():
        return redirect('/success')
    return render_template('form.html', form=form)

@app.route("/login/", methods=("GET", "POST"), strict_slashes=False)
def login():
    form = login_form()
    print("something")

    print(form.errors)

    if form.is_submitted():
        print("submitted")

    if form.validate():
        print("valid")

    print(form.errors)

    if form.validate_on_submit():
        print("username:",form.username)
        try:
            #user = User.query.filter_by(email=form.email.data).first()
            if form.username.data == "RjFx3" or form.username.data == "RjFx5": #if check_password_hash(user.pwd, form.pwd.data):
                login_user(User(form.username.data))
                return redirect(url_for('find_game'))
            else:
                login_user(User(form.username.data)) #Lets anyone log in as whoever
                return redirect(url_for('find_game'))

                flash("Invalid Username or password!", "danger")
        except Exception as e:
            print("Exception",e)
            flash(e, "danger")

    return render_template("form.html",
        form=form,
        )

def getAllgameIDs():
    filenames = next(walk(Path("savefiles/games/")), (None, None, []))[2]  # [] if no file
    l = []
    for fileName in filenames:
        if fileName == ".gitignore":
            continue
        l.append(fileName[5:][:-4])
    return l

def findGamesPlayerIsIn(username):
    gameList = getAllgameIDs()
    output = []
    for game_id in gameList:
        with open(Path("savefiles/games/game_%s.txt" % game_id), "r+") as text_file:
            if text_file.read().find(username.lower()) != -1:
                output.append(game_id)
    return output


@app.route('/find_game')
@login_required
def find_game():
    return render_template('gameSelection.html', gameList = findGamesPlayerIsIn(current_user.username))

@app.route('/game/<game_id>')
@login_required
def canvas_game_by_id(game_id):
    with open(Path("savefiles/games/game_%s.txt"%game_id), 'r') as f:
        CurrentGame = GameMaker(f.read())
        if not (current_user.username.lower() in CurrentGame.playernames[0]):
            return redirect(url_for('find_game'))
        userid = CurrentGame.playernames[0][current_user.username.lower()]
        return render_template('canvas2.html', player_id = userid, game_id = game_id)

@app.route('/game2/<game_id>')
@login_required
def canvas_game_by_id2(game_id):
    with open(Path("savefiles/tactics_games/game_%s.txt"%game_id), 'r') as f:
        CurrentGame = TacticalGameMaker(f.read())
        if not (current_user.username.lower() in CurrentGame.units):
            return redirect(url_for('find_game'))
        userid = current_user.username.lower()
        return render_template('canvas3.html', player_id = userid, game_id = game_id)


@app.route('/')
@login_required
def canvas():
    userid = 0
    if current_user.username == "RjFx3":
        userid = 0
    elif current_user.username == "RjFx5":
        userid = 1
    gameID = "3"
    return render_template('canvas2.html', player_id = userid, game_id = gameID)
"""
@app.route('/get_game')
@login_required
def get_game():
    return CurrentGame.getJSON()
"""
"""
@app.route('/get_states')
@login_required
def get_states():
    player = "0"
    try:
        with open(Path("savefiles/states/game_2.json"), "r+") as text_file:
            out = text_file.read()
            if out.find('%srefresh' % player) != -1: #Indicator in states file that player hasn't recieved updated version yet
                print("found indicator")
                CurrentGame = ""
                try:
                    with open(Path("savefiles/games/game_2.txt"), 'r') as f:
                        CurrentGame = GameMaker(f.read())
                        out = out.replace('%srefresh' % player,"") #Remove indicator
                        print("re")
                        text_file.truncate(0)
                        text_file.seek(0)
                        text_file.write(out)
                        return CurrentGame.getJSON()
                except:
                    print("panik545")
                    return "" #This means not good,could not open file
            return out
    except Exception as e:
        print(str(e))
        return "{}"
"""

@app.route('/get_game2/<game_id>')
@login_required
def get_game2(game_id):
    try:
        try:
            with open(Path("savefiles/tactics_games/game_%s.txt" % game_id), 'r') as f:
                CurrentGame = TacticalGameMaker(f.read())
                return CurrentGame.getJSON()
        except:
            print("panik545")
            return "" #This means not good,could not open file
    except Exception as e:
        print(str(e))
        return "{}"

@app.route('/get_states/<game_id>/<turn>')
@login_required
def get_states2(game_id, turn):
    player = "0"
    try:
        with open(Path("savefiles/states/game_%s.json" % game_id), "r+") as text_file:
            out = text_file.read()
            if out.find('"turn": %s' % turn) == -1: #Indicator in states file that player hasn't recieved updated version yet
                print("wrong turn. Updating")
                CurrentGame = ""
                try:
                    with open(Path("savefiles/games/game_%s.txt" % game_id), 'r') as f:
                        CurrentGame = GameMaker(f.read())
                        return CurrentGame.getJSON()
                except:
                    print("panik545")
                    return "" #This means not good,could not open file
            return out
    except Exception as e:
        print(str(e))
        return "{}"

@app.route('/finish_turn/<game_id>')
def finish_turn(game_id):
    with open(Path("savefiles/games/game_%s.txt"%game_id), 'r') as f:
        CurrentGame = GameMaker(f.read())
        CurrentGame.round()
        return CurrentGame.getJSON()

@app.route('/done/<game_id>/<this_player>')
def done(game_id, this_player):
    with open(Path("savefiles/games/game_%s.txt"%game_id), 'r') as f:
        CurrentGame = GameMaker(f.read())
        CurrentGame.playerDone(int(this_player))
        CurrentGame.saveGame()
        return CurrentGame.getJSON()

@app.route('/action/<game_id>', methods=['GET', 'POST'])
def action(game_id):
    if request.method == "POST":
        try:
            print("data recieved",request.data.decode())
            CurrentGame = None
            with open(Path("savefiles/games/game_%s.txt"%game_id), 'r') as f:
                CurrentGame = GameMaker(f.read())
            player = CurrentGame.playernames[0][current_user.username.lower()]
            game.stateStuff(game_id, player,request.data.decode())
            CurrentGame.setState(0, request.data.decode())
            CurrentGame.saveGame()
        except Exception as e:
            print(str(e))
    print("HELLO")
    print("this is it ->", request.data.decode())
    return "bye"

@app.route('/action2/<game_id>', methods=['GET', 'POST'])
def action2(game_id):
    if request.method == "POST":
        try:
            print("data recieved",request.data.decode())
            CurrentGame = None
            with open(Path("savefiles/tactics_games/game_%s.txt"%game_id), 'r') as f:
                CurrentGame = TacticalGameMaker(f.read())
            #player = CurrentGame.playernames[0][current_user.username.lower()]
            player = current_user.username.lower()
            print("MY units:", str(CurrentGame.units["rjfx3"]))
            print("adfgadfgadfg")
            CurrentGame.decodeAction(player, request.data.decode())
            print("MY units:", str(CurrentGame.units["rjfx3"]))
            #game.stateStuff(game_id, player,request.data.decode())
            #CurrentGame.setState(0, request.data.decode())
            CurrentGame.saveGame()
        except Exception as e:
            print("an EXCEPTION has occured")
            print(str(e))
            print(traceback.format_exc())
    print("HELLO")
    print("this is it ->", request.data.decode())
    return "bye"

@app.route('/newgame', methods=("GET", "POST"), strict_slashes=False)
@login_required
def newGame():
    global CurrentGame
    form = create_game_form()
    print("something2")

    print(form.errors)

    if form.is_submitted():
        print("submitted")

    if form.validate():
        print("valid")

    print(form.errors)

    if form.validate_on_submit():
        try:
            x = int(form.player_count.data)
            CurrentGame = Game(form.game_id.data)
            if form.cloud_mode.data:
                CurrentGame.mode = form.cloud_mode.data.lower()
            if form.mapType.data:
                CurrentGame.wantedMap = form.mapType.data.lower()
            for i in range(x):
                CurrentGame.addPlayer()


            playerText = form.players.data.lower()
            if playerText == "":
                playerText = "RjFx3,RjFx5"
            playerText = playerText.replace(" ", "")
            players = playerText.split(",")
            playerDict = {}
            i = 0
            for player in players:
                playerDict[player] = i
                i+=1

            CurrentGame.playernames = [playerDict]
            #CurrentGame.addPlayer()
            CurrentGame.start()
            CurrentGame.saveGame()
            CurrentGame.addIndicatorsToStateFile()
            return redirect(url_for('canvas_game_by_id',game_id=form.game_id.data))
        except Exception as e:
            print("Exception",e)
            flash(e, "danger")

    return render_template("newGameForm.html",
        form=form,
        )

@app.route('/newgame2', methods=("GET", "POST"), strict_slashes=False)
@login_required
def newGame2():
    global CurrentGame
    form = create_game_form()
    print("something2")

    print(form.errors)

    if form.is_submitted():
        print("submitted")

    if form.validate():
        print("valid")

    print(form.errors)

    if form.validate_on_submit():
        try:
            x = int(form.player_count.data)
            CurrentGame = TacticalGame(form.game_id.data)


            playerText = form.players.data.lower()
            if playerText == "":
                playerText = "RjFx3,RjFx5"
            playerText = playerText.replace(" ", "")
            players = playerText.split(",")
            i = 0
            for player in players:
                CurrentGame.addPlayer(player)
                i+=1

            #CurrentGame.addPlayer()
            CurrentGame.start()
            CurrentGame.saveGame()
            return redirect(url_for('canvas_game_by_id2',game_id=form.game_id.data))
        except Exception as e:
            print("Exception",e)
            flash(e, "danger")

    return render_template("newGameForm2.html",
        form=form,
        )

class Encoder(json.JSONEncoder):
    def default(self, o):
        #Posible thing to do is is find all units with attack as their state and change statedata to unitID
        return o.__dict__

@app.route('/UnitDB/', strict_slashes=False)
def getUnitDB():
    return json.dumps(UnitDB.UnitDB, indent=0, cls=Encoder)

@app.route('/TechDB/', strict_slashes=False)
def getTechDB():
    return json.dumps(UnitDB.TechDB, indent=0, cls=Encoder)

@app.route('/UnitDB2/', strict_slashes=False)
def getUnitDB2():
    return json.dumps(TacticalUnitDB.UnitDB, indent=0, cls=Encoder)