import os
import motor
import tornado.ioloop as ti
from tornado.web import Application
from handlers.base import BaseHandler
from handlers.login import LoginHandler
from handlers.register import RegisterHandler
from handlers.demo import DemoHandler
from handlers.turing import TuringHandler
from handlers.AI import *

import numpy as np

client = motor.motor_tornado.MotorClient('localhost', 27017)
db = client.gamesdb

handlebars = [
    (r'/', BaseHandler),
    (r'/login', LoginHandler),
    (r'/register', RegisterHandler),
    (r'/demo', DemoHandler),
    (r'/turing', TuringHandler),
    (r'/AI', AIHandler),
    (r'/AIData', GameHandler)
]

def make_app():
    return Application(
        handlebars, 
        static_path=os.path.join(os.path.dirname(__file__), 'static'),
        template_path=os.path.join(os.path.dirname(__file__), 'templates'),
        debug=True,
        db=db,
        cookie_secret=str(np.random.randint(1, 99999)),
        login_url='/login'
    )

if __name__ == '__main__':
    app = make_app()
    app.listen(8989)
    ti.IOLoop.current().start()