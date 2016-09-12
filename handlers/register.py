import tornado.web as tw
from .base import BaseHandler

class RegisterHandler(BaseHandler):
    def get(self):
        # todo: redirect if user is already logged in
        self.render('../templates/register.html')

    def post(self):
        user = self.get_argument('username', '')
        password = self.get_argument('password', '')
        print('Registration attempt by {}!'.format(user))
        for arg in self.request.arguments:
            print(arg, self.get_argument(arg))

        self.redirect('/')

