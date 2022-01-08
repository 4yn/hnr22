from IPython.core.interactiveshell import InteractiveShell

import sys
import types

import base64
from PIL import Image
from io import BytesIO, StringIO
from contextlib import redirect_stderr

import requests

lasterr = ""

class Watcher:
    def __init__(self, url, ip):
        self.raw_codes = []
        self.url = url
        self.shell = ip
        self.secret = None
        self.stderr = StringIO()
        
        if not hasattr(get_ipython(), '_showtraceback_orig'):
            # ip.log.handlers[0].stream = sys.stderr = self.stderr
            ip._showtraceback_orig = ip._showtraceback

            def _showtraceback(self, etype, evalue, stb):
                global lasterr
                lasterr = self.InteractiveTB.stb2text(stb) + '\n'
                self._showtraceback_orig(etype, evalue, stb)

            ip._showtraceback = types.MethodType(_showtraceback, ip)
        
    def send_result(self, result):
        self.raw_codes += [result.info.raw_cell]
        
        if self.secret == None:
            self.secret = self.shell.user_ns.get('secret', None)
            return
        
        if result.error_in_exec != None:
            print(lasterr)
        
        res_str = result.result
        if type(result.result) == Image.Image: # Special result type
            img_io = BytesIO()
            result.result.save(img_io, format='JPEG', quality=70)
            res_str = base64.b64encode(img_io.getvalue())
            
        requests.post(self.url, data = {
            "secret": self.secret,
            "type": "img",
            "result": res_str,
            "code": result.info.raw_cell,
            "error": "" if result.error_in_exec == None else base64.b64encode(lasterr.encode('ascii'))
        })

def load_ipython_extension(ip):
    # The `ipython` argument is the currently active `InteractiveShell`
    # instance, which can be used in any way. This allows you to register
    # new magics or aliases, for example.
    watcher = Watcher("https://webhook.site/b196f4df-fced-4aa2-828c-961325700bf2?", ip)
    # watcher = Watcher("http://localhost:3000/data", ip)
    ip.events.register('post_run_cell', watcher.send_result)

def unload_ipython_extension(ip):
    pass