import tornado.web as tw
from .base import BaseHandler

class TuringHandler(BaseHandler):

    @tw.authenticated
    def get(self):
        self.render('../templates/turing.html')

    @tw.authenticated
    def post(self):
        db = self.settings['db']
        choice = self.get_argument('choice', '')
        start = self.get_argument('start', '')
        ts = self.get_argument('timestamp', '')
        clip_id = self.get_argument('clip_id', '')

        print(clip_id, choice, start, ts, self.current_user)

        argdict = {key: self.get_argument(key) for key in self.request.arguments}
        argdict['user_name'] = self.current_user.decode()

        def insert_cb(result, error):
            if error:
                raise error
            else:
                print('result: {}'.format(result))
                return
        db.test_collection.insert(argdict, callback=insert_cb)