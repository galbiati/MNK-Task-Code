import tornado.web as tw
from .base import BaseHandler

class CastlefightHandler(BaseHandler):

    def get(self):
        self.render('castlefight.html')

    def post(self):
        pass