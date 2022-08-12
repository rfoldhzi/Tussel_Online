from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def canvas():
    return render_template('canvas2.html')