from utils import *

class Templates():
    def __init__(self, templateDirectory: str) -> None:
        self._templates = dict()
        
        d = os.listdir(templateDirectory)

        for object in d:
            self._templates[object.split(".")[-1]] = object
        
        return

    def getFileTemplate(self, ext: str) -> Union[None, str, dict]: return readFile(self._templates[ext])

from tkinter import Tk
from tkinter.filedialog import askopenfilenames

root = Tk()
root.withdraw()

appTemplate = "./templates/template.json"

application = readFile(appTemplate)

print(application)

for detail in list(application["details"].keys()):
    print(detail)
    application["details"][detail] = input(f"{application['details'][detail]} ")
    if(application["details"][detail] == "" and detail == "pageName"):
        application["details"][detail] = application["details"]["appCode"]
    
    application["details"][detail] += ".html"

# get template

# Define the expected filetypes for each includeType
filetype_mappings = {
    "js": [("JavaScript files", "*.js")],
    "css": [("CSS files", "*.css")]
}

for includeType in list(application["includes"].keys()):
    # Retrieve the correct filetype mapping based on includeType
    filetypes = filetype_mappings.get(includeType, [])
    # Use the retrieved filetypes in askopenfilenames
    selected_files = askopenfilenames(filetypes=filetypes, title=f"Include {includeType}")
    if(selected_files == ""): selected_files = list()
    application["includes"][includeType] = selected_files

writeFile(application, "test-output.json")
