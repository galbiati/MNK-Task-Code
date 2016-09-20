import numpy as np

class GameRoom(object):
    def __init__(self, Opp):
        self.history = []
        self.current_player = 0
        self.opponent = Opp()

    def 

class Opponent(object):
    def get_legal_moves(self, position):
        position = position[0] + position[1]
        position = np.array(list(position)).astype(int)
        return np.where(position==0)[0]

    def make_move(self, position):
        moves = self.get_legal_moves(position)
        return np.random.choice(moves)