import os
import motor
import tornado.ioloop as ti
from tornado.web import Application
from handlers.base import BaseHandler
from handlers.login import LoginHandler
from handlers.index import IndexHandler
from handlers.register import RegisterHandler
from handlers.demo import DemoHandler



handlebars = [
    (r'/', IndexHandler),
    (r'/login', LoginHandler),
    (r'/register', RegisterHandler),
    (r'/demo', DemoHandler),
]

def make_app():
    return Application(
        handlebars, 
        static_path=os.path.join(os.path.dirname(__file__), "static"),
        debug=True
    )

if __name__ == '__main__':
    app = make_app()
    app.listen(8989)
    ti.IOLoop.current().start()