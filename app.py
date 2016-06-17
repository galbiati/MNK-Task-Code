import os
import motor
import tornado.ioloop as ti
from tornado.web import Application
from handlers.base import BaseHandler
from handlers.login import LoginHandler
from handlers.index import IndexHandler



handlebars = [
    (r'/', IndexHandler),
    (r'/login', LoginHandler),
]

def make_app():
    return Application(
        handlebars, 
        static_path=os.path.join(os.path.dirname(__file__), "static")
    )

if __name__ == '__main__':
    app = make_app()
    app.listen(8989)
    ti.IOLoop.current().start()