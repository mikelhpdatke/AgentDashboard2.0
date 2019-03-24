import websocket
import thread
import time
import sys
from urllib import *

class SocketIO:
	def __init__(self):
		self.PORT = 8081
		self.HOSTNAME = 'localhost'
		self.connect()

	def __del__(self):
		self.close()

	def handshake(self,host,port):
		u = urlopen("ws://localhost:8081")
		if u.getcode() == 200:
			response = u.readline()
			(sid, hbtimeout, ctimeout, supported) = response.split(":")
			supportedlist = supported.split(",")
			print(supportedlist)
			if "websocket" in supportedlist:
				print('abc')
				return (sid, hbtimeout, ctimeout)
			else:
				print('abc')
				raise TransportException()
		else:
			print('abc')
			raise InvalidResponseException()

	def connect(self):
		try:
			sid, a, b = self.handshake(self.HOSTNAME, self.PORT)
			#self.ws = websocket.create_connection("ws://%s:%d/" % (self.HOSTNAME, self.PORT))
		except Exception as e:
			print e
			sys.exit(1)

	def heartbeat(self):
		self.ws.send("2::")

	def send(self,event,message):
		self.heartbeat()
		self.ws.send('5:1::{"name":"%s","args":"%s"}' % (event, message))

	def close(self):
		self.ws.close()

if __name__ == "__main__":
	s = SocketIO()