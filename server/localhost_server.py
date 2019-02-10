import sys
#import BaseHTTPServer
import http
import os
from http.server import SimpleHTTPRequestHandler


class MyRequestHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        print(self.path)
        print("Current path is " + (os.path.realpath(__file__)))
        root = os.path.join(os.path.realpath(__file__),"/../processing.html")
        if self.path == '/':
            self.path = root
        return SimpleHTTPRequestHandler.do_GET(self)

HandlerClass = MyRequestHandler
ServerClass  = http.server.HTTPServer
Protocol     = "HTTP/1.0"

if sys.argv[1:]:
    port = int(sys.argv[1])
else:
    port = 8000
server_address = ('127.0.0.1', port)

HandlerClass.protocol_version = Protocol
httpd = ServerClass(server_address, HandlerClass)


sa = httpd.socket.getsockname()
print("Serving HTTP on", sa[0], "port", sa[1], "...")
httpd.serve_forever()