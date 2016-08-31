import tornado.web as tw
from .base import BaseHandler

class LoginHandler(BaseHandler):
    def get(self):
        self.render('../templates/login.html')

    def post(self):
        user = self.get_argument('username', '')
        password = self.get_argument('password', '')
        print('Login attempt by {}!'.format(user))
        print(password)
        self.write(
            {'username': user[::-1]}
        )

        # self.redirect(u'/')