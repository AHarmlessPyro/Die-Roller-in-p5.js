import sys
import http
import os
from http.server import SimpleHTTPRequestHandler
import socket
import random

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
    random.randrange(8000,25000,1)

s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(("1.1.1.1", 80)) # Connect to a known server location. In this case, connect to Cloudflare DNS
server_address = (s.getsockname()[0], port) # Open a random port from 8000 to 25000

HandlerClass.protocol_version = Protocol
httpd = ServerClass(server_address, HandlerClass)


sa = httpd.socket.getsockname()
print("Serving HTTP on", sa[0], "port", sa[1], "...")
httpd.serve_forever()