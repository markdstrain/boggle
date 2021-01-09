from flask import Flask,render_template,request,session,jsonify
from boggle import Boggle
import os
import sys
import logging


# from flask_debugtoolbar import DebugToolbarExtension



app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'hellosecretkey')
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

# debug = DebugToolbarExtension(app)
boggle_game = Boggle()

@app.route("/", methods=["GET"])
def homepage():
    board = boggle_game.make_board()
    session['board']=board
    highscore = session.get('highscore',0)

    return render_template('boggle_board.html',board = board,highscore=highscore)

@app.route('/check-word')
def seeIfItsWord():
    word = request.args['word']
    board = session['board']
    response = boggle_game.check_valid_word(board = board,word= word)

    return jsonify({'result': response})

@app.route('/post-score', methods = ['POST'])
def post_score():

    score = request.json['score']
    highscore = session.get('highscore', 0)

    session['highscore']= max(score, highscore)

    return jsonify(brokeRecord = score > highscore)

