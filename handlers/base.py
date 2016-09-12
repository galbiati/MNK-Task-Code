import tornado.web as tw
from tornado.escape import xhtml_escape as xesc

class BaseHandler(tw.RequestHandler):
    def get_current_user(self):
        return self.get_secure_cookie('user')

    @tw.authenticated
    def get(self):
        name = xesc(self.current_user)
        self.render('../templates/index.html', name=name)

