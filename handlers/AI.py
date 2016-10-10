import tornado.web as tw
import numpy as np
import subprocess as sp
from scipy.signal import convolve
from .base import BaseHandler
from datetime import datetime as dt

class AIHandler(BaseHandler):
    @tw.authenticated
    def get(self):
        self.render('../templates/AI.html')


class GameCache(object):
    # move utility functions to new file 'util.py' in lib

    def __init__(self, user):
        self.user = user
        self.reset()

    def update(self, move, position):
        if type(position[0]) is str:
            position = self.strings_to_int(position)
        self.move_history.append(move)
        self.position_history.append(position)
        if self.game_status == 'playing':
            self.game_status = self.check_for_win()
        if self.game_status in ['win', 'draw']:
            self.reset()

    def reset(self):
        self.position_history = [(0, 0)] # positions are tuples of integers
        self.move_history = []
        self.game_status = 'ready'
        self.user_turn = 0
        self.game_index = 0

    def check_for_win(self):
        p = self.ints_to_tensor(self.position_history[-1])
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

    def make_move(self, position, color, opponent):
        if self.game_status == 'playing':
            newm = self.choose_move(position, color, opponent)
            newp = position

            self.update(newm, newp)

        self.user_turn = 1

    def choose_move(self, position, color, opponent):
        # replace this or subclass GameCache as necessary
        #lm = self.get_legal_moves(position)
        #return np.random.choice(lm)
        bp, wp = position
        bp = self.int_to_binstring(bp)
        wp = self.int_to_binstring(wp)
        opponent = str(opponent)
        print('MNK hears: \n', bp, '\n', wp)
        colarg = 'BLACK' if color==0 else 'WHITE';
        seed = str(int(dt.now().timestamp()))
        command = ['static/scripts/MNK', 'static/scripts/params_final.txt', opponent, bp, wp, colarg, seed]
        output = sp.check_output(command)
        o = output.decode('utf-8')
        print('MNK says:', o)
        return int(o.split()[0])

    def get_legal_moves(self, position):
        bp, wp = position
        lm = self.int_to_binstring(2**36 - 1 - bp - wp)
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

game_cache_buffer = {}

class GameDataHandler(BaseHandler):

    @tw.authenticated
    def get(self):
        user = self.current_user.decode()
        G = game_cache_buffer[user]
        if G.user_turn:
            reply_data = {
                'gi': G.game_index,
                'status': G.game_status,
                'bp': G.int_to_binstring(G.position_history[-1][0]),
                'wp': G.int_to_binstring(G.position_history[-1][1]),
                'response': int(G.move_history[-1]),
                'initials': 'AI'
            }
            print(reply_data)
            self.write(dict(reply_data))

    @tw.authenticated
    def post(self):
        # TODO: force correct move index by counting pieces
        # TODO: add more to cache, eg GI
        # TODO: edit JS to modify turn monitoring
        # TODO: fix long polling

        # convert data to dictionary
        db = self.settings['db']
        collection = db.turing # change this when deploying!

        argdict = {key: self.get_argument(key) for key in self.request.arguments}
        user = self.current_user.decode()
        argdict['user_name'] = user
        argdict['task'] = 'AI'

        for k, v in argdict.items():
            if not k in ['mt', 'mxy']:
                print(k, v)

        # add data to MongoDB

        collection.insert(argdict, callback=self.insert_cb)

        self.write({'post_success':"OK"})

        # add data to cache
        if not (user in game_cache_buffer.keys()):
            game_cache_buffer[user] = GameCache(user)

        G = game_cache_buffer[user]
        G.user_turn = 0
        G.update(
            argdict['response'],
            (argdict['bp'], argdict['wp'])
        )

        print(G.position_history[-1])
        if G.game_status == 'playing':
            color = (int(argdict['color']) + 1) % 2
            G.make_move(G.position_history[-1], color, argdict['opponent'])
        else:
            G.game_status = 'playing'
            G.user_turn = 1;

    def insert_cb(self, result, error):
        if error:
            raise error
        else:
            print('result: {}'.format(result))
            return
