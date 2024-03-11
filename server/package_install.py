from json import load
from os import system

with open("package.json") as file: data = load(file)
dependencies = " ".join(list(data["dependencies"].keys()))
system(f"sudo npm install {dependencies}")
