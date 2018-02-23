import socket
import json
from machine import Pin
import time

class iotreta:
    kind = 'thing'         # class variable shared by all instances

    def __init__(self, config):
        self.config = config
        self.s = [] #socket será armazenado aqui
        self.pins = {} #dict de portas que serão setadas
        self.events = {} #payload de eventos 

    def recv_sock_json(self, length):
        return json.loads(str(self.s.recv(length), 'utf8'))
    def send_sock_json(self,data):
        #socket send generico para json
        self.data = data
        try: 
            self.s.send(json.dumps(self.data))
        except:
            print("algo de errado nao esta certo")
    def send_data_thing(self,data = {} ,event = 'data'):
        time.sleep(0.3)
        self.data = {
                    'event':event,
                    'auth_user': self.config['auth_user'],
                    'auth_thing':self.config['auth_thing'],
                    'payload': data
                    }
        self.send_sock_json(self.data)

        print(self.data)

        try:
            self.data_server = self.recv_sock_json(1024)
            return self.data_server
        except:
            return ('erro de recv', None, None)
    def connect_thing(self, configMode = 'slave'):

        self.addr_info = socket.getaddrinfo( self.config['host'], int(self.config['port']) )
        self.addr = self.addr_info[0][-1]
        self.s = socket.socket()
        self.s.connect(self.addr)
        #difine like the thing is intereact with the server IOTretas,
        #how the pins are avaliable for using and how are preseted.
        if configMode == 'slave':
            self.configModeThing = {
            'mode' :'slave',
            'thing_board':'Micropython v8.8.1',
            'pins_avaliable' :'all',
            'pins_preset' :{},
            }
            print(self.configModeThing)
        else:
            self.configModeThing = configMode

        print("send order connection for iotretas's server") 

        self.recived = self.send_data_thing(self.configModeThing , event = 'connect')
        print(type(self.recived))
        
        try:
            if (self.recived['event']['cmd'] is 'connect') and (self.recived['event']['status']):
                if 'set_pins' in self.recived['payload']['events']:
                    print('trabalhar a set_pins aqui')
                else:
                    print('set_pins not avaliable')             
                return True
            elif self.recived['event']['cmd'] is 'connection' and not self.recived['event']['status']:
                return False
            else:
                return 'vish'

        except ValueError as err:
            print(err)


            #parte do machine
    def set_pin(self,pin,mode = 'out'):
        print(pin,type(pin))
        self.pino = pin
        self.new_pin = {}
        esp8266gpio = [0,2,4,5,12,14,13,15,16]
        if self.pino in  esp8266gpio:
            if mode == 'out' :
                try:
                    self.mod = Pin(self.pino, Pin.OUT)
                    self.new_pin = {str(self.pino):{'mode':'OUT', 'pin': self.mod }}
                    print('out')
                except ValueError as err:
                    print(err)
            else:
                self.mod = Pin(self.pino, Pin.IN)
                self.new_pin = {str(self.pino):{'mode':'IN', 'pin': self.mod }}                
                print('in')
            print('pino', self.pino)
        else:
            print('pino ',pin,' nao pode')              
        self.pins.update(self.new_pin)
     #teoricamente poderar ser setado todos os pinos desejados inicialmente
    def set_pins(self,pins):
        if type(pins) is int:
            self.set_pin(pins)
        elif type(pins) is list :
            for x in range(0 , len(pins)):
                if type(pins[x]) is int:
                    self.set_pin(pins[x])
                else:
                    print("list's value in argument must be int type")
        else:
            print("argument must be int type or int list ")

        #tratar erro
    def read_pin(self,pin):
        self.pino = str(pin)
        if self.pino in self.pins:
            state_pin  = self.pins[self.pino]['pin'].value()       
            return state_pin
        else:
            print("pin is not setting (read)") 
        #tratar erro
    def write_pin(self,pin,value):
        self.pino = str(pin)
        self.state = int(value)
        if self.pino in self.pins:       
            self.pins[self.pino]['pin'].value(self.state)
        else:
            print("pin is not setting (write)")
    def pin_on(self):
        pins_status = {}
        for pin in self.pins.keys():
            x = {"pin_"+str(pin) : {'pin':pin,'state': self.pins[str(pin)]['pin'].value() }}
            pins_status.update(x)
        self.events.update({'pin_on':pins_status})        
        print(self.events)

        self.rcv = self.send_data_thing({'events':self.events})   

        if 'pin_on' in self.rcv['payload']['events']:
            write = self.rcv['payload']['events']['pin_on']
            for pin in write:
                try:
                    self.write_pin(pin['pin'] , pin['state'])
                except ValueError as err:
                    print(err)

            #self.pins[str(pin)]['pin'].value()
    def msg_on(self , msg =""):
        self.events.update({'msg_on':msg})
        self.rcv = self.send_data_thing({'events':self.events})
        return(self.rcv)
    def plot_on(self , msg = 0):
        if type(msg) is int:
            self.events.update({'plot_on':msg})
            self.rcv = self.send_data_thing({'events':self.events})
            return(self.rcv)
        else:
            print('plot value must be a int')

"""        {
        'payload':
            {
                'events': 
                    {
                        'pin_on': [{'pin': '1', 'state': 0}, {'pin': '2', 'state': 1}],
                        'set_pins': 'teste',
                        'msg_on': {}
                    }
            },
        'event': {'status': True, 'cmd': 'connect'},
        'auth_thing': 'your key token thing',
        'auth_user': 'your name user'
        }
"""
