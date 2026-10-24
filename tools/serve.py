"""Local preview with caching disabled, including imported JavaScript modules."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(Path(__file__).resolve().parents[1]/'dist'),**kwargs)
    def end_headers(self):
        self.send_header('Cache-Control','no-store, max-age=0')
        super().end_headers()
if __name__=='__main__':
    print('Dragon Dungeon: http://127.0.0.1:4173/',flush=True)
    ThreadingHTTPServer(('127.0.0.1',4173),Handler).serve_forever()
