import tornado.web as tw
from .base import BaseHandler

class LogoutHandler(BaseHandler):
    def get(self):
        self.clear_cookier('user')
        self.redirect('/')
