import types
import sys

import base64

from io import BytesIO

import requests

from PIL import Image
from matplotlib.figure import Figure
from IPython.display import display
from IPython.utils.capture import capture_output, RichOutput

class Watcher:
    def __init__(self, url, ip):
        # Shell data
        self.shell = ip

        # Session data
        self.url = url
        # self.secret = input("Username:")
        self.secret = "ok"
        # self.secret = None

        # History
        self.raw_codes = []

        # capture
        self.capper = capture_output()
        self.cap = self.capper.__enter__() # for first run
        self.hook = sys.displayhook # for first run

        # Track stderr
        self.lasterr = ""
        if not hasattr(ip, '_orig_showtraceback'):
            self.shell._showtraceback_orig = self.shell._showtraceback
            watcher_self = self
            def hook_showtraceback(self, etype, evalue, stb):
                lasterr = self.InteractiveTB.stb2text(stb) + '\n'
                watcher_self.lasterr = lasterr
                self._showtraceback_orig(etype, evalue, stb)
            self.shell._showtraceback = types.MethodType(hook_showtraceback, self.shell)

    def pre_run_cell(self):
        self.lasterr = ""
        self.cap = self.capper.__enter__()
        self.hook = sys.displayhook

        
    def post_run_cell(self, result):
        # print(dir(result))
        cell_code = result.info.raw_cell
        cell_result = result.result
        cell_ok = result.success

        self.hook(cell_result)
        self.capper.__exit__(None, None, None)

        self.cap.show()

        self.raw_codes += [cell_code]

        self.egress({
            "room": "0001",
            "secret": self.secret,
            "idx": len(self.raw_codes),
            "code": cell_code,
            "ok": cell_ok,
            "stdout": self.cap.stdout,
            "stderr": self.cap.stderr + self.lasterr,
            "outputs": [{
                k: base64.b64encode(v).decode() if isinstance(v, bytes) else v
                for k, v in i.data.items()
            } for i in self.cap.outputs]
        })

    def egress(self, data):
        # requests.post(self.url, json=data)
        print(data)
        pass

def load_ipython_extension(ip):
    watcher = Watcher("https://eg.ress.me/api/data", ip)
    ip.events.register('pre_run_cell', watcher.pre_run_cell)
    ip.events.register('post_run_cell', watcher.post_run_cell)

def unload_ipython_extension(ip):
    pass