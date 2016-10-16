import tornado.web as tw
from .base import BaseHandler

class TuringQHandler(BaseHandler):
    @tw.authenticated
    def get(self):
        self.render('turingQ.html')

    @tw.authenticated
    def post(self):
        argdict = {key: self.get_argument(key) for key in self.request.arguments}
        user = self.current_user.decode()
        argdict['user_name'] = user
        argdict['task'] = 'turingQ'

        print(argdict)
        db = self.settings['db']
        collection = db.turing

        collection.insert(argdict)
