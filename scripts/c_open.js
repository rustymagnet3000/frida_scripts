var ptrToOpen = Module.findExportByName("libsystem_kernel.dylib", "open");
try {
    if (ptrToOpen == null) {
        throw "open() pointer not found";
    }
  }
catch(err){
      console.log("[*]Exception: " + err.message);
}
finally {
    console.log("[+] open() intercept placed");
}

Interceptor.attach(ptrToOpen, {
    onEnter: function (args) {
        var str = Memory.readUtf8String(args[0]);
        console.log("[*]\t" + str);
    }
});
