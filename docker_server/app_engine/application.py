from utils import *

class Application():
    def __init__(self, appDir: str) -> None:
        self._appName = appDir
        
        self._appJson = os.path.join(appDir, "app.json")

        self._static = os.path.join(appDir, "static")

        staticSubs = [
            "js",
            "css",
            "img",
            "html"
        ]

        for ss in staticSubs:
            os.mkdir(os.path.join(self._static, ss))

        return