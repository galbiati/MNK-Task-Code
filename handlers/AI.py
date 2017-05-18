import os
import sys
import tornado.web as tw
import numpy as np
import subprocess as sp
from scipy.signal import convolve
from datetime import datetime as dt
from .base import BaseHandler

handler_dir = os.path.dirname(__file__)
project_dir = os.path.dirname(handler_dir)
template_dir = os.path.join(project_dir, 'templates')
lib_dir = os.path.join(project_dir, 'lib')
sys.path.insert(0, lib_dir)

from game_cache import GameCache

game_cache_buffer = {}


class AIHandler(BaseHandler):
    """
    Responds to initial request for AI task
    """

    @tw.authenticated
    def get(self):
        self.render(os.path.join(template_dir, 'AI.html'))


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
