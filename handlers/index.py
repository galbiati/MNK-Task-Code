import tornado.web as tw

class IndexHandler(tw.RequestHandler):
    def get(self):
        self.redirect(r'/login')

    def post(self):
        pass

