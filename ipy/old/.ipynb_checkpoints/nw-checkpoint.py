from IPython.core.interactiveshell import InteractiveShell

import sys
import types

import base64
from PIL import Image
from io import BytesIO, StringIO
from contextlib import redirect_stderr

import requests

from IPython import display
from matplotlib.figure import Figure

class Watcher:
    def __init__(self, url, ip):
        # Shell data
        self.shell = ip

        # Session data
        self.url = url
        self.secret = input("Secret:")

        # History
        self.raw_codes = []
        self.buffer = []
        self.buffer_has_error = False

        # Track calls to display()
        if not hasattr(display.display, '_orig_display'):
            orig_display = display.display
            def hook_display(*args, **kwargs):
                retval = orig_display(*args, **kwargs)
                for item in args:
                    self.buffer_data(item)
                return retval
            display.display = hook_display
            display.display._orig_display = orig_display

        # Track stderr
        if not hasattr(ip, '_orig_showtraceback'):
            self.shell._showtraceback_orig = self.shell._showtraceback
            watcher_self = self
            def hook_showtraceback(self, etype, evalue, stb):
                lasterr = self.InteractiveTB.stb2text(stb) + '\n'
                watcher_self.buffer_data(Exception(lasterr))
                self._showtraceback_orig(etype, evalue, stb)
            self.shell._showtraceback = types.MethodType(hook_showtraceback, self.shell)

    def buffer_data(self, data):
        if isinstance(data, Figure):
            fig_io = BytesIO()
            data.savefig(fig_io, format='jpg')
            fig_io.seek(0)
            fig_b64 = base64.b64encode(fig_io.read()).decode()

            self.buffer.append({
                "type": "figure",
                "data": fig_b64
            })
        elif isinstance(data, str):
            self.buffer.append({
                "type": "str",
                "data": data
            })
        elif isinstance(data, int):
            self.buffer.append({
                "type": "int",
                "data": data
            })
        elif isinstance(data, float):
            self.buffer.append({
                "type": "float",
                "data": data
            })
        elif isinstance(data, Exception):
            self.buffer.append({
                "type": "error",
                "data": str(data)
            })
        elif data is None:
            self.buffer.append({
                "type": "null",
                "data": None
            })
        else:
            self.buffer.append({
                "type": "unknown",
                "data": str(data)
            })
        
    def send_result(self, result):
        print(dir(result))

        cell_code = result.info.raw_cell
        cell_result = result.result
        cell_ok = result.success

        self.buffer_data(cell_result)

        self.raw_codes += [cell_code]

        self.egress(data={
            "code": cell_code,
            "result": self.buffer,
            "ok": cell_ok
        })

        self.buffer = []

    def egress(self, data):
        print(str(data)[:1000])

def load_ipython_extension(ip):
    watcher = Watcher("https://webhook.site/8785cc9e-a3da-48ad-95bd-898ef1bb9391?", ip)
    ip.events.register('post_run_cell', watcher.send_result)

def unload_ipython_extension(ip):
    pass