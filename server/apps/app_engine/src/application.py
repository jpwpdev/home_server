from abc import ABC, abstractclassmethod, abstractmethod, abstractproperty
from utils import *
import qrcode

class Application(ABC):
    def __init__(self, appFn: str) -> None:
        self._conf = readFile(appFn)
        details = self._conf["details"]

        ...

        return

    def __getitem__(self, key: str) -> Any:
        if key in self._conf["data"]:
            return self._conf["data"][key]
        else:
            raise(KeyError(f"{key} not found in application data"))
    
    def __setitem__(self, key: str, val: Any) -> None:
        self._conf["data"][key] = val
    
    def __delitem__(self, key: str) -> None:
        if key in self._conf["data"]:
            del self._conf["data"][key]
        else:
            raise(KeyError(f"{key} not found in application data"))

    def __importData(self, src: str) -> bool:
        try:
            data = readFile(src)
            if isinstance(data, dict): self._conf["data"] = data
            else: raise(TypeError("Data must be of type dictionary"))
            return True
        except Exception as e: print(e)
        return False
    
    def __generate_and_save_qr(self, url):
        # Generate QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(url)
        qr.make(fit=True)

        # Create an image from the QR Code instance
        img = qr.make_image(fill_color="black", back_color="white")

        # Save the image to a file specified in the configuration
        qr_file_path = self._conf["details"]["qrFile"]
        img.save(qr_file_path)
        print(f"QR code saved to {qr_file_path}")
    
    def _data(self) -> dict: return self._conf["data"]

    def _addIncludes(self, js: list = None, css: list = None) -> bool:
        if(not isinstance(js, list)): pass
        else: self._conf
    
    def _import(self, configFn: str, dataFn: str, save: bool = None) -> bool:
        if not save in {True, False}: save = True

        res = self.__importData(dataFn)
        if(res and save): self._save()

        return res

    def _save(self, fn: str) -> bool: return writeFile(self._conf, fn)

    def _load(self, fn: str) -> bool:
        try:
            self._conf = readFile(fn)
            return True
        except KeyboardInterrupt as ki: raise(ki)
        except Exception as e: print(e)
        return False
