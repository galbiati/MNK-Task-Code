import numpy as np

"""
    1. Post sends message to GameRoom
    2. 
"""

class GameRoom(object):
    def __init__(self, Opp):
        self.history = []
        self.current_player = 0
        self.current_state = 0
        self.opponent = Opp()

        self.history.append(self.current_state)

    def update_state(self, move):
        pass

    def reset(self):
        self.history = []
        self.current_state = 0

    def encode(self, position):
        pass

    def decode(self, position):
        pass

class Opponent(object):
    def get_legal_moves(self, position):
        position = position[0] + position[1]
        position = np.array(list(position)).astype(int)
        return np.where(position==0)[0]

    def make_move(self, position):
        moves = self.get_legal_moves(position)
        return np.random.choice(moves)