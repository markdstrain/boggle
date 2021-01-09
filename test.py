from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    def setUp(self):
        """Make sure information is in the seesion and HTML is displayed"""

        self.client = app.test_client()
        app.config['TESTING'] = True

    def test_homepage(self):

        with self.client:
            response = self.client.get('/')
            self.assertEqual(response.status_code, 200)
            self.assertIn('board',session)
            self.assertIsNone(session.get('highscore'))
            self.assertIn(b'High Score:' ,response.data)
            self.assertIn(b'Score:',response.data)
            self.assertIn(b'Time:',response.data)

    def test_valid_word(self):
        """Test if word is valid by modifying the board in the session"""

        with self.client as client:
            with client.session_transaction() as sess:
                sess['board'] = [["C", "A", "T", "T", "T"],
                                 ["C", "A", "T"," T", "T"],
                                 ["C", "A", "T"," T", "T"],
                                 ["C", "A", "T", "T", "T"],
                                 ["C", "A", "T", "T", "T"]]
        response = self.client.get('/check-word?word=cat')
        self.assertEqual(response.json['result'], 'ok')

    def test_invalid_word(self):
        """Test if word is on the board"""

        self.client.get('/')
        response = self.client.get(
            '/check-word?word=sdfkjsldfjdfjdljflkajsdfkljaf')
        self.assertEqual(response.json['result'],'not-word')
        

