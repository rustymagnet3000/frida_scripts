/***********************************************************************************
CFStringRef CFStringCreateWithCString(CFAllocatorRef alloc, const char *cStr, CFStringEncoding encoding);
 USAGE:  frida -l objc_cfstring.js -U -f appname --no-pause
***********************************************************************************/

var ptrToCFStr = Module.findExportByName("CoreFoundation", "CFStringCreateWithCString");

try {
    if (ptrToCFStr == null) {
        throw "pointer not found";
    }
    Interceptor.attach(ptrToCFStr, {
        onEnter: function (args) {
            this._str  = Memory.readUtf8String(args[1]);
            console.log("[*]\t" + this._str);
        }
    });
    console.log("[*]CFStringCreateWithCString() intercept placed")
  }
catch(err){
      console.log("[*]Exception: " + err.message);
}
