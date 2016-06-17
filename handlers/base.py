import tornado.web as tw

class BaseHandler(tw.RequestHandler):
    def get(self):
        self.render('../templates/index.html')

