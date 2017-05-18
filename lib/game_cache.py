import subprocess as sp
import numpy as np
from scipy.signal import convolve
from datetime import datetime as dt

class GameCache(object):
    """
    A GameCache allows for a persistent game state

    To Dos:
    - modify for subclassing (AI or two-player)
    """

    def __init__(self, user):
        self.user = user
        self.game_index = 0
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
        self.move_history = [99]
        self.game_status = 'ready'
        self.user_turn = 0
        self.game_index = self.game_index + 1

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
