import tornado.web as tw
from .base import BaseHandler

class TuringHandler(BaseHandler):

    @tw.authenticated
    def get(self):
        self.render('../templates/turing.html')

    @tw.authenticated
    def post(self):
        db = self.settings['db']

        argdict = {key: self.get_argument(key) for key in self.request.arguments}
        argdict['user_name'] = self.current_user.decode()
        argdict['task'] = 'turing'

        db.test_collection.insert(argdict, callback=self.insert_cb)

    def insert_cb(self, result, error):
        if error:
            raise error
        else:
            print('result: {}'.format(result))
            return