import tornado.web as tw
from .base import BaseHandler

class AIHandler(BaseHandler):

    @tw.authenticated
    def get(self):
        self.render('../templates/AI.html')

class AIDataHandler(BaseHandler):

    @tw.authenticated
    def get(self):
        # return move for AI
        pass

    @tw.authenticated
    def post(self):
        # write to DB
        pass

class AIOpponent():
    pass