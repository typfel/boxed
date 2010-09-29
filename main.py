import os
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.api import mail

class MainPage(webapp.RequestHandler):
  def get(self):
    path = os.path.join(os.path.dirname(__file__), 'index.html')
    self.response.out.write(template.render(path, {}))

class Feedback(webapp.RequestHandler):
	def post(self):
		mail.send_mail(sender="All These Boxes <jacob.persson@robotcrowd.com>",
					   to="Jacob Persson <jacob.persson@robotcrowd.com>",
					   subject="All These Boxes - Feedback Response",
					   body=self.request.get("message"))

application = webapp.WSGIApplication([('/', MainPage),
									  ('/feedback', Feedback),
									 ],
									 debug=True)

def main():
  run_wsgi_app(application)

if __name__ == "__main__":
  main()
