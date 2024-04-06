from utils import *

class Application():
    def __init__(self, name: str, appData: str) -> None:
        self._name = name
        self._appData = readFile(appData)
        return

appDir = "/home_server/server/apps"

d = os.listdir(appDir)

for app in d:
    if(app != "app_engine"):
        ...
