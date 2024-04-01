import os, sys
from json import load as jsonLoad, dump as jsonDump

# toml will be attemped when needed

from typing import Union, NoReturn, Any

def getExt(fn: str) -> str: return fn.split('.')[-1]

def readFile(fn: str, binary: bool = None) -> Union[str, dict, None]:
    if binary not in {True, False}: binary = False
    data = None
    mode = 'rb' if binary else 'r'
    ext = getExt(fn)
    try:
        assert(os.path.isfile(fn))
        with open(fn, mode) as file:
            if(ext == 'json'): data = jsonLoad(file)
            elif(ext == 'toml'):
                try:
                    from toml import load as tomlLoad
                    data = tomlLoad(file)
                    del tomlLoad
                except KeyboardInterrupt as ki: raise(ki)
                except Exception:
                    data = file.read()
            else: data = file.read()
    except KeyboardInterrupt as ki: raise(ki)
    except Exception as e: print(e)
    return data

def writeFile(data: Union[str, dict], fn: str, mode: str = None) -> bool:
    if mode not in {'w', 'wb', 'a', 'ab'}: mode = 'w'
    if(not os.path.isfile(fn) and mode in {'a', 'ab'}): mode = 'w'
    ext = getExt(fn)
    try:
        with open(fn, mode) as file:
            if(ext == 'json'): jsonDump(data, file, indent = 4)
            elif(ext == 'toml'):
                try:
                    from toml import dump as tomlDump
                    tomlDump(data, file)
                    del tomlDump
                except KeyboardInterrupt as ki: raise(ki)
                except Exception as e: file.write(data)
            else: file.write(data)
    except KeyboardInterrupt as ki: raise(ki)
    except Exception as e: print(e)
    return

def copyFile(o: str, c: str) -> bool:
    try:
        data = readFile(o, True)
        return writeFile(data, c, "wb")
    except KeyboardInterrupt as ki: raise(ki)
    except Exception as e: print(e)
    return False