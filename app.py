from flask import (
    Flask,
    render_template,
    redirect,
    flash,
    url_for,
    session
)
from game import Game

from wtforms import (
    StringField,
    PasswordField,
    BooleanField,
    IntegerField,
    DateField,
    TextAreaField,
)
from flask_login import UserMixin


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

CurrentGame = Game(2)
CurrentGame.addPlayer()
#CurrentGame.addPlayer()
CurrentGame.start()

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
                return redirect(url_for('canvas'))
            else:
                flash("Invalid Username or password!", "danger")
        except Exception as e:
            print("Exception",e)
            flash(e, "danger")

    return render_template("form.html",
        form=form,
        )




@app.route('/')
@login_required
def canvas():
    userid = 0
    if current_user.username == "RjFx3":
        userid = 0
    elif current_user.username == "RjFx5":
        userid = 1
    return render_template('canvas2.html', player_id = userid)

@app.route('/get_game')
@login_required
def get_game():
    return CurrentGame.getJSON()

@app.route('/finish_turn')
def finish_turn():
    CurrentGame.round()
    return CurrentGame.getJSON()

@app.route('/done/<this_player>')
def done(this_player):
    CurrentGame.playerDone(int(this_player))
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