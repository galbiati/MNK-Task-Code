import numpy as np
from scipy.signal import convolve

# utilities for manipulating board representation

def string_to_array(input_string):
    """For a single color channel"""
    return np.array(list(input_string), dtype=np.int8).reshape([4, 9])

def array_to_string(input_array):
    """For single color channel"""
    return ''.join(list(input_array.reshape(36).astype(str)))

def tuple_to_array(input_tuple):
    """For complete board image"""
    return np.array([list(s) for s in input_tuple], dtype=np.int8).reshape([4, 9])

def array_to_tuple(self, input_array):
    """For complete board image"""
    return(array_to_string(input_array[0]), array_to_string(input_array[1]))

# classes for persistent serverside objects

class Room(object):
    """
    A Room is a persistent object for 1-2 users doing some task; it facilitates
    multi-agent tasks.
    """

    def __init__(self, player1, player2=None):
        self.player1 = player1
        self.player2 = player2

class GameCache(object):
    """
    A GameCache is a persistent object storing information about a given room
    """

    def __init__(self):
        self.start_state = GameState(tuple_to_array(('0'*36, '0'*36)))
        self.reset()

    def reset(self):
        self.history = []
        return None


class GameState(object):
    """
    A GameState is a persisent object storing information about
    a given state of the game
    """

    def __init__(self, position):
        self.position = position     # state should be a 2x4x9 numpy array
        self.color = get_player_color(position)
        self.status = get_status(position)

    def update(self, move):
        """Returns a new GameState resulting from a given move"""
        next_position = self.position.copy()                    # make sure we get new np.array
        row, column = np.unravel_index(move, (4, 9))            # get row and column
        next_position[self.color, row, column] = 1              # add piece
        return GameState(next_position)                         # return new GameState object

    @staticmethod
    def get_player_color(position):
        npieces = position.sum()
        if npieces % 2 == 0:
            return 0
        else:
            return 1

    @staticmethod
    def get_status(position):
        """Returns whether state is won, drawn, or still in progress"""

        # filters for convolution; apply to 2 channels
        f1 = np.array([[[1, 1, 1, 1]]])                         # horizontal win
        f2 = np.diagflat(f1)[np.newaxis, :, :]                  # topleft to bottomright diagonal win
        filters = [f1, f1.swapaxes(1, 2), f2, np.fliplr(f2)]    # list of all win orientations

        # draw if all locations occupied
        if position.sum() == 72:
            return 'draw'

        # check each feature for win
        for i, f in enumerate(filters):
            fmap = convolve(position, f, mode='valid')          # count num pieces matching filter at each location
            fcount = np.sum(fmap==4)                            # count number of locations where all 4 pieces match
            if c == 1:
                return 'win'
            elif c > 1:
                return 'invalid'
        return 'playing'

# abstract classes for opponents

class Agent(object):
    def __init__(self):
        raise NotImplementedError

    def make_move(self, position, params):
        raise NotImplementedError
