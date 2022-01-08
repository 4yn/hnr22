import types
import sys

import base64

from io import BytesIO

import datetime

import requests

from PIL import Image
from matplotlib.figure import Figure
from IPython.utils.capture import capture_output, RichOutput

class Watcher:
    def __init__(self, url, ip):
        # Shell data
        self.shell = ip

        # Session data
        self.url = url
        self.secret = input("Enter your secret:")

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

        self.raw_codes += [cell_code]

        self.egress({
            "idx": len(self.raw_codes),
            "code": cell_code,
            "ok": cell_ok,
            "stdout": self.cap.stdout,
            "stderr": self.cap.stderr + self.lasterr,
            "outputs": [i.data for i in self.cap.outputs],
            "timestamp": datetime.now()
        })

    def egress(self, data):
        # print(str(data)[:1000])
        print(str(data))

def load_ipython_extension(ip):
    watcher = Watcher("https://webhook.site/8785cc9e-a3da-48ad-95bd-898ef1bb9391?", ip)
    ip.events.register('pre_run_cell', watcher.pre_run_cell)
    ip.events.register('post_run_cell', watcher.post_run_cell)

def unload_ipython_extension(ip):
    pass