import tornado.web as tw
import numpy as np
from scipy.signal import convolve
from .base import BaseHandler

class AIHandler(BaseHandler):

    @tw.authenticated
    def get(self):
        self.render('../templates/AI.html')


class GameCache(object):
    def __init__(self, user):
        self.user = user
        self.position_history = [] # positions are tuples of integers
        self.move_history = []
        self.game_status = 'ready'

    def update(self, move, position):
        if position[0] is str:
            position = self.strings_to_int(position)
        self.move_history.append(move)
        self.position_history.append(position)
        self.game_status = self.check_for_win()
    
    def check_for_win(self):
        p = self.unpack_position(self.position_history[-1])
        f1 = np.array([[[1, 1, 1, 1]]])
        f2 = np.diagflat(f1)[np.newaxis, :, :]
        filters = [
            f1,
            f1.swapaxes(1, 2),
            f2,
            np.fliplr(f2)
        ]
        if np.sum(p) == 72:
            return 'draw'
        for i, f in enumerate(filters):
            c = np.sum(convolve(p, f, mode='valid')==4)
            if c == 1:
                return 'win'
        return 'playing'

    def make_move(self, position, color):
        newm = self.choose_move(position)
        if color == 0:
            newp = (position[0] + 2**newm, position[1])
        else:
            newp = (position[0], position[1] + 2**newm)

        self.position_history.append(newp)
        self.move_history.append(newm)

    def choose_move(self, position):
        # replace this or subclass GameCache as necessary
        lm = self.get_legal_moves(position)
        return np.random.choice(lm)

    def get_legal_moves(self, position):
        bp, wp = position
        lm = int_to_binstring(2**36 - 1 - bp - wp)
        return np.where(np.array(list(lm)).astype(bool))[0]

    def int_to_binstring(self, x):
        _x = bin(x)[2:]
        _xl = len(_x)
        if _xl < 36:
            _x = '0'*(36-_xl) + _x
        return _x

    def unp(self, x):
        _x = self.int_to_binstring(x)
        return np.array(list(_x)).astype(int).reshape(4, 9)

    def ints_to_tensor(self, position):
        bp, wp = position
        return np.array([self.unp(bp), self.unp(wp)])

    def strings_to_int(self, position):
        bp, wp = position
        return (int(bp, 2), int(wp, 2))
        

class GameHandler(BaseHandler):

    @tw.authenticated
    def get(self):
        user = self.current_user.decode()

    @tw.authenticated
    def post(self):

        # convert data to dictionary
        db = self.settings['db']

        argdict = {key: self.get_argument(key) for key in self.request.arguments}
        user = self.current_user.decode()  
        argdict['user_name'] = user
        argdict['task'] = 'AI'

        argdict[]
        for k, v in argdict.items():
            print(k, v) 

        # add data to MongoDB
        def insert_cb(result, error):
            if error:
                raise error
            else:
                print('result: {}'.format(result))
                return
        db.test_collection.insert(argdict, callback=insert_cb)

        # add data to cache
        if not (user in game_cache_buffer.keys()]:
            game_cache_buffer[user] = GameCache(user)
        G = game_cache_buffer[user]
        G.update(
            argdict['response'], 
            (argdict['bp'], argdict['wp'])
        )

        if G.game_status == 'playing':
            reply = G.make_move(G.position_history[:-1])




        