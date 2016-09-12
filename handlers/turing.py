import tornado.web as tw
from .base import BaseHandler

class TuringHandler(BaseHandler):

    @tw.authenticated
    def get(self):
        self.render('../templates/turing.html')

    def post(self):
        choice = self.get_argument('choice', '')
        start = self.get_argument('start', '')
        ts = self.get_argument('timestamp', '')
        clip_id = self.get_argument('clip_id', '')

        print(clip_id, choice, start, ts)