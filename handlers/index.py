import tornado.web as tw

class IndexHandler(tw.RequestHandler):
    def get(self):
        self.render('../templates/index.html')

