import tornado.web as tw
from .base import BaseHandler

class AIHandler(BaseHandler):

    @tw.authenticated
    def get(self):
        self.render('../templates/AI.html')

class AIDataHandler(BaseHandler):
    # sike, turns out you NEED game room to avoid DB probs

    @tw.authenticated
    def get(self):
        # return move for AI
        pass

    @tw.authenticated
    def post(self):
        db = self.settings['db']

        argdict = {key: self.get_argument(key) for key in self.request.arguments}
        argdict['user_name'] = self.current_user.decode()  
        argdict['task'] = 'AI'      

        def insert_cb(result, error):
            if error:
                raise error
            else:
                print('result: {}'.format(result))
                return
        db.test_collection.insert(argdict, callback=insert_cb)
        # write to DB
        