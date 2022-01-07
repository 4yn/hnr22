from IPython.core.magic import (Magics, magics_class, line_magic,
                                cell_magic, line_cell_magic)
from IPython.core.interactiveshell import InteractiveShell

import base64
from PIL import Image
from io import BytesIO

import requests

class Watcher:
    def __init__(self, url, ip):
        self.url = url
        self.shell = ip
        self.secret = None
    
    def send_result(self, result):
        if self.secret == None:
            self.secret = self.shell.user_ns.get('secret', None)
            return
        
        if result.result == None:
            return
        
        if type(result.result) == Image.Image: # Special result type
            img_io = BytesIO()
            result.result.save(img_io, format='JPEG', quality=70)
            img_str = base64.b64encode(img_io.getvalue())
            
            requests.post(self.url, data = {
                "secret": self.secret,
                "type": "img",
                "result": img_str,
                "raw_code": result.info.raw_cell
            })
        else:     
            requests.post(self.url, data = {
                "secret": self.secret,
                "type": "text",
                "result": result.result,
                "raw_code": result.info.raw_cell
            })

def load_ipython_extension(ip):
    # The `ipython` argument is the currently active `InteractiveShell`
    # instance, which can be used in any way. This allows you to register
    # new magics or aliases, for example.
    watcher = Watcher("https://webhook.site/b196f4df-fced-4aa2-828c-961325700bf2?", ip)
    ip.events.register('post_run_cell', watcher.send_result)