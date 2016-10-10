import tornado.web as tw
from .base import BaseHandler

class LoginHandler(BaseHandler):
    def get(self):
        self.render('../templates/login.html')

    def post(self):
        user = self.get_argument('username')
        password = self.get_argument('password')
        self.set_secure_cookie('user', user)
        self.redirect('/') # need to redirect to previous page otherwise?

class LogoutHandler(BaseHandler):
    def get(self):
        self.clear_cookie('user')
        self.redirect('/')
