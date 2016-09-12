import tornado.web as tw
from .base import BaseHandler

class DemoHandler(BaseHandler):

    @tw.authenticated
    def get(self):
        self.render('../templates/demo.html')

    def post(self):
        pass