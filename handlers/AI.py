import tornado.web as tw
from .base import BaseHandler

class AIHandler(BaseHandler):

    @tw.authenticated
    def get(self):
        self.render('../templates/AI.html')

class GameHandler(BaseHandler):
    def __init__(self):
        super(GameHandler, self).__init__()

    @tw.authenticated
    def get(self):
        cu = self.current_user.decode()

        data = {
            'initials': self.initials
            'res': self.last_move,
            'bp'
        }

    @tw.authenticated
    def post(self):

        # handle data
        db = self.settings['db']

        argdict = {key: self.get_argument(key) for key in self.request.arguments}
        argdict['user_name'] = self.current_user.decode()  
        argdict['task'] = 'AI'
        for k, v in argdict.items():
            print(k, v) 
        def insert_cb(result, error):
            if error:
                raise error
            else:
                print('result: {}'.format(result))
                return
        db.test_collection.insert(argdict, callback=insert_cb)


        